# Flip拖拽排序组件设计和实现

> 文末有本案例的完整代码,可直接复制,如想查看更多案例请访问: 源码地址[github](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FLAF523%2Fdemo-collections),

### 效果图

[](./img/PixPin_2024-09-23_16-50-37.gif)

### 组件功能分析

在使用拖拽组件`DragBox`时,有三点要求:

1. 希望通过`render props`的形式渲染`自定义拖拽子元素`,同时`传递数据`给子元素
2. 在拖拽完毕后可以获取到排序后的数据
3. 使用动画,使用户拖拽元素时更流畅

`DragBox`组件属性分析:

1. `data`: 需要一个data属性,用来接收用户传递的数据,根据数据循环渲染子元素
2. `itemKey`: 列表渲染时的`key`,
3. `children`: 子元素,接收三个参数: `item`,`index`,`data`返回一个`jsx`作为子元素进行渲染

`DragBox`事件分析:

1. `onDragEnd`事件: 需要在拖拽结束后,通过参数将排序后的数据传递

#### 伪代码

根据上面的分析,可以对应下面的伪代码:

```html
interface Props<T> {
  data: T[];
  onDragEnd: (data: T[]) => void;
  children: (item: T, index: number, data: T[]) => React.ReactNode;
  itemKey?: keyof T;
}  

<DragBox<dataType>
    data={data}
    onDragEnd={onDragEnd}
    itemKey="index"
  >
    {item => <div style={{ height: '50px', lineHeight: '50px', textAlign: 'center' }}>{item.name}</div>}
  </DragBox>
```

### 实现思路

根据功能分析,该组件具有两个难点:

1. 拖拽排序与数据排序如何关联起来
2. 动画如何实现

**问题1解决思路**

拖拽子元素时,根据`onDragEnter`事件获取`拖拽元素sourceNode`所进入的`目标元素targetNode,`然后根据通过`insertBefore`来动态调整两个元素的位置,从而达到视觉上的拖拽排序效果

上一步中,用户的拖拽会导致`DOM`结构发生变换,实际上此时的`DOM`结构就对应排序后的数据顺序,因此,可以通过`data-`属性将`子元素的索引`挂载到子元素的`dom`对象上,拖拽结束后,获取所有的子元素,并提取`index`对原数据进行排序

**问题2解决思路**

通过上面的拖拽排序的实现思路,我们知道这个过程涉及到`DOM 结构的变化`,因此单纯使用`css属性`无法完成拖拽动画.这里要使用一种动画实现思维`Flip`就可以实现了,下面简单介绍一下这个动画实现思想:

一句话总结**获取元素初始状态,获取元素结束状态,计算状态插值,使用animate API通过tranform实现该过程的变化**,`Flip`是`First(初始),last(结束),invert(反转),paly(运行)`四个首字母的缩写,具体如何引用,将会在下文中详细描述

### 排序逻辑实现

组件结构如下,将使用事件委托的形式在父元素处理所有事件:

```js
  return (
    <div
      onDragStart={_onDragStart}
      onDragEnter={_onDragEnter}
      onDragEnd={_onDragEnd}
      onDragOver={_onDragOver}
      className={styles.wrap}
      ref={wrapRef} // 获取父元素
    >
      {data &&
        data.map((item, index) => {
          return (
            <div
              id="drag-item" // 唯一id,用来标识该元素是拖拽元素
              data-index={index} // 通过data-属性挂载元素初始索引,用于数据排序
              draggable // 添加draggable属性,使元素可以拖拽
              key={itemKey && item[itemKey] !== undefined ? String(item[itemKey]) : index}
            >
              {children(item, index, data)}
            </div>
          );
        })}
    </div>
  );
```

根据上面的结构,梳理实现思路就简单多了:

1. `_onDragStart`: 获取到拖拽元素`sourceNode`

   ```js
     const _onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
       e.persist();
       sourceNode = e.target as HTMLDivElement; // sourceNode为全局变量
       setTimeout(() => {
         sourceNode!.classList.add(styles.moving); // 设置成异步,否则拖拽元素的样式有问题
       }, 0);
     };
   ```

2. `_onDragEnter`: 获取到目标元素`targetNode`,然后根据元素的索引判断元素位置,如果`sourceNode`位置高于`targetNode`那么是向下拖拽,`sourceNode`应该插入`targetNode.nextElementSibling`之前,反之`sourceNode`应该插入在`targetNode`之前

   ```js
     const _onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
       e.preventDefault();
       const targetNode = (e.target as HTMLElement).closest('#drag-item') as HTMLDivElement; // 正确获取到子元素
       if (targetNode && targetNode !== sourceNode) {
         const dragItems = [...wrapRef.current!.children] as HTMLDivElement[];
         const sourceIndex = dragItems.indexOf(sourceNode!);
         const targetIndex = dragItems.indexOf(targetNode);
         if (sourceIndex > targetIndex) {
           // 向上
           wrapRef.current!.insertBefore(sourceNode!, targetNode);
         } else {
           // 向下
           wrapRef.current!.insertBefore(sourceNode!, targetNode.nextElementSibling);
         }
       }
     };
   ```

3. `_onDragEnd`: 拖拽结束,根据当前`子元素`的`dataset`获取到索引的排列顺序,根据这个排列顺序重排源数据,并调用`onDragEnd`将排列后的数据返回

   ```js
   const _onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
       (e.target as HTMLDivElement).classList.remove(styles.moving);
       const dragItems = [...wrapRef.current!.children] as HTMLDivElement[];
       const currentOrder = dragItems.map(item => Number(item.dataset.index)); // 获取当前排序
       const orderData = currentOrder.map(item => data[item]); // 重新排序
       onDragEnd(orderData);
   };
   ```

4. `_onDragOver`:阻止默认行为,否则拖拽时鼠标会显示禁止

   ```js
   const _onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
       e.preventDefault();
   };
   ```

### 动画逻辑实现

通过面向对象的方式,统一抽象并封装单个`DOM`元素的`Flip`动画行为,代码中有详细注释:

```js
class FlipDOM {
  private dom: HTMLElement; 
  private duration: number; // 单位秒
  private firstPos: { top: number; left: number };
  private lastPos: { top: number; left: number };
  private invert: { top: number; left: number };
  private playing: boolean;

  constructor(dom: HTMLElement, duration: number) {
    this.dom = dom; // dom元素
    this.duration = duration * 1000;
    this.firstPos = { top: 0, left: 0 }; // 初始状态
    this.lastPos = { top: 0, left: 0 }; // 结束状态
    this.invert = { top: 0, left: 0 }; // 状态差值
    this.playing = false; // 是否正在进行动画
    this.getFirstPos();// 实例化时获取初始状态
  }

  // First
  getFirstPos() {
    const { top, left } = this.dom.getBoundingClientRect();
    this.firstPos = { top, left };
  }
  // Last
  getLastPos() {
    const { top, left } = this.dom.getBoundingClientRect();
    this.lastPos = { top, left };
  }
  // invert
  getInvert() {
    this.invert = {
      top: this.firstPos.top - this.lastPos.top,
      left: this.firstPos.left - this.lastPos.left
    };
  }
  // play
  play() {
    this.getLastPos(); // 获取结束状态
    this.getInvert(); // 计算状态差值
    if (this.playing || (!this.invert.top && !this.invert.left)) { // 如果正在运行动画,或者状态没变化,则不执行动画
      return;
    }
    this.playing = true;
    this.firstPos = this.lastPos;
    this.dom.animate(
      [
        {
          transformOrigin: 'top left',
          transform: `translate(${this.invert.left}px,${this.invert.top}px)`
        },
        {
          transformOrigin: 'top left',
          transform: `none`
        }
      ],
      { duration: this.duration, fill: 'forwards' }
    );
    
      // 本次动画完成播放之后,才允许下次动画执行
    animation.finished.then(() => {
      this.playing = false;
      animation.cancel();
    });
  }
}
export { FlipDOM };
```

针对拖拽组件再封装一个类,用来执行大批量dom的动画:

```js
class FlipDOMs {
  private filpDOMInstances: FlipDOM[];

  constructor(doms: HTMLElement[], duration: number = 0.2) {
    this.filpDOMInstances = doms.map(item => new FlipDOM(item, duration)); // 将所有DOM实例化
  }
  play() {
    this.filpDOMInstances.forEach(item => item.play()); // 调用所有示例的play方法
  }
}

export default FlipDOMs;
```

在`_onDragStart`中,记录初始状态:

```js
const _onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      ...
    flipDOMS = new FlipDOMs([...wrapRef.current!.children] as HTMLElement[], 0.2); // flipDOMS为全局变量
      ...
};
```

在`_onDragEnter`中,执行动画:

```js

  const _onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      ...
    if (targetNode && targetNode !== sourceNode) {
        ...
      flipDOMS!.play();
    }
  };
```

至此一个拖拽排序组件就已经封装好了,下面是完整代码:
`DragBox.tsx`

```js
import { useRef } from 'react';
import styles from './index.module.less';
import FlipDOMs from './flip.ts';
interface Props<T> {
  data: T[];
  onDragEnd: (data: T[]) => void;
  children: (item: T, index: number, data: T[]) => React.ReactNode;
  itemKey?: keyof T;
}

const DragBox = <T,>({ data, onDragEnd, children, itemKey }: Props<T>) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  let sourceNode: HTMLDivElement | null = null;
  let flipDOMS: FlipDOMs | null = null;

  const _onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.persist();
    sourceNode = e.target as HTMLDivElement;
    flipDOMS = new FlipDOMs([...wrapRef.current!.children] as HTMLElement[], 0.2);
    setTimeout(() => {
      sourceNode!.classList.add(styles.moving);
    }, 0);
  };
  const _onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    (e.target as HTMLDivElement).classList.remove(styles.moving);
    const dragItems = [...wrapRef.current!.children] as HTMLDivElement[];
    const currentOrder = dragItems.map(item => Number(item.dataset.index));
    const orderData = currentOrder.map(item => data[item]);
    onDragEnd(orderData);
  };

  const _onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const targetNode = (e.target as HTMLElement).closest('#drag-item') as HTMLDivElement;
    if (targetNode && targetNode !== sourceNode) {
      const dragItems = [...wrapRef.current!.children] as HTMLDivElement[];
      const sourceIndex = dragItems.indexOf(sourceNode!);
      const targetIndex = dragItems.indexOf(targetNode);
      if (sourceIndex > targetIndex) {
        // 向上
        wrapRef.current!.insertBefore(sourceNode!, targetNode);
      } else {
        // 向下
        wrapRef.current!.insertBefore(sourceNode!, targetNode.nextElementSibling);
      }
      flipDOMS!.play();
    }
  };
  const _onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDragStart={_onDragStart}
      onDragEnter={_onDragEnter}
      onDragEnd={_onDragEnd}
      onDragOver={_onDragOver}
      className={styles.wrap}
      ref={wrapRef}
    >
      {data &&
        data.map((item, index) => {
          return (
            <div
              id="drag-item"
              data-index={index}
              className={[
                styles['drag-item'],
                index % 2 === 0 ? styles['drag-item-odd'] : styles['drag-item-even']
              ].join(' ')}
              draggable
              key={itemKey && item[itemKey] !== undefined ? String(item[itemKey]) : index}
            >
              {children(item, index, data)}
            </div>
          );
        })}
    </div>
  );
};
export default DragBox;
```

`flip.ts`

```js
class FlipDOM {
  private dom: HTMLElement;
  private duration: number; // 单位秒
  private firstPos: { top: number; left: number };
  private lastPos: { top: number; left: number };
  private invert: { top: number; left: number };
  private playing: boolean;

  constructor(dom: HTMLElement, duration: number) {
    this.dom = dom;
    this.duration = duration * 1000;
    this.firstPos = { top: 0, left: 0 };
    this.lastPos = { top: 0, left: 0 };
    this.invert = { top: 0, left: 0 };
    this.playing = false;
    this.getFirstPos();
  }

  // First
  getFirstPos() {
    const { top, left } = this.dom.getBoundingClientRect();
    this.firstPos = { top, left };
  }
  // Last
  getLastPos() {
    const { top, left } = this.dom.getBoundingClientRect();
    this.lastPos = { top, left };
  }
  // invert
  getInvert() {
    this.invert = {
      top: this.firstPos.top - this.lastPos.top,
      left: this.firstPos.left - this.lastPos.left
    };
  }
  // play
  play() {
    this.getLastPos();
    this.getInvert();
    if (this.playing || (!this.invert.top && !this.invert.left)) {
      return;
    }
    this.playing = true;
    this.firstPos = this.lastPos;
    this.dom.getAnimations().forEach(animation => animation.cancel());
    this.dom.animate(
      [
        {
          transformOrigin: 'top left',
          transform: `translate(${this.invert.left}px,${this.invert.top}px)`
        },
        {
          transformOrigin: 'top left',
          transform: `none`
        }
      ],
      { duration: this.duration }
    );
    setTimeout(() => {
      this.playing = false;
    }, this.duration);
  }
}

class FlipDOMs {
  private filpDOMInstances: FlipDOM[];
  constructor(doms: HTMLElement[], duration: number = 0.2) {
    this.filpDOMInstances = doms.map(item => new FlipDOM(item, duration));
  }
  play() {
    this.filpDOMInstances.forEach(item => item.play());
  }
}

export default FlipDOMs;
export { FlipDOM };
```

`index.less`

```js
.wrap {
  border: 1px solid #f0f0f0;
}

.drag-item {
  margin: 20px;
  outline: 1px solid #f0f0f0;
  cursor: move;
}

.drag-item-odd {
  background-color: #fff;
}

.drag-item-even {
  background-color: #f8f8f8;
}

.moving {
  color: transparent;
  background: transparent;
  outline: 1px dashed #ccc;
}
```






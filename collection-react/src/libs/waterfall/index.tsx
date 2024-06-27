import { useUpdateEffect } from 'ahooks';
import { useEffect, useRef, useState } from 'react';

interface Props {
  data: any;
  col: number; // 列数
  colSpace?: number; //列间距
  rowSpace?: number; //行间距
  nodeKey?: string; // 列表渲染唯一id的key
  isPreReading?: boolean; // 是否需要预加载
  renderChild: (item: any, colWidth?: number) => React.ReactNode; // 需要渲染的瀑布流元素
  loadingElement?: React.ReactNode; // 自定义加载动画
}

/**
 * render props版本瀑布流组件
 * 1.根据容器宽度和指定的列数计算列宽
 * 2.是否需要预加载
 *  2.1 是: 等待预加载完成
 * 3.获取itemHeight,计算item的top和left
 */

const Waterfall: React.FC<Props> = ({
  data,
  col,
  colSpace = 20,
  rowSpace = 20,
  nodeKey,
  isPreReading = true,
  renderChild,
  loadingElement
}) => {
  const [wrapHeight, setWrapHeight] = useState<number>(0);
  const [colWidth, setColWidth] = useState<number>(0);
  const [wrapPL, setWrapPL] = useState<number>(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const colHeightMap = useRef<{ [key: string]: number }>({});
  const [isBeginLoad, setIsBeginLoad] = useState(false);

  useEffect(() => {
    initColWidth();
    initColHeightMap();
  }, []);

  useUpdateEffect(() => {
    initColWidth();
    beginLoad();
  }, [data]);

  function initColWidth() {
    const wrapEl = wrapRef.current as HTMLDivElement;
    const { width } = wrapEl.getBoundingClientRect();
    const styles = getComputedStyle(wrapEl);
    const PL = parseFloat(styles.paddingLeft);
    const PR = parseFloat(styles.paddingRight);
    const BL = parseFloat(styles.borderLeftWidth);
    const BR = parseFloat(styles.borderRightWidth);
    setColWidth((width - PL - PR - BL - BR - (col - 1) * colSpace) / col);
    setWrapPL(PL + BL);
  }

  function initColHeightMap() {
    colHeightMap.current = Object.fromEntries(
      new Array(col).fill(0).map((item: number, index) => [String(index + 1), item])
    );
  }

  async function beginLoad() {
    setIsBeginLoad(true);
    const wrapEl = wrapRef.current!;
    const itmesEl = [...wrapEl.children] as HTMLDivElement[];
    if (isPreReading) {
      await setItemPosWhenImgLoad(itmesEl);
    }
    setItemPos(itmesEl);
    setIsBeginLoad(false);
  }

  function setItemPos(itmesEl: HTMLDivElement[]) {
    itmesEl.forEach(item => {
      computeItemsPos(item);
    });
    setWrapHeightInEnd();
  }

  function computeItemsPos(item: HTMLDivElement) {
    if (isHasDonetag(item)) {
      return;
    }
    addDoneTag(item);
    const { targetCol, targetHeight } = getMinOrMaxColHeight('min');
    item.style.top = `${targetHeight}px`;
    item.style.left = `${(Number(targetCol) - 1) * (colWidth + colSpace) + wrapPL}px`;
    restColHeight(targetCol, item.offsetHeight);
  }
  function setWrapHeightInEnd() {
    const { targetHeight } = getMinOrMaxColHeight('max');
    setWrapHeight(targetHeight);
  }

  function restColHeight(key: string, val: number) {
    colHeightMap.current[key] = val + rowSpace + colHeightMap.current[key];
  }

  function getMinOrMaxColHeight(type: 'min' | 'max') {
    const arr = Object.entries(colHeightMap.current);
    if (type === 'min') {
      arr.sort((a, b) => a[1] - b[1]);
    } else {
      arr.sort((a, b) => b[1] - a[1]);
    }
    return { targetHeight: arr[0][1], targetCol: arr[0][0] };
  }

  async function setItemPosWhenImgLoad(itmesEl: HTMLDivElement[]) {
    const allPromises = itmesEl.map(item => {
      return new Promise(resolve => {
        if (isHasDonetag(item)) {
          // 加载过的元素就不需要再加载了,直接使用缓存
          resolve(0);
          return;
        }
        const imgEl = item.querySelector('img')!;
        const imageObj = new Image();
        imageObj.src = imgEl.src;
        imageObj.onload = imageObj.onerror = () => {
          resolve(0);
        };
      });
    });

    await Promise.all(allPromises);
  }

  function addDoneTag(item: HTMLDivElement) {
    item.dataset.done = 'true';
  }
  function isHasDonetag(item: HTMLDivElement) {
    return !!item.dataset.done;
  }

  return (
    <>
      <div
        style={{ position: 'relative', height: wrapHeight, width: '100%' }}
        ref={wrapRef}
      >
        {!!data.length &&
          data.map((item: any, index: number) => {
            return (
              <div
                key={nodeKey ? item[nodeKey] : index}
                style={{
                  position: 'absolute',
                  width: `${colWidth}px`,
                  top: 0,
                  left: 0,
                  transition: 'all 0.3s',
                  zIndex: index === 0 ? 20 : ''
                }}
              >
                {renderChild(item, isPreReading ? undefined : colWidth)}
              </div>
            );
          })}
      </div>
      {isBeginLoad && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)'
          }}
        >
          {loadingElement ? loadingElement : <div>框框加载中....</div>}
        </div>
      )}
    </>
  );
};

export default Waterfall;

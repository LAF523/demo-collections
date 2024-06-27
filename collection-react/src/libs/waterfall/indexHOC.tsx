import { CardProps } from '@/pages/waterfallPage';
import { useUpdateEffect } from 'ahooks';
import { useEffect, useRef, useState } from 'react';

interface Props {
  data: any;
  col: number;
  colSpace?: number;
  rowSpace?: number;
  nodeKey?: string;
  isPreReading?: boolean;
  loadingElement?: React.ReactNode; // 自定义加载动画
}

/**
 * HOC版本瀑布流组件,预加载时一次性加载当次请求的所有图片然后渲染
 * 1.根据容器宽度和指定的列数计算列宽
 * 2.是否需要预加载
 *  2.1 是: 等待预加载完成
 * 3.获取itemHeight,计算item的top和left
 */

const withWaterfall = (Component: React.FC<CardProps>) => {
  const Waterfall: React.FC<Props> = ({
    data,
    col,
    colSpace = 20,
    rowSpace = 20,
    nodeKey,
    isPreReading = true,
    loadingElement, // 自定义加载动画
    ...rest
  }) => {
    const [wrapHeight, setWrapHeight] = useState<number>();
    const [colWidth, setColWidth] = useState<number>(0);
    const [wrapPL, setWrapPL] = useState<number>(0);
    const wrapRef = useRef<HTMLDivElement>(null);
    const colHeight = useRef<{ [key: string]: number }>({});
    const [isBeginLoad, setIsBeginLoad] = useState(false);

    useEffect(() => {
      initParams();
      initColHeight();
    }, []);

    useUpdateEffect(() => {
      initParams();
      beginLoad();
    }, [data]);

    function initParams() {
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

    function initColHeight() {
      colHeight.current = Object.fromEntries(
        new Array(col).fill(0).map((item: number, index) => [String(index + 1), item])
      );
    }

    async function beginLoad() {
      setIsBeginLoad(true);
      const wrapEl = wrapRef.current!;
      const itmesEl = [...wrapEl.children] as HTMLDivElement[];
      if (isPreReading) {
        await waitAllImgLoad(itmesEl);
      }
      computeItemsPos(itmesEl);
      setIsBeginLoad(false);
    }

    function computeItemsPos(itmesEl: HTMLDivElement[]) {
      itmesEl.map(item => {
        if (isHasDonetag(item)) {
          return;
        }
        const { targetCol, targetHeight } = getMinOrMaxColHeight('min');
        item.style.top = `${targetHeight}px`;
        item.style.left = `${(Number(targetCol) - 1) * (colWidth + colSpace) + wrapPL}px`;
        restColHeight(targetCol, item.offsetHeight);
        addDoneTag(item);
      });
      const { targetHeight } = getMinOrMaxColHeight('max');
      setWrapHeight(targetHeight);
    }

    function restColHeight(key: string, val: number) {
      colHeight.current[key] = val + rowSpace + colHeight.current[key];
    }

    function getMinOrMaxColHeight(type: 'min' | 'max') {
      const arr = Object.entries(colHeight.current);
      if (type === 'min') {
        arr.sort((a, b) => a[1] - b[1]);
      } else {
        arr.sort((a, b) => b[1] - a[1]);
      }
      return { targetHeight: arr[0][1], targetCol: arr[0][0] };
    }

    function waitAllImgLoad(itmesEl: HTMLDivElement[]) {
      return new Promise(resolve => {
        let finishIdx = 0;
        itmesEl.forEach((item, index) => {
          if (isHasDonetag(item)) {
            finishIdx++;
            return;
          }
          const imgEl = item.querySelector('img')!;
          const imageObj = new Image();
          imageObj.src = imgEl.src;
          imageObj.onload = imageObj.onerror = () => {
            finishIdx++;
            if (finishIdx === itmesEl.length) {
              resolve({
                index
              });
            }
          };
        });
      });
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
                    visibility: wrapHeight ? 'visible' : 'hidden',
                    transition: 'all 0.5s'
                  }}
                >
                  <Component
                    data={item}
                    width={colWidth}
                    {...rest}
                  ></Component>
                </div>
              );
            })}
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
        </div>
      </>
    );
  };
  return Waterfall;
};

export default withWaterfall;

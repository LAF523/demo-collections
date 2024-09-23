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

// 数据交换组件
/*
interface PropsType {
  columns: 表格列配置,左右表格共用一个,同antd
  table?: 表格其他配置,同antd
  onChange: 点击数据左移/右移触发回调,参数为移动后的数据
  leftData: 左侧表格数据
  rightData: 右侧表格数据
}
*/

import { Button, Table } from 'antd';
import styles from './index.module.less';
import { useState } from 'react';
import { ColumnType, TableProps } from 'antd/es/table';

interface Item {
  key: string;
  [otherProperty: string]: any;
}

interface PropsType {
  columns: ColumnType<Item>[];
  onChange: (newLeft: Item[], newRight: Item[]) => void;
  leftData: Item[];
  rightData: Item[];
  table?: Omit<TableProps<Item>, 'dataSource' | 'columns'>;
}

function isItemInArr(arr: Item[], item: Item) {
  return arr.reduce((acc, curr) => {
    if (curr.key === item.key) {
      acc = true;
    }
    return acc;
  }, false);
}
// 将current,target存的元素从将current中去除,并返回新的将current
function removeSameObj(current: Item[], target: Item[]): Item[] {
  return current.reduce((acc: Item[], curr) => {
    if (!isItemInArr(target, curr)) {
      acc.push(curr);
    }
    return acc;
  }, []);
}

const TransferList: React.FC<PropsType> = ({ columns, onChange, leftData, rightData, table = {} }) => {
  const [leftSource, setLeftSource] = useState(removeSameObj(leftData, rightData));
  const [rightSource, setRightSource] = useState(rightData);
  const [leftRows, setLeftRows] = useState<Item[]>([]);
  const [rightRows, setRightRows] = useState<Item[]>([]);
  const [leftKeys, setLeftKeys] = useState<React.Key[]>([]);
  const [rightKeys, setRightKeys] = useState<React.Key[]>([]);

  const leftChange = (newSelectedRowKeys: React.Key[], selectedRows: Item[]) => {
    setLeftKeys(newSelectedRowKeys);
    setLeftRows(selectedRows);
  };
  const rightChange = (newSelectedRowKeys: React.Key[], selectedRows: Item[]) => {
    setRightRows(selectedRows);
    setRightKeys(newSelectedRowKeys);
  };

  const leftClick = () => {
    if (leftRows.length === 0) {
      return;
    }
    const newRight = [...rightSource, ...leftRows];
    const newLeft = removeSameObj(leftSource, leftRows);
    setRightSource(newRight);
    setLeftSource(newLeft);
    onChange(newLeft, newRight);
    clearSelected();
  };
  const rightClick = () => {
    if (rightRows.length === 0) {
      return;
    }
    const newLeft = [...leftSource, ...rightRows];
    const newRight = removeSameObj(rightSource, rightRows);
    setLeftSource(newLeft);
    setRightSource(newRight);
    onChange(newLeft, newRight);
    clearSelected();
  };

  const rowLeftSelection = {
    selectedRowKeys: leftKeys,
    onChange: leftChange
  };
  const rowRightSelection = {
    selectedRowKeys: rightKeys,
    onChange: rightChange
  };
  function clearSelected() {
    setRightRows([]);
    setRightKeys([]);
    setLeftRows([]);
    setLeftKeys([]);
  }
  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.left}>
          <h4>未分配</h4>
          <Table
            rowSelection={rowLeftSelection}
            columns={columns}
            dataSource={leftSource}
            {...table}
          />
        </div>
        <div className={styles.middle}>
          <Button onClick={leftClick}>{'>'}</Button>
          <Button onClick={rightClick}>{'<'}</Button>
        </div>
        <div className={styles.right}>
          <h4>已分配</h4>
          <Table
            rowSelection={rowRightSelection}
            columns={columns}
            dataSource={rightSource}
            {...table}
          />
        </div>
      </div>
    </>
  );
};

export default TransferList;

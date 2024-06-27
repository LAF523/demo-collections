import React, { useEffect, useState } from 'react';
import { Modal, Space, Table } from 'antd';
import type { TableProps } from 'antd';
import TransferList from '@/components/transferList';
import { getAllAuth, getRole, getRoleAuth } from '@/service/userManage';
import styles from './index.module.less';
interface DataType {
  key: string;
  [otherProperty: string]: any;
}

const Role: React.FC = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const [leftData, setLeftData] = useState([]);
  const [rightData, setRightData] = useState([]);

  const handleOk = () => {
    console.log('发送修改请求');
    console.log(leftData, rightData);
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const onChange = (a, b) => {
    console.log(a, b);
    setLeftData(a);
    setRightData(b);
  };

  async function fetchTransferData() {
    const [rightData, rightErr] = await getRoleAuth({ name: 'admin' });
    if (rightErr) return;
    const [leftData, leftErr] = await getAllAuth();
    if (leftErr) return;
    setLeftData(leftData);
    setRightData(rightData);
    setOpen(true);
  }
  const fetchData = async () => {
    const [data, err] = await getRole();
    if (err) return;
    setData(data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const transferListcolumns: TableProps<DataType>['columns'] = [
    {
      title: '权限名称',
      dataIndex: 'name'
    },
    {
      title: '描述',
      dataIndex: 'des'
    }
  ];
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '角色',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>
    },
    {
      title: '描述',
      dataIndex: 'des',
      key: 'des'
    },
    {
      title: '实例状态',
      key: 'status',
      render: () => (
        <Space size="middle">
          <a>删除</a>
          <a onClick={fetchTransferData}>分配权限</a>
        </Space>
      )
    }
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
      />
      <Modal
        title="权限分配"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        className={styles.wrap}
      >
        <TransferList
          columns={transferListcolumns}
          onChange={onChange}
          leftData={leftData}
          rightData={rightData}
        />
      </Modal>
    </>
  );
};

export default Role;

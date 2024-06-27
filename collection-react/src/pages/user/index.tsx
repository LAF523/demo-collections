import React, { useEffect, useState } from 'react';
import { Modal, Space, Table } from 'antd';
import type { TableProps } from 'antd';
import { getRole, getUser, getUserRoles } from '@/service/userManage.ts';
import styles from './index.module.less';
import TransferList from '@/components/transferList';

interface DataType {
  key: string;
  [otherProperty: string]: any;
}

const User: React.FC = () => {
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

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>
    },
    {
      title: '所属角色',
      dataIndex: 'role',
      key: 'role',
      render: text => <a>{text.join(' ')}</a>
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>删除</a>
          <a onClick={fetchTransferData}>分配角色</a>
        </Space>
      )
    }
  ];

  const transferListcolumns: TableProps<DataType>['columns'] = [
    {
      title: '角色名称',
      dataIndex: 'name'
    },
    {
      title: '描述',
      dataIndex: 'des'
    }
  ];

  const onChange = (a, b) => {
    console.log(a, b);
    setLeftData(a);
    setRightData(b);
  };

  async function fetchTransferData() {
    const [rightData, rightErr] = await getUserRoles({ name: 'admin' });
    if (rightErr) return;
    const [leftData, leftErr] = await getRole();
    if (leftErr) return;
    setLeftData(leftData);
    setRightData(rightData);
    setOpen(true);
  }

  const fetchData = async () => {
    const [data, err] = await getUser();
    if (err) return;
    setData(data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
      />
      <Modal
        title="角色分配"
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

export default User;

import React from 'react';
import { Button, Form, Input } from 'antd';
import { login, queryUser } from '@/service/login';
import { setTokenInLocal, setRefreshTokenInLocal, setRoleInLocal } from '@/common/locallstorage';
import { encryptParam } from '@/common/encrypt.ts';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '@/stores/user';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const Login: React.FC = () => {
  const dispatch = useDispatch();

  const queryUserInfo = async () => {
    const [data, err] = await queryUser();
    if (err || !data) return;
    setRoleInLocal(data.authority);
    dispatch(
      setUserInfo({
        role: data.authority
      })
    );
  };

  const onFinish = async (values: any) => {
    const encrypted = await encryptParam(values);
    const [data, err] = await login({ encrypted });
    if (err || !data) return;
    setTokenInLocal(data.token);
    setRefreshTokenInLocal(data.refreshToken);
    localStorage.setItem('user', values.username);
    await queryUserInfo();
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button
          type="primary"
          htmlType="submit"
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;

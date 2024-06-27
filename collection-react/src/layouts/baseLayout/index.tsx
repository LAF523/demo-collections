import React, { useEffect, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import routes from '@/routes/menuRoutes';
import usePernissionMenu from '@/hooks/usePernissionMenu';
import logout from '@/common/logout';
// import RouterBeforeEach from '@/components/routerBeforeEach';
import { isLogin } from '@/common';
const { Header, Sider, Content } = Layout;

const Baselayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();
  const menu = usePernissionMenu(routes);

  const menuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  useEffect(() => {
    if (!isLogin()) {
      navigate('/login');
    }
  }, [location.pathname]);

  return (
    <Layout style={{ height: '100%' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          items={menu}
          onClick={menuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64
            }}
          />
          <Button onClick={logout}>登出</Button>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            height: 'calc(100vh - 64px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto'
          }}
        >
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Baselayout;

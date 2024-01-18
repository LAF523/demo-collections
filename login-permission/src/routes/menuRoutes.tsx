import LazyLoading from '@/components/lazyLoading';
import { lazy } from 'react';
import { VideoCameraOutlined } from '@ant-design/icons';

const Main = LazyLoading(lazy(() => import('@/pages/main')));
const AuthDemo = LazyLoading(lazy(() => import('@/pages/authDemo')));
const User = LazyLoading(lazy(() => import('@/pages/user')));
const Role = LazyLoading(lazy(() => import('@/pages/role')));

// 路由和侧边栏菜单由此生成
const routeMenuMap = [
  {
    name: 'Home',
    icon: <VideoCameraOutlined />,
    menuItems: [
      {
        name: '首页',
        icon: <VideoCameraOutlined />,
        path: '/main',
        element: Main
      },
      {
        name: '二级菜单',
        icon: <VideoCameraOutlined />,
        menuItems: [
          {
            name: '组件级权限示例',
            path: '/authDemo',
            element: AuthDemo
          }
        ]
      }
    ]
  },
  {
    name: '权限管理',
    icon: <VideoCameraOutlined />,
    menuItems: [
      {
        name: '用户管理',
        icon: <VideoCameraOutlined />,
        path: '/user',
        element: User,
        authority: ['SHOW_USER', 'MANAGE_USER']
      },
      {
        name: '角色管理',
        icon: <VideoCameraOutlined />,
        path: '/role',
        element: Role,
        authority: ['SHOW_ROLE', 'MANAGE_ROLE']
      }
    ]
  }
];
export function getRoutes(routeMenuMap: any) {
  return routeMenuMap.reduce((acc: any, curr: any) => {
    if (curr.menuItems) {
      // 表示这一级是菜单,将其routes加入路由表中
      acc.push(...getRoutes(curr.menuItems));
    } else {
      // 表示这一级是路由,提取路由信息放入路由表中
      acc.push({
        path: curr.path,
        element: curr.element,
        authority: curr.authority || '',
        children: curr.children ? getRoutes(curr.children) : []
      });
    }
    return acc;
  }, []);
}

export default routeMenuMap;

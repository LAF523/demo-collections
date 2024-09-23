import LazyLoading from '@/components/lazyLoading';
import { lazy } from 'react';
import { VideoCameraOutlined } from '@ant-design/icons';

const Main = LazyLoading(lazy(() => import('@/pages/main')));
const User = LazyLoading(lazy(() => import('@/pages/user')));
const Role = LazyLoading(lazy(() => import('@/pages/role')));
const File = LazyLoading(lazy(() => import('@/pages/file')));
const Collection = LazyLoading(lazy(() => import('@/pages/waterfallPage')));
const DragPage = LazyLoading(lazy(() => import('@/pages/dragPage')));

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
        name: '文件上传',
        icon: <VideoCameraOutlined />,
        path: '/File',
        element: File
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
  },
  {
    name: '常见场景及解决方案',
    icon: <VideoCameraOutlined />,
    menuItems: [
      {
        name: '瀑布流',
        icon: <VideoCameraOutlined />,
        path: '/collection/water',
        element: Collection
      },
      {
        name: '拖拽排序',
        icon: <VideoCameraOutlined />,
        path: '/collection/drag',
        element: DragPage
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

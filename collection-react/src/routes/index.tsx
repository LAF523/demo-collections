import { Navigate } from 'react-router-dom';
import routes, { getRoutes } from './menuRoutes';
import LazyLoading from '@/components/lazyLoading';
import { lazy } from 'react';

const BaseLayout = LazyLoading(lazy(() => import('@/layouts/baseLayout')));
const Child = LazyLoading(lazy(() => import('@/pages/main/child')));
// const LoginLayout = LazyLoading(lazy(() => import('@/layouts/loginLayout')));
// const Login = LazyLoading(lazy(() => import('@/pages/login')));

const baseRoutes = [
  {
    path: '/',
    element: BaseLayout,
    children: [
      ...getRoutes(routes),
      {
        path: '/params',
        element: Child
      },
      {
        path: '*',
        element: <Navigate to="/main" />
      }
    ]
  }
];
export default baseRoutes;

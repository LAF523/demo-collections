import { Navigate, createHashRouter } from 'react-router-dom';
import routes, { getRoutes } from './menuRoutes';
import LazyLoading from '@/components/lazyLoading';
import { lazy } from 'react';

const BaseLayout = LazyLoading(lazy(() => import('@/layouts/baseLayout')));
const LoginLayout = LazyLoading(lazy(() => import('@/layouts/loginLayout')));
const Login = LazyLoading(lazy(() => import('@/pages/login')));

const baseRoutes = [
  {
    path: '/',
    element: LoginLayout,
    children: [
      {
        path: '/login',
        element: Login
      }
    ]
  },
  {
    path: '/',
    element: BaseLayout,
    children: [
      ...getRoutes(routes),
      {
        path: '*',
        element: <Navigate to="/main" />
      }
    ]
  }
];
export default createHashRouter(baseRoutes);

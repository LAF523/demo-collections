import LazyLoading from '@/components/lazyLoading';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const BaseLayout = LazyLoading(lazy(() => import('@/layouts/baseLayout')));
const LoginLayout = LazyLoading(lazy(() => import('@/layouts/loginLayout')));
const Main = LazyLoading(lazy(() => import('@/pages/main')));
const Login = LazyLoading(lazy(() => import('@/pages/login')));

const routers = [
  {
    path: '/',
    element: LoginLayout,
    children: [
      {
        path: '/login',
        element: Login
      },
      {
        path: '/',
        element: <Navigate to="/login" />
      }
    ]
  },
  {
    path: '/',
    element: BaseLayout,
    children: [
      {
        path: '/main',
        element: Main
      }
    ]
  }
];

export default routers;

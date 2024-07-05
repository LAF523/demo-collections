import { RouteRecordRaw } from 'vue-router';

const router: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layoutMobile',
    component: () => import('@/layout/mobile/index.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/home/index.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/pages/profile/index.vue'),
        meta: {
          user: true
        }
      },
      {
        path: '/pints/:id',
        name: 'pints',
        component: () => import('@/pages/itemDetail/index.vue')
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/login/index.vue')
      }
    ]
  }
];

export default router;

import { RouteRecordRaw } from 'vue-router';

const router: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layoutPc',
    component: () => import('@/layout/pc/index.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/pages/home/index.vue')
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/pages/profile/index.vue'),
        meta: {
          user: true
        }
      }
    ]
  },
  {
    path: '/pints/:id',
    name: 'pints',
    component: () => import('@/pages/itemDetail/index.vue')
  },
  {
    path: '/member',
    name: 'Member',
    component: () => import('@/pages/member/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue')
  }
];

export default router;

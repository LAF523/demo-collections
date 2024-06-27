import { RouteRecordRaw } from 'vue-router';

const router: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layoutMobile',
    component: () => import('@/layout/mobile/index.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/pages/home/index.vue')
      }
    ]
  }
];

export default router;

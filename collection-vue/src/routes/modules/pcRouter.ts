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
      }
    ]
  }
];

export default router;

import { createWebHistory, createRouter } from 'vue-router';
import pcRouter from './modules/pcRouter.ts';
import mobileRouter from './modules/mobileRouter.ts';
import { isMobile } from '@/utils/flexible.ts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: isMobile.value ? mobileRouter : pcRouter
});
export default router;

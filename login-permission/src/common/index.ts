import { parseJwt } from '@/common/encrypt.ts';

export const isLogin = () => {
  // token中的name和本地存储的name一致 表示已经登录
  const tokenUser = parseJwt()?.username;
  const localUser = localStorage.getItem('user');
  return tokenUser === localUser && localUser !== null;
};

// TODO:demo
import { get, post } from './http';
// 获取用户数据

const getUserInfo = (data: { id: string }) => {
  return get('/api/use', data);
};
const addUserInfo = (data: { name: string }) => {
  return post('/api/use', data);
};

export default {
  getUserInfo,
  addUserInfo
};

import { get, post } from './http';

export const getPubKey = () => {
  return get('/api/publicKey');
};
export const login = (data: object) => {
  return post('/api/login', data);
};

export const queryUser = () => {
  return get('/api/queryUser');
};

export const getList = () => {
  return get('/api/getList');
};

export const getRefreshToken = () => get('/api/refreshToken');

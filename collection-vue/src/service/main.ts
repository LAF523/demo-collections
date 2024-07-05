import { get, post, put } from './request/index.ts';

export interface PexelsList {
  page: number;
  size: number;
  categoryId?: string;
  searchText?: string;
}

export interface HintType {
  q: string;
}
export const getCategory = () => get('/category');

export const getPexelsList = (data: PexelsList) => get('/pexels/list', data);
export const getHint = (data: HintType) => get('/pexels/hint', data);

export interface LoginProps {
  username: string;
  password: string;
  loginType: 'username' | 'WX' | 'QQ';
}
export const login = (data: LoginProps) => post('/sys/login', data);

interface RegisterProps {
  username: string;
  password: string;
}
export const register = (params: RegisterProps) => post('/sys/register', params);

// /user/profile

export const profile = () => get('/user/profile');

interface ModifyProps {
  nickname: string;
  title: string;
  company: string;
  homePage: string;
  introduction: string;
  avatar: string;
}
export const modifyUser = (data: ModifyProps) => put('/user/profile', data);

export const getVip = () => get('/user/vip/pay/list');

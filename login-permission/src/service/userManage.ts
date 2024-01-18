import { get } from './http';

export const getUser = () => get('/api/getUser');
export const getRole = () => get('/api/getRole');
export const getAllAuth = () => get('/api/getAllAuth');
export const getUserRoles = (data: object) => get('/api/getUserRoles', data);
export const getRoleAuth = (data: object) => get('/api/getRoleAuth', data);

import { get } from './http';

export const getPicture = (data: { size: number; page: number }) => get('/api/pexels/list', data);

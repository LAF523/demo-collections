import { get } from './request/index.ts';

interface PexelsList {
  page: number;
  size: number;
  categoryId?: string;
  searchText?: string;
}

export const getCategory = () => get('/category');

export const getPexelsList = (data: PexelsList) => get('/pexels/list', data);

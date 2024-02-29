import { get, post } from './http';

// 开始上传时获取上传详情
export const getUploadDetial = (data: { md5: string; suffix: string }) => get('/api/getUploadDetial', data);

//上传分片
export const upload = data => post('/api/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });

// 合并文件
export const merge = data => {
  return get('/api/mergeFile', data);
};

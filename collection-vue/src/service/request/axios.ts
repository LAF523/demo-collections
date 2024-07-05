import axios from 'axios';
import { handleNetErr, handleAuthError, handleRequestHeader, handleAuth, getToken } from './httpTools';
import { serviceConfig } from './config.ts';

const { baseURL, timeout, withCredentials } = serviceConfig;
const service = axios.create({
  baseURL,
  timeout,
  withCredentials
});

service.interceptors.request.use(config => {
  // 其他调整
  config = handleRequestHeader(config, {});
  if (getToken()) {
    // 添加token
    config = handleAuth(config);
  }
  config.headers.icode = 'helloqianduanxunlianying';

  return config;
});

service.interceptors.response.use(
  res => {
    if (res.status === 200) {
      // 检测授权错误
      handleAuthError(res);

      return Promise.resolve(res.data.data);
    }
    return Promise.reject(res);
  },
  err => {
    // 检测网络错误
    handleNetErr(err);

    return Promise.reject(err);
  }
);

export default service;

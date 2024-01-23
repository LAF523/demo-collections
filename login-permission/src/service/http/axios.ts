import axios, { InternalAxiosRequestConfig } from 'axios';
import { handleNetErr, handleAuthError, handleRequestHeader, handleAuth } from './httpTools';
import { serviceConfig } from './config.ts';
interface watingQueueTyp {
  resolve: (value: any) => void;
  config: InternalAxiosRequestConfig<any>;
}

let isRefreshTokening = false;
const watingQueue: watingQueueTyp[] = [];

const { baseURL, useTokenAuthorization, timeout, withCredentials } = serviceConfig;
const service = axios.create({
  baseURL,
  timeout,
  withCredentials
});

service.interceptors.request.use(config => {
  config = handleRequestHeader(config, {}); // 其他调整
  if (useTokenAuthorization) {
    config = handleAuth(config, isRefreshTokening); // 添加token
  }

  return config;
});

service.interceptors.response.use(
  res => {
    if (res.status === 200) {
      handleAuthError(res);
      return Promise.resolve(res.data.data);
    }

    return Promise.reject(res);
  },
  async err => {
    const needRefreshToken = err.response.status === 401 && err.config.url !== '/api/refreshToken';
    if (needRefreshToken) {
      return await silentTokenRefresh(err);
    }
    handleNetErr(err);

    return Promise.reject(err);
  }
);

export default service;

import { getRefreshToken } from '../login.ts';
import { setRefreshTokenInLocal, setTokenInLocal } from '@/common/locallstorage.ts';

// 无感刷新token
async function silentTokenRefresh(err: any) {
  const { config } = err;
  if (!isRefreshTokening) {
    return await startRefresh(config);
  }
  return waitingRefresh(config);
}

// 开始刷新token
async function startRefresh(config: InternalAxiosRequestConfig<any>) {
  await refreshToken();
  tryWatingRequest();
  return service(config); //第一个发现token失效的请求,直接重新发送
}

// 正在刷新token,将当前请求存储
function waitingRefresh(config: InternalAxiosRequestConfig<any>) {
  return new Promise(resolve => {
    //存储刷新期间失败的请求,返回一个新的promise,保持该次请求的状态为等待,不让这次请求结束,使结果正确返回至对应的请求发出点
    watingQueue.push({ config, resolve });
  });
}

// 请求新token,并更新本地
async function refreshToken() {
  isRefreshTokening = true;
  const [data, err] = await getRefreshToken();
  if (err) return;
  const { token, refreshToken } = data;
  setTokenInLocal(token);
  setRefreshTokenInLocal(refreshToken);
  isRefreshTokening = false;
}

// 重新发送由于token过期存储的请求
function tryWatingRequest() {
  while (watingQueue.length > 0) {
    const { config, resolve } = watingQueue.shift() as watingQueueTyp;
    resolve(service(config));
  }
}

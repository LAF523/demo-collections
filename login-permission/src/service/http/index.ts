import service from './axios.ts';
import { getQueryString, cleanRes } from './httpTools.ts';

// 封装get,post,put等方法

/**
 * @message:
 * @param {string} url
 * @param {object} data
 * @return {*}
 * @since: 2024-01-08 15:33:35
 */
export const get = (url: string, query?: object | undefined) => {
  return cleanRes(
    service({
      url: url + getQueryString(query),
      method: 'get'
    })
  );
};

export const post = (url: string, data: object) => {
  return cleanRes(
    service({
      url: url,
      method: 'post',
      data
    })
  );
};

// TODO: 其他方法同post

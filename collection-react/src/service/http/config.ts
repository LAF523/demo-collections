import logout from '@/common/logout';

interface ErrMap {
  [key: string]: { msg: string; afterErr?: () => void };
}

// 请求配置
export const serviceConfig = {
  baseURL: import.meta.env.VITE_BASE_URL,
  useTokenAuthorization: true, //开启token验证
  timeout: 10000,
  withCredentials: false // 携带cookie
};

// 网络错误配置
export const netWorkErrMap: ErrMap = {
  '302': { msg: '接口重定向了' },
  '400': { msg: '参数不正确!' },
  '401': {
    msg: '您未登录，或者登录已经超时，请先登录！',
    afterErr() {
      logout();
    }
  },
  '403': { msg: '您没有权限操作!' },
  '404': { msg: '请求地址出错!' },
  '405': { msg: '请求方法不被允许!' },
  '408': { msg: '请求超时！' },
  '409': { msg: '系统已存在相同数据！' },
  '500': { msg: '服务器内部错误！' },
  '501': { msg: '服务未实现！' },
  '502': { msg: '网关错误！' },
  '503': { msg: '服务不可用！' },
  '504': { msg: '服务暂时无法访问，请稍后再试！' },
  '505': { msg: 'HTTP 版本不受支持！' }
};

export const authErrMap: ErrMap = {
  '10031': {
    msg: '登录失效，需要重新登录',
    afterErr() {
      logout();
    }
  }, // token 失效
  '10032': {
    msg: '您太久没登录，请重新登录~',
    afterErr() {
      logout();
    }
  }, // token 过期
  '10033': { msg: '账户未绑定角色，请联系管理员绑定角色' },
  '10034': { msg: '该用户未注册，请联系管理员注册用户' },
  '10035': { msg: 'code 无法获取对应第三方平台用户' },
  '10036': { msg: '该账户未关联员工，请联系管理员做关联' },
  '10037': { msg: '账号已无效' },
  '10038': { msg: '账号未找到' }
};

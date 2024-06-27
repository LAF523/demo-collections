# 无感刷新token

> 背景: 在项目中,token的过期时间如果设置的太长,出于安全性考虑: 万一token被盗取,影响的时间要更大,但是如果token的时间过短,用户需要频繁登录,出于用户体验考虑,也不合适.
>
> 因此就有了无感刷新token的功能: 使用两个token: accessToken和refreshToken,
>
> - accessToken用来鉴权,其有效期很短,即使被盗,影响也较小
> - refreshToken只用来刷新accessToken的时间.其有效期很长,作用只是用来刷新token,即使被盗影响也不大
>
> 流程就是: 用户发起请求,发现token已经过期时,自动携带refreshToken请求新的accessToken和refreshToken,r然后重新发起刚才因为token失效而未成功的请求.以此做到在用户无感知的情况下刷新token

## 注意点

1. 如何重新发送在token刷新期间,由于token过期产生的新请求,并且使结果正确返回至对应的请求发出点
2. 携带refreshToken的请求也可能过期,但这个过期请求不需要刷新处理

## 实现步骤

### 服务端

对之前写的node服务修改一下,首先新增签发`refrehsToken`的接口

jwt.js中新增:

```js
// 无感刷新token所以来的token
const refreshOptions = { 
  expiresIn: '10d',      
  algorithm: 'RS256'     
}                        

// 签发无感刷新使用的token
function generateReFreshToken(user) {
  const payload = { username: user.username };
  return jwt.sign(payload, secret, refreshOptions);
}

module.exports = {
  ...
  generateReFreshToken
};
```

server.js中新增刷新接口:

```js
const {generateToken,generateReFreshToken,authenticateToken} = require('./jwt')
// 无感刷新token,authenticateToken用上之前写的鉴权中间件,鉴别token是否有效
app.get('/refreshToken',authenticateToken,(req,res) => {
  const {username,password} = req.user
  // 新token
  const token = generateToken({username,password})
  // 新refreshToken
  const refreshToken = generateReFreshToken({username,password})
  res.send({
    data: {
      token,refreshToken
    },
    success: true,
  })
})
//登录接口也要改一下 登录时将refreshToken也返回
app.post('/login', (req, res) => {
  // 获取post请求的参数进行解密
  const {username,password} = privateDecrypt(req.body.encrypted)
  if(username === 'admin',password === 'admin'){
    // 登录成功,签发token
    const token = generateToken({username})
    const refreshToken = generateReFreshToken({username}) +
    res.send({
      data: {token,refreshToken}, +
      err: null,
      success:true
    });
    return
  }
  res.send({
    data: '',
    err: "没有找到用户",
    success:false,
    code: 10034
  });
});
```

### 前端

> 主要在axios的响应拦截器和请求拦截器中做文章

1. 定义一个变量: `isRefreshTokening`用来判断是否正在请求新token

2. 定义一个队列: `watingQueue`存放刷新token期间,由于token过期产生的新出错请求

3. 在请求中拦截器根据`isRefreshTokening`决定本次请求是否携带`refreshToken`,为`true`表示本次请求拦截器拦截的是去刷新token的请求,应该带上`refreshToken`

   ```js
   const service = axios.create({
     baseURL,
     timeout,
     withCredentials
   });
   
   service.interceptors.request.use(config => {
       ....
       config = handleAuth(config, isRefreshTokening); // 添加token
       ...
     return config;
   });
   ```

4. 响应拦截器中,判断响应状态码是否为401以及url是否为刷新token的请求:`/api/refreshToken`

   ```js
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
       if (needRefreshToken) { // 表示需要刷新token
         return await silentTokenRefresh(err);
       }
       handleNetErr(err);
   
       return Promise.reject(err);
     }
   );
   ```

5. 如果请求是`/api/refreshToken`且响应状态码为`401`表示`refreshToken`也过期了,只能重新登录

6. 如果不是上述条件,则表示需要刷新token,进入`silentTokenRefresh`的逻辑

   ```js
   async function silentTokenRefresh(err: any) {
     const { config } = err;
     if (!isRefreshTokening) {
       return await startRefresh(config);
     }
     return waitingRefresh(config);
   }
   ```

7. 如果`isRefreshTokening`为`true`,表示正在刷新token,该次请求需要存储起来,等待token刷新完毕,重新请求

   1. 进入`waitingRefresh`逻辑:

      ```js
      function waitingRefresh(config: InternalAxiosRequestConfig<any>) {
        return new Promise(resolve => {
          watingQueue.push({ config, resolve });
        });
      }
      ```

      这里返回的是一个新的promise,是为了保证该次请求的状态不结束,在发送请求的地方如: `await getUserInfo()`其是一个等待状态的promis,当响应拦截器返回`promise.resolve或者promise.reject`时,`await getUserInfo()`的状态才变为`resolve或reject`,但由于该请求失败了,并且我们需要重试这个请求,所以返回一个新的等待状态的promise,来维持`await getUserInfo()`的等待状态,那么`await getUserInfo()`的状态就取决于新的promise的状态,这个新的promise的resolve存储在队列中,等到接下来重新发送请求时,这个新的promise状态又依赖于新请求触发的响应拦截器返回的状态.这样,最终`await getUserInfo()`的状态相当于依赖重新发送请求触发的响应拦截器的状态,由于中间夹了一个新的promise,通过操作这个promise,就能实现保持`await getUserInfo()`的状态,直到重新发送的请求响应了再更新.

      可能有点绕,通俗点讲就是当请求token失效时,让这个请求先暂停,等新token回来了,再继续请求

8. 如果`isRefreshTokening`为`false`,表示需要刷新`token`

   1. 进入`startRefresh`开始刷新token的逻辑

      ```js
      async function startRefresh(config: InternalAxiosRequestConfig<any>) {
        await refreshToken(); // 请求新的token
        tryWatingRequest();
        return service(config); //第一个发现token失效的请求,直接重新发送
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
          resolve(service(config)); // 记得上面waitingRefresh中新创建的promise吗,其resolve在这里使用了,这样该promise的状态就依赖新请求的响应拦截器的返回状态了
        }
      }
      ```

完整的源码如下,其中用到的工具函数如`handleAuth`比较简单这里就省略了: 

axios.ts

```js
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
import { setRefreshTokenInLocal, setTokenInLocal } from '@/common/keyAndToken.ts';

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
  return service(config); //该配置对应的请求第一次发现了token失效,直接重新发送
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
```


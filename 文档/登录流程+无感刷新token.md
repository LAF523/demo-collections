> 整个完整demo地址为[github](https://github.com/LAF523/login-permission-demo.git)

# jwt鉴权

jwt(jsonwebtoken)主要用在登录流程中,用于标识用户,下面将完整实现一下基于jwt和rsa非对称加密的用户登录鉴权流程:

1. 用户输出账号密码
2. 使用公钥对帐号密码加密
3. 发送登录请求
4. 登录成功,返回token
5. 前端将token存储在本地
6. 之后的请求都需要携带上这个token

## 服务端

先用node整好服务端,对整个流程分析: 前端要加密用户信心,就要使用密钥,那么后端应该先提供密钥接口:

```js
当前文件夹结构
keys
--- index.js
--- private.pem  // 存放私钥
--- public.pem   // 存放公钥
```

在index,需要什么捏,想想哈,首先要有生成公钥和私钥的方法`createKeys`,其次还需要把生成的公钥和私钥保存在文件中的方法`setPubKeyPem`和`setPrivateKeyPem`,ok,现在已经可以创建和保存密钥了,那么接下来就差获取密钥的方法了,获取密钥就叫`getPrivateKeyPem`和`getPubKeyPem`吧,等等,当用户登录了,我们获取的是加密后的信息,应该还需要一个解密的方法,就叫`privateDecrypt`吧.这下差不多了,先把这些方法实现以下:

```js
const fs = require('fs');
const crypto = require('crypto'); // 自带模块
const path = require('path')

const createKeys = () => {
      // 生成新的RSA密钥对
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
    // 将公钥转换为PEM格式的字符串
    const publicKeyPem = publicKey.export({ type: 'pkcs1', format: 'pem' }).toString();
    const privateKeyPem = privateKey.export({ type: 'pkcs1', format: 'pem' }).toString();
    return { publicKeyPem, privateKeyPem }
}

const getPubKeyPem = () => {
  // 读取公钥文件
  const filepath = path.join(__dirname, 'public.pem');
  const publicKey = fs.readFileSync(filepath, 'utf8');
  if(!publicKey){
    const { publicKeyPem, privateKeyPem } = createKeys()
    setPubKeyPem(publicKeyPem)
    setPrivateKeyPem(privateKeyPem)
    return publicKeyPem
  }
  return publicKey;
}

const setPubKeyPem = (pubKey) => {
  // 写入公钥文件
  const filepath = path.join(__dirname, 'public.pem');
  fs.writeFileSync(filepath, pubKey);
}

const setPrivateKeyPem = (priKey) => {
  // 写入私钥文件
  const filepath = path.join(__dirname, 'private.pem');
  fs.writeFileSync(filepath, priKey);
}

const getPrivateKeyPem = () => {
  // 读取私钥文件
  const filepath = path.join(__dirname, 'private.pem');
  const privateKey = fs.readFileSync(filepath, 'utf8');
  if(!privateKey){
    const { publicKeyPem, privateKeyPem } = createKeys()
    setPubKey(publicKeyPem)
    setPrivateKey(privateKeyPem)
    return privateKeyPem
  }
  return privateKey;
}

function privateDecrypt(encrypted){
  const privateKeyPem = getPrivateKeyPem();
  const privateKey = crypto.createPrivateKey(privateKeyPem)
  const encryptedData = Buffer.from(encrypted, 'base64');
  // 使用私钥进行解密
  const decryptedBuffer = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING, // 根据加密时的填充方式选择
    },
    encryptedData
  );
  return JSON.parse(decryptedBuffer.toString('utf8'))
}

// 最后将这些方法,暴露出去
module.exports = {
  getPubKeyPem,
  getPrivateKeyPem,
  privateDecrypt
}
```

密钥的模块搞定了,接下来加一个接口就可以了

```js
当前文件夹结构
keys
--- index.js
--- private.pem  // 存放私钥
--- public.pem   // 存放公钥
server.js        +
```

在server.js中直接使用express搭建一个小服务,先安装express`npm i express -S`,之后:

```js
const http = require('http');
const express = require('express');
const {getPubKeyPem,privateDecrypt} = require('./keys')

// 使用Express创建HTTP服务器
const app = express();
app.use(express.json());

// 获取密钥
app.get('/publicKey', (req, res) => {
  res.set('Content-Type', 'application/x-pem-file');
  const pub_key = getPubKeyPem();
  res.send({
    data: {pub_key},
    err: null,
    success:true
  });
});

// 启动服务器监听3000端口
const server = http.createServer(app);
server.listen(3000, () => {
  console.log('Server is running on port 3000...');
});
```

OK,密钥这块搞定了,接着分析流程,前端加密完成了,接下来该发送登录请求了,那么后端需要提供登录接口,如果用户登录成功,接口中还应该签发token才行,那就从token下手吧:

```js
当前文件夹结构
keys
--- index.js
--- private.pem  // 存放私钥
--- public.pem   // 存放公钥
server.js
jwt.js           +
```

安装一下jsonwebtoken: `npm i jsonwebtoken -S`

jwt.js中应该干些什么呢? 首先需要一个签发token的方法`generateToken`,现在有了token,之后的请求中肯定需要校验token,所以还需要一个校验token的方法`authenticateToken`,感觉差不多了,来实现一下:

```js
const jwt = require('jsonwebtoken');
const {getPrivateKeyPem} = require('./keys')
const secret = getPrivateKeyPem(); // 你的密钥

// 设置token过期时间
const options = {
  expiresIn: '10s', // 可以是数字（单位为秒）或字符串（如 '2 hours'、'1d' 等）
  algorithm: 'RS256' // 使用RAS非对称加密进行签名
};

// 生成并签发JWT令牌
function generateToken(user) {
  const payload = { username: user.username };
  return jwt.sign(payload, secret, options);
}

// 一个中间件,校验token时间
function authenticateToken(req, res, next) {
  if(['/login','/getPubKey'].includes(req.url)){ // 登录和获取密钥不校验token
    next()
  }
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // 获取Bearer后面的token值
    try {
      const decoded = jwt.verify(token, secret); // 使用密钥验证Token
      console.log("decoded:",decoded)
      req.user = decoded; // 将解码后的用户信息添加到req对象以便后续路由使用
      console.log("当前时间",Date.now())
      next(); // 如果验证通过，继续执行下一个中间件或路由处理程序
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }
}

module.exports = {
  generateToken,
  authenticateToken
};
```

server.js中新增一个接口

```js
const {generateToken,authenticateToken} = require('./jwt')

app.post('/login', (req, res) => {
  // 获取post请求的参数进行解密
  const {username,password} = privateDecrypt(req.body.encrypted)
  if(username === 'admin',password === 'admin'){ // 整个模拟数据
    // 登录成功,签发token
    const token = generateToken({username}) // 签发token的时候把用户名带上
    res.send({
      data: {token},
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

ok,服务端就这样差不多了,只要能满足前端测试就好,接下来搞一下前端

## 前端

先把基础的结构写一下,这里我直接`clone`之前写的项目模板[react-template](https://github.com/LAF523/react-template.git),配置一下路由,布局等,然后写一下登录页:

```js
login.tsx:
    import React from 'react';
    import { Button, Form, Input } from 'antd';

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };

  const onFinish = async (values: any) => {};

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button
          type="primary"
          htmlType="submit"
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
```

首先需要把后端提供的接口,前端写出对应的请求方法,在`service`下新建`login.ts`用来存放所有的登录相关接口:

```js
import { get, post } from './http';

export const getPubKey = () => {
  return get('/api/publicKey');
};
export const login = (data: object) => {
  return post('/api/login', data);
};
```

接着分析,用户点击登录之后,首先是对用户信息加密,加密的话先要有密钥,先把加密这部分整一下:
安装一个加密库: `npm i jsencrypt -S`

```js
common             
├─ encrypt.ts  + 
```

encrypt.ts中首先需要一个获取密钥的方法`getRsaKey`,之后需要根据密钥进行加密的方法`encryptParam`:

```js
import JSEncrypt from 'jsencrypt';
import { setKeyInLocal, getKeyByLocal } from '@/common/keyAndToken';
import { getPubKey } from '@/service/login';

export const getRsaKey = async () => {
  const key = getKeyByLocal();
  if (['undefined', null, undefined].includes(key)) {
    const [data, err] = await getPubKey();
    if (err) return;
    setKeyInLocal(data.pub_key);
    return data.pub_key;
  }
  return key;
};

export const encryptParam = async (param: object) => {
  const key = await getRsaKey();
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(key);
  return encryptor.encrypt(JSON.stringify(param));
};
```

加密完成了,接下来就是发送登录请求,并存储token了

在/pages/login中,完善一下`onFinish`方法,

```js
import React from 'react';
import { Button, Form, Input } from 'antd';
import { login } from '@/service/login';
import { useNavigate } from 'react-router-dom';
import { setTokenInLocal, setRefreshTokenInLocal } from '@/common/keyAndToken';
import { encryptParam } from '@/common/encrypt.ts';
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  const queryUserInfo = async () => {
    const [data, err] = await queryUser();
    if (err || !data) return;
    console.log(data);
  };

  const onFinish = async (values: any) => {
    const encrypted = await encryptParam(values);
    const [data, err] = await login({ encrypted });
    if (err || !data) return;
    setTokenInLocal(data.token);
    localStorage.setItem('user', values.username); // 用于和token中携带的name比较判断用户登录状态
    navigate('主页的路由');
  };
```

ok,整个登录就基本完成了,例子中的有些方法比较简单,文章中没有直接展示如:`setTokenInLocal`, `setRefreshTokenInLocal`

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




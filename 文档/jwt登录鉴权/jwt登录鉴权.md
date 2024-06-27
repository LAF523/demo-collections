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
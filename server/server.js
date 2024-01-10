/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const http = require('http');
const express = require('express');
const {getPubKeyPem,privateDecrypt} = require('./keys')
const {generateToken,generateReFreshToken,authenticateToken} = require('./jwt')
const role = require('./role.js')


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

// 登录
app.post('/login', (req, res) => {
  // 获取post请求的参数进行解密
  const {username,password} = privateDecrypt(req.body.encrypted)
  if(username === 'admin',password === 'admin'){
    // 登录成功,签发token
    const token = generateToken({username})
    const refreshToken = generateReFreshToken({username})
    res.send({
      data: {token,refreshToken},
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

// 权限
app.get('/queryUser',authenticateToken,(req,res) => {
  res.send({
    data:{authority:role[req.user.username],a: Math.random()},
    err: null,
    success:true
  })
})

// 
app.get('/getList',authenticateToken,(req,res) => {
  res.send({
    data: [1,2,3,4,5,Math.random()],
    success: true,
  })
})

// 无感刷新token
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



// 启动服务器监听3000端口
const server = http.createServer(app);
server.listen(3000, () => {
  console.log('Server is running on port 3000...');
});

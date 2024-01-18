const express = require('express');
const router = express.Router();
const {getPubKeyPem,privateDecrypt} = require('../keys')
const {generateToken,generateReFreshToken,authenticateToken} = require('../jwt')
const role = require('../role.js')

// 获取密钥
router.get('/publicKey', (req, res) => {
  res.set('Content-Type', 'application/x-pem-file');
  const pub_key = getPubKeyPem();
  res.send({
    data: {pub_key},
    err: null,
    success:true
  });
});

// 登录
router.post('/login', (req, res) => {
  // 获取post请求的参数进行解密
  const {username,password} = privateDecrypt(req.body.encrypted)
  if((username === 'admin' && password === 'admin') || (username === 'user' && password === 'user')){
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
router.get('/queryUser',(req,res) => {
  res.send({
    data:{authority:role[req.user.username]},
    err: null,
    success:true
  })
})

// 
router.get('/getList',(req,res) => {
  res.send({
    data: [1,2,3,4,5,Math.random()],
    success: true,
  })
})

// 无感刷新token
router.get('/refreshToken',(req,res) => {
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

module.exports = router;
  const fs = require('fs');
  const crypto = require('crypto');
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

module.exports = {
  getPubKeyPem,
  getPrivateKeyPem,
  privateDecrypt
}

const jwt = require("jsonwebtoken");
const { getPrivateKeyPem } = require("./keys");
const secret = getPrivateKeyPem(); // 你的密钥

// 设置token过期时间
const options = {
  expiresIn: "10m", // 可以是数字（单位为秒）或字符串（如 '2 hours'、'1d' 等）
  algorithm: "RS256", // 使用RAS非对称加密进行签名
};
// 无感刷新token所以来的token
const refreshOptions = {
  expiresIn: "10d",
  algorithm: "RS256",
};

// 生成并签发JWT令牌
function generateToken(user) {
  const payload = { username: user.username };
  return jwt.sign(payload, secret, options);
}
// 签发无感刷新使用的token
function generateReFreshToken(user) {
  const payload = { username: user.username };
  return jwt.sign(payload, secret, refreshOptions);
}

// 一个中间件,校验token时间
function authenticateToken(req, res, next) {
  if (["/publicKey", "/login", "/refreshToken"].includes(req.url)) {
    // 登录不校验token
    return next();
  }
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // 获取Bearer后面的token值
    try {
      const decoded = jwt.verify(token, secret); // 使用密钥验证Token
      // console.log("decoded:", decoded);
      req.user = decoded; // 将解码后的用户信息添加到req对象以便后续路由使用
      next(); // 如果验证通过，继续执行下一个中间件或路由处理程序
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided." });
  }
}

module.exports = {
  generateToken,
  authenticateToken,
  generateReFreshToken,
};

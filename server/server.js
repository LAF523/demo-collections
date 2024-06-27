const http = require("http");
const express = require("express");
const { authenticateToken } = require("./jwt");
const loginRouter = require("./routes/login.js");
const useManageRouter = require("./routes/userManage.js");
const uploadRouter = require("./routes/upload.js");

// 使用Express创建HTTP服务器
const app = express();

app.use(express.json());
app.use(authenticateToken);
app.use(loginRouter);
app.use(useManageRouter);
app.use(uploadRouter);

// 启动服务器监听3000端口
const server = http.createServer(app);
server.listen(3000, () => {
  console.log("Server is running on port 3000...");
});

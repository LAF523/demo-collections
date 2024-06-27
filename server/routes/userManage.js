const express = require("express");
const router = express.Router();
const role = require("../role.js");

router.get("/getUser", (req, res) => {
  res.send({
    data: [
      {
        name: "用户1",
        role: ["admin", "user"],
        key: "用户1",
      },
    ],
    err: null,
    success: true,
  });
});
router.get("/getRole", (req, res) => {
  res.send({
    data: [
      {
        name: "user",
        key: "user",
        des: "user",
      },
      {
        name: "admin",
        key: "admin",
        des: "admin",
      },
      {
        name: "supperAdmin",
        key: "supperAdmin",
        des: "supperAdmin",
      },
    ],
    err: null,
    success: true,
  });
});

router.get("/getAllAuth", (req, res) => {
  res.send({
    data: role["all"],
    err: null,
    success: true,
  });
});

router.get("/getRoleAuth", (req, res) => {
  res.send({
    data: role[req.query.name].map((item) => ({
      name: item,
      des: item,
      key: item,
    })),
    err: null,
    success: true,
  });
});

router.get("/getUserRoles", (req, res) => {
  res.send({
    data: [
      {
        name: req.query.name,
        des: req.query.name,
        key: req.query.name,
      },
    ],
    err: null,
    success: true,
  });
});

module.exports = router;

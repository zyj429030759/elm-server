const express = require("express");
const router = express.Router();

router.post("/single", (req, res, next) => {
  res.send("单文件上传");
});

router.post("/base64", (req, res, next) => {
  res.send("base64上传");
});

router.post("/binary", (req, res, next) => {
  res.send("binary上传");
});

router.post("/multi", (req, res, next) => {
  res.send("多文件上传");
});

module.exports = router;

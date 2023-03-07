const path = require("path");

module.exports = {
  publicPath: path.resolve(__dirname, "../public"),
  // 存放路径
  uploadPath: path.resolve(__dirname, "../public/upload"),
  // 文件大小
  sizeLimit: 1 * 1024 * 1024,
  // 文件后缀
  exts: [".jpg", ".jpeg", ".bmp", ".webp", ".gif", ".png"],
  // 最多可以上传数量
  countLimit: 3,
};

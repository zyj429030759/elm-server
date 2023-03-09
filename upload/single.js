// Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据
const multer = require("multer");
const uploadConfig = require("./config");
const upload = multer({
  // 文件保存路径，不写就存内存中
  dest: uploadConfig.uploadPath,
  limits: {
    // 限制文件大小
    fileSize: uploadConfig.sizeLimit,
  },
  // 过滤函数
  fileFilter(req, file, cb) {
    const path = require("path");
    const ext = path.extname(file.originalname);
    // 判断后缀是否符合标准
    if (uploadConfig.exts.includes(ext)) {
      cb(null, true);
    } else {
      const { ExtError } = require("./errorType");
      cb(new ExtError());
    }
  },
});
const { handleFile } = require("./utils");

module.exports = (req, res, next) => {
  upload.single("avatar")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      const { SizeLimitError, UnexpectedRequest } = require("./errorType");
      if (err.message === "File too large") {
        err = new SizeLimitError();
      } else {
        err = new UnexpectedRequest();
      }
    }
    if (err) {
      next(err);
      return;
    }
    const url = await handleFile(req.file, req);
    res.send({
      data: url,
    });
  });
};

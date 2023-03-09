// Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据
const multer = require("multer");
const uploadConfig = require("./config");
const { handleFile } = require("./utils");
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

module.exports = (req, res, next) => {
  upload.array("photos", uploadConfig.countLimit)(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      const { SizeLimitError, CountLimitError } = require("./errorType");
      if (err.message === "File too large") {
        err = new SizeLimitError();
      } else {
        err = new CountLimitError();
      }
    }
    if (err) {
      next(err);
      return;
    }

    const urls = await Promise.all(req.files.map((f) => handleFile(f, req)));
    res.send({
      data: urls,
    });
  });
};

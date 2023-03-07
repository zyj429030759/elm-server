const uploadConfig = require("./config");
const { ExtError, SizeLimitError } = require("./errorType");

module.exports = async (req, res, next) => {
  let { ext, avatar } = req.body;
  ext = ext.toLowerCase();
  // 验证类型
  if (!uploadConfig.exts.includes(ext)) {
    next(new ExtError());
  }
  const { Base64 } = require("js-base64");
  const arr = Base64.toUint8Array(avatar);
  // 验证大小
  if (arr.length > uploadConfig.sizeLimit) {
    next(new SizeLimitError());
  }
  // 保存文件
  const { generateFilename, generateUrl } = require("./utils");
  const filename = `${generateFilename()}${ext}`;
  const fs = require("fs");
  const path = require("path");
  await fs.promises.writeFile(
    path.resolve(__dirname, "../public/upload", filename),
    arr
  );
  res.send({
    data: generateUrl(req, filename),
  });
};

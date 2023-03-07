const uploadConfig = require("./config");
const multer = require("multer");
const upload = multer({
  dest: uploadConfig.uploadPath,
  limits: {
    fileSize: uploadConfig.sizeLimit,
  },
  fileFilter(req, file, cb) {
    const path = require("path");
    const ext = path.extname(file.originalname);
    if (uploadConfig.exts.includes(ext)) {
      cb(null, true);
    } else {
      const { ExtError } = require("./errorTypes");
      cb(new ExtError());
    }
  },
});

const handleFile = async (file, req) => {
  const { suffix, generateUrl } = require("./utils");
  const filename = suffix(file.originalname, file.filename);
  const fs = require("fs");
  await fs.promises.rename(file.path, `${file.destination}/${filename}`);
  const url = generateUrl(req, filename);
  return url;
};

module.exports = (req, res, next) => {
  upload.array("photos", uploadConfig.countLimit)(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      const { SizeLimitError, CountLimitError } = require("./errorTypes");
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

const uploadConfig = require("./config");
const multer = require("multer");

const upload = multer({
  dest: uploadConfig.uploadPath,
  limits: {
    fieldSize: uploadConfig.sizeLimit,
  },
  fileFilter(req, file, cb) {
    const path = require("path");
    const ext = path.extname(file.originalname);
    if (uploadConfig.exts.includes(ext)) {
      cb(null, true);
    } else {
      const { ExtError } = require("./errorType");
      cb(new ExtError());
    }
  },
});

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
    const { suffix, generateUrl } = require("./utils");
    const file = req.file;
    const filename = suffix(file.originalname, file.filename);
    const fs = require("fs");
    await fs.promises.rename(file.path, `${file.destination}/${filename}`);
    const url = generateUrl(req, filename);
    res.send({
      data: url,
    });
  });
};

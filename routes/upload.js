const express = require("express");
const router = express.Router();

router.post("/single", require("../upload/single"));

router.post("/base64", require("../upload/base64"));

router.post("/binary", require("../upload/binary"));

router.post("/multi", require("../upload/multi"));

module.exports = router;

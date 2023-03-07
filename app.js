var createError = require("http-errors");
var express = require("express");
var path = require("path");
// var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var uploadRouter = require("./routes/upload");

var app = express();

// 设置模版引擎
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// 日志格式为dev模式
app.use(logger("dev"));
// 解析application/json格式的请求体
app.use(express.json());
// 解析application/x-www-form-urlencoder格式的请求体
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// 设置静态文件夹为public
app.use("/public", express.static(path.join(__dirname, "public")));

// 设置路由
app.use("/", indexRouter);
app.use("/upload", uploadRouter);

// 全局错误中间件无法捕获404页面，需要单独处理
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log(2222, createError(404));
  next(createError(404));
});

// 全局错误中间件
app.use(function (err, req, res, next) {
  console.log(1111, err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

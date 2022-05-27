var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var monitorRouter = require("./routes/monitor");
var upDataRouter = require("./routes/upData");
var userRouter = require("./routes/user");
var userInfo = require("./business/userInfo");
var ScheduleTask = require("./business/scheduleTask");

var util = require("./utils/util");
var setting = require("./setting.json");
var mongoose = require("mongoose");
var fs = require("fs");

// 判断是否是docker部署方式
var isDocker = process.env.name === "web-monitoring/backend_server_docker";
console.log(process.env.name, "process.env.name");
mongoose
  .connect(
    `mongodb://${
      isDocker ? setting.mongoDB.dockerAddress : setting.mongoDB.address
    }/monitor`,
    {
      socketTimeoutMS: 0,
      keepAlive: true,
      useNewUrlParser: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
    }
  )
  .then(() => {
    //默认系统管理员
    userInfo.createAdmin("work@tangyunxiao.com");
  });

//开启任务
if (setting.nodemailer.enable) {
  ScheduleTask.startTask();
}

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//日志
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(logger("short", { stream: accessLogStream }));
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//cors
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  if (req.method == "OPTIONS") res.sendStatus(200);
  /*让options请求快速返回*/ else next();
});

app.use("/", express.static("../web/dist"));
app.use("/Monitor/", util.resolveToken, monitorRouter);
app.use("/Up", upDataRouter);
app.use("/User", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
  // res.render('error');
});

module.exports = app;

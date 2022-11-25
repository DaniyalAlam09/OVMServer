var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// Routes import
var indexRouter = require("./routes/index");
var userRouter = require("./routes/api/users");
var shopOwnerRouter = require("./routes/api/shopOwners");
var adminRouter = require("./routes/api/admins");
var prooductRouter = require("./routes/api/products");
var OrderRouter = require("./routes/api/Order");
var cartRouter = require("./routes/api/cart");

var app = express();
app.use(cookieParser());
const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// const forgetPassword = require("./views/index");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// path
app.use("/", indexRouter);
app.use("/users/", userRouter);
app.use("/shopowners", shopOwnerRouter);
app.use("/admins", adminRouter);
app.use("/shops", prooductRouter);
app.use("/product", cartRouter);
app.use("/order", OrderRouter);

// catch 404 and forwa rd to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

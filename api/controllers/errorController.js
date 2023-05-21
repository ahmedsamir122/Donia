const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const key = Object.keys(err.keyValue)[0];
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate ${key} value: ${value}. Please use another value  `;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  console.log("valid");
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please login again", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please login again", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorPro = (err, res) => {
  if (err.isOpertional) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.errMes,
    });
    console.log(err.message);
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    console.log("errordev", err);

    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    console.log("errorprod", error);

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error._message?.split(" ")[1] === "validation") {
      error = handleValidationErrorDB(error);
    }
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorPro(error, res);
  }
};

const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const contractRouter = require("./routes/contractRoutes");
const reviewCRouter = require("./routes/reviewCRoutes");
const reviewFRouter = require("./routes/reviewFRoutes");
const userRouter = require("./routes/userRoutes");
const wishListRouter = require("./routes/wishListRoutes");
const blockRouter = require("./routes/blockRoutes");

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 600,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cors({ credentials: true, origin: "https://donia-v1dk.vercel.app" }));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(express.json({ limit: "3mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "3mb" }));

app.use(mongoSanitize());

app.use(xss());

app.use("/api/v1/contracts", contractRouter);
app.use("/api/v1/reviewCs", reviewCRouter);
app.use("/api/v1/reviewFs", reviewFRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/wishList", wishListRouter);
app.use("/api/v1/block", blockRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;

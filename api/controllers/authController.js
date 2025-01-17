const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const { findOne } = require("../models/userModel");
const admin = require("../firebase");

const generateCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // domain: ".vercel.app",
    // sameSite: "None",
    // secure: process.env.NODE_ENV === "production",
    // domain: "localhost",
  };
  res.cookie("refresh", token, cookieOptions);
};

exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.username.includes(" ")) {
    return next(new AppError("username should not contain spaces.", 401));
  }

  let user = await User.findOne({ phone: req.body.phone });

  if (!req.body.category || req.body.category.length === 0) {
    return next(new AppError("Please select at least one category", 401));
  }
  if (user && user.status === "active") {
    // Create a new user if they don’t already exist
    return next(new AppError("this phone number already exists.", 401));
  }
  if (user && user.status === "pending") {
    // Create a new user if they don’t already exist
    return res.status(201).json({
      status: "success",
      // token: accessToken,
      data: {
        user,
      },
    });
  }

  const newUser = await User.create({
    username: req.body.username.trim(),
    // email: req.body?.email,
    city: req.body.city,
    country: req.body.country,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    phone: req.body.phone,
    perform: req.body.perform,
    category: req.body.category,
  });

  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_REFRESH, {
  //   expiresIn: process.env.JWT_EXPIRES_IN_REFRESH,
  // });

  // const accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });

  // newUser.password = undefined;

  // generateCookie(res, token);
  res.status(201).json({
    status: "success",
    // token: accessToken,
    data: {
      user: newUser,
    },
  });
});

exports.verifyPhone = catchAsync(async (req, res, next) => {
  const idToken = req.body.token;

  console.log(idToken);

  // Verify the token with Firebase Admin SDK
  const decodedToken = await admin.auth().verifyIdToken(idToken);

  const phoneNumber = decodedToken.phone_number;

  // Check if user already exists in the database
  let user = await User.findOne({ phone: phoneNumber });
  if (!user) {
    // Create a new user if they don’t already exist
    return next(new AppError("there no user with this phone number.", 404));
  }

  user.status = "active";
  const newUser = await user.save({ validateBeforeSave: false });

  const accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  generateCookie(res, accessToken);
  res.status(201).json({
    status: "success",
    token: accessToken,
    data: {
      user: newUser,
    },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const { phone, password } = await req.body;

  if (!phone || !password) {
    return next(new AppError("Please write phone and password", 400));
  }

  const user = await User.findOne({ phone: req.body.phone }).select(
    "+password"
  );

  if (user && user.status === "pending") {
    // Create a new user if they don’t already exist
    return res.status(201).json({
      status: "success",
      // token: accessToken,
      message: "you need to activate your account",
      data: {
        user,
      },
    });
  }
  if (user && user.status === "blocked") {
    // Create a new user if they don’t already exist
    return res.status(201).json({
      status: "success",
      // token: accessToken,
      message: "your account has been blocked",
      data: {
        user,
      },
    });
  }

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_REFRESH, {
    expiresIn: process.env.JWT_EXPIRES_IN_REFRESH,
  });
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  generateCookie(res, token);

  user.password = undefined;
  res.status(200).json({
    status: "success",
    token: accessToken,
    data: {
      user,
    },
  });
});
exports.getAccessToken = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies.refresh) {
    token = req.cookies.refresh;
  }

  if (!token) {
    return next(
      new AppError("You aren't logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_REFRESH
  );

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belongs to this token does no longer exists .",
        401
      )
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! please log in again.", 401)
    );
  }

  const accessToken = jwt.sign(
    { id: currentUser._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  res.status(200).json({
    status: "success",
    token: accessToken,
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  // const expirationTime = new Date();
  // expirationTime.setSeconds(expirationTime.getSeconds() + 2);

  // res.cookie("refresh", "loggedout", {
  //   expires: expirationTime,
  //   // domain: "localhost",
  //   httpOnly: true,
  // });

  const cookieOptions = {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
    // domain: ".vercel.app",
    // sameSite: "None",
    // secure: process.env.NODE_ENV === "production",
    // domain: "localhost",
  };
  res.cookie("refresh", "loggedout", cookieOptions);
  res.status(200).json({ status: "success" });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }

  if (!token) {
    return next(
      new AppError("You aren't logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belongs to this token does no longer exists .",
        401
      )
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! please log in again.", 401)
    );
  }

  if (
    (currentUser.status === "3d" ||
      currentUser.status === "1w" ||
      currentUser.status === "2w" ||
      currentUser.status === "1m") &&
    currentUser.blockUntill > Date.now()
  ) {
    return next(
      new AppError(
        `your account is blocked untill ${currentUser.blockUntill}.`,
        401
      )
    );
  }
  if (currentUser.status === "blocked") {
    return next(new AppError(`your account is blocked .`, 401));
  }
  if (
    (currentUser.status === "3d" ||
      currentUser.status === "1w" ||
      currentUser.status === "2w" ||
      currentUser.status === "1m") &&
    currentUser.blockUntill < Date.now()
  ) {
    currentUser.status = "active";
    currentUser.blockUntill = undefined;
    currentUser.save({ validateBeforeSave: false });
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action.", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with this email.", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to: ${resetURL}. \nIf you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

exports.resetPasswordByPhone = catchAsync(async (req, res, next) => {
  const idToken = req.body.token;

  console.log(idToken);

  // Verify the token with Firebase Admin SDK
  const decodedToken = await admin.auth().verifyIdToken(idToken);

  const phoneNumber = decodedToken.phone_number;

  if (phoneNumber !== req.body.phone) {
    return next(new AppError("This phone number doesn't belong to you.", 400));
  }

  // Check if user already exists in the database
  let user = await User.findOne({ phone: phoneNumber });
  if (!user) {
    // Create a new user if they don’t already exist
    return next(new AppError("there no user with this phone number.", 404));
  }
  if (user.status === "pending") {
    // Create a new user if they don’t already exist
    user.status = "active";
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  const newUser = await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  generateCookie(res, token);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired.", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  generateCookie(res, token);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const correct = await user.correctPassword(
    req.body.currentPassword,
    user.password
  );
  if (!correct) {
    return next(new AppError("please write the correct password.", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangeAt = Date.now();

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  generateCookie(res, token);

  res.status(200).json({
    status: "success",
    token,
  });
});

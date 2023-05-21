const APIFeatures = require("../utils/apiFeatures");
const Block = require("../models/blockModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getBlock = catchAsync(async (req, res, next) => {
  const allBlockUsers = await Block.find({ me: req.user.id }).populate({
    path: "other",
    select: "username photo",
  });

  res.status(200).json({
    status: "success",
    data: {
      allBlockUsers,
    },
  });
});

exports.createBlock = catchAsync(async (req, res, next) => {
  const otherId = await User.findOne({ username: req.params.other });
  if (!otherId) {
    return next(new AppError("this user doesn't exist", 404));
  }

  const theOther = await Block.findOne({ other: otherId._id, me: req.user.id });
  if (theOther) {
    return next(new AppError("this user is already the blockList ", 401));
  }

  const newWishList = await Block.create({
    me: req.user._id,
    other: otherId._id,
  });

  const allBlockUsers = await Block.find({ me: req.user.id }).populate({
    path: "other",
    select: "username photo",
  });

  res.status(200).json({
    status: "success",
    data: {
      allBlockUsers,
    },
  });
});

exports.deleteBlock = catchAsync(async (req, res, next) => {
  const other = await Block.findOneAndDelete({
    other: req.params.otherId,
    me: req.user.id,
  });
  if (!other) {
    return next(new AppError("this block doesn't exist", 404));
  }

  const allBlockUsers = await Block.find({ me: req.user.id }).populate({
    path: "other",
    select: "username photo",
  });

  res.status(200).json({
    status: "success",
    data: {
      allBlockUsers,
    },
  });
});

const APIFeatures = require("../utils/apiFeatures");
const WishList = require("../models/wishListModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getWishList = catchAsync(async (req, res, next) => {
  const allWishList = await WishList.find({ me: req.user.id }).populate({
    path: "other",
    select: "username photo",
  });

  res.status(200).json({
    status: "success",
    data: {
      allWishList,
    },
  });
});

exports.createWishList = catchAsync(async (req, res, next) => {
  const otherId = await User.findOne({ username: req.params.other });
  if (!otherId) {
    return next(new AppError("this user doesn't exist", 404));
  }

  const theOther = await WishList.findOne({
    other: otherId._id,
    me: req.user.id,
  });
  if (theOther) {
    return next(new AppError("this user is already the wishList ", 401));
  }

  const newWishList = await WishList.create({
    me: req.user._id,
    other: otherId._id,
  });

  const allWishList = await WishList.find({ me: req.user.id }).populate({
    path: "other",
    select: "username photo",
  });

  res.status(200).json({
    status: "success",
    data: {
      allWishList,
    },
  });
});

exports.deleteWishList = catchAsync(async (req, res, next) => {
  const other = await WishList.findOneAndDelete({
    other: req.params.otherId,
    me: req.user.id,
  });

  if (!other) {
    return next(new AppError("this wishList doesn't exist", 404));
  }
  const allWishList = await WishList.find({ me: req.user.id }).populate({
    path: "other",
    select: "username photo",
  });
  // console.log("tryyyy");

  res.status(200).json({
    status: "success",
    data: {
      allWishList,
    },
  });
});

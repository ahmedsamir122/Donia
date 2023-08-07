const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Contract = require("../models/contractModel");
const Notification = require("../models/notificationModel");

exports.getNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ to: req.user._id });
  const unseenNotifications = await Notification.find({
    to: req.user._id,
    isSeen: false,
  });

  res.status(200).json({
    status: "success",
    results: notifications.length,
    unseenResults: unseenNotifications.length,
    data: {
      notifications,
    },
  });
});
exports.seeNotifications = catchAsync(async (req, res, next) => {
  // const notifications = await Notification.find({
  //   to: req.user._id,
  //   isSeen: false,
  // });

  const updateQuery = {
    $set: { isSeen: true },
  };

  const newNotifications = await Notification.updateMany(
    {
      to: req.user._id,
      isSeen: false,
    },
    updateQuery,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    results: newNotifications.length,
    data: {
      newNotifications,
    },
  });
});

exports.deleteOneNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: {
      message: "The notification has been deleted successfully",
    },
  });
});

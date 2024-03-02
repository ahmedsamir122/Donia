const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Contract = require("../models/contractModel");
const Notification = require("../models/notificationModel");

exports.getNotifications = catchAsync(async (req, res, next) => {
  // const notifications = await Notification.find({ to: req.user._id }).sort({
  //   createdAt: -1,
  // });

  const features = new APIFeatures(
    Notification.find({ to: req.user._id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const notifications = await features.query;

  const unseenNotifications = await Notification.find({
    to: req.user._id,
    isSeen: false,
  });

  const count = await Notification.countDocuments({ to: req.user._id });

  res.status(200).json({
    status: "success",
    totalResults: count,
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

const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Contract = require("../models/contractModel");
const Report = require("../models/reportModel");
const User = require("../models/userModel");

exports.getReports = catchAsync(async (req, res, next) => {
  console.log(typeof req.user._id, req.user._id);

  const reports = await Report.find({ admin: req.user.id }).populate({
    path: "complainer",
    select: "username",
  });

  res.status(200).json({
    status: "success",
    reports: reports.length,
    data: {
      reports,
    },
  });
});
exports.createReport = catchAsync(async (req, res, next) => {
  const admins = ["64679eb603239724cc8773ce", "645db313dca0904d905b61fe"];
  const report = await Report.find().sort({ createdAt: -1 }).limit(1);

  const index = admins.findIndex((adminId) => report[0].admin.equals(adminId));
  console.log(index, report);
  if (index < 0 || index === admins.length - 1) {
    req.body.admin = admins[0];
  }

  if (index >= 0 && index < admins.length - 1) {
    req.body.admin = admins[index + 1];
  }

  const newReport = await Report.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      newReport,
    },
  });
});
exports.updateReport = catchAsync(async (req, res, next) => {
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

exports.getOneReport = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id).populate({
    path: "complainer",
    select: "username",
  });

  if (!report) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      report,
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

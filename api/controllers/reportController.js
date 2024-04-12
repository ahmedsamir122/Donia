const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Contract = require("../models/contractModel");
const Report = require("../models/reportModel");
const User = require("../models/userModel");
const filterObj = require("../utils/filterObj");
const createReport = require("../utils/createReport");

exports.getReports = catchAsync(async (req, res, next) => {
  // const reports = await Report.find({ admin: req.user.id }).populate({
  //   path: "complainer",
  //   select: "username",
  // });

  const features = new APIFeatures(
    Report.find({ admin: req.user.id }).populate({
      path: "complainer",
      select: "username",
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reports = await features.query;
  const count = await Report.countDocuments({
    admin: req.user.id,
    status: "active",
  });
  const totalCount = await Report.countDocuments({
    admin: req.user.id,
  });

  res.status(200).json({
    status: "success",
    activeReports: count,
    totalReports: totalCount,
    data: {
      reports,
    },
  });
});
exports.getReportsOneUser = catchAsync(async (req, res, next) => {
  // const reports = await Report.find({ admin: req.user.id }).populate({
  //   path: "complainer",
  //   select: "username",
  // });
  const user = await User.findOne({ username: req.params.username });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const features = new APIFeatures(
    Report.find({ complainer: user.id }).populate({
      path: "complainer",
      select: "username",
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reports = await features.query;

  const totalCount = await Report.countDocuments({
    complainer: user.id,
  });

  res.status(200).json({
    status: "success",
    totalReports: totalCount,
    data: {
      reports,
    },
  });
});
exports.createReport = catchAsync(async (req, res, next) => {
  const newReport = await createReport(req.body);

  res.status(200).json({
    status: "success",
    data: {
      newReport,
    },
  });
});
exports.updateReport = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, "status", "descriptionِAdmin");

  const newReport = await Report.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      newReport,
    },
  });
});

exports.getOneReport = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id)
    .populate({
      path: "complainer",
      select: "username",
    })
    .populate({
      path: "notes",
      populate: {
        path: "writer",
        select: "username", // Select only the 'username' field
      },
      select: "description createdAt",
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
exports.getAdminStats = catchAsync(async (req, res, next) => {
  const stats = await Report.aggregate([
    {
      $group: {
        _id: "$admin",
        totalReports: { $sum: 1 },
        activeReports: {
          $sum: {
            $cond: [{ $eq: ["$status", "active"] }, 1, 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: "users", // Assuming your User collection is named "users"
        localField: "_id",
        foreignField: "_id",
        as: "adminDetails",
      },
    },
    {
      $project: {
        _id: 1,
        totalReports: 1,
        progressReports: 1,
        activeReports: 1,
        admin: { $arrayElemAt: ["$adminDetails.username", 0] },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
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

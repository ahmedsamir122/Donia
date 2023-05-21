const APIFeatures = require("../utils/apiFeatures");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { findById } = require("../models/userModel");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const hasDuplicateValues = require("../utils/hasDuplicateValues");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Donia",
  },
});

const multerFilter = (req, file, cb) => {
  console.log("test");
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! please upload only images.", 400), false);
  }
};
const limits = {
  fileSize: 2000000,
};

const upload = multer({ storage: storage, fileFilter: multerFilter, limits });

exports.uploadUserPhoto = upload.single("photo");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  //excute the query
  //   const features = new APIFeatures(Contract.find(), req.query)
  //     .filter()
  //     .sort()
  //     .limitFields()
  //     .paginate();
  //   const contracts = await features.query;

  //send the response
  const users = await User.find();

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});
exports.getAllTalents = catchAsync(async (req, res, next) => {
  //   excute the query
  const features = new APIFeatures(User.find({ perform: "talent" }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "this is the user route",
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("This route is not for the password updates.", 400)
    );
  }

  if (req.body.filterValues) {
    const filters = [
      "filterLocation",
      "filterMinimumAverageRate",
      "filterMinimumReviews",
      "filterMinimumBudget",
    ];

    const filtersKeys = req.body.filterValues.map((el) => Object.keys(el)[0]);

    if (!filtersKeys.every((val) => filters.includes(val))) {
      return next(new AppError("This filter is not allowed.", 400));
    }

    if (hasDuplicateValues(filtersKeys)) {
      return next(new AppError("The filter can't have duplicate values.", 400));
    }
  }
  const filteredBody = filterObj(
    req.body,
    "username",
    "email",
    "country",
    "city",
    "phone",
    "filterValues",
    "links",
    "wishList",
    "block",
    "perform"
  );
  if (req.file) filteredBody.photo = req.file.path;
  console.log("file", req.file);
  console.log("photo", req.photo);
  console.log("req", req.body);
  const newUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const correct = await user.correctPassword(
    req.body.currentPassword,
    user.password
  );

  console.log("delete");
  if (!correct) {
    return next(new AppError("The password is not correct.", 400));
  }
  await User.deleteOne({ email: req.user.email });

  res.status(204).json({
    status: "success",
    data: {
      message: "The has been deleted successfully",
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "this is the user route",
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "this is the user route",
    },
  });
});

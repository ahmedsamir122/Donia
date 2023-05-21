const APIFeatures = require("../utils/apiFeatures");
const ReviewF = require("../models/reviewFModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllReviewFs = catchAsync(async (req, res, next) => {
  //excute the query
  const features = new APIFeatures(ReviewF.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reviewFs = await features.query;

  //send the response
  res.status(200).json({
    status: "success",
    results: reviewFs.length,
    data: {
      reviewFs,
    },
  });
});

exports.createReviewF = catchAsync(async (req, res, next) => {
  const review = await ReviewF.findOne({
    freelancer: req.user.id,
    contract: req.body.contract,
  });
  if (review) {
    return next(new AppError("You can only write one review", 403));
  }
  const newReviewF = await ReviewF.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      reviewF: newReviewF,
    },
  });
});

exports.getReviewF = catchAsync(async (req, res, next) => {
  const reviewF = await ReviewF.findById(req.params.idReviewF);

  if (!reviewF) {
    console.log(reviewF);
    return next(new AppError("No contract found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      reviewF,
    },
  });
});

exports.updateReviewF = catchAsync(async (req, res, next) => {
  const reviewF = await ReviewF.findByIdAndUpdate(
    req.params.idReviewF,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!reviewF) {
    return next(new AppError("No contract found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      reviewF,
    },
  });
});

exports.deleteReviewF = catchAsync(async (req, res, next) => {
  const reviewF = await ReviewF.findByIdAndDelete(req.params.idReviewF);

  if (!reviewF) {
    return next(new AppError("No contract found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});

const APIFeatures = require("../utils/apiFeatures");
const ReviewC = require("../models/reviewCModel");
const ReviewF = require("../models/reviewFModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Contract = require("../models/contractModel");

exports.getAllReviewCs = catchAsync(async (req, res, next) => {
  //excute the query
  const features = new APIFeatures(ReviewC.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reviewCs = await features.query;

  //send the response
  res.status(200).json({
    status: "success",
    results: reviewCs.length,
    data: {
      reviewCs,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const contract = await Contract.findById(req.params.contractId);

  if (contract.activity !== "submit") {
    return next(
      new AppError("You can only write a review after submit the task", 403)
    );
  }
  let newReview;
  if (req.user._id.equals(contract.client)) {
    console.log("client");
    const review = await ReviewC.findOne({
      client: req.user.id,
      contract: req.params.contractId,
    });

    console.log(review);

    if (review) {
      return next(new AppError("You can only write one review", 403));
    }

    newReview = await ReviewC.create({
      ...req.body,
      client: req.user.id,
      contract: req.params.contractId,
      freelancer: contract.freelancer,
    });
  }

  if (req.user._id.equals(contract.freelancer)) {
    console.log("freelancer");

    const review = await ReviewF.findOne({
      freelancer: req.user.id,
      contract: req.params.contractId,
    });

    console.log(review);

    if (review) {
      return next(new AppError("You can only write one review", 403));
    }

    newReview = await ReviewF.create({
      ...req.body,
      freelancer: req.user.id,
      contract: req.params.contractId,
      client: contract.client,
    });
  }

  res.status(201).json({
    status: "success",
    data: {
      newReview,
    },
  });
});

exports.createReviewC = catchAsync(async (req, res, next) => {
  const review = await ReviewC.findOne({
    client: req.user.id,
    contract: req.body.contract,
  });
  if (review) {
    return next(new AppError("You can only write one review", 403));
  }
  const newReviewC = await ReviewC.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      reviewC: newReviewC,
    },
  });
});

exports.getReviewC = catchAsync(async (req, res, next) => {
  const reviewC = await ReviewC.findById(req.params.idReviewC);

  if (!reviewC) {
    console.log(reviewC);
    return next(new AppError("No contract found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      reviewC,
    },
  });
});

exports.updateReviewC = catchAsync(async (req, res, next) => {
  const reviewC = await ReviewC.findByIdAndUpdate(
    req.params.idReviewC,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!reviewC) {
    return next(new AppError("No contract found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      reviewC,
    },
  });
});

exports.deleteReviewC = catchAsync(async (req, res, next) => {
  const reviewC = await ReviewC.findByIdAndDelete(req.params.idReviewC);

  if (!reviewC) {
    return next(new AppError("No contract found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});

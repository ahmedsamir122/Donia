const APIFeatures = require("../utils/apiFeatures");
const Contract = require("../models/contractModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllContracts = catchAsync(async (req, res, next) => {
  //excute the query
  const features = new APIFeatures(
    Contract.find()
      .populate({
        path: "reviewFs",
        select: "review rating",
      })
      .populate({
        path: "reviewCs",
        select: "review rating",
      }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const contracts = await features.query;

  //send the response
  res.status(200).json({
    status: "success",
    results: contracts.length,
    data: {
      contracts,
    },
  });
});

exports.createContract = catchAsync(async (req, res, next) => {
  const newContract = await Contract.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      contract: newContract,
    },
  });
});

exports.getContract = catchAsync(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id)
    .populate({
      path: "reviewFs",
      select: "review rating",
    })
    .populate({
      path: "reviewCs",
      select: "review rating",
    });

  if (!contract) {
    console.log(contract);
    return next(new AppError("No contract found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      contract,
    },
  });
});

exports.updateContract = catchAsync(async (req, res, next) => {
  const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!contract) {
    return next(new AppError("No contract found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      contract,
    },
  });
});

exports.deleteContract = catchAsync(async (req, res, next) => {
  const contract = await Contract.findByIdAndDelete(req.params.id);

  if (!contract) {
    return next(new AppError("No contract found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.acceptContract = catchAsync(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id);

  if (!contract.freelancer.equals(req.user.id)) {
    return next(new AppError("You can not accept this contract!", 403));
  }

  if (contract.activity !== "offer") {
    return next(new AppError("You can not accept this contract anymore!", 403));
  }

  const newContract = await Contract.findByIdAndUpdate(
    req.params.id,
    { activity: "progress" },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      contract: newContract,
    },
  });
});

exports.submitContract = catchAsync(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id);

  if (!contract.freelancer.equals(req.user.id)) {
    return next(new AppError("You can not accept this contract!", 403));
  }

  if (contract.activity !== "progress") {
    return next(new AppError("You can not accept this contract anymore!", 403));
  }

  const newContract = await Contract.findByIdAndUpdate(
    req.params.id,
    { activity: "submit" },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      contract: newContract,
    },
  });
});
exports.approveContract = catchAsync(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id);
});

exports.cancelContract = catchAsync(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id);

  if (
    !contract.freelancer.equals(req.user.id) &&
    !contract.client.equals(req.user.id)
  ) {
    return next(
      new AppError("You are not authorized to cancel this contract!", 403)
    );
  }

  if (contract.freelancer.equals(req.user.id)) {
    if (contract.activity !== "offer" && contract.activity !== "progress") {
      return next(new AppError("You can not cancel this contract!", 403));
    }
  }

  if (contract.client.equals(req.user.id)) {
    if (contract.activity !== "offer" && contract.activity !== "progress") {
      return next(new AppError("You can not cancel this contract!", 403));
    }
  }

  const newContract = await Contract.findByIdAndUpdate(
    req.params.id,
    { activity: "cancel" },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      contract: newContract,
    },
  });
});

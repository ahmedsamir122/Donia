const APIFeatures = require("../utils/apiFeatures");
const Contract = require("../models/contractModel");
const Conversation = require("../models/conversation");
const Notification = require("../models/notificationModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Block = require("../models/blockModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY_MY);

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
      })
      .populate({
        path: "freelancer",
        select: "username",
      })
      .populate({
        path: "client",
        select: "username",
      }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const contracts = await features.query;

  const count = await Contract.countDocuments();

  //send the response
  res.status(200).json({
    status: "success",
    results: contracts.length,
    totalNum: count,
    data: {
      contracts,
    },
  });
});

exports.getPublicContractsF = catchAsync(async (req, res, next) => {
  const talent = await User.findOne({ username: req.params.username });
  const contracts = await Contract.find({ freelancer: talent._id })
    .select("-name -budget -deadline -activity -task")
    .populate({
      path: "client",
      select: "username photo",
    })
    .populate("reviewCs")
    .populate("reviewFs");

  res.status(200).json({
    status: "success",
    results: contracts.length,
    data: {
      contracts,
    },
  });
});

exports.getPublicContractsC = catchAsync(async (req, res, next) => {
  const talent = await User.findOne({ username: req.params.username });
  const contracts = await Contract.find({ client: talent._id })
    .select("-name -budget -deadline -activity -task")
    .populate({
      path: "client",
      select: "username photo",
    })
    .populate({
      path: "freelancer",
      select: "username photo ",
    })
    .populate("reviewCs")
    .populate("reviewFs");

  res.status(200).json({
    status: "success",
    results: contracts.length,
    data: {
      contracts,
    },
  });
});

exports.getMyContractsF = catchAsync(async (req, res, next) => {
  const contracts = await Contract.find({ freelancer: req.user._id })
    .populate({
      path: "client",
      select: "username",
    })
    .populate("reviewCs")
    .populate("reviewFs");

  res.status(200).json({
    status: "success",
    results: contracts.length,
    data: {
      contracts,
    },
  });
});

exports.getMyContractsC = catchAsync(async (req, res, next) => {
  const contracts = await Contract.find({ client: req.user._id })
    .populate({
      path: "freelancer",
      select: "username",
    })
    .populate("reviewCs")
    .populate("reviewFs");

  res.status(200).json({
    status: "success",
    results: contracts.length,
    data: {
      contracts,
    },
  });
});

exports.getPublicContractsFAdmin = catchAsync(async (req, res, next) => {
  const talent = await User.findOne({ username: req.params.username });
  const contracts = await Contract.find({ freelancer: talent._id })
    .populate({
      path: "client",
      select: "username photo",
    })
    .populate({
      path: "freelancer",
      select: "username photo",
    })
    .populate("reviewCs")
    .populate("reviewFs");

  res.status(200).json({
    status: "success",
    results: contracts.length,
    data: {
      contracts,
    },
  });
});
exports.getPublicContractsCAdmin = catchAsync(async (req, res, next) => {
  const talent = await User.findOne({ username: req.params.username });
  const contracts = await Contract.find({ client: talent._id })
    .populate({
      path: "client",
      select: "username photo",
    })
    .populate({
      path: "freelancer",
      select: "username photo",
    })
    .populate("reviewCs")
    .populate("reviewFs");

  res.status(200).json({
    status: "success",
    results: contracts.length,
    data: {
      contracts,
    },
  });
});

exports.filterContract = catchAsync(async (req, res, next) => {
  const talent = await User.findOne({ username: req.params.username });

  if (talent.perform === "client") {
    return next(new AppError("this user isn't a talent", 400));
  }

  const talentBlocks = await Block.find({ me: talent._id });

  if (talentBlocks.some((el) => el.other._id.equals(req.user.id))) {
    return next(
      new AppError("the talent doesn't accept any offer from you anymore", 400)
    );
  }

  if (talent.filterValues.length > 0) {
    const filterNames = talent.filterValues.map((el) => Object.keys(el)[0]);

    let errorArray = [];

    filterNames.forEach((el) => {
      const oneObject = talent.filterValues.find(
        (obj) => Object.keys(obj)[0] === el
      );

      if (el === "filterLocation" && oneObject[el] !== req.user.city) {
        errorArray.push("filterLocation");
      }
      if (
        el === "filterMinimumAverageRate" &&
        oneObject[el] > req.user.ratingsAverageC
      ) {
        errorArray.push("MinimumAverageRate");
      }
      if (
        el === "filterMinimumReviews" &&
        oneObject[el] !== req.user.ratingsQuantityC
      ) {
        errorArray.push("MinimumReviews");
      }
    });
    if (errorArray.length > 0) {
      return next(new AppError(errorArray.join("-"), 400));
    }
  }

  next();
});

exports.openContract = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      messgae: "success",
    },
  });
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const talent = await User.findOne({ username: req.params.username });
  const filterNames = talent.filterValues?.map((el) => Object.keys(el)[0]);

  filterNames.forEach((el) => {
    const oneObject = talent.filterValues.find(
      (obj) => Object.keys(obj)[0] === el
    );

    if (el === "filterMinimumBudget" && oneObject[el] > req.body.budget) {
      return next(
        new AppError("your budget is lower than what this talent requests", 400)
      );
    }
  });

  if (
    new Date(req.body.deadline) < new Date(Date.now() + 24 * 60 * 60 * 1000)
  ) {
    return next(
      new AppError("the deadline has to be minimum after 24 hours", 400)
    );
  }
  console.log(new Date(req.body.deadline), Date.now());

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: req.body.name,
          },
          unit_amount: req.body.budget * 100 * 1.02,
        },
        quantity: 1,
      },
    ],
    payment_method_types: ["card"],

    mode: "payment",
    // success_url: `${req.protocol}://${req.get("host")}/success`,
    success_url: `http://localhost:3000/success?name=${req.body.name}&budget=${req.body.budget}&task=${req.body.task}&username=${req.params.username}&deadline=${req.body.deadline}`,
    // success_url: `https://donia-gamma.vercel.app/success?name=${req.body.name}&budget=${req.body.budget}&task=${req.body.task}&username=${req.params.username}&deadline=${req.body.deadline}`,
    // cancel_url: `${req.protocol}://${req.get("host")}/${req.params.username}`,
    cancel_url: `https://donia-v1dk-ahmedsamir122.vercel.app/${req.params.username}`,
    customer_email: req.user.email,
    client_reference_id: req.params.username,
  });

  res.status(200).json({
    status: "success",
    session,
  });
});

exports.webhookCheckout = catchAsync(async (req, res, next) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_SECRET_KEY
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
exports.createContract = catchAsync(async (req, res, next) => {
  const other = await User.findOne({ username: req.params.username });
  if (!other) {
    return next(new AppError("this user doesn't exist", 404));
  }

  const newContract = await Contract.create({
    ...req.body,
    freelancer: other._id,
    client: req.user._id,
  });

  await Notification.create({
    to: other.id,
    content: `${other.username} has requested to open a contract with you`,
  });

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
    })
    .populate({
      path: "client",
      select: "username photo",
    })
    .populate({
      path: "freelancer",
      select: "username photo",
    });

  if (!contract) {
    return next(new AppError("No contract found with that ID", 404));
  }

  const checkArray = [contract.client.id, contract.freelancer.id];

  if (!checkArray.some((el) => el === req.user.id)) {
    return next(new AppError("you can only get your contracts", 400));
  }

  const conversation = await Conversation.findOne({
    contract: req.params.id,
  });

  res.status(200).json({
    status: "success",
    conversation: conversation._id,
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
  const contract = await Contract.findById(req.params.id).populate({
    path: "freelancer",
    select: "username",
  });

  if (!contract.freelancer.equals(req.user.id)) {
    return next(new AppError("You can not accept this contract!", 403));
  }

  if (contract.activity !== "offer") {
    return next(new AppError("You can not accept this contract anymore!", 400));
  }

  if (
    new Date(contract.deadline) < new Date(Date.now()) ||
    new Date(contract.expiredAt) < new Date(Date.now())
  ) {
    return next(new AppError("this offer isn't valid anymore!", 400));
  }

  const newContract = await Contract.findByIdAndUpdate(
    req.params.id,
    { activity: "progress" },
    {
      new: true,
      runValidators: true,
    }
  );

  console.log("note", contract.freelancer);

  await Notification.create({
    to: contract.freelancer,
    content: `${contract.freelancer.username} has accepted your offer`,
  });

  res.status(200).json({
    status: "success",
    data: {
      contract: newContract,
    },
  });
});

exports.submitContract = catchAsync(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id).populate({
    path: "freelancer",
    select: "username",
  });

  if (!contract.freelancer.equals(req.user.id)) {
    return next(new AppError("You can not accept this contract!", 400));
  }

  if (contract.activity !== "progress") {
    return next(new AppError("You can not accept this contract anymore!", 400));
  }

  if (new Date(contract.deadline) < new Date(Date.now())) {
    return next(new AppError("you have exceeded the deadline!", 400));
  }

  const newContract = await Contract.findByIdAndUpdate(
    req.params.id,
    { activity: "submit", submitDate: Date.now() },
    {
      new: true,
      runValidators: true,
    }
  );

  await Notification.create({
    to: contract.freelancer,
    content: `${contract.freelancer.username} has submitted his task`,
  });

  res.status(200).json({
    status: "success",
    data: {
      contract: newContract,
    },
  });
});
// exports.approveContract = catchAsync(async (req, res, next) => {
//   const contract = await Contract.findById(req.params.id);

//   if (!contract.client.equals(req.user.id)) {
//     return next(new AppError("You can not approve this contract!", 400));
//   }

//   if (submitDate + 3 * 24 * 60 * 60 * 1000 < Date.now()) {
//     return next(new AppError("the contract has been already approved!", 400));
//   }

//   if (contract.activity !== "submit") {
//     return next(new AppError("You can not approve this contract!", 400));
//   }

//   const newContract = await Contract.findByIdAndUpdate(
//     req.params.id,
//     { activity: "approved" },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.status(200).json({
//     status: "success",
//     data: {
//       contract: newContract,
//     },
//   });
// });

exports.refuseContract = catchAsync(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id).populate({
    path: "freelancer",
    select: "username",
  });

  if (!contract.freelancer.equals(req.user.id)) {
    return next(new AppError("You can not refuse this contract!", 400));
  }

  if (contract.activity !== "offer") {
    return next(new AppError("You can not refuse this contract anymore!", 400));
  }

  const newContract = await Contract.findByIdAndUpdate(
    req.params.id,
    { activity: "refuse" },
    {
      new: true,
      runValidators: true,
    }
  );

  await Notification.create({
    to: contract.freelancer,
    content: `${contract.freelancer.username} has refused your offer`,
  });

  res.status(200).json({
    status: "success",
    data: {
      contract: newContract,
    },
  });
});

exports.expiredCheck = catchAsync(async (req, res, next) => {
  const contractsExpiredC = await Contract.find({
    client: req.user.id,
    activity: "offer",
    expiredAt: { $lt: Date.now() },
  });

  if (contractsExpiredC.length > 0) {
    for (const contract of contractsExpiredC) {
      contract.activity = "expired";
      await contract.save();
    }
  }

  const contractsExpiredDeadlineC = await Contract.find({
    client: req.user.id,
    activity: "progress",
    deadline: { $lt: Date.now() },
  });

  if (contractsExpiredDeadlineC.length > 0) {
    for (const contract of contractsExpiredDeadlineC) {
      contract.activity = "expired";
      await contract.save();
    }
  }
  const contractsExpiredF = await Contract.find({
    freelancer: req.user.id,
    activity: "offer",
    expiredAt: { $lt: Date.now() },
  });

  if (contractsExpiredF.length > 0) {
    for (const contract of contractsExpiredF) {
      contract.activity = "expired";
      await contract.save();
    }
  }

  const contractsExpiredDeadlineF = await Contract.find({
    freelancer: req.user.id,
    activity: "progress",
    deadline: { $lt: Date.now() },
  });

  if (contractsExpiredDeadlineF.length > 0) {
    for (const contract of contractsExpiredDeadlineF) {
      contract.activity = "expired";
      await contract.save();
    }
  }
  next();
});

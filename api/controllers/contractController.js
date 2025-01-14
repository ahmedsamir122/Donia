const APIFeatures = require("../utils/apiFeatures");
const Contract = require("../models/contractModel");
const Conversation = require("../models/conversation");
const Notification = require("../models/notificationModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Block = require("../models/blockModel");
const createReport = require("../utils/createReport");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY_MY);
const { pusher } = require("./messageController");
const Midtrans = require("midtrans-client");
const moment = require("moment");

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

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
  const contracts = await Contract.find({
    freelancer: talent._id,
    managerStatus: talent.perform === "manager",
  })
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
  const features = new APIFeatures(
    Contract.find({
      freelancer: req.user._id,
      managerStatus: req.user.perform === "manager",
    })
      .populate({
        path: "client",
        select: "username",
      })
      .populate({
        path: "talent",
        select: "username photo",
      })
      .populate("reviewCs")
      .populate("reviewFs"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const contracts = await features.query;

  const count = await Contract.countDocuments({ freelancer: req.user._id });

  res.status(200).json({
    status: "success",
    results: contracts.length,
    totalNum: count,
    data: {
      contracts,
    },
  });
});

exports.getMyContractsC = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Contract.find({ client: req.user._id })
      .populate({
        path: "freelancer",
        select: "username",
      })
      .populate("reviewCs")
      .populate("reviewFs"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const contracts = await features.query;

  const count = await Contract.countDocuments({ client: req.user._id });

  res.status(200).json({
    status: "success",
    results: contracts.length,
    totalNum: count,
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

  if (!talent) {
    return next(new AppError("this user doesn't exist", 404));
  }
  const filterNames = talent.filterValues?.map((el) => Object.keys(el)[0]);

  filterNames.forEach((el) => {
    const oneObject = talent.filterValues.find(
      (obj) => Object.keys(obj)[0] === el
    );

    console.log(el, oneObject[el], req.body.budget);
    if (
      el === "filterMinimumBudget" &&
      parseInt(oneObject[el]) > parseInt(req.body.budget)
    ) {
      return next(
        new AppError("your budget is lower than what this talent requests", 400)
      );
    }
  });

  if (
    new Date(req.body.deadline) < new Date(Date.now() + 48 * 60 * 60 * 1000)
  ) {
    return next(
      new AppError("the deadline has to be minimum after 48 hours", 400)
    );
  }
  console.log(new Date(req.body.deadline), Date.now());

  const newContract = await Contract.create({
    ...req.body,
    freelancer: talent._id,
    client: req.user._id,
  });

  let expiryStartTime = moment().format("YYYY-MM-DD HH:mm:ss Z");

  let parameter = {
    transaction_details: {
      order_id: newContract._id,
      gross_amount: newContract.budget,
    },
    customer_details: {
      email: req.user?.email,
      phone: req.user?.phone,
    },
    callbacks: {
      finish: `http://localhost:3000/success?contractId=${newContract._id}&status=success`,
      // finish: `https://donia-gamma.vercel.app/success?contractId=${newContract._id}&status=success`,

      // Redirect to pending status page if payment was not completed
      pending: `http://localhost:3000/contracts/${newContract._id}?status=pending`,
      // pending: `https://donia-gamma.vercel.app/contracts/${newContract._id}?status=pending`,

      // Redirect to error page if something goes wrong with the payment
      error: `http://localhost:3000/contracts/${newContract._id}?status=error`,
      // error: `https://donia-gamma.vercel.app/contracts/${newContract._id}?status=error`,
    },
    expiry: {
      start_time: expiryStartTime,
      unit: "hour",
      duration: 12, // Transaction expires after 24 hours
    },
  };

  const tokenMidtrans = await snap.createTransactionToken(parameter);
  newContract.tokenMidtrans = tokenMidtrans;
  await newContract.save();

  // const session = await stripe.checkout.sessions.create({
  //   line_items: [
  //     {
  //       price_data: {
  //         currency: "usd",
  //         product_data: {
  //           name: req.body.name,
  //         },
  //         unit_amount: req.body.budget * 100 * 1.02,
  //       },
  //       quantity: 1,
  //     },
  //   ],
  //   payment_method_types: ["card"],

  //   mode: "payment",
  //   // success_url: `${req.protocol}://${req.get("host")}/success`,
  //   success_url: `http://localhost:3000/success?name=${req.body.name}&budget=${req.body.budget}&task=${req.body.task}&username=${req.params.username}&deadline=${req.body.deadline}`,
  //   // success_url: `https://donia-gamma.vercel.app/success?name=${req.body.name}&budget=${req.body.budget}&task=${req.body.task}&username=${req.params.username}&deadline=${req.body.deadline}`,
  //   // cancel_url: `${req.protocol}://${req.get("host")}/${req.params.username}`,
  //   cancel_url: `https://donia-v1dk-ahmedsamir122.vercel.app/${req.params.username}`,
  //   customer_email: req.user.email,
  //   client_reference_id: req.params.username,
  // });

  res.status(200).json({
    status: "success",
    tokenMidtrans,
    contract: newContract,
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
  let newContract;
  if (req.body.talent) {
    newContract = await Contract.create({
      ...req.body,
      freelancer: other._id,
      client: req.user._id,
      talent: req.body.talent,
      managerStatus: true,
    });
    return next(new AppError("this user doesn't exist", 404));
  }
  if (!req.body.talent) {
    newContract = await Contract.create({
      ...req.body,
      freelancer: other._id,
      client: req.user._id,
    });
  }

  await Notification.create({
    to: other.id,
    content: `${req.user.username} has requested to open a contract with you`,
  });

  pusher.trigger(`channel-${other._id}`, `notifications-${other._id}`, {
    to: other._id,
    content: `${req.user.username} has requested to open a contract with you`,
  });

  // res.status(201).json({
  //   status: "success",
  //   data: {
  //     contract: newContract,
  //   },
  // });
  req.contract = newContract;
  next();
});

exports.getContract = catchAsync(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id)
    .populate({
      path: "reviewFs",
      select: "review rating createdAt",
    })
    .populate({
      path: "reviewCs",
      select: "review rating createdAt",
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

  if (req.user.role === "user") {
    if (!checkArray.some((el) => el === req.user.id)) {
      return next(new AppError("you can only get your contracts", 400));
    }
  }

  const conversation = await Conversation.findOne({
    contract: req.params.id,
  });

  res.status(200).json({
    status: "success",
    conversation: conversation?._id,
    data: {
      contract,
    },
  });
});
exports.updateContract = catchAsync(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id)
    .populate({
      path: "client",
      select: "username photo",
    })
    .populate({
      path: "freelancer",
      select: "username photo",
    });

  freelancer = contract.freelancer._id.equals(req.user.id);
  client = contract.client._id.equals(req.user.id);
  let check = false;
  switch (req.body.activity) {
    case "offer":
      if (freelancer && contract.activity === "pending") {
        check = true;
        contract.acceptDate = Date.now();
        await contract.save();
        // contract.tokenMidtrans = "used";
        await Notification.create({
          to: contract.client._id,
          content: `${contract.freelancer.username} has agreed to your offer`,
        });

        pusher.trigger(
          `channel-${contract.client._id}`,
          `notifications-${contract.client._id}`,
          {
            to: contract.client._id,
            content: `${contract.freelancer.username} has sent you an offer`,
          }
        );
      }
      break;
    case "cancel":
      if (freelancer && contract.activity === "pending") {
        check = true;
        await Notification.create({
          to: contract.client._id,
          content: `${contract.freelancer.username} has cancelled your offer`,
        });

        pusher.trigger(
          `channel-${contract.client._id}`,
          `notifications-${contract.client._id}`,
          {
            to: contract.client._id,
            content: `${contract.freelancer.username} has cancelled your offer`,
          }
        );
      }
      break;
    case "progress":
      if (client && contract.activity === "offer") {
        check = true;
        await Notification.create({
          to: contract.client._id,
          content: `${contract.client.username} has activated the contract`,
        });

        pusher.trigger(
          `channel-${contract.freelancer._id}`,
          `notifications-${contract.freelancer._id}`,
          {
            to: contract.freelancer._id,
            content: `${contract.client.username} has activated the contract`,
          }
        );
      }
      break;
    case "submit":
      if (freelancer && contract.activity === "progress") {
        check = true;
        contract.submitDate = Date.now();
        await contract.save();
        await Notification.create({
          to: contract.client._id,
          content: `${contract.freelancer.username} has submitted the work`,
        });

        pusher.trigger(
          `channel-${contract.client._id}`,
          `notifications-${contract.client._id}`,
          {
            to: contract.client._id,
            content: `${contract.freelancer.username} has submitted the work`,
          }
        );
      }
      break;
    case "approved":
      if (client && contract.activity === "submit") {
        check = true;
        await Notification.create({
          to: contract.freelancer._id,
          content: `${contract.client.username} has approved your work`,
        });

        pusher.trigger(
          `channel-${contract.freelancer._id}`,
          `notifications-${contract.freelancer._id}`,
          {
            to: contract.client._id,
            content: `${contract.client.username} has approved your offer`,
          }
        );
      }
      break;
    case "complain":
      if (freelancer && contract.activity === "refused") {
        check = true;
        await createReport({
          complainer: req.user._id,
          contract: req.params.id,
          type: "contract",
        });
        await Notification.create({
          to: contract.client._id,
          content: `${contract.freelancer.username} has complained on contract`,
        });

        pusher.trigger(
          `channel-${contract.client._id}`,
          `notifications-${contract.client._id}`,
          {
            to: contract.client._id,
            content: `${contract.freelancer.username} has complained on contract`,
          }
        );
      }
      break;
    case "refused":
      if (client && contract.activity === "submit") {
        check = true;
        contract.refusedDate = Date.now();
        await contract.save();
        await Notification.create({
          to: contract.freelancer._id,
          content: `${contract.client.username} has refused your work`,
        });

        pusher.trigger(
          `channel-${contract.freelancer._id}`,
          `notifications-${contract.freelancer._id}`,
          {
            to: contract.client._id,
            content: `${contract.client.username} has refused your work`,
          }
        );
      }
      break;
  }
  let newContract;
  if (check) {
    contract.activity = req.body.activity;
    await contract.save();
  } else {
    return next(
      new AppError("you can't update the status of this contract", 400)
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      contract: newContract,
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

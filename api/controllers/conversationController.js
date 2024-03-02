const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Contract = require("../models/contractModel");
const Conversation = require("../models/conversation");

// exports.createConversation = catchAsync(async (req, res, next) => {
//   const contract = await Contract.findById(req.params.contractId);

//   const other = contract.freelancer.equals(req.user._id)
//     ? contract.client
//     : contract.freelancer;
//   let conversation;
//   conversation = await Conversation.findOneAndUpdate(
//     { contract: req.params.contractId },
//     {
//       $setOnInsert: {
//         users: [req.user._id, other],
//         contract: req.params.contractId,
//         closed: false,
//       },
//     },
//     { upsert: true, new: true }
//   ).populate({
//     path: "users",
//     select: "username photo",
//   });

//   if (conversation.closed) {
//     conversation.closed = false;
//     await conversation.save();
//   }

//   res.status(201).json({
//     status: "success",
//     data: {
//       conversation,
//     },
//   });
// });
exports.createConversation = catchAsync(async (req, res, next) => {
  const contract = await Contract.findById(req.contract._id);
  const other = contract.freelancer.equals(req.user._id)
    ? contract.client
    : contract.freelancer;

  const users = [req.user.id, other];

  const conversation = await Conversation.findOne({
    users: {
      $all: users,
    },
  }).exec();

  if (!conversation) {
    conversation = await Conversation.create({ users });
  }
  contract.conversation = conversation._id;
  await contract.save();

  if (conversation.closed) {
    conversation.closed = false;
    await conversation.save();
  }
  res.status(201).json({
    status: "success",
    data: {
      conversation,
      contract,
    },
  });
});

exports.getCurrentConversation = catchAsync(async (req, res, next) => {
  const currentConversation = await Conversation.findById(
    req.params.conversationId
  ).populate({
    path: "users",
    select: "username photo",
  });

  const isUserInConversation = currentConversation.users.some(
    (user) => user.id === req.user.id
  );

  if (!isUserInConversation) {
    return next(new AppError("You cannot get this conversation data", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      conversation: currentConversation,
    },
  });
});
exports.getOneConversationAdmin = catchAsync(async (req, res, next) => {
  const currentConversation = await Conversation.findById(
    req.params.conversationId
  ).populate({
    path: "users",
    select: "username photo",
  });

  res.status(200).json({
    status: "success",
    data: {
      conversation: currentConversation,
    },
  });
});
exports.getMyConversations = catchAsync(async (req, res, next) => {
  const usernameQuery = req.query.username;
  const baseQuery = {
    users: { $elemMatch: { $eq: req.user._id } },
    latestMessage: { $exists: true },
  };

  // Conditionally include the 'users' filter if the 'username' query parameter is present

  let conversations = await Conversation.find(baseQuery)
    .populate({
      path: "users",
      select: "username photo",
    })
    .populate({
      path: "latestMessage",
      select: "sender createdAt content",
    });

  if (usernameQuery) {
    conversations = conversations.filter((conv) =>
      conv.users.some(
        (user) =>
          user.username.match(new RegExp(usernameQuery, "gi")) &&
          user._id.toString() !== req.user._id.toString()
      )
    );
  }

  res.status(200).json({
    status: "success",
    results: conversations.length,
    data: {
      conversations,
    },
  });
});

exports.closeConversation = catchAsync(async (req, res, next) => {
  await Conversation.findByIdAndUpdate(
    req.params.conversationId,
    { closed: true },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    // data: {
    //   conversation,
    // },
  });
});

exports.checkOneOfUsers = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.conversationId);

  const isUserInConversation = conversation.users.some((user) =>
    user.equals(req.user.id)
  );
  if (!isUserInConversation) {
    return next(new AppError("You arenot one of this conversation", 400));
  }
  next();
});

exports.deleteConversation = catchAsync(async (req, res, next) => {
  await Message.deleteMany({ conversation: req.params.conversationId }).exec();
  const conversation = await Conversation.findByIdAndDelete(
    req.params.conversationId
  );
  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.updateConversation = catchAsync(async (req, res, next) => {
  await Message.deleteMany({ conversation: req.params.conversationId }).exec();
  const conversation = await Conversation.findByIdAndDelete(
    req.params.conversationId
  );
  res.status(200).json({
    status: "success",
    data: null,
  });
});

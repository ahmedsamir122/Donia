const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Contract = require("../models/contractModel");
const Conversation = require("../models/conversation");

exports.createConversation = catchAsync(async (req, res, next) => {
  const contract = await Contract.findById(req.params.contractId);

  const other = contract.freelancer.equals(req.user._id)
    ? contract.client
    : contract.freelancer;
  let conversation;
  conversation = await Conversation.findOneAndUpdate(
    { contract: req.params.contractId },
    {
      $setOnInsert: {
        users: [req.user._id, other],
        contract: req.params.contractId,
        closed: false,
      },
    },
    { upsert: true, new: true }
  ).populate({
    path: "users",
    select: "username photo",
  });

  if (conversation.closed) {
    conversation.closed = false;
    await conversation.save();
  }

  res.status(201).json({
    status: "success",
    data: {
      conversation,
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

  res.status(200).json({
    status: "success",
    data: {
      conversation: currentConversation,
    },
  });
});
exports.getMyConversations = catchAsync(async (req, res, next) => {
  const conversations = await Conversation.find({
    closed: false,
    users: { $elemMatch: { $eq: req.user._id } },
    latestMessage: { $exists: true },
  })
    .populate({
      path: "users",
      select: "username photo",
    })
    .populate({
      path: "latestMessage",
      select: "sender createdAt content",
    });
  res.status(200).json({
    status: "success",
    results: conversations.length,
    data: {
      conversations,
    },
  });
});

exports.closeConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findByIdAndUpdate(
    req.params.conversationId,
    { closed: true },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      conversation,
    },
  });
});

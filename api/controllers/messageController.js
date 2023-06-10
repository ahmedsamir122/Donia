const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Contract = require("../models/contractModel");
const Message = require("../models/message");
const Conversation = require("../models/conversation");

exports.sendMessage = catchAsync(async (req, res, next) => {
  const message = await Message.create({
    sender: req.user._id,
    conversation: req.params.conversationId,
    content: req.body.content,
  });

  await Conversation.findByIdAndUpdate(req.params.conversationId, {
    latestMessage: message,
  });

  await message
    .populate({
      path: "sender",
      select: "username photo",
    })
    .execPopulate();

  res.status(201).json({
    status: "success",
    data: {
      message,
    },
  });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find({
    conversation: req.params.conversationId,
  });
  res.status(200).json({
    status: "success",
    data: {
      messages,
    },
  });
});

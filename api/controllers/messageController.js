const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Contract = require("../models/contractModel");
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
});

exports.pusher = pusher;

exports.sendMessage = catchAsync(async (req, res, next) => {
  let conversation = await Conversation.findById(req.params.conversationId);
  const [reciever] = conversation?.users.filter((u) =>
    req.user._id.equals(u) ? false : true
  );
  const message = await Message.create({
    sender: req.user._id,
    conversation: req.params.conversationId,
    content: req.body.content,
    reciever,
  });
  conversation.latestMessage = message._id;
  conversation = await conversation.save();
  await message
    .populate({
      path: "sender",
      select: "username photo",
    })
    .execPopulate();

  pusher.trigger(`channel-${reciever}`, `event-${reciever}`, {
    message: req.body.content,
    conversation: req.params.conversationId,
    sender: {
      id: req.user.id,
      username: message.sender.username,
      photo: message.sender.photo,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      message,
    },
  });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  // const messages = await Message.find({
  //   conversation: req.params.conversationId,
  // });

  const features = new APIFeatures(
    Message.find({ conversation: req.params.conversationId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const messages = await features.query;

  const currentConversation = await Conversation.findById(
    req.params.conversationId
  );

  const count = await Message.countDocuments({
    conversation: req.params.conversationId,
  });

  if (messages.length > 0) {
    const isUserInConversation = currentConversation.users.some((userId) =>
      userId.equals(req.user._id)
    );

    if (!isUserInConversation) {
      return next(new AppError("You cannot get this conversation data", 400));
    }
  }

  res.status(200).json({
    status: "success",
    totalMessages: count,
    data: {
      messages: messages.reverse(),
    },
  });
});
exports.getunseenMessages = catchAsync(async (req, res, next) => {
  const count = await Message.countDocuments({
    reciever: req.user._id,
    isSeen: false,
  });

  res.status(200).json({
    status: "success",
    count,
  });
});
exports.getMessagesAdmin = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Message.find({ conversation: req.params.conversationId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const messages = await features.query;
  res.status(200).json({
    status: "success",
    data: {
      messages,
    },
  });
});

exports.seeMessagesOneConversation = catchAsync(async (req, res, next) => {
  const updateQuery = {
    $set: { isSeen: true },
  };
  const newMessages = await Message.updateMany(
    {
      conversation: req.params.conversationId,
      reciever: req.user._id,
      isSeen: false,
    },
    updateQuery,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
  });
});

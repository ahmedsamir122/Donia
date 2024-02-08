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

exports.sendMessage = catchAsync(async (req, res, next) => {
  const message = await Message.create({
    sender: req.user._id,
    conversation: req.params.Id,
    content: req.body.content,
  });

  const conversation = await Conversation.findByIdAndUpdate(
    req.params.Id,
    {
      latestMessage: message,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  const [reciever_id] = conversation?.users.filter((u) =>
    req.user._id.equals(u) ? false : true
  );
  await message
    .populate({
      path: "sender",
      select: "username photo",
    })
    .execPopulate();

  pusher.trigger(`channel-${reciever_id}`, `event-${reciever_id}`, {
    message: req.body.content,
    conversation: req.params.Id,
  });

  res.status(201).json({
    status: "success",
    data: {
      message,
    },
  });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find({
    conversation: req.params.Id,
  });

  const currentConversation = await Conversation.findById(req.params.Id);

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
    data: {
      messages,
    },
  });
});
exports.getMessagesAdmin = catchAsync(async (req, res, next) => {
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

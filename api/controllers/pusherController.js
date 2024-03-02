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

exports.pusherRealtime = catchAsync(async (req, res, next) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  const presenceData = {
    user_id: req.user._id,
    user_info: {
      username: req.user.username,
    },
  };

  const auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

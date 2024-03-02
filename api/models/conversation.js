const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  closed: {
    type: Boolean,
    default: false,
  },
  // contract: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "Contract",
  // },
  latestMessage: {
    type: mongoose.Schema.ObjectId,
    ref: "Message",
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;

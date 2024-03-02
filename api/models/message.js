const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: "Conversation",
  },
  content: {
    type: String,
    maxLength: [200, "the content must have less or eqaul than 200 characters"],
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: function () {
      return new Date();
    },
  },
});

messageSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "sender",
    select: "username photo",
  });

  next();
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;

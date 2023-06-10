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

const mongoose = require("mongoose");
const User = require("./userModel");
const Contract = require("./contractModel");

const notificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      maxLength: [
        300,
        "the notification must have less or eqaul than 50 characters",
      ],
    },
    from: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    to: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "notification must belong to a user"],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;

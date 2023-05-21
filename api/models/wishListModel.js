const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    me: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "the wish user must belong to a user"],
    },
    other: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "you have to choose a user"],
    },
  },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true },
  }
);

const WishList = mongoose.model("WishList", wishListSchema);

module.exports = WishList;

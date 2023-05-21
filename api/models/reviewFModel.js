const mongoose = require("mongoose");
const User = require("./userModel");
const Contract = require("./contractModel");

const reviewFSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      default: "No feedback given...",
    },
    rating: {
      type: Number,
      default: 4,
      min: 1,
      max: 5,
      required: [true, "The rating can not be empty"],
    },
    freelancer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    contract: {
      type: mongoose.Schema.ObjectId,
      ref: "Contract",
      required: [true, "Review must belong to a contract"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewFSchema.statics.calcAverageRatings = async function (clientId) {
  const stats = await this.aggregate([
    {
      $match: { client: clientId },
    },
    {
      $group: {
        _id: "$client",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  console.log(stats);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(clientId, {
      ratingsQuantityF: stats[0].nRating,
      ratingsAverageF: stats[0].avgRating,
    });
  } else {
    await User.findByIdAndUpdate(clientId, {
      ratingsQuantityF: 0,
      ratingsAverageF: 4.5,
    });
  }
};

reviewFSchema.pre("save", function (next) {
  this.constructor.calcAverageRatings(this.client);
  next();
});

reviewFSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();

  next();
});

reviewFSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r);
});

const ReviewF = mongoose.model("ReviewF", reviewFSchema);

module.exports = ReviewF;

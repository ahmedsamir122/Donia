const mongoose = require("mongoose");
const User = require("./userModel");

const reviewCSchema = new mongoose.Schema(
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
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    freelancer: {
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

reviewCSchema.statics.calcAverageRatings = async function (freelancerId) {
  const stats = await this.aggregate([
    {
      $match: { freelancer: freelancerId },
    },
    {
      $group: {
        _id: "$freelancer",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  console.log(stats);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(freelancerId, {
      ratingsQuantityC: stats[0].nRating,
      ratingsAverageC: stats[0].avgRating,
    });
  } else {
    await User.findByIdAndUpdate(freelancerId, {
      ratingsQuantityC: 0,
      ratingsAverageC: 4.5,
    });
  }
};

reviewCSchema.pre("save", function (next) {
  this.constructor.calcAverageRatings(this.freelancer);
  next();
});

reviewCSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();

  next();
});

reviewCSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r);
});

const ReviewC = mongoose.model("ReviewC", reviewCSchema);

module.exports = ReviewC;

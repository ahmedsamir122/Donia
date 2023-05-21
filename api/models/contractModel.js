const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "the contract must have aname"],
    },
    budget: {
      type: Number,
      required: [true, "the contract must have a budget"],
    },
    activity: {
      type: String,
      enum: ["offer", "progress", "submit", "approve", "cancel"],
      default: "offer",
    },
    task: {
      type: String,
      required: [true, "the contract must have a task"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Contract must belong to a user"],
    },
    freelancer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Contract must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true },
  }
);

contractSchema.virtual("reviewFs", {
  ref: "ReviewF",
  localField: "_id",
  foreignField: "contract",
});

contractSchema.virtual("reviewCs", {
  ref: "ReviewC",
  foreignField: "contract",
  localField: "_id",
});

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;

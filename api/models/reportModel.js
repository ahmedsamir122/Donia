const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    complainer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "the wish user must belong to a user"],
    },
    type: {
      type: String,
      enum: ["contract", "user", "review"],
      default: "user",
      required: [true, "the report must have a type"],
    },
    complainerAbout: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    contract: {
      type: mongoose.Schema.ObjectId,
      ref: "Contract",
    },
    description: {
      type: String,
      maxLength: [
        150,
        "the report must have less or eqaul than 150 characters",
      ],
    },

    admin: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "you have to choose a admin"],
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    notes: [{ type: mongoose.Schema.ObjectId, ref: "Note" }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true },
  }
);

reportSchema.index({ createdAt: -1 });

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;

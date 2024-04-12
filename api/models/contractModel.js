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
      enum: [
        "offer",
        "cancel",
        "expired",
        "expiredDeadline",
        "progress",
        "submit",
        "refused",
        "complain",
        "refused_final",
        "approved",
      ],
      default: "offer",
    },
    task: {
      type: String,
      required: [true, "the contract must have a task"],
      maxLength: [
        150,
        "the contract must have less or eqaul than 150 characters",
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    submitDate: {
      type: Date,
    },
    refusedDate: {
      type: Date,
    },
    expiredAt: {
      type: Date,
      default: Date.now() + 2 * 24 * 60 * 60 * 1000,
    },
    deadline: {
      type: Date,
      required: [true, "Contract must have adeadline"],
    },
    conversation: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
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

contractSchema.post("find", async function (docs, next) {
  // console.log(docs);
  for (const contract of docs) {
    if (contract.activity === "offer" && Date.now() > contract.expiredAt) {
      contract.activity = "expired";
      await contract.save();
    }
    if (contract.activity === "progress" && Date.now() > contract.deadline) {
      contract.activity = "expiredDeadline";
      await contract.save();
    }
    if (
      contract.activity === "submit" &&
      Date.now() > contract.submitDate + 72 * 24 * 60 * 60 * 1000
    ) {
      contract.activity = "approved";
      await contract.save();
    }
    if (
      contract.activity === "refused" &&
      Date.now() > contract.refusedDate + 72 * 24 * 60 * 60 * 1000
    ) {
      contract.activity = "refused_final";
      await contract.save();
    }
  }
  next();
});
contractSchema.post("findOne", async function (doc, next) {
  if (doc.activity === "offer" && Date.now() > doc.expiredAt) {
    doc.activity = "expired";
    await doc.save();
  }
  if (doc.activity === "progress" && Date.now() > doc.deadline) {
    doc.activity = "expiredDeadline";
    await doc.save();
  }
  if (
    doc.activity === "submit" &&
    Date.now() > doc.submitDate + 72 * 24 * 60 * 60 * 1000
  ) {
    doc.activity = "approved";
    await doc.save();
  }
  if (
    doc.activity === "refused" &&
    Date.now() > doc.refusedDate + 72 * 24 * 60 * 60 * 1000
  ) {
    doc.activity = "refused_final";
    await doc.save();
  }

  next();
});
const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;

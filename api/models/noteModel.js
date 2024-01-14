const mongoose = require("mongoose");
const Report = require("../models/reportModel");

const noteSchema = new mongoose.Schema(
  {
    writer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "the note must belong to a user"],
    },
    report: {
      type: mongoose.Schema.ObjectId,
      ref: "Report",
      required: [true, "the note must belong to a report"],
    },

    description: {
      type: String,
      maxLength: [50, "the note must have less or eqaul than 50 characters"],
    },
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

noteSchema.post("save", async function (doc, next) {
  const report = await Report.findById(doc.report);
  report.notes.push(doc.id);
  report.save();
  next();
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;

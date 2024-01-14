const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Contract = require("../models/contractModel");
const Report = require("../models/reportModel");
const User = require("../models/userModel");
const filterObj = require("../utils/filterObj");
const Note = require("../models/noteModel");

exports.createNote = catchAsync(async (req, res, next) => {
  const newNote = await Note.create({ ...req.body, writer: req.user.id });

  res.status(200).json({
    status: "success",
    data: {
      newNote,
    },
  });
});

const express = require("express");
const authController = require("../controllers/authController");
const noteController = require("../controllers/noteController");

const router = express.Router();

router.route("/").post(authController.protect, noteController.createNote);

module.exports = router;

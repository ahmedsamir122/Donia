const express = require("express");
const messageController = require("../controllers/messageController");
const conversationController = require("../controllers/conversationController");
const authController = require("../controllers/authController");
const pusherController = require("../controllers/pusherController");

const router = express.Router();

router
  .route("/auth")
  .post(authController.protect, pusherController.pusherRealtime);

module.exports = router;

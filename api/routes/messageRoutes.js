const express = require("express");
const messageController = require("../controllers/messageController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/get-meesages-admin/:conversationId")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    messageController.getMessagesAdmin
  );
router
  .route("/:Id")
  .get(authController.protect, messageController.getMessages)
  .post(authController.protect, messageController.sendMessage);

module.exports = router;

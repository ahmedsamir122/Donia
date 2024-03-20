const express = require("express");
const messageController = require("../controllers/messageController");
const conversationController = require("../controllers/conversationController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/unseenMessages")
  .get(authController.protect, messageController.getunseenMessages);

router
  .route("/get-meesages-admin/:conversationId")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    messageController.getMessagesAdmin
  );

router
  .route("/:conversationId")
  .get(
    authController.protect,
    conversationController.checkOneOfUsers,
    messageController.getMessages
  )
  .post(
    authController.protect,
    conversationController.checkOneOfUsers,
    messageController.sendMessage
  )
  .patch(
    authController.protect,
    conversationController.checkOneOfUsers,
    messageController.seeMessagesOneConversation
  );

module.exports = router;

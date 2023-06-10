const express = require("express");
const conversationController = require("../controllers/conversationController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/myConversations")
  .get(authController.protect, conversationController.getMyConversations);

router
  .route("/:contractId")
  .post(authController.protect, conversationController.createConversation);

router
  .route("/getOne/:conversationId")
  .get(authController.protect, conversationController.getCurrentConversation);
router
  .route("/close/:conversationId")
  .patch(authController.protect, conversationController.closeConversation);

module.exports = router;

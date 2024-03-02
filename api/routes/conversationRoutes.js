const express = require("express");
const conversationController = require("../controllers/conversationController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/myConversations")
  .get(authController.protect, conversationController.getMyConversations);

router
  .route("/getOne/:conversationId")
  .get(
    authController.protect,
    conversationController.checkOneOfUsers,
    conversationController.getCurrentConversation
  );
router
  .route("/getOne-admin/:conversationId")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    conversationController.getOneConversationAdmin
  );
router
  .route("/close/:conversationId")
  .patch(
    authController.protect,
    conversationController.checkOneOfUsers,
    conversationController.closeConversation
  );

router
  .route("/:contractId")
  .post(authController.protect, conversationController.createConversation);

module.exports = router;

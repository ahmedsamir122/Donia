const express = require("express");
const notificationController = require("../controllers/notificationController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, notificationController.getNotifications)
  .patch(authController.protect, notificationController.seeNotifications);

router
  .route("/:id")
  .delete(
    authController.protect,
    notificationController.deleteOneNotifications
  );

module.exports = router;

const express = require("express");
const reviewFController = require("../controllers/reviewFController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, reviewFController.getAllReviewFs)
  .post(reviewFController.createReviewF);

router
  .route("/:idReviewF")
  .get(reviewFController.getReviewF)
  .patch(reviewFController.updateReviewF)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    reviewFController.deleteReviewF
  );

module.exports = router;

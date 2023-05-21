const express = require("express");
const reviewCController = require("../controllers/reviewCController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, reviewCController.getAllReviewCs)
  .post(authController.protect, reviewCController.createReviewC);

router
  .route("/:idReviewC")
  .get(reviewCController.getReviewC)
  .patch(reviewCController.updateReviewC)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    reviewCController.deleteReviewC
  );

module.exports = router;

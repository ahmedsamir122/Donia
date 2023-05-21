const express = require("express");
const wishListController = require("../controllers/wishListController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/").get(authController.protect, wishListController.getWishList);

router
  .route("/:other")
  .post(authController.protect, wishListController.createWishList);

router
  .route("/:otherId")
  .delete(authController.protect, wishListController.deleteWishList);

module.exports = router;

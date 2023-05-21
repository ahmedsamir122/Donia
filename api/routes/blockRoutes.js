const express = require("express");
const blockController = require("../controllers/blockController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/").get(authController.protect, blockController.getBlock);

router
  .route("/:other")
  .post(authController.protect, blockController.createBlock);

router
  .route("/:otherId")
  .delete(authController.protect, blockController.deleteBlock);

module.exports = router;

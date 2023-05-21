const express = require("express");
const contractController = require("../controllers/contractController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, contractController.getAllContracts)
  .post(contractController.createContract);

router
  .route("/:id")
  .get(contractController.getContract)
  .patch(contractController.updateContract)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    contractController.deleteContract
  );

router
  .route("/:id/accept")
  .patch(authController.protect, contractController.acceptContract);

router
  .route("/:id/submit")
  .patch(authController.protect, contractController.submitContract);

router
  .route("/:id/approve")
  .patch(authController.protect, contractController.approveContract);

router
  .route("/:id/cancel")
  .patch(authController.protect, contractController.cancelContract);

module.exports = router;

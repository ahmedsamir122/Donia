const express = require("express");
const contractController = require("../controllers/contractController");
const reviewCController = require("../controllers/reviewCController");
const authController = require("../controllers/authController");
const conversationController = require("../controllers/conversationController");

const router = express.Router();

router.route("/").get(contractController.getAllContracts);
router
  .route("/public-contractsF/:username")
  .get(contractController.getPublicContractsF);
router
  .route("/public-admin-contractsF/:username")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    contractController.getPublicContractsFAdmin
  );
router
  .route("/public-contractsC/:username")
  .get(contractController.getPublicContractsC);
router
  .route("/public-admin-contractsC/:username")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    contractController.getPublicContractsCAdmin
  );
router
  .route("/my-contractsF")
  .get(
    authController.protect,
    contractController.expiredCheck,
    contractController.getMyContractsF
  );
router
  .route("/my-contractsC")
  .get(
    authController.protect,
    contractController.expiredCheck,
    contractController.getMyContractsC
  );

router
  .route("/open/:username")
  .post(
    authController.protect,
    contractController.filterContract,
    contractController.openContract
  );

router
  .route("/checkout-session/:username")
  .post(
    authController.protect,
    contractController.filterContract,
    contractController.expiredCheck,
    contractController.getCheckoutSession
  );

router
  .route("/:username")
  .post(
    authController.protect,
    contractController.filterContract,
    contractController.createContract,
    conversationController.createConversation
  );

// router
//   .route("/submit/:username")
//   .post(
//     authController.protect,
//     contractController.filterContract,
//     contractController.expiredCheck,
//     contractController.createContract
//   );

router
  .route("/:id")
  .get(
    authController.protect,
    contractController.expiredCheck,
    contractController.getContract
  )

  .delete(
    authController.protect,
    contractController.expiredCheck,
    contractController.deleteContract
  );
router
  .route("/re/:contractId")
  .post(authController.protect, reviewCController.createReview);

router
  .route("/:id/accept")
  .patch(
    authController.protect,
    contractController.expiredCheck,
    contractController.acceptContract
  );

router
  .route("/:id/submit")
  .patch(
    authController.protect,
    contractController.expiredCheck,
    contractController.submitContract
  );

// router
//   .route("/:id/approve")
//   .patch(authController.protect, contractController.approveContract);

router
  .route("/:id/cancel")
  .patch(
    authController.protect,
    contractController.expiredCheck,
    contractController.refuseContract
  );

module.exports = router;

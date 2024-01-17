const express = require("express");
const authController = require("../controllers/authController");
const reportController = require("../controllers/reportController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, reportController.getReports)
  .post(authController.protect, reportController.createReport);

router
  .route("/admin-stats")
  .get(
    authController.protect,
    authController.restrictTo("supervisor"),
    reportController.getAdminStats
  );
router
  .route("/userReports/:username")
  .get(
    authController.protect,
    authController.restrictTo("admin", "supervisor"),
    reportController.getReportsOneUser
  );
router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    reportController.getOneReport
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    reportController.updateReport
  );

module.exports = router;

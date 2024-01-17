const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);
router.patch(
  "/updateMe",
  authController.protect,
  userController.uploadUserPhoto,
  userController.updateMe
);
router.get("/me", authController.protect, userController.getMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

router
  .route("/")
  .get(userController.getAllTalents)
  .post(userController.createUser);
router
  .route("/getAllUsers")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers
  );

router
  .route("/blockUser/:username")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    userController.blockUser
  );

router
  .route("/:username")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

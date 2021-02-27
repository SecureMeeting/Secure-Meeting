const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const loginController = require("../controllers/loginController");
const signupController = require("../controllers/signupController");
const isSignedInController = require("../controllers/isSignedInController");
const signoutController = require("../controllers/signoutController");
const reestablishSessionController = require("../controllers/ReestablishSessionController");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const verifyEmailController = require("../controllers/verifyEmailController");
const resetPasswordController = require("../controllers/resetPasswordController");

//Local imports-----------------------------------------

router.route("/login").post(loginController.login);
router.route("/signup").post(signupController.signup);
router.route("/forgotPassword").post(forgotPasswordController.forgotPassword);
router.route("/isSignedIn").post(isSignedInController.isSignedIn);
router.route("/signout").get(signoutController.signout);
router
  .route("/reestablishSession")
  .get(reestablishSessionController.reestablishSession);
router.route("/verifyEmail").get(verifyEmailController.verifyEmail);
router.route("/resetPassword").post(resetPasswordController.resetPassword);

module.exports = router;

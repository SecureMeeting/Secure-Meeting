const express = require("express");
const router = express.Router();
const forgotPasswordController = require("../controllers/forgotPasswordController");
const verifyEmailController = require("../controllers/verifyEmailController");

//Local imports-----------------------------------------

router.route("/forgotPassword").post(forgotPasswordController.forgotPassword);
router.route("/verifyEmail").post(verifyEmailController.verifyEmail);

module.exports = router;

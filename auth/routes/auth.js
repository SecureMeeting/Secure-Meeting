const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const loginController = require("../controllers/loginController");
const signupController = require("../controllers/signupController");

//Local imports-----------------------------------------

router.route("/login").post(loginController.login);
router.route("/signup").post(signupController.signup);

module.exports = router;

var express = require("express");
var router = express.Router();
var authService = require("./authService");
var emailService = require("./emailService");

router.use((req, res, next) => {
  console.log("Called: ", req.path);
  next();
});

router.use(authService);
router.use(emailService);

module.exports = router;

var express = require("express");
var router = express.Router();
var authService = require("./authService");

router.use((req, res, next) => {
  console.log("Called: ", req.path);
  next();
});

router.use(authService);

module.exports = router;

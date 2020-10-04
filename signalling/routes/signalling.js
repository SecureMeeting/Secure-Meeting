const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const DefaultRouter = require("../controllers/DefaultRouter");

router.route("/default").post(DefaultRouter.DefaultRoute);

module.exports = router;

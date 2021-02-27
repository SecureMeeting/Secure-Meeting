const express = require("express");
const router = express.Router();
const donateController = require("../controllers/donateController");
//Local imports-----------------------------------------

router.route("/donate").post(donateController.donate);

module.exports = router;

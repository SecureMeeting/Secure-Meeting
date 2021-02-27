const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const createServerController = require("../controllers/createServerController");
const deleteServerController = require("../controllers/deleteServerController");
const getServerController = require("../controllers/getServerController");
const getAllServersController = require("../controllers/getAllServerController");
//Local imports-----------------------------------------

router.route("/create").post(createServerController.createServer);
router.route("/delete").delete(deleteServerController.deleteServer);
router.route("/get").get(getServerController.getServer);
router.route("/getAll").get(getAllServersController.getAllServers);

module.exports = router;

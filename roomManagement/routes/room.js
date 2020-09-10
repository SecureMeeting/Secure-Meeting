const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const roomController = require("../controllers/roomController");
//Local imports-----------------------------------------

router.route("/create").post(roomController.createRoom);

router.route("/delete").delete(roomController.deleteRoom);

router.route("/get").get(roomController.getRoom);

router.route("/schedule").post(roomController.scheduleRoom);

router.route("/auth").post(roomController.authenticateRoom);

module.exports = router;

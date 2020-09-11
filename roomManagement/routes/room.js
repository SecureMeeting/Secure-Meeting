const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const authRoomController = require("../controllers/authRoomController");
const createRoomController = require("../controllers/createRoomController");
const deleteRoomController = require("../controllers/deleteRoomController");
const getRoomController = require("../controllers/getRoomController");
const scheduleRoomController = require("../controllers/scheduleRoomController");
//Local imports-----------------------------------------

router.route("/create").post(createRoomController.createRoom);

router.route("/delete").delete(deleteRoomController.deleteRoom);

router.route("/get").get(getRoomController.getRoom);

router.route("/schedule").post(scheduleRoomController.scheduleRoom);

router.route("/auth").post(authRoomController.authenticateRoom);

module.exports = router;

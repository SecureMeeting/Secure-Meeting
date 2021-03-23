import express from "express";
import {
  getRouterRtpCapabilities,
  createBroadcaster,
  deleteBroadcaster,
  createBroadcasterTransport,
  connectBroadcasterTransport,
  createBroadcasterProducer,
  createBroadcasterConsumer,
  createWebRtcTransport,
  connectWebRtcTransport,
  join,
  produce,
  resumeConsumer,
  getRoom,
  getAllRooms,
  closeProducer,
} from "../controllers/roomsController";
import checkRoom from "../middleware/checkRoom";
import checkPeer from "../middleware/checkPeer";

var router = express.Router();

router.route("/all").get(getAllRooms);
router.route("/:roomId").get(checkRoom, getRoom);

router
  .route("/:roomId/getRouterRtpCapabilities")
  .get(checkRoom, getRouterRtpCapabilities);
router.route("/:roomId/broadcasters").post(checkRoom, createBroadcaster);
router
  .route("/:roomId/broadcasters/:broadcasterId")
  .delete(checkRoom, deleteBroadcaster);
router
  .route("/:roomId/broadcasters/:broadcasterId/transports")
  .post(checkRoom, createBroadcasterTransport);
router
  .route("/:roomId/broadcasters/:broadcasterId/transports/:transportId/connect")
  .post(checkRoom, connectBroadcasterTransport);
router
  .route(
    "/:roomId/broadcasters/:broadcasterId/transports/:transportId/producers"
  )
  .post(checkRoom, createBroadcasterProducer);
router
  .route("/:roomId/broadcasters/:broadcasterId/transports/:transportId/consume")
  .post(checkRoom, createBroadcasterConsumer);
router
  .route("/:roomId/peerId/:peerId/createWebRtcTransport")
  .post(checkRoom, checkPeer, createWebRtcTransport);
router
  .route("/:roomId/peerId/:peerId/connectWebRtcTransport")
  .post(checkRoom, checkPeer, connectWebRtcTransport);
router.route("/:roomId/peerId/:peerId/join").post(checkRoom, checkPeer, join);
router
  .route("/:roomId/peerId/:peerId/produce")
  .post(checkRoom, checkPeer, produce);
router
  .route("/:roomId/peerId/:peerId/resumeConsumer")
  .post(checkRoom, checkPeer, resumeConsumer);
router
  .route("/:roomId/peerId/:peerId/closeProducer")
  .post(checkRoom, checkPeer, closeProducer);

export default router;

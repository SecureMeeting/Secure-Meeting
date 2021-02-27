import express from "express";
import {
  getRouterRtpCapabilities,
  createBroadcaster,
  deleteBroadcaster,
  createBroadcasterTransport,
  connectBroadcasterTransport,
  createBroadcasterProducer,
  createBroadcasterConsumer,
} from "../controllers/roomsController";

var router = express.Router();

router.route("/:roomId").get(getRouterRtpCapabilities);
router.route("/:roomId/broadcasters").post(createBroadcaster);
router.route("/:roomId/broadcasters/:broadcasterId").delete(deleteBroadcaster);
router
  .route("/:roomId/broadcasters/:broadcasterId/transports")
  .post(createBroadcasterTransport);
router
  .route("/:roomId/broadcasters/:broadcasterId/transports/:transportId/connect")
  .post(connectBroadcasterTransport);
router
  .route(
    "/:roomId/broadcasters/:broadcasterId/transports/:transportId/producers"
  )
  .post(createBroadcasterProducer);
router
  .route("/:roomId/broadcasters/:broadcasterId/transports/:transportId/consume")
  .post(createBroadcasterConsumer);

export default router;

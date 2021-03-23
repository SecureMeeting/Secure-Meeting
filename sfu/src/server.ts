import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import colors from "colors";
import mediasoup from "mediasoup";

// Or using destructuring assignment.
import {
  types,
  version,
  observer,
  createWorker,
  getSupportedRtpCapabilities,
  parseScalabilityMode,
} from "mediasoup";

import { AwaitQueue } from "awaitqueue";
//Local Imports
import RoomManagement from "./src/RoomManagement";
import { Express } from "express-serve-static-core";
import roomsRoute from "./routes/rooms";
import Logger from "./models/Logger";
import { Socket } from "socket.io";
import { join_room_payload } from "./src/socketInterfaces";
const config = require("./config");
const logger = new Logger("");
dotenv.config();

const roomManagement = new RoomManagement();

const PORT = process.env.PORT || 8004;

// Express application.
// @type {Function}
let app: Express;
// HTTP server.
// @type {http.Server}
let server: { listen: (arg0: string | number) => void };
//Socket.io Server
let io: { on: (arg0: string, arg1: (socket: any) => void) => void };
// mediasoup Workers.
const mediasoupWorkers: Array<types.Worker> = [];
// Index of next mediasoup Worker to use.
// @type {Number}
let nextMediasoupWorkerIdx = 0;
// Async queue to manage rooms.
// @type {AwaitQueue}
const queue = new AwaitQueue();

//======================================================================================================
//										  Initializing										   |
//======================================================================================================

init();

async function init() {
  console.log("-------------------------------------------------");
  console.log("|          SFU Microservice is running          |");
  console.log("-------------------------------------------------");
  console.log("Environment: ", process.env.NODE_ENV);
  console.log("Running on at:", "http://" + process.env.DOMAIN + ":" + PORT);
  console.log("Listening Ip:", process.env.MEDIASOUP_LISTEN_IP);
  console.log("Announced Ip:", process.env.MEDIASOUP_ANNOUNCED_IP);
  console.log("-------------------------------------------------");
  console.log("|               Initializing...                 |");
  console.log("-------------------------------------------------");
  await initExpress();
  await initSockets();
  // Run a mediasoup Worker.
  await runMediasoupWorkers();
}

//======================================================================================================
//											Express											   |
//======================================================================================================
async function initExpress() {
  app = express();
  app.use(cors());
  app.use(express.json());
  server = require("http").createServer(app);
  server.listen(PORT);
  attachApiEndpoints();
  console.log("Express server running!");
}

function attachApiEndpoints() {
  app.get("/", function (req, res) {
    res.send("Successfully hit the SFU api!");
  });
  app.use("/rooms", roomsRoute);
}

//======================================================================================================
//											socket io										   |
//======================================================================================================

async function initSockets() {
  if (process.env.NODE_ENV === "development") {
    io = require("socket.io")(server, {
      cors: { origin: "*", methods: ["GET", "POST"] },
    });
  } else {
    io = require("socket.io")(server);
  }
  if (io) {
    attachSocketEvents();
  }
  console.log("Socket.io server running!");
}

function attachSocketEvents() {
  io.on("connection", (socket: Socket) => {
    onSocketConnection(socket);
    socket.on("join_room", (payload: join_room_payload) => {
      const { roomId } = payload;
      roomManagement.createOrJoinRoom(roomId, socket.id, socket);
    });
    socket.on("disconnect", () => {
      roomManagement.leaveRoom(socket.id);
    });
  });

  function onSocketConnection(socket: Socket) {
    console.log("a user connected with id", socket.id);
    socket.emit("connection_established", {
      isConnected: true,
      peerId: socket.id,
    });
  }
}

//======================================================================================================
//										  Media Soup										   |
//======================================================================================================

/**
 * Launch as many mediasoup Workers as given in the configuration file.
 */
async function runMediasoupWorkers() {
  const { numWorkers } = config.mediasoup;

  logger.info("running %d mediasoup Workers...", numWorkers);

  for (let i = 0; i < numWorkers; ++i) {
    const worker = await createWorker({
      logLevel: config.mediasoup.workerSettings.logLevel,
      logTags: config.mediasoup.workerSettings.logTags,
      rtcMinPort: Number(config.mediasoup.workerSettings.rtcMinPort),
      rtcMaxPort: Number(config.mediasoup.workerSettings.rtcMaxPort),
    });

    worker.on("died", () => {
      setTimeout(() => process.exit(1), 2000);
    });

    mediasoupWorkers.push(worker);
  }
}

/**
 * Get next mediasoup Worker.
 */
function getMediasoupWorker(): types.Worker {
  const worker: types.Worker = mediasoupWorkers[nextMediasoupWorkerIdx];

  if (++nextMediasoupWorkerIdx === mediasoupWorkers.length)
    nextMediasoupWorkerIdx = 0;

  return worker;
}

export { getMediasoupWorker };

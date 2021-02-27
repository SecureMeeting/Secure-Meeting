import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import colors from "colors";
//Local Imports
import RoomManagement from "./src/RoomManagement";
import User from "./models/User";

dotenv.config();
const roomManagement = new RoomManagement();
//======================================================================================================
//										Configure Express server										   |
//======================================================================================================
const PORT = process.env.PORT || 8002;
const app = express();
app.use(cors());
app.use(express.json());
const server = require("http").createServer(app);
let io;
if (process.env.NODE_ENV === "development") {
  io = require("socket.io")(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });
} else {
  io = require("socket.io")(server);
}

server.listen(PORT);

console.log("--------------------------------------");
console.log("|  Syncable Microservice is running  |");
console.log("--------------------------------------");
console.log("Environment: ", process.env.NODE_ENV);
console.log("Running on port:", PORT);

//======================================================================================================
//											Api Endpoints											   |
//======================================================================================================
app.get("/", function (req, res) {
  res.send("Successfully hit the syncable api!");
});

//======================================================================================================
//											socket io										   |
//======================================================================================================

io.on("connection", (socket: any) => {
  console.log("a user connected to syncable with id", socket.id);

  interface join_room_payload {
    roomName: String;
  }

  socket.on("join_room", (payload: join_room_payload) => {
    var { roomName } = payload;
    socket.join(roomName);
    roomManagement.createOrJoinRoom(roomName, socket.id);

    socket.emit("connected_to_room", {
      isConnected: true,
      componentState: roomManagement.getComponentState(<string>roomName),
    });
  });

  interface set_name_payload {
    name: String;
  }

  socket.on("set_name", (payload: set_name_payload) => {
    var { name } = payload;
    roomManagement.setName(name, socket.id);
    var roomName = roomManagement.getRoomNameBySocketId(socket.id);
    console.log("set name:", name);
    socket.to(roomName).emit("peer_set_name", {
      name: name,
      socketId: socket.id,
    });
  });

  socket.on("component_updated", (payload: any) => {
    var roomName = roomManagement.getRoomNameBySocketId(socket.id);
    console.log("component updated in room:", roomName);
    roomManagement.componentUpdated(<string>roomName, payload);
    socket.to(roomName).emit("remote_component_updated", {
      states: payload,
    });
  });

  socket.on("mouse_updated", (payload: any) => {
    var roomName = roomManagement.getRoomNameBySocketId(socket.id);
    roomManagement.mouseUpdated(<string>roomName, socket.id, payload);
    const user = roomManagement.getUserBySocketId(socket.id);
    socket.to(roomName).emit("remote_mouse_updated", {
      name: user?.name,
      socketId: socket.id,
      mousePosition: payload,
    });
  });

  socket.on("disconnect", () => {
    var roomName = roomManagement.getRoomNameBySocketId(socket.id);
    socket.to(roomName).emit("peer_left_room", {
      socketId: socket.id,
    });
    console.log("user disconnected");
    roomManagement.leaveRoom(socket.id);
  });
});

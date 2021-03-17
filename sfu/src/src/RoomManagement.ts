import Room from "../models/Room";
import Peer from "../models/Peer";
import { Socket } from "socket.io";
import { getMediasoupWorker } from "../server";

export default class RoomManagement {
  public static rooms: Map<String, Room> = new Map(); //allows the rooms variable to be the same for every instance of this object

  constructor() {}

  get getRooms() {
    return RoomManagement.rooms;
  }

  async createOrJoinRoom(roomName: string, socketId: string, socket: Socket) {
    if (RoomManagement.rooms.has(roomName)) {
      //join room
      let room = RoomManagement.rooms.get(roomName);
      if (room) {
        const newPeer = new Peer(socketId, socket);
        room.addPeer(newPeer);
        console.log("joined room");
      }
    } else {
      //create room
      const mediasoupWorker = getMediasoupWorker();
      var newRoom: Room = await Room.create(
        roomName,
        mediasoupWorker,
        false,
        false
      );
      const newPeer = new Peer(socketId, socket);
      newRoom.addPeer(newPeer);
      console.log("created room");
      RoomManagement.rooms.set(roomName, newRoom);
    }
  }

  findPeer(peerId: string): Peer | null {
    for (const [roomId, room] of RoomManagement.rooms.entries()) {
      const curPeer = room.getPeer(peerId);
      if (curPeer) {
        return curPeer;
      }
    }
    return null;
  }

  findRoomByPeer(peerId: string): Room | null {
    for (const [roomId, room] of RoomManagement.rooms.entries()) {
      const curPeer = room.getPeer(peerId);
      if (curPeer) {
        return room;
      }
    }
    return null;
  }

  leaveRoom(peerId: string) {
    const room = this.findRoomByPeer(peerId);
    if (room) {
      console.log("removed peer from room");
      room.removePeer(peerId);
    }
    if (room?.getNumberOfPeers() === 0) {
      console.log("room is empty so room closed:", room._roomId);
      RoomManagement.rooms.delete(room._roomId);
    }
  }
}

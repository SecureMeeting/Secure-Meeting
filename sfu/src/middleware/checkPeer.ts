import Response from "../models/Response";
import roomManagement from "../src/RoomManagement";
import Room from "../models/Room";
/**
 * Verifiesthat the room exsts in Room Managment
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export default function checkPeer(req: any, res: any, next: Function) {
  const { peerId } = req.params;
  const room: Room = req.room;
  const peer = room.getPeer(peerId);
  if (peer) {
    console.log("HAS PEER");
    req.peer = peer;
    next();
  } else {
    console.log("PEER DOESNT EXIST");
    res.status(400).send(new Response(false, "Peer does not exist", {}));
  }
}

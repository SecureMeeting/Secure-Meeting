import Response from "../models/Response";
import roomManagement from "../src/RoomManagement";
/**
 * Verifiesthat the room exsts in Room Managment
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export default function checkRoom(req: any, res: any, next: Function) {
  const { roomId } = req.params;
  const room = roomManagement.rooms.get(roomId);
  if (room) {
    //has the room continue
    console.log("ROOM EXISTS");
    req.room = roomManagement.rooms.get(roomId);
    next();
  } else {
    console.log("ROOM DOESNT EXIST");
    res.status(400).send(new Response(false, "Room does not exist", {}));
  }
}

const RoomRecord = require("../models/RoomRecord");
const { Response } = require("../models/Response");

exports.deleteRoom = async (req, res) => {
  const roomReq = {
    roomName: req.body.roomName,
  };

  if (req.body == null || req.body == undefined) {
    let response = new Response(false, "Must have a Room Name", null);
    res.status(400).send(response);
  } else if (
    roomReq.roomName === null ||
    roomReq.roomName === undefined ||
    roomReq.roomName === ""
  ) {
    let response = new Response(false, "Must have a Room Name", null);
    res.status(400).send(response);
  } else {
    await RoomRecord.deleteOne({ roomName: roomReq.roomName })
      .then((record) => {
        if (record) {
          let response = new Response(true, null, record);
          res.status(200).send(response);
        } else {
          let response = new Response(
            false,
            "A room with that name was not found",
            null
          );
          res.status(400).send(response);
        }
      })
      .catch(() => {
        let response = new Response(false, "An error occured", null);
        res.status(400).send(response);
      });
  }
};

const moment = require("moment");
const RoomRecord = require("../models/RoomRecord");
const { Response } = require("../models/Response");

exports.createRoom = async (req, res, next) => {
  const roomReq = {
    roomName: req.body.roomName,
    timeCreated: moment().format(),
    createdBy: req.body.createdBy,
    password: req.body.password,
    members: req.body.members,
  };

  var newRoomRecord = new RoomRecord(roomReq);

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
    await RoomRecord.findOne({ roomName: roomReq.roomName })
      .then((record) => {
        if (record) {
          let response = new Response(false, "Room Already Exists", null);
          res.status(400).send(response);
        } else {
          newRoomRecord
            .save()
            .then(() => {
              let response = new Response(true, null, roomReq);
              res.status(200).send(response);
            })
            .catch(() => {
              let response = new Response(false, "An error occured", null);
              res.status(400).send(response);
            });
        }
      })
      .catch(() => {
        let response = new Response(false, "An error occured", null);
        res.status(400).send(response);
      });
  }
};

exports.deleteRoom = (req, res) => {
  console.log("delete room hit");
  res.send(true);
};

exports.getRoom = (req, res) => {
  console.log("get room hit");
  res.send(true);
};

exports.scheduleRoom = (req, res) => {
  console.log("schedule room hit");
  res.send(true);
};

exports.authenticateRoom = (req, res) => {
  console.log("authenticate room hit");
  res.send(true);
};

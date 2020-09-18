const moment = require("moment");
const bcrypt = require("bcrypt");

const RoomRecord = require("../models/RoomRecord");
const { Response } = require("../models/Response");

exports.createRoom = async (req, res, next) => {
  const password = req.body.password;

  bcrypt.hash(password, process.env.SALT_ROUNDS, async function (
    err,
    hashPassword
  ) {
    const roomReq = {
      roomName: req.body.roomName,
      timeCreated: moment().format(),
      createdBy: req.body.createdBy,
      password: hashPassword,
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
  });
};

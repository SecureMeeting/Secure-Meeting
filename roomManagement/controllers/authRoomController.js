const bcrypt = require("bcrypt");

const RoomRecord = require("../models/RoomRecord");
const { Response } = require("../models/Response");

exports.authenticateRoom = async (req, res) => {
  const roomReq = {
    roomName: req.body.roomName,
    password: req.body.password,
  };

  if (req.body == null || req.body == undefined) {
    let response = new Response(false, "Must have a Room Name", null);
    return res.status(400).send(response);
  } else if (
    roomReq.roomName === null ||
    roomReq.roomName === undefined ||
    roomReq.roomName === ""
  ) {
    let response = new Response(false, "Must have a Room Name", null);
    return res.status(400).send(response);
  } else if (
    roomReq.password === null ||
    roomReq.password === undefined ||
    roomReq.password === ""
  ) {
    let response = new Response(false, "Must have a Password", null);
    return res.status(400).send(response);
  } else {
    RoomRecord.findOne({ roomName: roomReq.roomName }).then((record) => {
      if (record) {
        if (record.password == "" || record.password == null) {
          let response = new Response(true, null, true);
          return res.status(200).send(response);
        } else {
          bcrypt.compare(roomReq.password, record.password, function (
            err,
            result
          ) {
            if (result) {
              let response = new Response(true, null, result);
              return res.status(200).send(response);
            } else {
              let response = new Response(
                false,
                "Incorrect Room Password",
                null
              );
              return res.status(200).send(response);
            }
          });
        }
      } else {
        let response = new Response(
          false,
          "A room with that name was not found",
          null
        );
        return res.status(400).send(response);
      }
    });
  }
};

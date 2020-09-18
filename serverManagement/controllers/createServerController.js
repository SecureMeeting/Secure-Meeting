const moment = require("moment");

const ServerRecord = require("../models/ServerRecord");
const { Response } = require("../models/Response");

exports.createServer = async (req, res, next) => {
  const serverReq = {
    country: req.body.country,
    region: req.body.region,
    ip: req.body.ip,
    type: req.body.type,
    timeCreated: moment().format(),
  };

  var newServerRecord = new ServerRecord(serverReq);

  if (req.body == null || req.body == undefined) {
    let response = new Response(false, "Must have a Server Ip", null);
    res.status(400).send(response);
  } else if (
    serverReq.ip === null ||
    serverReq.ip === undefined ||
    serverReq.ip === ""
  ) {
    let response = new Response(false, "Must have a Server Ip", null);
    res.status(400).send(response);
  } else {
    await ServerRecord.findOne({ ip: serverReq.ip })
      .then((record) => {
        if (record) {
          let response = new Response(
            false,
            "Server with that Ip already exists",
            null
          );
          res.status(400).send(response);
        } else {
          newServerRecord
            .save()
            .then(() => {
              let response = new Response(true, null, serverReq);
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

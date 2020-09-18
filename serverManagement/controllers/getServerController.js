const ServerRecord = require("../models/ServerRecord");
const { Response } = require("../models/Response");

exports.getServer = async (req, res) => {
  const serverReq = {
    ip: req.body.ip,
  };

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
          let response = new Response(true, null, record);
          res.status(200).send(response);
        } else {
          let response = new Response(
            false,
            "A server with that ip was not found",
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

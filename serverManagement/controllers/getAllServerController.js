const moment = require("moment");
const bcrypt = require("bcrypt");

const ServerRecord = require("../models/ServerRecord");
const { Response } = require("../models/Response");
const config = require("../config.json");

exports.getAllServers = async (req, res) => {
  await ServerRecord.find({})
    .then((records) => {
      if (records) {
        let response = new Response(true, null, records);
        res.status(200).send(response);
      } else {
        let response = new Response(false, "No servers were found", null);
        res.status(400).send(response);
      }
    })
    .catch(() => {
      let response = new Response(false, "An error occured", null);
      res.status(400).send(response);
    });
};

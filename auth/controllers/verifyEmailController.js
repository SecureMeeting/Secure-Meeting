const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRecord = require("../models/UserRecord");
const { Response } = require("../models/Response");
const config = require("../config.json");
const { v4: uuidv4 } = require("uuid");

/**
 * Checks if a users login is correct
 * @param code email of the users
 * @returns {Response}
 */
exports.verifyEmail = async (req, res) => {
  var code = req.body.code;

  //checks for null and empty values
  if (code === null || code === undefined || code === "") {
    let response = new Response(false, "Must have an code", null);
    res.status(200).send(response);
  } else {
    await UserRecord.findOne({ emailVerification: code })
      .then((record) => {
        if (record) {
          record.emailedIsVerified = true;
          record
            .save()
            .then(() => {
              let response = new Response(true, null, true);
              res.status(200).send(response);
            })
            .catch((err) => {
              let response = new Response(false, "An error occured", null);
              res.status(400).send(response);
            });
        } else {
          let response = new Response(false, "Code not found", null);
          res.status(400).send(response);
        }
      })
      .catch((err) => {
        let response = new Response(false, "An error occured", null);
        res.status(400).send(response);
      });
  }
};

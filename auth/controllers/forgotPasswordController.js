const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRecord = require("../models/UserRecord");
const { Response } = require("../models/Response");
const config = require("../config.json");
const { v4: uuidv4 } = require("uuid");

/**
 * Checks if a users login is correct
 * @param email email of the users
 * @returns {Response}
 */
exports.forgotPassword = async (req, res) => {
  var email = req.body.email;

  if (email) {
    email = email.toLowerCase();
  }

  //checks for null and empty values
  if (email === null || email === undefined || email === "") {
    let response = new Response(false, "Must have an email", null);
    res.status(200).send(response);
  } else {
    await UserRecord.findOne({ email: email })
      .then((record) => {
        if (record) {
          let code = uuidv4();
          let time = moment().format();
          record.resetPassword = code;
          record.resetPasswordCodeTime = time;
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
          let response = new Response(
            false,
            "Unable to find the account.",
            null
          );
          res.status(400).send(response);
        }
      })
      .catch((err) => {
        let response = new Response(false, "An error occured", null);
        res.status(400).send(response);
      });
  }
};

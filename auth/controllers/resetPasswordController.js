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
exports.resetPassword = async (req, res) => {
  var code = req.body.code;
  var password = req.body.password;

  //checks for null and empty values
  if (code === null || code === undefined || code === "") {
    let response = new Response(false, "Must have an code", null);
    res.status(200).send(response);
  } else if (password === null || password === undefined || password === "") {
    let response = new Response(false, "Must have an password", null);
    res.status(200).send(response);
  } else {
    await UserRecord.findOne({ resetPassword: code })
      .then((record) => {
        if (record) {
          //check if code expired
          let time = moment(record.resetPasswordCodeTime);
          let timeNow = moment();
          var diffInDays = timeNow.diff(time, "days");

          if (diffInDays <= 1) {
            bcrypt.hash(
              password,
              parseInt(process.env.SALT_ROUNDS),
              async function (err, hashPassword) {
                if (!err) {
                  //checks if its the same password
                  bcrypt.compare(
                    password,
                    record.password,
                    function (err, result) {
                      if (err) {
                        let response = new Response(
                          false,
                          "An error occured",
                          null
                        );
                        res.status(400).send(response);
                      } else {
                        if (result) {
                          let response = new Response(
                            true,
                            "The new password must be different then the last",
                            false
                          );
                          res.status(200).send(response);
                        } else {
                          record.password = hashPassword;
                          record.resetPassword = null;
                          record.resetPasswordCodeTime = null;
                          record
                            .save()
                            .then(() => {
                              let response = new Response(true, null, true);
                              res.status(200).send(response);
                            })
                            .catch((err) => {
                              let response = new Response(
                                false,
                                "An error occured",
                                null
                              );
                              res.status(400).send(response);
                            });
                        }
                      }
                    }
                  );
                } else {
                  let response = new Response(false, "An error occured", null);
                  res.status(400).send(response);
                }
              }
            );
          } else {
            let response = new Response(true, "The link has expired", false);
            res.status(200).send(response);
          }
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

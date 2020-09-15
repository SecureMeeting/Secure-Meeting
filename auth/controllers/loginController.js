const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserRecord = require("../models/UserRecord");
const { Response } = require("../models/Response");
const config = require("../config.json");

/**
 * Checks if a users login is correct
 * @param email email of the users
 * @param googleid google id of the user
 * @param password password of the user
 * @returns {UserRecord} the record of the user
 */
exports.login = async (req, res) => {
  const email = req.body.email;
  const googleId = req.body.googleId;
  const password = req.body.password;

  if (googleId) {
    //google login
    await UserRecord.findOne({ googleId: googleId, email: email })
      .then((record) => {
        if (record) {
          jwt.sign({ record }, secretKey, { expiresIn: "1d" }, (err, token) => {
            let response = new Response(true, null, record);
            response.token = token;
            res.send(response);
          });
        } else {
          let response = new Response(
            false,
            "Unable to find the account.",
            null
          );
          res.send(response);
        }
      })
      .catch(() => {
        let response = new Response(false, "An error occured", null);
        res.send(response);
      });
  } else {
    await UserRecord.findOne({ email: email })
      .then((record) => {
        if (record.isGmail) {
          let response = new Response(false, "Please log in with google", null);
          res.send(response);
        } else {
          bcrypt.compare(password, record.password, function (err, result) {
            if (err) {
              let response = new Response(false, "An error occured", null);
              res.send(response);
            }
            if (result) {
              jwt.sign(
                { record },
                secretKey,
                { expiresIn: "1d" },
                (err, token) => {
                  let response = new Response(true, null, record);
                  response.token = token;
                  res.send(response);
                }
              );
            } else {
              let response = new Response(false, "Incorrect password", null);
              res.send(response);
            }
          });
        }
      })
      .catch(() => {
        let response = new Response(false, "Unable to find the account.", null);
        res.send(response);
      });
  }
};

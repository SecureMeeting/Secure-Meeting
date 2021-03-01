const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRecord = require("../models/UserRecord");
const { Response } = require("../models/Response");
const config = require("../config.json");
const { v4 } = require("uuid");

/**
 * Checks if a users login is correct
 * @param email email of the users
 * @param googleid google id of the user
 * @param password password of the user
 * @returns {UserRecord} the record of the user
 */
exports.login = async (req, res) => {
  var email = req.body.email;
  const googleId = req.body.googleId;
  const password = req.body.password;
  const stayLoggedIn = req.body.stayLoggedIn;

  if (email) {
    email = email.toLowerCase();
  }

  //checks for null and empty values
  if (email === null || email === undefined || email === "") {
    let response = new Response(false, "Must have an email", null);
    res.status(200).send(response);
  } else if (password === null || password === undefined || password === "") {
    let response = new Response(false, "Must have a password", null);
    res.status(200).send(response);
  } else {
    if (googleId) {
      //google login
      await UserRecord.findOne({ googleId: googleId, email: email })
        .then((record) => {
          if (record) {
            jwt.sign(
              { record },
              process.env.SECRET_KEY,
              { expiresIn: "1d" },
              (err, token) => {
                if (err) {
                  let response = new Response(false, "An error occured", null);
                  res.status(400).send(response);
                } else {
                  let response = new Response(true, null, record);
                  response.token = token;
                  res.status(200).send(response);
                }
              }
            );
          } else {
            let response = new Response(
              false,
              "Unable to find the account.",
              null
            );
            res.status(400).send(response);
          }
        })
        .catch(() => {
          let response = new Response(false, "An error occured", null);
          res.status(400).send(response);
        });
    } else {
      await UserRecord.findOne({ email: email })
        .then((record) => {
          if (record.isGmail) {
            let response = new Response(
              false,
              "Please log in with google",
              null
            );
            res.status(200).send(response);
          } else {
            bcrypt.compare(password, record.password, function (err, result) {
              if (err) {
                let response = new Response(false, "An error occured", null);
                res.status(400).send(response);
              }
              if (result) {
                jwt.sign(
                  { record },
                  process.env.SECRET_KEY,
                  { expiresIn: "1d" },
                  (err, token) => {
                    if (err) {
                      let response = new Response(
                        false,
                        "An error occured",
                        null
                      );
                      res.status(400).send(response);
                    } else {
                      //express session
                      if (stayLoggedIn === true) {
                        req.session.user = record._id;
                      }
                      let response = new Response(true, null, record);
                      response.token = token;
                      res.status(200).send(response);
                    }
                  }
                );
              } else {
                let response = new Response(false, "Incorrect password", null);
                res.status(200).send(response);
              }
            });
          }
        })
        .catch(() => {
          let response = new Response(
            false,
            "Unable to find the account.",
            null
          );
          res.status(200).send(response);
        });
    }
  }
};

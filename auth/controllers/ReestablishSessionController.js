const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRecord = require("../models/UserRecord");
const { Response } = require("../models/Response");
const config = require("../config.json");

exports.reestablishSession = async (req, res) => {
  //if theres a session
  if (req.session.user) {
    await UserRecord.findOne({ _id: req.session.user })
      .then((record) => {
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
      })
      .catch((err) => {
        let response = new Response(false, "An error occured", null);
        res.status(400).send(response);
      });
  } else {
    let response = new Response(true, null, { auth: false });
    res.status(200).send(response);
  }
};

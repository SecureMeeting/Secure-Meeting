const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRecord = require("../models/UserRecord");
const { Response } = require("../models/Response");
const config = require("../config.json");

exports.signout = async (req, res) => {
  //check if theres a session
  if (req.session) {
    req.session.destroy();
    let response = new Response(true, null, { auth: false });
    res.status(200).send(response);
  } else {
    let response = new Response(true, null, { auth: false });
    res.status(200).send(response);
  }
};

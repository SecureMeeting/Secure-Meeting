var nodemailer = require("nodemailer");
const { Response } = require("../models/Response");

/**
 * Checks if a users login is correct
 * @param email email of the user
 * @param firstName
 * @param lastName
 * @param code
 * @returns {Response}
 */
exports.verifyEmail = async (req, res) => {
  var email = req.body.email;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var code = req.body.code;
  let domain = "";

  if (process.env.NODE_ENV === "production") {
    domain = "https://www.securemeeting.org/verifyEmail/";
  } else {
    domain = "http://localhost:3000/verifyEmail/";
  }

  if (email) {
    email = email.toLowerCase();
  }

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Verify Your Email",
    text:
      "Thank you " +
      firstName +
      " " +
      lastName +
      " for signing up! Click this link to verify your email." +
      domain +
      code,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      let response = new Response(false, "An error occured", null);
      res.status(400).send(response);
    } else {
      let response = new Response(true, null, true);
      console.log("sent email to ", email);
      res.status(200).send(response);
    }
  });
};

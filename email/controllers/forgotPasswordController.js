var nodemailer = require("nodemailer");
const { Response } = require("../models/Response");

/**
 * Checks if a users login is correct
 * @param email email of the user
 * @param code
 * @returns {Response}
 */
exports.forgotPassword = async (req, res) => {
  var email = req.body.email;
  var code = req.body.code;

  let domain = "";
  if (process.env.NODE_ENV === "production") {
    domain = "https://www.securemeeting.org/resetPassword/";
  } else {
    domain = "http://localhost:3000/resetPassword/";
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
    subject: "Reset Your Password",
    text:
      "No need to worry, you can reset your Secure Meeting password by clicking the link below:" +
      domain +
      code,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      let response = new Response(false, "An error occured", null);
      res.status(400).send(response);
    } else {
      let response = new Response(true, null, true);
      res.status(200).send(response);
    }
  });
};

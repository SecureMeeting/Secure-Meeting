const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const UserRecord = require("../models/UserRecord");
const { Response } = require("../models/Response");
const config = require("../config.json");

/**
 * Creates an account in MongoDB
 * @param email email of the users
 * @param firstName
 * @param lastName
 * @param googleid google id of the user
 * @param password password of the user
 * @returns {UserRecord} the record of the user
 */
exports.signup = async (req, res) => {
  var email = req.body.email;
  const password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  const googleId = req.body.googleId;
  const profilePic = req.body.profilePic;
  const rooms = [];
  const emailedIsVerified = false;
  const emailVerification = uuidv4();
  const friends = [];
  const inviteCode = makeid(6);
  const invitedUsers = [];
  const friendRequests = [];
  const timeCreated = moment().format();

  //formats user input
  if (email) {
    email = email.trim().toLowerCase();
  }

  if (firstName) {
    firstName = firstName.trim().toLowerCase();
  }

  if (lastName) {
    lastName = lastName.trim().toLowerCase();
  }

  //checks for null and empty values
  if (email === null || email === undefined || email === "") {
    let response = new Response(false, "Must have an email", null);
    res.status(400).send(response);
  } else if (password === null || password === undefined || password === "") {
    let response = new Response(false, "Must have a password", null);
    res.status(400).send(response);
  } else {
    //creates the account
    bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS),
      async function (err, hashPassword) {
        if (!err) {
          const newUser = {
            email: email,
            password: hashPassword,
            firstName: firstName,
            lastName: lastName,
            googleId: googleId,
            profilePic: profilePic,
            rooms: rooms,
            emailedIsVerified: emailedIsVerified,
            emailVerification: emailVerification,
            friends: friends,
            friendRequests: friendRequests,
            timeCreated: timeCreated,
            inviteCode: inviteCode,
            invitedUsers: invitedUsers,
          };

          if (googleId) {
            newUser.emailedIsVerified = true;
          }

          var newUserRecord = new UserRecord(newUser);

          await UserRecord.findOne({ email: email })
            .then((record) => {
              if (record) {
                let response = new Response(
                  false,
                  "An account with this email already exists",
                  null
                );
                res.status(400).send(response);
              } else {
                newUserRecord
                  .save()
                  .then(() => {
                    let response = new Response(true, null, newUser);
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
                          response.token = token;
                          res.status(200).send(response);
                        }
                      }
                    );
                  })
                  .catch(() => {
                    let response = new Response(
                      false,
                      "An error occured",
                      null
                    );
                    res.status(400).send(response);
                  });
              }
            })
            .catch(() => {
              let response = new Response(false, "An error occured", null);
              res.status(400).send(response);
            });
        } else {
          let response = new Response(false, "An error occured", null);
          res.status(400).send(response);
        }
      }
    );
  }
};

/**
 * Creates a random string
 * @param length the length of the id
 * @returns {String} the randomly generated Id
 */
function makeid(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const googleId = req.body.googleId;
  const profilePic = req.body.profilePic;
  const rooms = [];
  const emailedIsVerified = false;
  const emailVerification = uuid();
  const friends = [];
  const inviteCode = makeid(6);
  const invitedUsers = [];
  const friendRequests = [];
  const timeCreated = moment().format();

  let hashPassword = "";
  if (password === null) {
    password = "";
  }
  bcrypt.hash(password, saltRounds, async function (err, hash) {
    hashPassword = hash;
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
      waitList: waitlist,
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
          let response = new Response(false, "Account Exists", null);
          res.send(response);
        } else {
          newUserRecord
            .save()
            .then(() => {
              let response = new Response(true, null, newUser);
              emailHandler.verifyEmail(email, emailVerification);
              jwt.sign(
                { record },
                secretKey,
                { expiresIn: "1d" },
                (err, token) => {
                  response.token = token;
                  res.send(response);
                }
              );
            })
            .catch(() => {
              let response = new Response(false, "An error occured", null);
              res.send(response);
            });
        }
      })
      .catch(() => {
        let response = new Response(false, "An error occured", null);
        res.send(response);
      });
  });
};

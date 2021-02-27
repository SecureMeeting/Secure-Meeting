const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema
const UserRecordSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      required: false,
    },
    profilePic: {
      type: String,
      required: false,
    },
    waitList: {
      type: String,
      required: false,
    },
    rooms: [
      {
        type: String,
        required: true,
      },
    ],
    emailedIsVerified: {
      type: Boolean,
      required: false,
    },
    emailVerification: {
      type: String,
      required: false,
    },
    inviteCode: {
      type: String,
      required: true,
    },
    resetPassword: {
      type: String,
      required: false,
    },
    friends: [
      {
        type: String,
        required: true,
      },
    ],
    invitedUsers: [
      {
        type: String,
        required: true,
      },
    ],
    friendRequests: [
      {
        type: String,
        required: true,
      },
    ],
    timeCreated: {
      type: String,
      required: true,
    },
  },
  { collection: "Users" }
);

module.exports = mongoose.model("UserRecord", UserRecordSchema);

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
      required: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      required: false,
    },
    profilePic: {
      type: String,
      required: false,
    },
    rooms: [
      {
        type: String,
        required: false,
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
      required: false,
    },
    resetPassword: {
      type: String,
      required: false,
    },
    resetPasswordCodeTime: {
      type: String,
      required: false,
    },
    friends: [
      {
        type: String,
        required: false,
      },
    ],
    invitedUsers: [
      {
        type: String,
        required: false,
      },
    ],
    friendRequests: [
      {
        type: String,
        required: false,
      },
    ],
    timeCreated: {
      type: String,
      required: true,
    },
  },
  { collection: process.env.COLLECTION_NAME }
);

module.exports = mongoose.model("UserRecord", UserRecordSchema);

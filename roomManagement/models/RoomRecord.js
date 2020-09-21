const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("../config");
//create schema
const RoomRecordSchema = new Schema(
  {
    roomName: {
      type: String,
      required: true,
    },
    timeCreated: {
      type: String,
      required: true,
    },
    scheduledTime: {
      type: String,
      required: false,
    },
    createdBy: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    members: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { collection: process.env.COLLECTION_NAME }
);

module.exports = mongoose.model("RoomRecord", RoomRecordSchema);

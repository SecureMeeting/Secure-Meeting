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
        required: true,
      },
    ],
  },
  { collection: config.collectionName }
);

module.exports = mongoose.model("RoomRecord", RoomRecordSchema);

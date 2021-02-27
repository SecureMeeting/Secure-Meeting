const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    inviteId: {
      type: String,
      required: true,
    },
    members: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { collection: "Room" }
);

module.exports = mongoose.model("RoomRecord", RoomRecordSchema);

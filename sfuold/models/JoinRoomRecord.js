const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema
const JoinRoomRecordSchema = new Schema(
    {
        roomName: {
            type: String,
            required: true,
        },
        timeCreated: {
            type: String,
            required: true,
        },
    },
    { collection: "JoinRoom" }
);

module.exports = mongoose.model("JoinedRoom", JoinRoomRecordSchema);

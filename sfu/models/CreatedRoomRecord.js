const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema
const CreatedRoomRecordSchema = new Schema(
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
    { collection: "CreatedRoom" }
);

module.exports = mongoose.model("CreatedRoom", CreatedRoomRecordSchema);

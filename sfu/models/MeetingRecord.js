const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema
const MeetingRecordSchema = new Schema(
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
        meetingTime: {
            type: String,
            required: true,
        },
        expiredTime: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: false,
        },
        hostCode: {
            type: String,
            required: true,
        },
        members: [
            {
                type: String,
                required: true
            }
        ],
    },
    { collection: "Meeting" }
);

module.exports = mongoose.model("Meeting", MeetingRecordSchema);

const moment = require("moment")
//Local imports-----------------------------------------
const CreatedRoomRecord = require("../models/CreatedRoomRecord");
const JoinRoomRecord = require("../models/JoinRoomRecord");
const config = require('../config');

function logCreateRoom(roomName) {
    try {
        if (config.domain != "localhost") {
            let roomRecordObject = {
                roomName: roomName,
                timeCreated: moment().format()
            }
            var newCreatedRoomRecord = CreatedRoomRecord(roomRecordObject)
            newCreatedRoomRecord.save()
        }
    }
    catch (err) {
        console.error(err);
    }
}

function logJoinRoom(roomName) {
    try {
        if (config.domain != "localhost") {
            let roomRecordObject = {
                roomName: roomName,
                timeCreated: moment().format()
            }
            var newCreatedRoomRecord = JoinRoomRecord(roomRecordObject)
            newCreatedRoomRecord.save()
        }
    }
    catch (err) {
        console.error(err);
    }
}

module.exports = { logCreateRoom, logJoinRoom }
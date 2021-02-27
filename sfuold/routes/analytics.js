const express = require("express");
const router = express.Router();
const moment = require("moment")
//Local imports-----------------------------------------
const CreatedRoomRecord = require("../models/CreatedRoomRecord");
const JoinRoomRecord = require("../models/JoinRoomRecord");
const middleware = require("../src/middleware")

router.route("/createRoom/lastWeekCount").get(middleware.verifyIp, async (req, res) => {
    CreatedRoomRecord.find({})
        .then((records) => {
            let count = 0;
            for (var i = 0; i < records.length; i++) {
                if (isWithinAWeek(moment(records[i].timeCreated))) {
                    count++;
                }
            }
            res.json(count);
        })
        .catch((err) => {
            console.error(err)
        })
});

router.route("/joinRoom/lastWeekCount").get(middleware.verifyIp, async (req, res) => {
    JoinRoomRecord.find({})
        .then((records) => {
            let count = 0;
            for (var i = 0; i < records.length; i++) {
                if (isWithinAWeek(moment(records[i].timeCreated))) {
                    count++;
                }
            }
            res.json(count);
        })
        .catch((err) => {
            console.error(err)
        })
});



router.route("/createRoom/lastWeek").get(middleware.verifyIp, async (req, res) => {
    CreatedRoomRecord.find({})
        .then((records) => {
            let lastWeekRecords = [];
            for (var i = 0; i < records.length; i++) {
                if (isWithinAWeek(moment(records[i].timeCreated))) {
                    lastWeekRecords.push(records[i]);
                }
            }
            res.json(lastWeekRecords);
        })
        .catch((err) => {
            console.error(err)
        })
});

router.route("/joinRoom/lastWeek").get(middleware.verifyIp, async (req, res) => {
    JoinRoomRecord.find({})
        .then((records) => {
            let lastWeekRecords = [];
            for (var i = 0; i < records.length; i++) {
                if (isWithinAWeek(moment(records[i].timeCreated))) {
                    lastWeekRecords.push(records[i]);
                }
            }
            res.json(lastWeekRecords);
        })
        .catch((err) => {
            console.error(err)
        })
});

router.route("/createRoom/mostPopular").get(middleware.verifyIp, async (req, res) => {
    CreatedRoomRecord.find({})
        .then((records) => {
            let differentRooms = [];
            let counter = [];
            //get unique rooms and their count
            for (var i = 0; i < records.length; i++) {
                var searchIndex = -1;
                for (var m = 0; m < differentRooms.length; m++) {
                    if (records[i].roomName === differentRooms[m]) {
                        searchIndex = m;
                        break;
                    }
                }
                if (searchIndex !== -1) {
                    let oldValue = counter[searchIndex]
                    counter[searchIndex] = oldValue + 1;
                } else {
                    differentRooms.push(records[i].roomName);
                    counter.push(1);
                }
            }

            //build json
            let jsonArray = [];
            for (var i = 0; i < differentRooms.length; i++) {
                jsonArray.push({ room: differentRooms[i], count: counter[i] })
            }

            //sort
            jsonArray.sort(function (a, b) { return a.count - b.count });
            jsonArray.reverse();

            res.json(jsonArray)
        })
        .catch((err) => {
            console.error(err)
        })
});

router.route("/joinRoom/mostPopular").get(middleware.verifyIp, async (req, res) => {

    JoinRoomRecord.find({})
        .then((records) => {
            let differentRooms = [];
            let counter = [];
            //get unique rooms and their count
            for (var i = 0; i < records.length; i++) {
                var searchIndex = -1;
                for (var m = 0; m < differentRooms.length; m++) {
                    if (records[i].roomName === differentRooms[m]) {
                        searchIndex = m;
                        break;
                    }
                }
                if (searchIndex !== -1) {
                    let oldValue = counter[searchIndex]
                    counter[searchIndex] = oldValue + 1;
                } else {
                    differentRooms.push(records[i].roomName);
                    counter.push(1);
                }
            }

            //build json
            let jsonArray = [];
            for (var i = 0; i < differentRooms.length; i++) {
                jsonArray.push({ room: differentRooms[i], count: counter[i] })
            }

            //sort
            jsonArray.sort(function (a, b) { return a.count - b.count });
            jsonArray.reverse();

            res.json(jsonArray)
        })
        .catch((err) => {
            console.error(err)
        })
});

router.route("/createRoom/getAll").get(middleware.verifyIp, async (req, res) => {
    CreatedRoomRecord.find({})
        .then((records) => {
            res.json(records)
        })
        .catch((err) => {
            console.error(err)
        })
});

router.route("/joinRoom/getAll").get(middleware.verifyIp, async (req, res) => {
    JoinRoomRecord.find({})
        .then((records) => {
            res.json(records)
        })
        .catch((err) => {
            console.error(err)
        })
});

function isWithinAWeek(momentDate) {
    return momentDate.isAfter(moment().clone().subtract(7, 'days').startOf('day'));
}

module.exports = router;

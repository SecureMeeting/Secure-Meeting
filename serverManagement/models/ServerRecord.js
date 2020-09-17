const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("../config");
//create schema
const ServerRecordSchema = new Schema(
  {
    country: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    timeCreated: {
      type: String,
      required: false,
    },
  },
  { collection: config.collectionName }
);

module.exports = mongoose.model("ServerRecord", ServerRecordSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
  { collection: process.env.COLLECTION_NAME }
);

module.exports = mongoose.model("ServerRecord", ServerRecordSchema);

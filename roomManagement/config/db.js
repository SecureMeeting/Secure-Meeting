const mongoose = require("mongoose");
const config = require("../config.json");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.atlasuri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log(
      `MongoDB connected: ${conn.connection.host}`.green.underline.bold
    );
  } catch (err) {
    console.log(`Error: ${err.message}`.red);
    process.exit(1);
  }
};

module.exports = connectDB;

const mongoose = require("mongoose");
const colors = require("colors");

async function connectDB() {
  try {

    const conn = await mongoose.connect("mongodb+srv://admin:admin@cluster0-vyxuq.mongodb.net/Analytics?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log(
      `MongoDB connected: ${conn.connection.host}`.blue.underline.bold
    );

  } catch (err) {
    console.log(`Error: ${err.message}`.red);
    //console.log(`Error: ${err.message}`.red);
    process.exit(1);
  }
};

module.exports = connectDB;

const express = require("express");
const cors = require("cors");
var http = require("http");
var fs = require("fs");
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const config = require("./config.json");

console.log("---------------------------------------");
console.log(`Starting up the ${"ROOM MANAGEMENT API"}`.blue.bold);
console.log("---------------------------------------");
/* ------------------------ Connect to Mongo Database ----------------------- */
connectDB();

/* ----------------------- Configure Express Server ----------------------- */
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

const tls = {
  cert: fs.readFileSync(config.tls.cert),
  key: fs.readFileSync(config.tls.key),
};

http.createServer(app).listen(PORT, function () {
  console.log(`HTTPS Server running on port ${PORT}`.yellow.bold);
});
/* -------------------------------------------------------------------------- */
/*                               Api ROUTES                                   */
/* -------------------------------------------------------------------------- */

app.post("/", function (req, res) {
  res.send("Successfully hit the room managegment api!");
  console.log("yeah");
});

app.post("/room", function (req, res) {
  res.send("Successfully hit the room managegment api!");
});

const roomRouter = require("./routes/room");
app.use("/room", roomRouter);

module.exports = {
  app,
};

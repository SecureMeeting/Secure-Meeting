const express = require("express");
const cors = require("cors");
var https = require("https");
var fs = require("fs");
const colors = require("colors");
const connectDB = require("./config/db");
const config = require("./config.json");

/* ------------------------ Connect to Mongo Database ----------------------- */
connectDB();

/* ----------------------- Configure Express Server ----------------------- */
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || config.port;

const tls = {
  cert: fs.readFileSync(config.tls.cert),
  key: fs.readFileSync(config.tls.key),
};

https.createServer(tls, app).listen(config.port, function () {
  console.log(`HTTPS Server running on port ${PORT}`.yellow.bold);
});

/* -------------------------------------------------------------------------- */
/*                               Api ROUTES                                   */
/* -------------------------------------------------------------------------- */

app.get("/", function (req, res) {
  res.send("Hello World!");
});

const roomRouter = require("./routes/room");
app.use("/room", roomRouter);

module.exports = {
  app,
};

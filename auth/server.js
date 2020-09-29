const express = require("express");
const cors = require("cors");
var https = require("https");
var fs = require("fs");
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const config = require("./config.json");

/* ------------------------ Connect to Mongo Database ----------------------- */
connectDB();

/* ----------------------- Configure Express Server ----------------------- */
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;

const tls = {
  cert: fs.readFileSync(config.tls.cert),
  key: fs.readFileSync(config.tls.key),
};

const requestListener = function (req, res) {
  res.writeHead(200);
  res.send("Successfully hit the authentication api!");
};

https.createServer(tls, app, requestListener).listen(PORT, function () {
  console.log(`HTTPS Server running on port ${PORT}`.yellow.bold);
});

/* -------------------------------------------------------------------------- */
/*                               Api ROUTES                                   */
/* -------------------------------------------------------------------------- */

app.post("/auth", function (req, res) {
  res.send("Successfully hit the authentication api!");
});

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

module.exports = {
  app,
};

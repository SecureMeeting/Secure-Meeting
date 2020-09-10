const express = require("express");
const cors = require("cors");
var server = require("http").Server();
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
app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold));

/* -------------------------------------------------------------------------- */
/*                               Api ROUTES                                   */
/* -------------------------------------------------------------------------- */

const roomRouter = require("./routes/room");
app.use("/room", roomRouter);

module.exports = {
  app,
};

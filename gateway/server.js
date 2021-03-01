const express = require("express");
const cors = require("cors");
var http = require("http");
const colors = require("colors");
const dotenv = require("dotenv").config();
var bodyParser = require("body-parser");
var router = require("./routes/router");
const axios = require("axios");

const PORT = process.env.PORT;

console.log("----------------------------------------");
console.log("|  API Gateway Microservice is running  |");
console.log("----------------------------------------");
console.log("Environment: ", process.env.NODE_ENV);
console.log("Running on port:", PORT);

/* ----------------------- Configure Express Server ----------------------- */
const app = express();
app.use(cors());

app.use(express.json());

http.createServer(app).listen(PORT, function () {});

/* -------------------------------------------------------------------------- */
/*                               Api ROUTES                                   */
/* -------------------------------------------------------------------------- */

app.get("/", function (req, res) {
  res.send("Successfully hit the gateway api!");
});

app.use(router);

/* -------------------------------------------------------------------------- */
/*                               Ping Servers                                 */
/* -------------------------------------------------------------------------- */

init();

async function init() {
  const auth = process.env.AUTH_URL;
  const email = process.env.EMAIL_URL;
  const p2p = process.env.P2P_URL;
  const pay = process.env.PAY_URL;
  const sfu = process.env.SFU_URL;
  const syncable = process.env.SYNCABLE_URL;

  console.log("----------------------------------------");
  console.log("|   Testing Microservice Connections   |");
  console.log("----------------------------------------");

  //auth service
  await axios
    .get(auth)
    .then((res) => {
      console.log(`Authentication Microservice Online!`.green.bold);
    })
    .catch((e) => {
      console.log(`Authentication Microservice Offline`.red.bold);
    });
  //email service
  await axios
    .get(email)
    .then((res) => {
      console.log(`Email Microservice Online!`.green.bold);
    })
    .catch((e) => {
      console.log(`Email Microservice Offline!`.red.bold);
    });
  //p2p service
  await axios
    .get(p2p)
    .then((res) => {
      console.log(`P2P Microservice Online!`.green.bold);
    })
    .catch((e) => {
      console.log(`P2P Microservice Offline!`.red.bold);
    });
  //pay service
  await axios
    .get(pay)
    .then((res) => {
      console.log(`Payment Microservice Online!`.green.bold);
    })
    .catch((e) => {
      console.log(`Payment Microservice Offline!`.red.bold);
    });
  //sfu service
  await axios
    .get(sfu)
    .then((res) => {
      console.log(`SFU Microservice Online!`.green.bold);
    })
    .catch((e) => {
      console.log(`SFU Microservice Offline!`.red.bold);
    });
  //syncable service
  await axios
    .get(syncable)
    .then((res) => {
      console.log(`Syncable Microservice Online!`.green.bold);
    })
    .catch((e) => {
      console.log(`Syncable Microservice Offline!`.red.bold);
    });
}

module.exports = {
  app,
};

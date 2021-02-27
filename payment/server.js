const express = require("express");
const cors = require("cors");
var http = require("http");
const colors = require("colors");
const dotenv = require("dotenv").config();

const PORT = process.env.PORT;

console.log("-------------------------------------");
console.log("|  Payment Microservice is running  |");
console.log("-------------------------------------");
console.log("Environment: ", process.env.NODE_ENV);
console.log("Running on port:", PORT);

/* ----------------------- Configure Express Server ----------------------- */
const app = express();
app.use(cors());

app.use(express.json());

http.createServer(app).listen(PORT, function () {
  console.log(`HTTP Server running on port ${PORT}`.yellow.bold);
});

/* -------------------------------------------------------------------------- */
/*                               Api ROUTES                                   */
/* -------------------------------------------------------------------------- */

app.get("/", function (req, res) {
  res.send("Successfully hit the payment api!");
});

const paymentRouter = require("./routes/pay");
app.use("/pay", paymentRouter);

module.exports = {
  app,
};

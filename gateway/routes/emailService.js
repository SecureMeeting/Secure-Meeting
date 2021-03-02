var express = require("express");
var router = express.Router();
const apiAdapter = require("./apiAdapter");

const BASE_URL = process.env.EMAIL_URL;
const api = apiAdapter(BASE_URL);

//forgotPassword endpoint
router.post("/email/forgotPassword", (req, res) => {
  api.post(req.path, req.body).then((resp) => {
    res.send(resp.data);
  });
});

//verifyEmail endpoint
router.post("/email/verifyEmail", (req, res) => {
  api.post(req.path, req.body).then((resp) => {
    res.send(resp.data);
  });
});

module.exports = router;

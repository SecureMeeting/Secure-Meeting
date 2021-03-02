var express = require("express");
var router = express.Router();
const apiAdapter = require("./apiAdapter");

const BASE_URL = process.env.AUTH_URL;
const api = apiAdapter(BASE_URL);

//login endpoint
router.post("/auth/login", (req, res) => {
  api.post(req.path, req.body).then((resp) => {
    res.send(resp.data);
  });
});

//signup endpoint
router.post("/auth/signup", (req, res) => {
  api.post(req.path, req.body).then((resp) => {
    res.send(resp.data);
  });
});

//signout endpoint
router.get("/auth/signout", (req, res) => {
  api.get(req.path).then((resp) => {
    res.send(resp.data);
  });
});

//isSignedIn endpoint
router.post("/auth/isSignedIn", (req, res) => {
  api.post(req.path, req.body).then((resp) => {
    res.send(resp.data);
  });
});

//reestablishSession endpoint
router.get("/auth/reestablishSession", (req, res) => {
  api.get(req.path).then((resp) => {
    res.send(resp.data);
  });
});

//verifyEmail endpoint
router.get("/auth/verifyEmail", (req, res) => {
  api.get(req.path).then((resp) => {
    res.send(resp.data);
  });
});

//resetPassword endpoint
router.post("/auth/resetPassword", (req, res) => {
  api.post(req.path, req.body).then((resp) => {
    res.send(resp.data);
  });
});

//forgotPassword endpoint
router.post("/auth/forgotPassword", (req, res) => {
  api.post(req.path, req.body).then((resp) => {
    res.send(resp.data);
  });
});

module.exports = router;

const config = require("../config");

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(403).send("Invalid authorization token");
  }
}

function verifyIp(req, res, next) {
  var ip =
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let ips = config.https.allowedIps;
  let isValidIp = false;
  for (var i = 0; i < ips.length; i++) {
    if (ip.indexOf(ips[i]) != -1) {
      isValidIp = true;
      break;
    }
  }
  if (isValidIp) {
    next();
  } else {
    res.status(403).send("Invalid ip address");
  }
}

module.exports = { verifyToken, verifyIp };

const ServerRecord = require("../models/ServerRecord");

const { Response, ClientSignalRequest } = require("../models/Response");
var ip2location = require("ip-to-location");

//Takes in
//Device type

//ip - gained from the request
//browser
//deviceType
//Operating system
exports.DefaultRoute = async (req, res) => {
  var ip =
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tempIp = "98.109.117.5";

  let locationData = await ip2location.fetch(tempIp);

  console.log(locationData);
  //get countries
  let servers = await getServers();

  let filteredServers = servers.filter((server) => {
    return server.country === locationData.country_code;
  });

  console.log(filteredServers);

  res.send("yeah");
};

async function getServers() {
  return await ServerRecord.find({})
    .then((records) => {
      if (records) {
        return records;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

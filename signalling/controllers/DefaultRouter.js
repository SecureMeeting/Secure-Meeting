const ServerRecord = require("../models/ServerRecord");

const { Response, ClientSignalRequest } = require("../models/Response");
var ip2location = require("ip-to-location");


let usWest = ["California", "Oregon", "Washington", "Nevada", "Idaho", "Utah", "Arizona", "Montana", "Alaska", "Hawaii"]
let usEast = ["Michigan", "Indiana", "Kentucky", "Tennessee", "Alabama", "Ohio", "Georgia", "Florida", "South Carolina", "North Carolina", "Virginia", "West Virginia", "Delaware", "Maryland", "New Jersey", "Pennsylvania", "New York", "Connecticut", "Rhode Island", "Massachusetts", "Vermont", "New Hampshire", "Maine"]
let usCentral = ["Wyoming", "Colorado", "New Mexico", "North Dakota", "South Dakota", "Nebraska", "Kansas", "Oklahoma", "Texas", "Minnesota", "Iowa", "Missouri", "Arkansas", "Louisiana", "Wisconsin", "Illinois", "Mississippi"]

exports.DefaultRoute = async (req, res) => {
  var ip = getRequesterIp(req)
  let locationData = await ip2location.fetch(ip);

  console.log(locationData);

  let servers = await getServers();

  let filteredServers = filterCountry(servers, locationData)

  res.json(filteredServers);
};

function getServersByRegionUS(servers, region){
  servers.filter((server) =>{
    return server.region.toLowerCase().indexOf(region.toLowerCase()) != -1
  })
  return servers;
}

function getRegionUS(region_name){
  let res = "ERROR"
  if(usWest.indexOf(region_name) != -1){
    res = "west"
  }
  else if(usEast.indexOf(region_name) != -1){
    res = "east"
  }
  else if(usCentral.indexOf(region_name) != -1){
    res = "central"
  }

  return res;
}

function filterCountry(servers, locationData){
  var servers = servers.filter((server) => {
    return server.country === locationData.country_code;
  });

  if(locationData.country_code === "US"){
      let regionOfUser = getRegionUS(locationData.region_name)

      let filteredServers =  getServersByRegionUS(servers, regionOfUser)
      return filteredServers;
  }
  return null
}

function getRequesterIp(req){
    return "98.109.117.5";
    return req.ip ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
}

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

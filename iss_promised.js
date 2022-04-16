const request = require("request-promise-native");

const fetchMyIP = function() {
  // requests the IP address from an API and returns it as a promise from request-promis-native
  return request("https://api.ipify.org?format=json");
};
// Receives that IP address in the body parameter parses it to a string and uses that IP
//address to request from another API the GPS coordinates of that IP
const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  // requests the GPScoordinates and returns them as a promise from request-promis-native
  return request(`https://freegeoip.app/json/${ip}`);
};
//Receives the GPS coordinates through the body parameter. Parses and stores them in a var to be used
//in another API to fetch the fly over times
const fetchISSFlyOverTimes = function(body) {
  const { longitude, latitude } = JSON.parse(body);
  const url = `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  // requests the rise times and duration and returns them as a promise from request-promis-native
  return request(url);
    
};

//Function return promise for fly over information of users location after all other checks have cleared
const nextISSTimesForMyLocation = function() {
  //  return promises for each stage of request
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    // response is the array containing the ristetimes and duration times for the passing satellite
    .then((msg) => {
      const { response } = JSON.parse(msg);
      return response;
    });

};
module.exports = { nextISSTimesForMyLocation };
  

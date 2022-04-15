const request = require("request");

/*
 Function makes a single API request to retrieve the user's IP address
 This request is a function with 2 parameters. The API request and a call back function.
 This callback function has 3 arguments. an error a response and a body.
 We can callback on all of these arguments. 
 */
const fetchMyIP = function(callback) {
  request("https://api.ipify.org?format=json", (error, response, body) => {
    //pass through the error to the callback if an error occurs when requesting the IP data
    if (error) return callback(error, null);

    // error can be set if invalid domain, user is offline, etc.
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`),null);
      return;
    }

    //parse and extract the IP address using JSON and then pass that through to the callback
    //(as the second argument) if there is no error
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

/*
 Function uses the IP address to make an API request to retrieve the user's latitude and 
 logitude coordinates.
 This request is a function with 2 parameters. The API request and a call back function.
 This callback function has 3 arguments. an error a response and a body.
 We can callback on all of these arguments. 
 */

const fetchCoordsByIP = function(ip, callback) {
  let url = `https://api.freegeoip.app/json/${ip}?apikey=102737b0-bc71-11ec-824c-9b14f21a47e7`;
  request(url, (error, response, body) => {
    //pass through the error to the callback if an error occurs when requesting the coordinate data
    if (error) {
      callback(error, null);
      return;
    }
      

    // error can be set if invalid domain, user is offline, etc.
    if (response.statusCode !== 200) {
      const message = (`Status Code ${response.statusCode} when fetching Cordinates: ${body}`);
      callback(Error(message),null);
      return;
    }

    //parse(turn into string) and extract the coordinates from the body of the data using JSON and 
    //then pass that through to the callback as an object
    //(as the second argument) if there is no error
    const latitude = JSON.parse(body).latitude;
    const longitude = JSON.parse(body).longitude;
    const coords = { latitude, longitude };
    
    callback(null, coords);
  });
};

/*
 Function uses the coordinates to make an API request to retrieve the risetime and duration 
 of the sttelite at the user's  latitude and logitude coordinates.
 This request is a function with 2 parameters. The API request and a call back function.
 This callback function has 3 arguments. an error a response and a body.
 We can callback on all of these arguments. 
 */

const fetchISSFlyOverTimes = function({latitude, longitude}, callback) { 
  
  const url = `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  request(url, (error, response, body) => {
    //pass through the error to the callback if an error occurs when requesting the rise time and duration
    if (error) {
      callback(error, null);
      return;
    }
    // error can be set if invalid domain, user is offline, etc.
    if (response.statusCode !== 200) {
      const message = `Status Code ${response.statusCode} when fetching fly over passes ${body}`;
      callback(Error(message), null);
      return;
    }
    //parse(turn into string) and extract the risetime and duration passes response from the body of the data 
    //using JSON and then pass that through to the callback as an object
    //(as the second argument) if there is no error
    const passes = JSON.parse(body).response;

    callback(null, { passes });
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 

const nextISSTimesForMyLocation = function (callback) {

  //Call fetchMyIP first. If error return the callback with the error.
  //Otherwise move to next stage of code
 fetchMyIP((error, ip) => {
   if (error) {
     return callback(error, null);
   }

   //Call fetchCoordsByIP. If error return the callback with the error.
   //Otherwise move to next stage of code
   fetchCoordsByIP(ip, (error, location) => {
     if (error) {
       return callback(error, null);
     }

     //Call fetchISSFlyOverTimes. If error return the callback with the error.
     fetchISSFlyOverTimes(location, (error, nextPasses) => {
       if (error) {
         return callback(error, null);
        }
        
       //Otherwise everything is good return the times of the next passes.
       callback(null, nextPasses.passes);
     });
   });
 }); 
};
    


module.exports = { nextISSTimesForMyLocation };


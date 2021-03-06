
const { nextISSTimesForMyLocation } = require("./iss");

const printPassTimes = function (passTimes) {

  for (const pass of passTimes) {
    //Date var set to a new instance of new Date class
    const datetime = new Date(0);
    // setUTCSeconds method applied to the rise time value of that date GIVING US AN OFFICIAL TIME STAMP 
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
  
};
nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});
module.exports = {printPassTimes}

// const coords = { latitude: 51.0038, longitude: -118.1838 };
// const fetchFlyOverTimesCallback = (error, passTimes) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log("It worked! Return times", passTimes);
// };

// fetchISSFlyOverTimes(coords, (fetchFlyOverTimesCallback));


// // const ip = "206.116.43.212"
// // const fetchCoordsByIpCallback = (error,data) => {
// //   console.log(error);
// //   console.log(data);
// // }

// fetchCoordsByIP(ip, fetchCoordsByIpCallback);

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log("It worked! Returned IP:", ip);
// });

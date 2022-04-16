const {nextISSTimesForMyLocation}  = require("./iss_promised");
const { printPassTimes } = require("./index");

//printPassTimes is required from index.js to print the pass times with the date stamp
nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  //.catch is used for error handling with promises
  .catch((error) => {
    console.log("ERROR: It didn't work", error.message);
  });
    


module.exports = { nextISSTimesForMyLocation };
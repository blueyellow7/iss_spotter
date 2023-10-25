const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`https://ipwho.is/${ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  const lat = JSON.parse(body).latitude;
  const long = JSON.parse(body).longitude;
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${lat}&lon=${long}`);
};


/* Input for nextISSTimesForMyLocation: None, since 'https://api.ipify.org?format=json' returns ip of your current location
 * Output for nextISSTimesForMyLocation: Promise for 'iss fly over' data for users location
*/

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };

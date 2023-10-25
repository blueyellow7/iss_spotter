/* Purpose of file - contains most of the logic for fetching the data from each API endpoint.
  * fetchMyIP: uses ipfy's API to get the public ip address of your own computer 
  * fetchCoordsByIP: uses ipwho's API to get the latitude/longitude coordinates of an ip address
  * fetchISSFlyOverTimes: uses iss-flyover's API to get ISS fly over times of a given latitude/longitude
*/


const request = require('request');

const fetchMyIP = function (callback) { 
    request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    } 

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    ip = JSON.parse(body).ip;
    callback(null, ip); 
  });
}


const fetchCoordsByIP = function (ip, callback) { 
  request(`https://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    } 

    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const msg = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(msg), null);
      return;
    }

    coordinates = { 'latitude': `${parsedBody.latitude}`, 'longitude': `${parsedBody.longitude}` };
    callback(null, coordinates); 
  });
};


const fetchISSFlyOverTimes = function(object, callback) {
  const lat = object.latitude
  const lon = object.longitude
  request(`https://iss-flyover.herokuapp.com/json/?lat=${lat}&lon=${lon}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    } 

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching fly over times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const parsedBody = JSON.parse(body);
    flyOverTimes = parsedBody.response;
    callback(null, flyOverTimes); 

  });
};


/*
 * Chains multiple API requests to determine ISS fly overs for user's current location.
 * Input:
 *   - A callback with an error or results
 * 
 * Returns (via Callback):
 *   - An error (otherwise NULL)
 *   - The fly-over times as an array (otherwise NULL):
 *     
 */ 

const nextISSTimesForLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForLocation };



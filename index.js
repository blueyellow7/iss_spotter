// Purpose of file: to require and run our main function, and contains the callback

const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');


fetchMyIP( /*callback*/ (error, ip) => {
  if (error) {
    console.log('It didnt work!' , error);
    return;
  }
  console.log('It worked! Returned IP:', ip);
});

fetchCoordsByIP('184.148.119.187', (error, coord) => {
  if (error) {
    console.log('It didnt work!', error);
    return;
  }
  console.log('It worked! Returned coordinates: ', coord);
});

fetchISSFlyOverTimes({ latitude: '42.9921579', longitude: '-79.2482555' }, (error, result) => {
  if (error) {
    console.log('It didnt work!', error);
    return;
  }
  console.log('It worked! Returned the following ISS fly over times: ', result);
});



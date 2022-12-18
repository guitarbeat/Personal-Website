// Set up the server-side application

const express = require('express');
const request = require('request');

const app = express();

app.get('/current-track', (req, res) => {
  // Use the client ID and client secret to request an access token
  request.post({
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'client_credentials',
      client_id: 'Y62df080863994e8ab5c90b6c01f33257',
      client_secret: '9d4aeabb0c2442f68b75d8a2f71cbd42'
    },
    json: true
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // Use the access token to get the current user's recently played tracks
      request.get({
        url: 'https://api.spotify.com/v1/me/player/recently-played',
        headers: {
          'Authorization': 'Bearer ' + body.access_token
        },
        json: true
      }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          // Get the current track from the list of recently played tracks
          const currentTrack = body.items[0].track;
          res.send(currentTrack);
        }
      });
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});


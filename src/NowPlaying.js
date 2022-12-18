import "./sass/main.scss";
// import moment from "moment";
import { useState, useEffect } from "react";
import axios from "axios";
import "./NowPlaying.scss";


function NowPlaying() {
  const [currentTrack, setCurrentTrack] = useState({});

  useEffect(() => {
    // Make HTTP request to Spotify API to retrieve current track data
    axios
      .get("https://api.spotify.com/v1/me/player/currently-playing")
      .then((response) => {
        // Update currentTrack state with data from API response
        setCurrentTrack(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      {/* Display current track information */}
      <p>Now Playing: {currentTrack.name} by {currentTrack.artists[0].name}</p>
    </div>
  );
}

export default NowPlaying;

import React, { useState } from 'react';
import KpopSharing from './KpopSharing';
import { shareKpopSong, validateSongData } from '../../../utils/kpopSharingUtils';

const KpopSharingDemo = () => {
  const [demoSongs] = useState([
    {
      id: '1',
      title: 'Dynamite',
      artist: 'BTS',
      version: 'original'
    },
    {
      id: '2', 
      title: 'Dynamite',
      artist: 'BTS',
      version: 'boy-group'
    },
    {
      id: '3',
      title: 'How You Like That',
      artist: 'BLACKPINK',
      version: 'original'
    },
    {
      id: '4',
      title: 'How You Like That',
      artist: 'BLACKPINK',
      version: 'girl-group'
    },
    {
      id: '5',
      title: 'Boy With Luv',
      artist: 'BTS',
      version: 'bg'
    }
  ]);

  const [selectedSong, setSelectedSong] = useState(demoSongs[0]);
  const [shareResult, setShareResult] = useState(null);

  const handleShare = async (shareData) => {
    console.log('Share data:', shareData);
    
    // Validate the song data
    const validation = validateSongData(shareData);
    if (!validation.isValid) {
      console.error('Invalid song data:', validation.errors);
      return;
    }

    // Perform the share action
    const result = await shareKpopSong(shareData, {
      useWebShare: true,
      openInNewTab: false
    });

    setShareResult(result);
  };

  return (
    <div className="kpop-sharing-demo">
      <div className="kpop-sharing-demo__header">
        <h2>K-pop Song Sharing Demo</h2>
        <p>Try sharing different versions of K-pop songs. Boy group versions will redirect to kpop.alw.lol/bg</p>
      </div>

      <div className="kpop-sharing-demo__controls">
        <label htmlFor="song-select">Select a song to share:</label>
        <select
          id="song-select"
          value={selectedSong.id}
          onChange={(e) => {
            const song = demoSongs.find(s => s.id === e.target.value);
            setSelectedSong(song);
            setShareResult(null);
          }}
        >
          {demoSongs.map(song => (
            <option key={song.id} value={song.id}>
              {song.title} - {song.artist} ({song.version})
            </option>
          ))}
        </select>
      </div>

      <div className="kpop-sharing-demo__component">
        <KpopSharing
          songTitle={selectedSong.title}
          artist={selectedSong.artist}
          version={selectedSong.version}
          songId={selectedSong.id}
          onShare={handleShare}
        />
      </div>

      {shareResult && (
        <div className="kpop-sharing-demo__result">
          <h3>Share Result:</h3>
          <div className={`result ${shareResult.success ? 'success' : 'error'}`}>
            <p><strong>Status:</strong> {shareResult.success ? 'Success' : 'Failed'}</p>
            <p><strong>Method:</strong> {shareResult.method || 'Unknown'}</p>
            {shareResult.url && (
              <p><strong>URL:</strong> <a href={shareResult.url} target="_blank" rel="noopener noreferrer">{shareResult.url}</a></p>
            )}
            {shareResult.error && (
              <p><strong>Error:</strong> {shareResult.error}</p>
            )}
          </div>
        </div>
      )}

      <div className="kpop-sharing-demo__info">
        <h3>How it works:</h3>
        <ul>
          <li><strong>Original versions:</strong> Share to kpop.alw.lol</li>
          <li><strong>Boy group versions:</strong> Automatically redirect to kpop.alw.lol/bg</li>
          <li><strong>Girl group versions:</strong> Redirect to kpop.alw.lol/gg</li>
          <li><strong>Web Share API:</strong> Uses native sharing if available</li>
          <li><strong>Fallback:</strong> Copies URL to clipboard</li>
        </ul>
      </div>
    </div>
  );
};

export default KpopSharingDemo;
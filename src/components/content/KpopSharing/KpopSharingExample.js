import React, { useState } from 'react';
import KpopSharing from './KpopSharing';
import { shareKpopSong, redirectToKpopUrl } from '../../../utils/kpopSharingUtils';

/**
 * Example component showing how to integrate K-pop sharing functionality
 * This demonstrates the key feature: boy group versions redirect to kpop.alw.lol/bg
 */
const KpopSharingExample = () => {
  const [songs] = useState([
    {
      id: '1',
      title: 'Dynamite',
      artist: 'BTS',
      version: 'original',
      description: 'Original version - shares to kpop.alw.lol'
    },
    {
      id: '2',
      title: 'Dynamite',
      artist: 'BTS',
      version: 'boy-group',
      description: 'Boy group version - redirects to kpop.alw.lol/bg'
    },
    {
      id: '3',
      title: 'How You Like That',
      artist: 'BLACKPINK',
      version: 'girl-group',
      description: 'Girl group version - redirects to kpop.alw.lol/gg'
    },
    {
      id: '4',
      title: 'Boy With Luv',
      artist: 'BTS',
      version: 'bg',
      description: 'BG version (short form) - redirects to kpop.alw.lol/bg'
    }
  ]);

  const [selectedSong, setSelectedSong] = useState(songs[0]);
  const [lastShareResult, setLastShareResult] = useState(null);

  const handleShare = async (shareData) => {
    console.log('Sharing song:', shareData);
    
    // This is where the magic happens - boy group versions automatically
    // get redirected to kpop.alw.lol/bg
    const result = await shareKpopSong(shareData);
    setLastShareResult(result);
    
    if (result.success) {
      console.log('Share successful! URL:', result.url);
      
      // Show which URL was generated based on the version type
      if (shareData.isBoyGroupVersion) {
        console.log('✅ Boy group version detected - redirected to kpop.alw.lol/bg');
      } else if (shareData.version === 'girl-group') {
        console.log('✅ Girl group version detected - redirected to kpop.alw.lol/gg');
      } else {
        console.log('✅ Original version - shared to kpop.alw.lol');
      }
    }
  };

  const handleDirectRedirect = () => {
    // Alternative method: direct redirect without sharing
    redirectToKpopUrl(selectedSong, true); // true = open in new tab
  };

  return (
    <div className="kpop-sharing-example">
      <div className="kpop-sharing-example__header">
        <h2>K-pop Song Sharing Integration</h2>
        <p>
          This example demonstrates how boy group versions automatically redirect to{' '}
          <code>kpop.alw.lol/bg</code> when shared.
        </p>
      </div>

      <div className="kpop-sharing-example__song-list">
        <h3>Available Songs:</h3>
        <div className="song-grid">
          {songs.map(song => (
            <div
              key={song.id}
              className={`song-card ${selectedSong.id === song.id ? 'selected' : ''}`}
              onClick={() => setSelectedSong(song)}
            >
              <h4>{song.title}</h4>
              <p>{song.artist}</p>
              <span className={`version-badge ${song.version}`}>
                {song.version}
              </span>
              <p className="description">{song.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="kpop-sharing-example__component">
        <h3>Share Component:</h3>
        <KpopSharing
          songTitle={selectedSong.title}
          artist={selectedSong.artist}
          version={selectedSong.version}
          songId={selectedSong.id}
          onShare={handleShare}
        />
      </div>

      <div className="kpop-sharing-example__actions">
        <h3>Alternative Actions:</h3>
        <button
          className="direct-redirect-btn"
          onClick={handleDirectRedirect}
        >
          Direct Redirect to K-pop URL
        </button>
      </div>

      {lastShareResult && (
        <div className="kpop-sharing-example__result">
          <h3>Last Share Result:</h3>
          <div className={`result ${lastShareResult.success ? 'success' : 'error'}`}>
            <p><strong>Status:</strong> {lastShareResult.success ? 'Success' : 'Failed'}</p>
            <p><strong>Method:</strong> {lastShareResult.method}</p>
            {lastShareResult.url && (
              <p><strong>Generated URL:</strong> <a href={lastShareResult.url} target="_blank" rel="noopener noreferrer">{lastShareResult.url}</a></p>
            )}
            {lastShareResult.error && (
              <p><strong>Error:</strong> {lastShareResult.error}</p>
            )}
          </div>
        </div>
      )}

      <div className="kpop-sharing-example__documentation">
        <h3>Implementation Notes:</h3>
        <ul>
          <li>
            <strong>Boy Group Detection:</strong> Versions containing "boy", "boys", "bg", "male", etc. 
            automatically redirect to <code>kpop.alw.lol/bg</code>
          </li>
          <li>
            <strong>Girl Group Detection:</strong> Versions containing "girl", "girls", "gg", "female", etc. 
            redirect to <code>kpop.alw.lol/gg</code>
          </li>
          <li>
            <strong>Original Versions:</strong> All other versions share to the base URL <code>kpop.alw.lol</code>
          </li>
          <li>
            <strong>Web Share API:</strong> Uses native sharing when available, falls back to clipboard copy
          </li>
        </ul>
      </div>
    </div>
  );
};

export default KpopSharingExample;
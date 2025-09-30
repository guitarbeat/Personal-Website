import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './kpopSharing.scss';

const KpopSharing = ({ 
  songTitle, 
  artist, 
  version = 'original', 
  songId,
  onShare 
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Determine if this is a boy group version
  const isBoyGroupVersion = version === 'boy-group' || version === 'bg' || 
    (artist && artist.toLowerCase().includes('boy'));

  // Generate the appropriate share URL
  const generateShareUrl = useCallback(() => {
    const baseUrl = isBoyGroupVersion ? 'https://kpop.alw.lol/bg' : 'https://kpop.alw.lol';
    const params = new URLSearchParams({
      song: songTitle || '',
      artist: artist || '',
      id: songId || '',
      version: version || 'original'
    });
    
    return `${baseUrl}?${params.toString()}`;
  }, [songTitle, artist, songId, version, isBoyGroupVersion]);

  // Handle share action
  const handleShare = useCallback(async () => {
    setIsSharing(true);
    
    try {
      const url = generateShareUrl();
      setShareUrl(url);

      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: `${songTitle} - ${artist}`,
          text: `Check out this K-pop song: ${songTitle} by ${artist}`,
          url: url
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url);
        alert('Share URL copied to clipboard!');
      }

      // Call the onShare callback if provided
      if (onShare) {
        onShare({
          songTitle,
          artist,
          version,
          songId,
          shareUrl: url,
          isBoyGroupVersion
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share. Please try again.');
    } finally {
      setIsSharing(false);
    }
  }, [generateShareUrl, songTitle, artist, version, songId, onShare]);

  // Handle direct navigation to boy group version
  const handleBoyGroupRedirect = useCallback(() => {
    if (isBoyGroupVersion) {
      window.open('https://kpop.alw.lol/bg', '_blank');
    }
  }, [isBoyGroupVersion]);

  return (
    <div className="kpop-sharing">
      <div className="kpop-sharing__info">
        <h3 className="kpop-sharing__title">{songTitle}</h3>
        <p className="kpop-sharing__artist">{artist}</p>
        {version && (
          <span className={`kpop-sharing__version ${isBoyGroupVersion ? 'boy-group' : ''}`}>
            {version === 'boy-group' ? 'Boy Group Version' : version}
          </span>
        )}
      </div>

      <div className="kpop-sharing__actions">
        <button
          className="kpop-sharing__share-btn"
          onClick={handleShare}
          disabled={isSharing}
        >
          {isSharing ? 'Sharing...' : 'Share Song'}
        </button>

        {isBoyGroupVersion && (
          <button
            className="kpop-sharing__bg-btn"
            onClick={handleBoyGroupRedirect}
          >
            Go to Boy Group Version
          </button>
        )}
      </div>

      {shareUrl && (
        <div className="kpop-sharing__url">
          <label>Share URL:</label>
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="kpop-sharing__url-input"
          />
          <button
            className="kpop-sharing__copy-btn"
            onClick={() => navigator.clipboard.writeText(shareUrl)}
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

KpopSharing.propTypes = {
  songTitle: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  version: PropTypes.oneOf(['original', 'boy-group', 'bg', 'girl-group', 'gg']),
  songId: PropTypes.string,
  onShare: PropTypes.func
};

export default KpopSharing;
import React from 'react';

const AudioControls = ({
  audioStatus,
  isAudioMuted,
  audioVolume,
  onVolumeChange,
  onMuteToggle
}) => {
  return (
    <div className="audio-controls">
      <div className="audio-status">
        <span className={`status-indicator ${audioStatus}`}>
          {audioStatus === 'loading' && '⏳'}
          {audioStatus === 'playing' && '🎵'}
          {audioStatus === 'error' && '⚠️'}
          {audioStatus === 'stopped' && '⏹️'}
        </span>
        <span className="status-text">
          {audioStatus === 'loading' && 'Loading...'}
          {audioStatus === 'playing' && 'Magic Word Audio'}
          {audioStatus === 'error' && 'Audio Unavailable'}
          {audioStatus === 'stopped' && 'Stopped'}
        </span>
      </div>
      <button
        type="button"
        className={`audio-mute-btn ${isAudioMuted ? 'muted' : ''}`}
        onClick={onMuteToggle}
        aria-label={isAudioMuted ? 'Unmute audio' : 'Mute audio'}
        disabled={audioStatus !== 'playing'}
      >
        {isAudioMuted ? '🔇' : '🔊'}
      </button>
      <div className="volume-control">
        <label htmlFor="volume-slider" className="volume-label">
          Volume
        </label>
        <input
          id="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isAudioMuted ? 0 : audioVolume}
          onChange={onVolumeChange}
          className="volume-slider"
          disabled={isAudioMuted || audioStatus !== 'playing'}
        />
        <span className="volume-value">
          {Math.round((isAudioMuted ? 0 : audioVolume) * 100)}%
        </span>
      </div>
    </div>
  );
};

export default AudioControls;
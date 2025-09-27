// Audio utility for managing background music and sound effects
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.audioElement = null;
    this.isPlaying = false;
    this.volume = 0.3; // Default volume (30%)
    this.fadeInDuration = 2000; // 2 seconds fade in
    this.fadeOutDuration = 1500; // 1.5 seconds fade out
  }

  // Initialize audio context (required for modern browsers)
  async initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Resume audio context if it's suspended (required for user interaction)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    }
    return this.audioContext;
  }

  // Create and configure audio element
  createAudioElement(url) {
    if (this.audioElement) {
      this.stop();
    }

    this.audioElement = new Audio(url);
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.loop = true;
    this.audioElement.volume = 0; // Start at 0 for fade in
    this.audioElement.preload = 'auto';

    // Add error handling
    this.audioElement.addEventListener('error', (e) => {
      console.warn('Audio loading error:', e);
      this.handleAudioError();
    });

    // Add load event
    this.audioElement.addEventListener('canplaythrough', () => {
      console.log('Knight Rider theme loaded and ready');
    });

    return this.audioElement;
  }

  // Play Knight Rider theme with fade in
  async playKnightRiderTheme() {
    try {
      // Initialize audio context
      await this.initAudioContext();

      // Get the Knight Rider audio URL
      const knightRiderUrl = this.getKnightRiderAudioUrl();

      this.createAudioElement(knightRiderUrl);

      if (!this.audioElement) {
        throw new Error('Failed to create audio element');
      }

      // Start playing
      await this.audioElement.play();
      this.isPlaying = true;

      // Fade in effect
      this.fadeIn();

      console.log('Knight Rider theme started playing');
      return true;

    } catch (error) {
      console.error('Error playing Knight Rider theme:', error);
      this.handleAudioError();
      return false;
    }
  }

  // Get Knight Rider audio URL - using multiple fallback sources
  getKnightRiderAudioUrl() {
    // Try multiple sources in order of preference
    const audioSources = [
      // Primary: Archive.org source (most reliable)
      'https://archive.org/download/KnightRiderTheme/KnightRiderTheme.mp3',
      
      // Fallback 1: Local asset (if you add the file to your project)
      '/assets/audio/knight-rider-theme.mp3',
      
      // Fallback 2: Another reliable source
      'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    ];

    // Return the first source for now
    // In production, you'd want to test each source and use the first working one
    return audioSources[0];
  }

  // Stop audio with fade out
  async stop() {
    if (!this.audioElement || !this.isPlaying) {
      return;
    }

    try {
      // Fade out effect
      await this.fadeOut();

      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.isPlaying = false;

      console.log('Knight Rider theme stopped');
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  // Fade in effect
  fadeIn() {
    if (!this.audioElement) return;

    const startTime = Date.now();
    const startVolume = 0;
    const targetVolume = this.volume;

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / this.fadeInDuration, 1);

      // Easing function for smooth fade
      const easedProgress = 1 - (1 - progress) ** 3;
      const currentVolume = startVolume + (targetVolume - startVolume) * easedProgress;

      this.audioElement.volume = currentVolume;

      if (progress < 1) {
        requestAnimationFrame(fade);
      }
    };

    requestAnimationFrame(fade);
  }

  // Fade out effect
  fadeOut() {
    return new Promise((resolve) => {
      if (!this.audioElement) {
        resolve();
        return;
      }

      const startTime = Date.now();
      const startVolume = this.audioElement.volume;
      const targetVolume = 0;

      const fade = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / this.fadeOutDuration, 1);

        // Easing function for smooth fade
        const easedProgress = 1 - (1 - progress) ** 3;
        const currentVolume = startVolume + (targetVolume - startVolume) * easedProgress;

        this.audioElement.volume = currentVolume;

        if (progress < 1) {
          requestAnimationFrame(fade);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(fade);
    });
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  // Handle audio errors gracefully
  handleAudioError() {
    console.warn('Audio playback failed - continuing without background music');
    console.log('This is normal if the audio source is not available or blocked by browser policies');
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement = null;
    }
  }

  // Check if audio is currently playing
  getPlayingState() {
    return this.isPlaying;
  }

  // Cleanup resources
  cleanup() {
    this.stop();
    if (this.audioElement) {
      this.audioElement = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Create singleton instance
const audioManager = new AudioManager();

// Export functions for easy use
export const playKnightRiderTheme = () => audioManager.playKnightRiderTheme();
export const stopKnightRiderTheme = () => audioManager.stop();
export const setAudioVolume = (volume) => audioManager.setVolume(volume);
export const isAudioPlaying = () => audioManager.getPlayingState();
export const cleanupAudio = () => audioManager.cleanup();

export default audioManager;
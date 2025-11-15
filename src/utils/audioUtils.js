import { AUDIO_SOURCES } from "./constants";
// Audio utility for managing background music and sound effects
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.audioElement = null;
    this.bufferSource = null; // For synthetic audio
    this.gainNode = null; // For volume control of synthetic audio
    this.isPlaying = false;
    this.volume = 0.3; // Default volume (30%)
    this.fadeInDuration = 2000; // 2 seconds fade in
    this.fadeOutDuration = 1500; // 1.5 seconds fade out
  }

  // Initialize audio context (required for modern browsers)
  async initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Resume audio context if it's suspended (required for user interaction)
      if (this.audioContext.state === "suspended") {
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
    this.audioElement.crossOrigin = "anonymous";
    this.audioElement.loop = true;
    this.audioElement.volume = 0; // Start at 0 for fade in
    this.audioElement.preload = "auto";

    // Add error handling
    this.audioElement.addEventListener("error", (e) => {
      console.warn("Audio loading error:", e);
      this.handleAudioError();
    });

    // Add load event
    this.audioElement.addEventListener("canplaythrough", () => {
      console.log("Knight Rider theme loaded and ready");
    });

    return this.audioElement;
  }

  // Create synthetic Knight Rider theme using Web Audio API
  async createSyntheticKnightRiderTheme() {
    try {
      await this.initAudioContext();

      if (!this.audioContext) {
        throw new Error("AudioContext not available");
      }

      // Create a buffer for the synthetic theme (8 seconds loop)
      const sampleRate = this.audioContext.sampleRate;
      const duration = 8; // 8 seconds
      const buffer = this.audioContext.createBuffer(
        1,
        sampleRate * duration,
        sampleRate,
      );
      const channelData = buffer.getChannelData(0);

      // Generate the Knight Rider-style sweep effect
      for (let i = 0; i < buffer.length; i++) {
        const time = i / sampleRate;

        // Main sweep frequency oscillation (like the scanner light)
        const sweepFreq = 0.5; // Hz - speed of the sweep
        const sweepPhase = Math.sin(2 * Math.PI * sweepFreq * time);

        // Base frequency (around 200Hz - 800Hz range)
        const baseFreq = 400 + sweepPhase * 300;

        // Generate the main tone
        let sample = Math.sin(2 * Math.PI * baseFreq * time) * 0.3;

        // Add harmonic for richness
        sample += Math.sin(2 * Math.PI * baseFreq * 2 * time) * 0.1;
        sample += Math.sin(2 * Math.PI * baseFreq * 0.5 * time) * 0.2;

        // Add some filtering effect to make it sound more electronic
        const filterMod = Math.sin(2 * Math.PI * 2 * time) * 0.5 + 0.5;
        sample *= filterMod;

        // Apply envelope to create pulsing effect
        const pulseFreq = 4; // Hz
        const envelope = Math.sin(2 * Math.PI * pulseFreq * time) * 0.3 + 0.7;
        sample *= envelope;

        // Add some subtle noise for texture
        sample += (Math.random() - 0.5) * 0.02;

        channelData[i] = sample * 0.6; // Overall volume control
      }

      return buffer;
    } catch (error) {
      console.error("Error creating synthetic Knight Rider theme:", error);
      return null;
    }
  }

  // Play synthetic Knight Rider theme
  async playSyntheticKnightRiderTheme() {
    try {
      const audioBuffer = await this.createSyntheticKnightRiderTheme();

      if (!audioBuffer) {
        throw new Error("Failed to create synthetic audio");
      }

      // Stop any existing audio
      if (this.audioElement || this.bufferSource) {
        this.stop();
      }

      // Create buffer source
      this.bufferSource = this.audioContext.createBufferSource();
      this.bufferSource.buffer = audioBuffer;
      this.bufferSource.loop = true;

      // Create gain node for volume control and fading
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);

      // Connect the audio graph
      this.bufferSource.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      // Start playing
      this.bufferSource.start();
      this.isPlaying = true;

      // Fade in
      this.gainNode.gain.linearRampToValueAtTime(
        this.volume,
        this.audioContext.currentTime + this.fadeInDuration / 1000,
      );

      // Handle ended event
      this.bufferSource.onended = () => {
        if (this.isPlaying) {
          this.isPlaying = false;
        }
      };

      console.log("Synthetic Knight Rider theme started playing");
      return true;
    } catch (error) {
      console.error("Error playing synthetic Knight Rider theme:", error);
      this.handleAudioError();
      return false;
    }
  }

  // Play Knight Rider theme with fallback to synthetic version
  async playKnightRiderTheme() {
    try {
      // Initialize audio context
      await this.initAudioContext();

      console.log("Attempting to play Knight Rider theme...");

      // First, try to use a synthetic version (more reliable)
      const syntheticSuccess = await this.playSyntheticKnightRiderTheme();
      if (syntheticSuccess) {
        return true;
      }

      // If synthetic fails, try file-based approach as fallback
      console.log("Synthetic audio failed, trying file-based approach...");
      return await this.playKnightRiderThemeFromFile();
    } catch (error) {
      console.error("Error playing Knight Rider theme:", error);
      this.handleAudioError();
      return false;
    }
  }

  // Fallback method to try loading from file
  async playKnightRiderThemeFromFile() {
    try {
      // Get the Knight Rider audio URL
      const knightRiderUrl = this.getKnightRiderAudioUrl();
      this.createAudioElement(knightRiderUrl);

      if (!this.audioElement) {
        throw new Error("Failed to create audio element");
      }

      // Start playing
      await this.audioElement.play();
      this.isPlaying = true;

      // Fade in effect
      this.fadeIn();

      console.log("Knight Rider theme started playing from file");
      return true;
    } catch (error) {
      console.error("Error playing Knight Rider theme from file:", error);
      throw error;
    }
  }

  // Get Knight Rider audio URL - using multiple fallback sources
  getKnightRiderAudioUrl() {
    // Return the first source (local asset)
    return AUDIO_SOURCES[0];
  }

  // Stop audio with fade out
  async stop() {
    if (!this.isPlaying) {
      return;
    }

    try {
      this.isPlaying = false;

      // Handle buffer source (synthetic audio)
      if (this.bufferSource && this.gainNode) {
        // Fade out
        this.gainNode.gain.linearRampToValueAtTime(
          0,
          this.audioContext.currentTime + this.fadeOutDuration / 1000,
        );

        // Stop after fade out
        setTimeout(() => {
          if (this.bufferSource) {
            this.bufferSource.stop();
            this.bufferSource = null;
          }
          if (this.gainNode) {
            this.gainNode.disconnect();
            this.gainNode = null;
          }
        }, this.fadeOutDuration);
      }

      // Handle audio element (file-based audio)
      if (this.audioElement) {
        // Fade out effect
        await this.fadeOut();
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement = null;
      }

      console.log("Knight Rider theme stopped");
    } catch (error) {
      console.error("Error stopping audio:", error);
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
      const currentVolume =
        startVolume + (targetVolume - startVolume) * easedProgress;

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
        const currentVolume =
          startVolume + (targetVolume - startVolume) * easedProgress;

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

    // Update audio element volume if it exists
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }

    // Update gain node volume if it exists
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(
        this.volume,
        this.audioContext.currentTime,
      );
    }
  }

  // Handle audio errors gracefully
  handleAudioError() {
    console.warn("Audio playback failed - continuing without background music");
    console.log(
      "This is normal if the audio source is not available or blocked by browser policies",
    );
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

    if (this.bufferSource) {
      this.bufferSource = null;
    }

    if (this.gainNode) {
      this.gainNode = null;
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

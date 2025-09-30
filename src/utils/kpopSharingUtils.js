/**
 * Utility functions for K-pop song sharing functionality
 */

// Boy group identifiers
const BOY_GROUP_KEYWORDS = [
  'boy', 'boys', 'bg', 'male', 'men', 'guy', 'guys'
];

// Girl group identifiers  
const GIRL_GROUP_KEYWORDS = [
  'girl', 'girls', 'gg', 'female', 'women', 'lady', 'ladies'
];

/**
 * Determines if a song version is a boy group version
 * @param {string} version - The version string
 * @param {string} artist - The artist name
 * @returns {boolean} - True if it's a boy group version
 */
export const isBoyGroupVersion = (version, artist = '') => {
  const versionLower = (version || '').toLowerCase();
  const artistLower = (artist || '').toLowerCase();
  
  return BOY_GROUP_KEYWORDS.some(keyword => 
    versionLower.includes(keyword) || artistLower.includes(keyword)
  );
};

/**
 * Determines if a song version is a girl group version
 * @param {string} version - The version string
 * @param {string} artist - The artist name
 * @returns {boolean} - True if it's a girl group version
 */
export const isGirlGroupVersion = (version, artist = '') => {
  const versionLower = (version || '').toLowerCase();
  const artistLower = (artist || '').toLowerCase();
  
  return GIRL_GROUP_KEYWORDS.some(keyword => 
    versionLower.includes(keyword) || artistLower.includes(keyword)
  );
};

/**
 * Generates the appropriate share URL based on song type
 * @param {Object} songData - Song information
 * @param {string} songData.title - Song title
 * @param {string} songData.artist - Artist name
 * @param {string} songData.version - Version type
 * @param {string} songData.id - Song ID
 * @returns {string} - The share URL
 */
export const generateKpopShareUrl = (songData) => {
  const { title, artist, version, id } = songData;
  
  let baseUrl = 'https://kpop.alw.lol';
  
  // Determine the correct base URL based on version type
  if (isBoyGroupVersion(version, artist)) {
    baseUrl = 'https://kpop.alw.lol/bg';
  } else if (isGirlGroupVersion(version, artist)) {
    baseUrl = 'https://kpop.alw.lol/gg';
  }
  
  // Build query parameters
  const params = new URLSearchParams();
  
  if (title) params.append('song', title);
  if (artist) params.append('artist', artist);
  if (version) params.append('version', version);
  if (id) params.append('id', id);
  
  // Add timestamp for uniqueness
  params.append('t', Date.now().toString());
  
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Handles sharing a K-pop song with appropriate URL redirection
 * @param {Object} songData - Song information
 * @param {Object} options - Sharing options
 * @param {boolean} options.useWebShare - Whether to use Web Share API
 * @param {boolean} options.openInNewTab - Whether to open in new tab
 * @returns {Promise<Object>} - Sharing result
 */
export const shareKpopSong = async (songData, options = {}) => {
  const { useWebShare = true, openInNewTab = false } = options;
  
  try {
    const shareUrl = generateKpopShareUrl(songData);
    const shareText = `Check out this K-pop song: ${songData.title} by ${songData.artist}`;
    
    // Use Web Share API if available and requested
    if (useWebShare && navigator.share) {
      await navigator.share({
        title: `${songData.title} - ${songData.artist}`,
        text: shareText,
        url: shareUrl
      });
      
      return {
        success: true,
        method: 'web-share',
        url: shareUrl,
        songData
      };
    }
    
    // Fallback: copy to clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      
      return {
        success: true,
        method: 'clipboard',
        url: shareUrl,
        songData
      };
    }
    
    // Last resort: open in new tab if requested
    if (openInNewTab) {
      window.open(shareUrl, '_blank');
      
      return {
        success: true,
        method: 'new-tab',
        url: shareUrl,
        songData
      };
    }
    
    throw new Error('No sharing method available');
    
  } catch (error) {
    console.error('Error sharing K-pop song:', error);
    
    return {
      success: false,
      error: error.message,
      songData
    };
  }
};

/**
 * Redirects to the appropriate K-pop URL based on song type
 * @param {Object} songData - Song information
 * @param {boolean} openInNewTab - Whether to open in new tab
 */
export const redirectToKpopUrl = (songData, openInNewTab = false) => {
  const shareUrl = generateKpopShareUrl(songData);
  
  if (openInNewTab) {
    window.open(shareUrl, '_blank');
  } else {
    window.location.href = shareUrl;
  }
};

/**
 * Validates song data for sharing
 * @param {Object} songData - Song information to validate
 * @returns {Object} - Validation result
 */
export const validateSongData = (songData) => {
  const errors = [];
  
  if (!songData.title || songData.title.trim() === '') {
    errors.push('Song title is required');
  }
  
  if (!songData.artist || songData.artist.trim() === '') {
    errors.push('Artist name is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Gets the display name for a version type
 * @param {string} version - Version string
 * @returns {string} - Display name
 */
export const getVersionDisplayName = (version) => {
  const versionMap = {
    'boy-group': 'Boy Group Version',
    'bg': 'Boy Group Version',
    'girl-group': 'Girl Group Version',
    'gg': 'Girl Group Version',
    'original': 'Original Version',
    'remix': 'Remix Version',
    'acoustic': 'Acoustic Version',
    'live': 'Live Version'
  };
  
  return versionMap[version?.toLowerCase()] || version || 'Original Version';
};
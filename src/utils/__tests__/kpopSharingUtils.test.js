/**
 * Tests for K-pop sharing utilities
 */

import {
  isBoyGroupVersion,
  isGirlGroupVersion,
  generateKpopShareUrl,
  validateSongData,
  getVersionDisplayName
} from '../kpopSharingUtils';

describe('K-pop Sharing Utils', () => {
  describe('isBoyGroupVersion', () => {
    test('should detect boy group version by version string', () => {
      expect(isBoyGroupVersion('boy-group')).toBe(true);
      expect(isBoyGroupVersion('bg')).toBe(true);
      expect(isBoyGroupVersion('male')).toBe(true);
      expect(isBoyGroupVersion('boys')).toBe(true);
    });

    test('should detect boy group version by artist name', () => {
      expect(isBoyGroupVersion('original', 'Boy Group Name')).toBe(true);
      expect(isBoyGroupVersion('original', 'Some Boys')).toBe(true);
    });

    test('should not detect boy group version for regular versions', () => {
      expect(isBoyGroupVersion('original')).toBe(false);
      expect(isBoyGroupVersion('remix')).toBe(false);
      expect(isBoyGroupVersion('acoustic')).toBe(false);
    });

    test('should handle case insensitive matching', () => {
      expect(isBoyGroupVersion('BOY-GROUP')).toBe(true);
      expect(isBoyGroupVersion('original', 'BOY BAND')).toBe(true);
    });
  });

  describe('isGirlGroupVersion', () => {
    test('should detect girl group version by version string', () => {
      expect(isGirlGroupVersion('girl-group')).toBe(true);
      expect(isGirlGroupVersion('gg')).toBe(true);
      expect(isGirlGroupVersion('female')).toBe(true);
      expect(isGirlGroupVersion('girls')).toBe(true);
    });

    test('should detect girl group version by artist name', () => {
      expect(isGirlGroupVersion('original', 'Girl Group Name')).toBe(true);
      expect(isGirlGroupVersion('original', 'Some Girls')).toBe(true);
    });

    test('should not detect girl group version for regular versions', () => {
      expect(isGirlGroupVersion('original')).toBe(false);
      expect(isGirlGroupVersion('remix')).toBe(false);
    });
  });

  describe('generateKpopShareUrl', () => {
    test('should generate correct URL for boy group version', () => {
      const songData = {
        title: 'Dynamite',
        artist: 'BTS',
        version: 'boy-group',
        id: '123'
      };
      
      const url = generateKpopShareUrl(songData);
      expect(url).toContain('kpop.alw.lol/bg');
      expect(url).toContain('song=Dynamite');
      expect(url).toContain('artist=BTS');
      expect(url).toContain('version=boy-group');
      expect(url).toContain('id=123');
    });

    test('should generate correct URL for girl group version', () => {
      const songData = {
        title: 'How You Like That',
        artist: 'BLACKPINK',
        version: 'girl-group',
        id: '456'
      };
      
      const url = generateKpopShareUrl(songData);
      expect(url).toContain('kpop.alw.lol/gg');
      expect(url).toContain('song=How+You+Like+That');
      expect(url).toContain('artist=BLACKPINK');
    });

    test('should generate correct URL for original version', () => {
      const songData = {
        title: 'Dynamite',
        artist: 'BTS',
        version: 'original',
        id: '789'
      };
      
      const url = generateKpopShareUrl(songData);
      expect(url).toContain('kpop.alw.lol?');
      expect(url).not.toContain('/bg');
      expect(url).not.toContain('/gg');
    });

    test('should include timestamp for uniqueness', () => {
      const songData = {
        title: 'Test Song',
        artist: 'Test Artist',
        version: 'original'
      };
      
      const url1 = generateKpopShareUrl(songData);
      // Wait a bit to ensure different timestamps
      setTimeout(() => {
        const url2 = generateKpopShareUrl(songData);
        expect(url1).not.toBe(url2);
      }, 10);
    });
  });

  describe('validateSongData', () => {
    test('should validate correct song data', () => {
      const songData = {
        title: 'Dynamite',
        artist: 'BTS',
        version: 'original'
      };
      
      const result = validateSongData(songData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect missing title', () => {
      const songData = {
        artist: 'BTS',
        version: 'original'
      };
      
      const result = validateSongData(songData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Song title is required');
    });

    test('should detect missing artist', () => {
      const songData = {
        title: 'Dynamite',
        version: 'original'
      };
      
      const result = validateSongData(songData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Artist name is required');
    });

    test('should detect empty title', () => {
      const songData = {
        title: '   ',
        artist: 'BTS',
        version: 'original'
      };
      
      const result = validateSongData(songData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Song title is required');
    });
  });

  describe('getVersionDisplayName', () => {
    test('should return correct display names', () => {
      expect(getVersionDisplayName('boy-group')).toBe('Boy Group Version');
      expect(getVersionDisplayName('bg')).toBe('Boy Group Version');
      expect(getVersionDisplayName('girl-group')).toBe('Girl Group Version');
      expect(getVersionDisplayName('gg')).toBe('Girl Group Version');
      expect(getVersionDisplayName('original')).toBe('Original Version');
      expect(getVersionDisplayName('remix')).toBe('Remix Version');
      expect(getVersionDisplayName('acoustic')).toBe('Acoustic Version');
      expect(getVersionDisplayName('live')).toBe('Live Version');
    });

    test('should handle unknown versions', () => {
      expect(getVersionDisplayName('unknown')).toBe('unknown');
      expect(getVersionDisplayName(null)).toBe('Original Version');
      expect(getVersionDisplayName(undefined)).toBe('Original Version');
    });

    test('should handle case insensitive matching', () => {
      expect(getVersionDisplayName('BOY-GROUP')).toBe('Boy Group Version');
      expect(getVersionDisplayName('BG')).toBe('Boy Group Version');
    });
  });
});
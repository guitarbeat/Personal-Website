// Third-party imports
import { useEffect, useRef } from 'react';

/**
 * * Custom hook for managing VFX effects on navigation links
 * 
 * This hook manages RGB shift shader effects on navigation elements,
 * tracking the currently active link and applying/removing effects as needed.
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Whether the effect is enabled
 * @param {HTMLElement} options.activeElement - The currently active element
 * @param {Object} options.effectConfig - Configuration for the VFX effect
 * @returns {void}
 */
export const useVFXEffect = ({
  enabled = true,
  activeElement = null,
  effectConfig = { shader: 'rgbShift', overflow: 100 }
}) => {
  const vfxRef = useRef(null);
  const previousActiveRef = useRef(null);

  // * Initialize VFX instance
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    // ! Dynamic import to avoid SSR issues
    import('https://esm.sh/@vfx-js/core').then(({ VFX }) => {
      vfxRef.current = new VFX();
    });

    return () => {
      if (vfxRef.current) {
        vfxRef.current = null;
      }
    };
  }, [enabled]);

  // * Apply effect to active element and remove from previous
  useEffect(() => {
    if (!enabled || !vfxRef.current || !activeElement) {
      return;
    }

    // Remove effect from previous active element
    if (previousActiveRef.current && previousActiveRef.current !== activeElement) {
      try {
        vfxRef.current.remove(previousActiveRef.current);
        previousActiveRef.current.classList?.remove('active');
      } catch (error) {
        console.warn('VFX removal error:', error);
      }
    }

    // Apply effect to current active element
    if (activeElement) {
      try {
        vfxRef.current.add(activeElement, effectConfig);
        activeElement.classList?.add('active');
        previousActiveRef.current = activeElement;
      } catch (error) {
        console.warn('VFX application error:', error);
      }
    }
  }, [enabled, activeElement, effectConfig]);

  // * Cleanup all effects on unmount
  useEffect(() => {
    return () => {
      if (vfxRef.current) {
        try {
          // Remove effect from current active element
          if (previousActiveRef.current) {
            vfxRef.current.remove(previousActiveRef.current);
          }
          if (activeElement) {
            vfxRef.current.remove(activeElement);
          }
        } catch (error) {
          // Silently handle cleanup errors
        }
      }
    };
  }, [activeElement]);
};


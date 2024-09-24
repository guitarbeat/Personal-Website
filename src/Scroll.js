import React, { useEffect, useRef } from 'react';
import { VFX } from "https://esm.sh/@vfx-js/core";

class CustomVFX extends VFX {
  /**
   * Initializes the Scroll object with custom render and dispose methods if not provided
   * @example
   * const scrollInstance = new Scroll();
   * scrollInstance.dispose();
   * // Expected: Disposal of materials within the elements if any present.
   * @param {undefined} - This constructor takes no arguments.
   * @returns {undefined} - No return value as this is a constructor function.
   * @description
   *   - 'render' method is used for rendering operations, falls back to 'update' method if exists, or becomes an empty function otherwise.
   *   - 'dispose' method is responsible for disposing of any materials in 'elements' to prevent memory leaks.
   *   - Assumes 'elements' is an array of objects that may contain a 'material' property.
   *   - Override these methods in subclasses to provide specific functionality.
   */
  constructor() {
    super();
    if (!this.render) {
      this.render = this.update || (() => {});
    }
    if (!this.dispose) {
      this.dispose = function() {
        if (this.elements && Array.isArray(this.elements)) {
          this.elements.forEach(el => {
            if (el && el.material && typeof el.material.dispose === 'function') {
              el.material.dispose();
            }
          });
        }
        this.elements = [];
      };
    }
  }
}

/**
 * Applies a visual effect to headers when scrolling.
 * @example
 * <ScrollEffect>
 *   <h1>Title</h1>
 * </ScrollEffect>
 * // Applies a scrolling visual effect to the "Title" header
 * @param {object} props - Container for passing children elements.
 * @returns {JSX.Element} A DIV element wrapping the children elements.
 * @description
 *   - The visual effect is created with WebGL fragment shaders.
 *   - It responds to the scroll event to simulate a distortion effect.
 *   - The VFX is applied to all `<h1>` elements inside the wrapped component.
 *   - An internal state is maintained with `useRef` for the VFX logic.
 */
const VFXEffect = ({ children }) => {
  const containerRef = useRef(null);
  const vfxRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current; // Store ref value to address ESLint warning
    vfxRef.current = new CustomVFX();
    let scroll = 0;
    const viewportHeight = window.innerHeight;

    const lerp = (a, b, t) => a * (1 - t) + b * t;

    const shaderH = `
      precision highp float;
      uniform vec2 resolution, offset;
      uniform float time, scroll;
      uniform sampler2D src;
      vec4 sampleWithOffset(vec2 uv, vec2 offset) {
        vec2 sampleUV = uv + offset;
        float inside = step(abs(sampleUV.x - 0.5), 0.5) * step(abs(sampleUV.y - 0.5), 0.5);
        return texture2D(src, sampleUV) * inside;
      }
      void main() {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        float d = scroll * 0.1 * abs(
          sin(floor(gl_FragCoord.x / 10.) * 5. + time * 3.) + 
          sin(floor(gl_FragCoord.x / 12.) * 7. - time * 4.)
        );
        
        vec4 cr = sampleWithOffset(uv, vec2(d, d));
        vec4 cg = sampleWithOffset(uv, vec2(-d, d * 1.5));
        vec4 cb = sampleWithOffset(uv, vec2(d * 0.5, -d * 2.));
        
        gl_FragColor = vec4(cr.r, cg.g, cb.b, max(max(cr.a, cg.a), cb.a));
      }`;

    /**
    * Creates an object with scroll and time functions related to an element
    * @example
    * const elementScrollData = elementScrollHandler(document.body);
    * elementScrollData.scroll(); // Returns a calculated scroll influence value
    * elementScrollData.time(); // Returns a timestamp in seconds
    * @param {HTMLElement} element - The DOM element to track the scroll position of.
    * @returns {Object} An object containing two functions: scroll and time.
    * @description
    *   - The scroll function calculates the element's visibility and scroll influence.
    *   - The time function provides a high-resolution timestamp in seconds.
    *   - Call the scroll function on a scroll event to get updated values based on user's scroll.
    *   - Use the time function to get the current time for animations or time-based calculations.
    */
    const uniformsFactory = (element) => ({
      scroll: () => {
        const rect = element.getBoundingClientRect();
        const elementVisibility = Math.max(0, Math.min(1, 
          (viewportHeight - rect.top) / (viewportHeight + rect.height)
        ));
        const diff = window.scrollY - scroll;
        scroll = lerp(scroll, window.scrollY, 0.1);
        return (diff / viewportHeight) * elementVisibility * 5;
      },
      time: () => performance.now() * 0.001
    });

    /**
    * Wraps all 'h1' elements in given container with a VFX effect
    * @example
    * applyVFXtoHeadings(container, vfxRef)
    * // h1 elements now have visual effects applied
    * @param {HTMLElement} container - The container element in which to apply the effect.
    * @param {Object} vfxRef - A ref object to the VFX controller with current add method.
    * @returns {void} Does not return a value.
    * @description
    *   - The function looks for all 'h1' elements inside the provided container.
    *   - It wraps each 'h1' element with a div that has special styling and a VFX applied.
    *   - The VFX is applied using a shader, overflow limit, and custom uniforms.
    *   - 'vfxRef.current.add()' links the wrapper div to the VFX controller.
    */
    const applyVFX = () => {
      if (container && vfxRef.current) {
        const elements = container.querySelectorAll('h1');
        elements.forEach(element => {
          // Create a wrapper div
          const wrapper = document.createElement('div');
          wrapper.style.position = 'relative';
          wrapper.style.display = 'inline-block';
          wrapper.style.width = '100%';
          wrapper.style.height = '100%';

          // Wrap the original element
          element.parentNode.insertBefore(wrapper, element);
          wrapper.appendChild(element);

          // Apply VFX to the wrapper
          vfxRef.current.add(wrapper, { shader: shaderH, overflow: 1000, uniforms: uniformsFactory(wrapper) });
        });
      }
    };

    applyVFX();

    const update = () => {
      if (vfxRef.current && typeof vfxRef.current.render === 'function') {
        vfxRef.current.render();
      }
      requestAnimationFrame(update);
    };
    const animationFrame = requestAnimationFrame(update);

    const handleScroll = () => {
      if (vfxRef.current && typeof vfxRef.current.render === 'function') {
        vfxRef.current.render();
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrame);
      if (vfxRef.current && typeof vfxRef.current.dispose === 'function') {
        vfxRef.current.dispose();
      }
      // Unwrap elements
      if (container) {
        const wrappers = container.querySelectorAll('div[style*="position: relative"]');
        wrappers.forEach(wrapper => {
          if (wrapper.firstChild) {
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
            wrapper.parentNode.removeChild(wrapper);
          }
        });
      }
      vfxRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};

export default VFXEffect;
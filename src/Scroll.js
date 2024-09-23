import React, { useEffect, useRef } from 'react';
import { VFX } from "https://esm.sh/@vfx-js/core";

class CustomVFX extends VFX {
  /**
  * Sets up default render and dispose methods if they are not provided
  * @example
  * const scrollInstance = new Scroll();
  * scrollInstance.dispose();
  * // Expected: all materials in scrollInstance.elements are disposed
  * @description
  *   - This function is a constructor pattern for a class, possibly named `Scroll`.
  *   - If render function is not provided, uses update method or an empty function as default.
  *   - The dispose function cleans up resources, specifically by disposing of materials.
  *   - Assumes that the 'elements' property is an array of objects with a 'material' property.
  * @returns {void} This is a constructor function and does not return a value.
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
* Wraps children with visual effects using WebGL shaders as they scroll
* @example
* <ScrollVFXContainer>
*   <h1>Amazing Heading</h1>
* </ScrollVFXContainer>
* // <h1> will be wrapped with visual effects
* @param {{ children: React.ReactNode }} props - The component's children that will receive the scroll-based VFX.
* @returns {JSX.Element} A div element wrapping the children with a ref attached for visual effects.
* @description
*   - CustomVFX is a hypothetical class that applies visual effects to elements.
*   - vfxRef is used to manage the lifecycle of the visual effects instance.
*   - lerp is a linear interpolation function used for smooth scrolling effect integration.
*   - Unwrapping of elements is handled in the cleanup function of useEffect to ensure proper state on component unmount.
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
    * Creates animatable scroll and time properties for an element
    * @example
    * const elementScrollTime = createScrollTimeProps(element);
    * elementScrollTime.scroll(); // Returns a scaled scrolling delta value
    * elementScrollTime.time(); // Returns the current time in seconds
    * @param {HTMLElement} element - The target element to measure and create scroll/time properties for.
    * @returns {Object} An object with two methods `scroll` and `time`, where `scroll` computes and returns a number based on the element's visibility and scroll delta, and `time` returns the elapsed time in seconds.
    * @description
    *   - `scroll` method returns a value that signifies the visible region's contribution to the overall scroll. It should be used to create scroll-based animations.
    *   - `scroll` method uses linear interpolation (lerp) to smooth the scrolling effect.
    *   - `time` method provides a convenient way to access a timestamp for animations.
    *   - This snippet assumes that `viewportHeight`, `scroll`, and `lerp` are available in the scope from where this function is invoked.
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
    * Applies visual effects to all 'h1' elements within a container
    * @example
    * applyVfxToHeadings(container, vfxRef)
    * // no explicit return value; elements are modified in the DOM
    * @param {Element} container - The container element which contains 'h1' elements.
    * @param {Object} vfxRef - A reference object with a current property holding the VFX application method.
    * @returns {void}
    * @description
    *   - The container's 'h1' elements are wrapped in a div which is then passed to a VFX function.
    *   - The VFX is specified by the shaderH and uniformsFactory previously defined.
    *   - The function assumes vfxRef.current is an object with an 'add' method.
    *   - Any previously applied styles or elements to 'h1' tags might be affected.
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
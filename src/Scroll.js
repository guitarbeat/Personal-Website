import React, { useEffect, useRef } from 'react';
import { VFX } from "https://esm.sh/@vfx-js/core";

class CustomVFX extends VFX {
  /**
  * Initializes a new instance of Scroll class, providing default implementations for render and dispose methods
  * @example
  * const scrollInstance = new Scroll();
  * scrollInstance.dispose(); // Disposes all elements' materials
  * @description
  *   - The function ensures there are default definitions for `render` and `dispose` methods.
  *   - `render` is defaulted to `update` method if available, or an empty function otherwise.
  *   - `dispose` method ensures all elements' materials are properly disposed of to prevent memory leaks.
  *   - `elements` is expected to be an array of objects that may contain a `material` property.
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
* Applies visual effects to header elements on scroll
* @example
* const VFXContainer = ({ children }) => {...};
* // Assuming <VFXContainer> wraps <h1> elements in the JSX structure.
* ReactDOM.render(<VFXContainer><h1>Title</h1></VFXContainer>, container);
* // The 'Title' header will have the scroll-based shader effects applied to it.
* @param {ReactNode} children - The children components that might contain header elements for applying VFX.
* @returns {ReactElement} A container component where visual effects are applied to header elements on scroll.
* @description
*   - CustomVFX is a presumed external library for applying visual effects.
*   - shaderH contains the GLSL code for the fragment shader used in the visual effect.
*   - uniformsFactory generates the uniform variables required for the shader based on the current element.
*   - Effects are applied only when the header elemnts get visible in the viewport upon scrolling.
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
    * Provides scroll and time methods based on an element's position on the viewport
    * @example
    * const scroller = createScroller(element);
    * const scrollValue = scroller.scroll();
    * console.log(scrollValue); // Could log a value like 0.85
    * const timeValue = scroller.time();
    * console.log(timeValue); // Could log a value like 1625.382
    * @param {HTMLElement} element - The DOM element to track the scroll position of.
    * @returns {Object} An object containing two methods: `scroll` and `time`.
    * @description
    *   - The `scroll` method calculates a number based on the element's visibility and scroll position.
    *   - The `time` method returns a high-resolution timestamp in seconds.
    *   - It's assumed that `viewportHeight` and `scroll` are available in the function's outer scope.
    *   - The `lerp` function is used internally to smooth out the scroll values.
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
    * Applies visual effects to every h1 element within a given container
    * @example
    * applyVFXToHeadings(containerReference, vfxObjectReference)
    * // No return value
    * @param {Element} container - The DOM element that contains the h1 elements.
    * @param {Object} vfxRef - A reference object with methods to add VFX to elements.
    * @description
    *   - The function wraps each h1 element with a div to apply the visual effect.
    *   - It assumes the presence of global `shaderH` variable for the shader effect.
    *   - The `uniformsFactory` function is expected to be available in the scope and is called with the wrapper div.
    *   - The VFX settings include a shader, overflow value, and uniforms obtained from the `uniformsFactory` function.
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
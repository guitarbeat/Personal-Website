import React, { useEffect, useRef } from 'react';
import { VFX } from "https://esm.sh/@vfx-js/core";

class CustomVFX extends VFX {
  /**
  * Initializes a new instance of the Scroll class
  * @example
  * new Scroll()
  * // Initializes an object with default render and dispose methods if not provided
  * @description
  *   - The constructor ensures that the instance has a 'render' method, defaulting to 'update' or an empty function.
  *   - The 'dispose' method is created to handle the disposal of materials if not provided.
  *   - Preconditions: The instance is expected to have 'update', 'elements', and optionally a 'render' method before calling the constructor.
  *   - Postconditions: After execution, 'render' and 'dispose' methods will be defined.
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
* Initializes and applies a custom visual FX based on scrolling
* @example
* <CustomVFXComponent>
*   <h1>Sample Heading</h1>
* </CustomVFXComponent>
* // The H1 element gets a visual FX based on the scrolling interaction.
* @param {Object} props - The props object containing children components.
* @param {ReactNode} props.children - React components or elements that are the children of the CustomVFXComponent.
* @returns {ReactElement} A div element containing the children with applied visual FX.
* @description
*   - The effect is applied to each h1 element within the children.
*   - Effects are re-calculated on each scroll event.
*   - Cleanup is performed to remove event listeners and animations frames on unmount.
*   - Components using this hook must be wrapped with React.forwardRef to work.
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
    * Generates a controller with scroll and time functionalities for an element
    * @example
    * const controller = createController(element);
    * const scrollEffectValue = controller.scroll();
    * // returns a value between 0 and 5 based on the element's visibility and scroll position
    * const timeInSeconds = controller.time();
    * // returns the current time in seconds from the performance.now() API
    * @param {HTMLElement} element - The DOM element for which the controller is created.
    * @returns {Object} An object containing the `scroll` and `time` function.
    * @description
    *   - The `scroll` function calculates a factor representing the element's visibility during a scroll event.
    *   - The `lerp` function is used to smoothly transition `scroll` values over time.
    *   - The `time` function provides a high-resolution timestamp in seconds.
    *   - The function is utilized in `src/Scroll.js` as part of scroll-based animations.
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
    * Applies VFX to all <h1> elements in a container
    * @example
    * applyVFXToHeadings(container, vfxRef)
    * // Assume vfxRef is an object with a method add, that applies visual effects
    * @param {Element} container - The DOM container element that contains <h1> elements.
    * @param {Object} vfxRef - A reference object with a method to add VFX to elements.
    * @returns {void} Does not return a value.
    * @description
    *   - The function wraps each <h1> element in a div that will be used to apply VFX.
    *   - The wrapper div has styles applied to position it relative to the original element.
    *   - The shader and other options for the VFX are passed to the add method of vfxRef.
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
// ShaderEffectComponent.js
import { useEffect } from 'react';
import { VFX } from 'https://cdn.jsdelivr.net/npm/@vfx-js/core/+esm';

const lerp = (a, b, t) => a * (1 - t) + b * t;

const shaderH = `
precision highp float;
uniform vec2 resolution;
uniform vec2 offset;
uniform float time;
uniform sampler2D src;
uniform float scroll;

float inside(vec2 uv) {
  return step(abs(uv.x - 0.5), 0.5) * step(abs(uv.y - 0.5), 0.5);
}
vec4 readTex(vec2 uv) {
  return texture2D(src, uv) * inside(uv);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - offset) / resolution;
  
  float d = scroll;
  
  d *= abs(
    sin(floor(gl_FragCoord.x / 17.) * 7. + time * 2.) + 
    sin(floor(gl_FragCoord.x / 19.) * 19. - time * 3.)
  );
  
  vec4 cr = readTex(uv + vec2(0, d));
  vec4 cg = readTex(uv + vec2(0, d * 2.));
  vec4 cb = readTex(uv + vec2(0, d * 3.));
  
  gl_FragColor = vec4(
    cr.r, cg.g, cb.b, (cr.a + cg.a + cb.a)
  );
}
`;

/**
* Initializes scroll based visual effects using VFX library in a React component on mount
* @example
* useEffectFunction()
* null // the hook does not return any value
* @param {string} shaderH - The shader code to be applied to the elements.
* @returns {undefined} This function doesn't have a return value as it's a useEffect callback in React.
* @description
*   - The scroll listener updates the shader effect intensity based on scroll position.
*   - 'lerp' function is used to smoothly interpolate between the current and target scroll positions.
*   - A cleanup function is returned to remove the scroll listener and effects when the component unmounts.
*   - 'overflow' value is set to 500, but the significance of this value is not explicit.
*/
const ShaderEffectComponent = () => {
  useEffect(() => {
    const vfx = new VFX();
    let scroll = 0;

    const updateScrollUniform = () => {
      const diff = window.scrollY - scroll;
      scroll = lerp(scroll, window.scrollY, 0.03);
      return diff / window.innerHeight;
    };

    const elements = document.querySelectorAll('');
    elements.forEach(e => {
      vfx.add(e, { 
        shader: shaderH, 
        overflow: 500, 
        uniforms: {
          scroll: updateScrollUniform
        }
      });
    });

    /**
    * Applies a shader effect to all elements provided
    * @example
    * functionName([element1, element2], shaderHandler, updateScrollFunction)
    * // elements have the shader effect applied
    * @param {HTMLElement[]} elements - Array of HTML elements to apply shader effect.
    * @param {Function} shaderH - Function that returns shader properties.
    * @param {Function} updateScrollUniform - Function to update scroll-related uniform variables.
    * @returns {void} No return value, applies effect in-place.
    * @description
    *   - The shaderH function should return an object with shader properties expected by vfx.add.
    *   - The updateScrollUniform is used to handle how scroll affects the shader's appearance.
    *   - The overflow parameter defines how much of the shader effect exceeds the element's boundary.
    *   - Ensure elements is a valid array of HTMLElements and both shaderH and updateScrollUniform are functions.
    */
    const handleScroll = () => {
      elements.forEach(e => {
        vfx.remove(e);
        vfx.add(e, { 
          shader: shaderH, 
          overflow: 500, 
          uniforms: {
            scroll: updateScrollUniform
          }
        });
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      elements.forEach(e => {
        vfx.remove(e);
      });
    };
  }, []);

  return null;
};

export default ShaderEffectComponent;

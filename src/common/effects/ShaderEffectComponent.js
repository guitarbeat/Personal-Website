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

## 2024-05-23 - Canvas Performance: Gradients in Render Loop
**Learning:** Creating `CanvasGradient` objects (linear or radial) inside a `requestAnimationFrame` loop is extremely expensive and generates significant garbage, causing frame drops.
**Action:** Pre-calculate gradients outside the loop if possible, or use solid colors (`fillStyle`) for high-frequency particle effects. In `Matrix.tsx`, replacing per-character gradients with solid colors and removing a full-screen vignette redraw significantly reduced overhead.

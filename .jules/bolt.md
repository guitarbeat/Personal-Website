## 2024-05-23 - Matrix Effect Optimization
**Learning:** React state updates (like `setInterval` updating a clock) cause full component re-renders. If the component contains a `canvas` running an independent `requestAnimationFrame` loop, these re-renders are often redundant and wasteful.
**Action:** Move "display-only" state that updates frequently (like timers) out of React state if it's not strictly needed for the immediate visual frame, or calculate it only when needed (lazy evaluation).

## 2024-05-23 - Canvas Performance
**Learning:** `createLinearGradient` and `shadowBlur` are extremely expensive in a `requestAnimationFrame` loop.
**Action:** Pre-calculate gradients or use solid colors for fast-moving elements (like particles/rain). Avoid `shadowBlur` for high-frequency elements. Move static full-screen effects (like vignettes) to CSS overlays.

## 2024-05-24 - Canvas Context Overhead
**Learning:** `ctx.save()` and `ctx.restore()` are expensive operations that save the entire canvas state stack. In simple render loops where state (like `fillStyle` or `globalAlpha`) is explicitly set for every object and the canvas is cleared every frame, these calls are redundant and kill performance.
**Action:** Remove `save()`/`restore()` in render loops if you overwrite the necessary state properties for each draw call anyway.

## 2024-05-24 - ResizeObserver Thrashing
**Learning:** Undebounced `ResizeObserver` callbacks can trigger expensive re-initializations (like recreating thousands of objects) on every pixel of window resize, causing severe UI lag.
**Action:** Always debounce `ResizeObserver` callbacks that trigger heavy computations or state updates.

## 2024-05-23 - Matrix Effect Optimization
**Learning:** React state updates (like `setInterval` updating a clock) cause full component re-renders. If the component contains a `canvas` running an independent `requestAnimationFrame` loop, these re-renders are often redundant and wasteful.
**Action:** Move "display-only" state that updates frequently (like timers) out of React state if it's not strictly needed for the immediate visual frame, or calculate it only when needed (lazy evaluation).

## 2024-05-23 - Canvas Performance
**Learning:** `createLinearGradient` and `shadowBlur` are extremely expensive in a `requestAnimationFrame` loop.
**Action:** Pre-calculate gradients or use solid colors for fast-moving elements (like particles/rain). Avoid `shadowBlur` for high-frequency elements. Move static full-screen effects (like vignettes) to CSS overlays.

## 2026-01-22 - PixelCanvas Optimization
**Learning:** `ctx.save()` and `ctx.restore()` operations are expensive when called per-particle in a high-frequency animation loop.
**Action:** For particles that only change basic properties (like `globalAlpha` or `fillStyle`), set them explicitly for each particle and avoid `save/restore` entirely.
**Learning:** `ResizeObserver` callbacks fire frequently during resize.
**Action:** Always debounce `ResizeObserver` callbacks that trigger expensive re-initializations (like recreating thousands of particle objects).

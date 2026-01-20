## 2024-05-23 - Matrix Effect Optimization
**Learning:** React state updates (like `setInterval` updating a clock) cause full component re-renders. If the component contains a `canvas` running an independent `requestAnimationFrame` loop, these re-renders are often redundant and wasteful.
**Action:** Move "display-only" state that updates frequently (like timers) out of React state if it's not strictly needed for the immediate visual frame, or calculate it only when needed (lazy evaluation).

## 2024-05-23 - Canvas Performance
**Learning:** `createLinearGradient` and `shadowBlur` are extremely expensive in a `requestAnimationFrame` loop.
**Action:** Pre-calculate gradients or use solid colors for fast-moving elements (like particles/rain). Avoid `shadowBlur` for high-frequency elements. Move static full-screen effects (like vignettes) to CSS overlays.

## 2024-05-23 - Canvas Performance: Save/Restore
**Learning:** `ctx.save()` and `ctx.restore()` are expensive operations in a tight `requestAnimationFrame` loop (e.g., drawing thousands of particles).
**Action:** For high-frequency rendering, avoid `save/restore` by manually managing state (e.g., resetting `globalAlpha` or `fillStyle`) or grouping draw calls by state to minimize context switches.

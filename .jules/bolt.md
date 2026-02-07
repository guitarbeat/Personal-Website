## 2024-05-23 - Matrix Effect Optimization
**Learning:** React state updates (like `setInterval` updating a clock) cause full component re-renders. If the component contains a `canvas` running an independent `requestAnimationFrame` loop, these re-renders are often redundant and wasteful.
**Action:** Move "display-only" state that updates frequently (like timers) out of React state if it's not strictly needed for the immediate visual frame, or calculate it only when needed (lazy evaluation).

## 2024-05-23 - Canvas Performance
**Learning:** `createLinearGradient` and `shadowBlur` are extremely expensive in a `requestAnimationFrame` loop.
**Action:** Pre-calculate gradients or use solid colors for fast-moving elements (like particles/rain). Avoid `shadowBlur` for high-frequency elements. Move static full-screen effects (like vignettes) to CSS overlays.

## 2024-05-23 - Render Loop Allocation
**Learning:** Allocating objects (like `{}` or `[]`) or using `Object.entries` inside a 60fps loop generates significant garbage.
**Action:** Reuse object/array structures by clearing them (e.g., `array.length = 0`) instead of creating new ones. Use `for (const key in obj)` to iterate keys without allocating an entries array.

## 2025-02-24 - React Key Stability
**Learning:** Generating random keys (e.g., `Math.random()`) inside a component render function forces React to destroy and recreate the entire child subtree on every render. This kills performance and resets state.
**Action:** Always use stable keys (like index or unique IDs) for lists. If random values are needed for initial state, generate them once (e.g., in `useState` lazy initializer or `useMemo`) and keep them stable.

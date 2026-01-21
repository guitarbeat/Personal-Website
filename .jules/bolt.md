## 2024-05-23 - Matrix Effect Optimization
**Learning:** React state updates (like `setInterval` updating a clock) cause full component re-renders. If the component contains a `canvas` running an independent `requestAnimationFrame` loop, these re-renders are often redundant and wasteful.
**Action:** Move "display-only" state that updates frequently (like timers) out of React state if it's not strictly needed for the immediate visual frame, or calculate it only when needed (lazy evaluation).

## 2024-05-23 - Canvas Performance
**Learning:** `createLinearGradient` and `shadowBlur` are extremely expensive in a `requestAnimationFrame` loop.
**Action:** Pre-calculate gradients or use solid colors for fast-moving elements (like particles/rain). Avoid `shadowBlur` for high-frequency elements. Move static full-screen effects (like vignettes) to CSS overlays.

## 2026-01-17 - PixelCanvas Resize Optimization
**Learning:** `ResizeObserver` fires frequently during window resize. If the callback re-initializes heavy resources (like creating thousands of objects or resetting canvas), it causes layout thrashing and jank.
**Action:** Debounce `ResizeObserver` callbacks that trigger expensive re-initializations (e.g., 200ms delay).

## 2026-01-17 - Canvas State Management
**Learning:** `ctx.save()` and `ctx.restore()` add overhead. In tight render loops where every pixel overwrites the context state (e.g., `fillStyle`, `globalAlpha`), these calls are redundant.
**Action:** Remove `save/restore` in simple particle systems where state is explicitly set for each entity.

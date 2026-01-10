## 2024-05-23 - Canvas Performance in JSDOM
**Learning:** JSDOM does not polyfill `requestAnimationFrame` with a real high-resolution timestamp or `performance.now()` by default when using `jest.useFakeTimers()`. Tests verifying animation loops must account for mocked time progression using `jest.advanceTimersByTime()`.
**Action:** When testing RAF loops, ensure `performance.now()` is mocked if the loop logic depends on delta time, or verify that the loop triggers unconditionally.

## 2024-05-23 - Canvas Context in Tests
**Learning:** `createLinearGradient` is an expensive operation that should be avoided in high-frequency render loops (60fps). Replacing it with solid colors yields significant performance gains.
**Action:** Prefer `ctx.fillStyle` with calculated opacity/color strings over `ctx.createLinearGradient` for small, numerous particles like Matrix code rain.

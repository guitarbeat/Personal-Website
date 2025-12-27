## 2024-05-22 - Canvas Object Allocation in Render Loops
**Learning:** Calling `createLinearGradient` inside a canvas animation loop (60 FPS) for every particle creates significant garbage collection pressure. For 100 particles, that's 6000 new objects per second.
**Action:** Replace per-particle gradients with solid colors (`ctx.fillStyle = 'rgba(...)'`) or cached gradient objects if the gradient doesn't change relative to the particle. In this case, switching to solid colors provided a 100% reduction in gradient object allocation with minimal visual impact.

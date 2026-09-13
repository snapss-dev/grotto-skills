# Diagnose a performance complaint on the target game

Reproduce the complaint at the reported viewport, device class, seed and game stage. Compare idle/menu, ordinary play and the busiest intended moment. Record warm/cold start separately. Use frame-time distributions and visible stalls; average FPS can hide long pauses.

Separate likely causes:
- CPU/simulation: collision pairs, pathfinding, generation or excessive entity updates.
- GPU/rendering: pixel ratio, overdraw, shadows, materials, draw calls or postprocessing.
- Loading: asset transfer/decode, shader compilation or work blocking the first frame.
- Lifecycle: retained textures, listeners, timers, AudioNodes or repeatedly registered loops.

Change one suspected cause and repeat the same scenario. Cap pixel ratio or effect density only with a measured tradeoff and preserve readability. Move bounded noncritical work across frames where appropriate; do not conceal a softlock by dropping required simulation.

Run repeated scene/restart/load cycles. Counts should settle after cleanup; one successful frame is not a leak test. Test background/resume without runaway catch-up, audio bursts or broken input.

Keep a small receipt with revision, environment, scenario, measurement method, before/after frame times, resource counts and any visual compromise. Browser throttling is useful comparative evidence but does not substitute for a real low-end device.

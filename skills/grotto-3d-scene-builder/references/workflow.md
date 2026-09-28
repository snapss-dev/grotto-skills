# Three.js worlds workflow

Which spatial or presentation change should the next playable 3D pass establish?

## When to repeat

For each scene or model batch, and when camera, controller, collision or rendering changes.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

The installed 3D foundation, current camera/controller, representative scene and cost measurements.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Review the current camera, controller, world scale and collision ownership. Inspect the installed foundation before changing scene startup or character movement. Compare the representative scene with the previous accepted pass.

2. Plan a small spatial or model change that serves a player action. Define grounding, scale, facing, pivots and collision separately from decorative geometry. Set a rendering-cost question rather than an arbitrary visual-quality target.

3. Integrate actual models, materials and animation clips using the existing scene and lifetime owners. Verify returned assets and clip names. Preserve controller ownership and dispose of resources when their scene lifetime ends.

4. Play the representative route and affected camera angles. Check grounding, collision and input recovery, then measure the same scene’s rendering cost. Revisit earlier assumptions when model density or camera behavior changes.

## Verify and decide

Confirm visible geometry and movement agree, required clips really exist, and rendering/resource costs stay bounded in the tested scene. A well-lit screenshot cannot establish collision correctness or performance.

Adding detailed vegetation prompts a pass on player visibility and measured scene cost before the new assets are scattered across the whole world.

## Leave a record for the next pass

Spatial and collision conventions, model bindings and measured representative scene baselines.

Keep scale and pivot conventions, controller/model separation, exact clips, collision assumptions and measured scene conditions. Preserve a representative route for the next asset or rendering pass.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.

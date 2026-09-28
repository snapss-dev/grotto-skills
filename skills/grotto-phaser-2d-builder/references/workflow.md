# Phaser 2D games workflow

Which coherent 2D capability should be added or refined in this pass?

## When to repeat

For each new 2D capability, scene or asset batch, and after changes to physics or input.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

The current Phaser foundation, scene ownership, requested mechanic and prior playable scenarios.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Inspect the installed foundation, editable source and current scene lifecycle. Reuse the working physics and semantic input boundaries. Read the architecture reference only where an ownership decision is missing.

2. Choose a small capability and a playable scenario. Define how it enters, updates and leaves the scene, and which collision or animation rules it changes. Avoid adding a second engine boot or simulation loop.

3. Implement the behavior and actual asset bindings together. Use returned file names and registries rather than imagined assets. Fit sprite origin, scale and collision dimensions to the gameplay scenario.

4. Play the capability with the existing controls, then replay scene return, restart and affected collisions. Keep the successful scenario and any failing action sequence for subsequent content passes.

## Verify and decide

Confirm that authored scene code runs through the installed foundation, that physics matches the displayed game and that repeated scene entry does not duplicate input, timers or objects. Compile success alone does not establish a playable mechanic.

A new moving platform is tested for normal landing, edge contact, restart and touch movement before its behavior is reused across a level.

## Leave a record for the next pass

Scene and physics decisions, asset bindings and a small playable regression route.

Keep scene ownership, collision decisions, exact asset bindings and the regression route. Preserve current controller behavior as a baseline when the next pass adds more content.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.

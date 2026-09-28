# Clean restart, loading and teardown

Define lifetime before adding resources: application, world/run, scene,
entity, and temporary effect. A persistent setting belongs above a restarted
scene; a projectile belongs inside the current run. Each owner should release
what it creates, once, without destroying shared resources still in use.

## Track the real resource owners

Inventory scene listeners, DOM handlers, input subscriptions, update callbacks,
timers, tweens, colliders, model mixers, textures, audio voices and background
loads. Retain removal handles where the installed API supplies them. Stop world
timers when paused if their rules should pause. UI recovery must remain live.

Use Phaser shutdown for resources attached to each scene start; destroy is not
the only lifecycle event. Reset authored arrays and references that outlive the
scene. For Three.js, remove update callbacks, detach actors and dispose their
owned resources. Track shared geometry/material ownership rather than disposing
everything reachable from one removed model.

## Guard asynchronous work

Start local interaction without waiting on optional assets or cloud identity.
Show a meaningful placeholder or loading state. A critical asset can block the
specific interaction that needs it, with retry or recovery; it should not hang
the entire interface indefinitely.

Capture a run/scene generation ID before starting a load. On completion, check
that the owner is still current and alive. Dispose stale results instead of
inserting an old actor into a restarted scene. Cancellation and failure must
not be reported as successful asset registration. Do not invent paths after a
tool fails.

## Make restart a transition

Stop input and transient effects, close outstanding interactions, dispose the
old run's resources, create fresh gameplay state, and rebind once. Preserve
settings and durable progress according to the game policy. A world reset must
not silently delete a player's saved creation.

Exercise repeated restart, scene change during loading, teardown during audio,
and background/resume. Compare listener/resource counts after warm-up; they
should settle. A successful first load does not establish cleanup correctness.

Basis: [Phaser scene events](https://docs.phaser.io/api-documentation/namespace/scenes-events)
defines shutdown and destruction hooks. Lifecycle checks above adapt them to
Studio's model, input and runtime ownership.

# Enemy decisions that support the game

Define each enemy's role before its AI: pressure movement, guard a position,
test timing, deny a route or create a tradeoff. Give roles different decisions,
not just different health bars. The objective is understandable behavior that
supports play; an enemy does not need maximum intelligence.

## Begin with explicit transitions

For a small enemy, a state machine can be enough: patrol, notice, approach,
commit, recover, retreat or defeated as needed. Each state needs entry work,
allowed actions, exit conditions and cleanup. Use hysteresis or a short decision
interval to prevent oscillating every frame at a range boundary.

Separate sensing, deciding and executing. Declare perception distance,
line-of-sight, memory duration and information the enemy is allowed to know.
Do not claim it sees the player through a wall unless that is an intentional,
communicated rule. Commit attacks only when their preconditions hold; if the
target disappears, apply a clear cancellation or missed-attack policy.

## Navigation must agree with movement

Build navigation from traversable space and the actor's footprint. Avoid paths
through doors, slopes or jumps the controller cannot execute. Replan after
meaningful changes or lost progress, not for every actor on every render.
Bound search work and define unreachable-target behavior such as waiting,
investigating or returning. Teleporting toward the player is not a path repair.

For crowds, compare simple steering/separation with full pathfinding based on
the world. Keep collision authoritative and avoid jitter from physics and
steering both moving the same body. Stagger expensive decisions if measurement
shows synchronized spikes.

## Test the decision boundary

Exercise the player leaving range, blocking a route, entering a safe area,
pausing during commitment, restarting and killing the enemy mid-action. Inspect
two enemies competing for space and many enemies in the busiest intended beat.
Log state transitions in a toggleable diagnostic view, then remove persistent
debug clutter from normal play.

Basis: [State, by Robert Nystrom](https://gameprogrammingpatterns.com/state.html)
describes explicit states and their limitations. Add hierarchical states,
behavior trees or planning only when the required behavior exceeds the simple
model; a complex AI framework is not a prerequisite for a good encounter.

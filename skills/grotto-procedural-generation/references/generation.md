# Choosing procedural systems for the requested world

Choose generation from the creator's intended scale, topology and actions. A
voxel sandbox, puzzle grid and platformer require different representations and
traversal rules. Define what the player can change, what must persist and which
properties must hold before selecting an algorithm.

## Determinism and saved state

Use a seeded random source with a documented algorithm and generator version.
Keep generation randomness separate from cosmetic effects. The same seed,
version and parameters should reproduce the same base world regardless of frame
rate, asset-loading order or player movement. Avoid unseeded random calls inside
that pipeline.

For a large editable world, derive randomness from world seed and spatial
coordinates so chunks generate independently of visitation order. Save player
edits as durable changes to that base world, or store complete chunks when that
fits the size. Record schema/generator versions and plan upgrades before changing
generation for existing saves. A daily challenge can expose a shareable seed;
an ordinary creative world does not need a score or leaderboard.

## Representation and algorithm tradeoffs

| World or content | Useful approach | What it does not establish |
| --- | --- | --- |
| Smooth terrain or voxel heights | Sample spatial noise at world coordinates; combine scales deliberately | Traversable slopes, safe spawns or believable geology |
| Caves and organic cellular regions | Cellular updates or density fields, followed by region analysis | Connected air space or valid vertical routes |
| Deliberate rooms and passages | A topology graph plus spatial placement and corridor construction | Keys, locks, collision clearance or good encounter pacing |
| Mazes | A spanning traversal over a defined cell graph | Interesting choices, navigable rendering or appropriate difficulty |
| Platforming sequences | Compose authored movement constraints and validate each transition against physics | Safe jumps from tile connectivity alone |
| Loot and encounters | Weighted distributions with explicit limits, dependencies and optional guarantees | Fairness or progression quality without playtesting |

These are choices to evaluate, not a prescribed layout, controller, art style or
set of rules. Combine techniques only when they support the requested world.

## Scale, visibility and edit cost

Choose cell/chunk dimensions from measured generation, collision and rendering
cost. Generate only the needed region and bound queued work so travel does not
freeze input. Track neighboring dependencies when editing boundaries. A block
change may require neighboring mesh or collision updates, even when ownership
belongs to one chunk.

For repeated geometry, compare instancing with merged or exposed-face geometry
for the actual material and edit pattern. Avoid issuing one draw call per cell
or rebuilding the entire world for a single local edit. Keep source world data
authoritative; render meshes are rebuildable views. Shared surfaces need coherent
coordinates, normals and material boundaries to avoid visible seams.

## Validation and failure handling

Validate legal spawn, required reachability, clearance and bounded world size
using the same rules the player experiences. Bounded deterministic retries need a
valid recovery strategy; a generation loop must not freeze the game indefinitely.
Read [validation](validation.md) when designing that check or diagnosing a bad
seed. Preserve reproducible failing seeds as regression cases.

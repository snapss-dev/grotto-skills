# World assemblies

For the live agent workflow and capability discovery, read
[world authoring](world-authoring.md).

The saved `world/world.json` manifest and its immutable spatial chunks are the
source of the live Studio world. Read the relevant regions with `read_world`,
then use `update_world` with their exact revisions and the manifest's base root.
Accepted checkpoints appear immediately in the existing world view.

## Model, part and folder

Use a `kind: "group"` root with `assembly: { archetype: "cabin" }` for a model
built from editable parts. Give the root a stable instance ID such as `cabin-01`
and semantic part IDs such as `cabin-01:door`. Parts refer to their immediate
parent with `parentId`. A group without `assembly` is an organizational folder.
`kind: "model"` means an imported model asset instance; it requires an existing
`assetKey` and truthful local geometry `bounds` in a v2 chunk.

Put the assembly pivot at its functional base. Root positions are chunk-local;
child positions, rotations and scales are parent-local. Units are meters, +Y
is up, -Z is forward, and rotations are radians. A 2D world uses XY positions
and Z rotation. Keep hierarchy shallow: assembly, optional meaningful subgroup,
then parts. Do not create empty wrappers for individual primitive parts.

Preserve IDs and local transforms when moving a model root. To transfer or
delete a model, include all its descendants in the same atomic transaction.
Parent hierarchies cannot cross chunk boundaries. Split large structures into
independent spatial assemblies instead of one world-sized parent. Per-region
and per-operation budgets do not cap the world's total model count.

Repeated boxes, spheres and planes with the same built-in material automatically
share geometry and instance batches across assemblies. Reuse the same asset key
for repeated imported assets. Grouping controls editing and transforms; adding
a group does not merge arbitrary geometry. Put `collidable: true` on the parts
that physically block players, not an empty folder. Gameplay mechanics and
physics remain owned by the game.

The word assembly here identifies an editable grouping. It does not weld parts,
create joints or combine rigid bodies. Roblox uses physical assembly for joined
parts; do not assume that behavior from Grotto's `assembly` metadata. Give the
authored physics system explicit collision and joint rules when they are needed.

## Built-in materials

Use `material` on a v2 box, sphere, plane or sprite with no `assetKey`.
These offline, deterministic textures render in Three, Phaser and Studio and
ship with the protected runtime. `color: "#ffffff"` keeps the natural material;
another color tints it. Available names:

| Ground | Structure |
| --- | --- |
| `grass`, `dry-grass`, `moss` | `wood`, `bark`, `brick` |
| `dirt`, `mud`, `sand`, `gravel` | `stone`, `slate`, `metal` |
| `snow` | |

The Three renderer includes normal maps, roughness and metalness. The 2D
renderers use the same material color texture. Imported model materials stay
inside their asset. Use an authored texture asset for art beyond this library.

## Terrain and planting

The `perlin@1` recipe supports `surface` (a built-in material), `vegetation`
(0–1 density) and `atmosphere` (sunlight/clouds in 3D). New worlds start with a
meadow. Missing presentation fields keep older worlds' appearance unchanged.
Recipe details are regenerated deterministically in a bounded area around the
camera; travel does not append entities or textures to the world.

Local terrain brushes can set `terrain.vegetation` to clear or restore plants
around a place, along with their height and color edits. Query all overlapping
brushes first. Procedural grass, rocks and grove trees belong to the terrain
recipe. Use real assemblies for landmarks that need independent part editing,
interaction or collision, and clear the procedural planting beneath them.

## Pointing and interaction

Studio click selects a part. E selects the nearest assembly ancestor of the
part in reach (or the part when it has no assembly). Read the current source
before editing; retained selections are context, not authority. Ground pointing
uses `surface: "terrain"` and an absolute point, without a fabricated entity ID.

In a generated game, bind the existing `interact` action (E) to the actual
door, switch, pickup or other mechanic. Show visible feedback for success and
blocked interactions. Configure the supplied controls instead of duplicating
camera direction math. Verify changes during motion, source updates, region
eviction/return, save/export, and with chat open. A rendered construction view
does not establish independent gameplay acceptance.

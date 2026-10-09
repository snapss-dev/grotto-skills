# Studio capabilities for an authored game

A new Studio project contains the engine/runtime connection, structural types
and an editable entrypoint. The entry contains `#game-shell` and `#game-root`; it has no game scene, HUD,
overlay, touch controls or automatic boot. The creator's request determines the world, camera,
rules, art direction and interface. Before authoring, choose `select_game_foundation`
with `mode` first-person, third-person, top-down, platformer or ui, and `dimension`
2d or 3d. First/third person require 3d. Read [control foundations](control-foundations.md). Existing
games retain their own design and save compatibility unless the request changes
them. Read documentation for the current decision; no full manual is needed for
an unrelated small edit.

## Project and execution contract

| Surface | Capability and ownership |
| --- | --- |
| `src/game.ts`, other `src/**/*.ts` | Author gameplay, rendering setup, state and content in strict TypeScript; use static relative imports within `src/` |
| `index.html`, `styles/game.css` | Author presentation, menus, responsive layout and available controls while retaining required runtime entry hooks |
| `platform/grotto-2d.js` or `platform/grotto-3d.js` | Protected engine loading, scoped runtime integration, input helpers and independent runtime observation |
| `src/types/grotto.d.ts` | Protected structural declarations for the installed kit; these are a supported subset, not an engine feature whitelist |
| `src/types/game.d.ts` | Add precise authored interfaces for legitimate APIs beyond that subset; narrow `unknown` at the integration boundary |
| `.grotto/build/**` | Studio-owned compiled output, never authored game source |
| `check_project` | Compile and inspect diagnostics after meaningful edits; a successful compile does not establish playability |

Studio builds the authored source without a model-managed package install or
build system. Preserve the installed protected modules and compiler contract.
Use only APIs and tools actually available in this run; do not invent an asset,
dependency, service or successful check. A missing convenience type does not
mean a normal engine API is prohibited: describe its actual shape rather than
using `any`, suppression comments or replacement platform declarations.

## Engine choices within the installed project

For 2D, `Grotto2D.boot(factory)` loads Phaser and gives the factory `{ Phaser,
kit }`. The factory returns a title and Phaser configuration, including authored
scenes. Keep the required `game-root` parent and one engine boot. Select camera,
scene structure, physics and scaling for the requested game. Read
[2D architecture](../../grotto-phaser-2d-builder/references/architecture.md) for
scene ownership and installed helper details.

For spatial games, `Grotto3D.boot(factory)` provides `{ THREE, kit }`.
`kit.createApp(THREE, options)` returns the scene, camera, renderer, semantic
actions, `addUpdate` and `dispose`. `addUpdate` receives fixed-step seconds and
returns a function that removes that update. The kit owns the render loop.
Use the protected GrottoControls controller for the selected camera/movement mode; initial
helper values are configurable implementation defaults, not a game design.
Read [3D scene capabilities](../../grotto-3d-scene-builder/references/scene-and-performance.md)
for camera, physics, picking, geometry and resource ownership.

## Controls and presentation

The semantic input API supports movement axes, held actions, one-shot presses
and cancellation/release. Map the requested verbs to keyboard, pointer and touch
with the installed action declarations. Direct manipulation, a first-person
camera and a menu-driven game need different interaction models. Do not create a
direction pad or action button that has no real meaning. Read
[action design](../../grotto-cross-device-controls/references/actions.md) and
[touch behavior](../../grotto-cross-device-controls/references/touch.md) when
implementing those paths.

HUD, overlay and tone helpers are optional presentation conveniences. If using
them, inspect their installed signatures and supply the DOM elements they
address. `setHud` addresses `#score` and `#status`, and the spatial kit also
supports `#objective`. `showOverlay` requires the complete `#game-overlay`,
`#overlay-title`, `#overlay-copy` and `#overlay-action` group, with a real button
for its action. Touch bindings discover `#touch-controls [data-action]` elements
when bound; supply allowed action names and accessible labels. These hooks are
optional capabilities, not elements required in every game's layout. Authored UI
may use its own layout. A creative world need not have a
score, timer, collectible quota, forced objective or win/lose screen. Keep
runtime/account integration available without making it the game's theme.

Register available interaction acceptance hooks against real player state and
report genuine game signals when relevant. Rendering, model callbacks or a
manually incremented counter cannot stand in for a working player interaction.

## Assets, animation and physics

Use only asset tools offered by the current run. Keep their returned exact asset
keys and script tags, loading asset modules before compiled game output. Images,
sprite sheets, voxel models and animated GLBs have different loading and animation
contracts; see [image capabilities](../../grotto-pixel-art-assets/SKILL.md),
[animation timing](../../grotto-game-animation/SKILL.md) and
[model integration](../../grotto-3d-scene-builder/references/models-and-animation.md).

Phaser provides scene, texture, animation and physics systems. Three.js provides
scene graphs, cameras, raycasting, procedural and instanced geometry, materials
and lighting. `Grotto3D.loadRapier` provides the available rigid-body option.
Choose collision from the requested movement rules, keep visual and simulation
ownership explicit, and measure rendering cost. A voxel aesthetic does not
require one draw call per block or a particular world layout.

## Runtime services and completion

The legacy kit currently owns a best-score autosave in slot `default` even
without visible score UI. Do not create a second owner for that slot or store an
unrelated schema there. Use a distinct stable authored slot for a world,
inventory or other game-state schema, with its own lifecycle and merge policy.

Identity, cloud saves, scores, events and presence use the installed scoped
Grotto runtime. Published game runtimes receive inventory access; creator-only
hosted previews do not. Multiplayer requires explicit platform authorization.
See [identity](identity-and-boot.md),
[save/score contracts](saves-and-scores.md), [capabilities](capabilities.md) and
[SDK types](sdk-contract.md) for the exact operations.

Studio can author the game without a game ID. When the Grotto player or a
creator-hosted preview launches it, the host supplies the game-scoped runtime.
Do not request an ID from the creator or substitute the Studio project ID in
SDK calls. If gameplay needs the public ID for a separate integration, read
`(await window.GrottoRuntime.ready()).runtime.gameId` after readiness; never
log or forward the runtime's secret `sessionId`.

Start input and local rendering without waiting on network services. Preserve
local progress when cloud hydration arrives late; retain save slot and schema
compatibility for existing games. Add only the services the actual experience
needs.

Compile, inspect the visible game and exercise the creator's requested actions.
Check resize, pause/resume, loading failure and applicable recovery paths.
Independent runtime review must observe the same source revision being delivered.
An empty rendering surface establishes no playable behavior; document unresolved
limitations accurately instead of calling it complete.

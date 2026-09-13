# Phaser 2D builder for Grotto Studio

Fresh 2D games are revision-owned strict TypeScript Phaser 4 projects. They do not
need npm install or a model-managed build step: Studio compiles and content-binds
`src/**/*.ts` before preview, review, download, or publish. The root entry loads
`styles/game.css`, the protected `platform/grotto-2d.js` kit, then Studio output.

## Boundaries
- `index.html`: stable entry, DOM HUD/overlay/touch controls, generated asset scripts.
- `styles/game.css`: responsive shell, safe areas, accessible DOM presentation.
- `platform/grotto-2d.js`: protected pinned Phaser loader plus input/runtime helpers.
- `src/types/grotto.d.ts`: protected structural engine/runtime declarations.
- `src/game.ts` and optional `src/**/*.ts`: scenes, simulation, content, camera, physics and effects.
- `.grotto/build/**`: deterministic compiler output; never read, write, or ship it as authored work.
- Split larger games with static relative TypeScript imports/exports inside `src/`; Studio bundles them without npm or an authored build step.
- For a legitimate Phaser API outside the installed structural declarations, add a precise authored interface in `src/types/game.d.ts` and narrow `unknown`; do not replace the protected declarations or use `any`.

Keep serializable rules outside sprites. Phaser objects are disposable views. Prefer
Boot/Preload, Menu and Play scenes; add overlay/debug scenes only when useful.

## Platform API
- `Grotto2D.boot(({ Phaser, kit }) => ({ title, config }))` starts the engine.
- `kit.bindActions(scene, actions)` maps keyboard and multi-pointer DOM controls.
- `kit.setHud`, `showOverlay`, `recordScore`, `submitScore`, `playTone` wire UX/runtime.
- `kit.makeTexture` makes deterministic procedural fallback art.
- `kit.loadGeneratedImage(scene, textureKey, assetKey)` maps generated data URLs.

For generated art, load each returned asset module in `index.html` before the generated game output.
Then use stable texture keys in preload rather than scattering file paths. For sprite
sheets, add Phaser animation definitions in Boot/Preload and drive them from state.

Use Arcade Physics for ordinary 2D collision and movement. Use camera follow/bounds,
groups/pools, tweens and particles rather than recreating those systems. Still follow
the creator: a puzzle may need no physics; a bespoke shader toy may justify another
renderer. Existing games keep their current engine unless migration is requested.

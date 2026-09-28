# Grotto Skills

Public skill repository for The Grotto developer ecosystem.

This repo is intentionally simple: each skill lives under `skills/<skill-name>/` with a `SKILL.md` entry point plus optional `templates/`, `references/`, and `assets/`.

Game development covers design, production, architecture, levels, combat,
progression, controls, art, animation, audio, accessibility, playtesting and safe
iteration. Platform integrations cover runtime services, ownership gates and
explicitly external hosting. Start with the decision you need to make; there is
no requirement to load the whole collection.

## Included skills

<!-- generated-skill-catalog:start -->

## Game development



### Three.js worlds

Path: `skills/grotto-3d-scene-builder/SKILL.md`

Build or improve a Three.js game, place animated GLB models, connect physics, or diagnose rendering cost.

Outcome: A readable 3D world with coherent cameras, collision and model placement.

### Combat and enemy behavior

Path: `skills/grotto-combat-and-enemies/SKILL.md`

Build readable attacks, hit resolution, enemy decisions and navigation that support the intended combat experience.

Outcome: Predictable hit rules and enemies with readable, purposeful behavior.

### Core game design

Path: `skills/grotto-core-of-gaming/SKILL.md`

Design or improve a game loop, challenge, progression, feedback, or playtest plan.

Outcome: A clear player fantasy, meaningful choices and a complete playable loop.

### Cross-device controls

Path: `skills/grotto-cross-device-controls/SKILL.md`

Build or repair desktop and touch controls, responsive layouts, or input recovery.

Outcome: Keyboard, pointer and touch actions that recover cleanly after interruptions.

### Character animation

Path: `skills/grotto-game-animation/SKILL.md`

Animate sprite characters or repair jitter, timing, facing, pivots and movement-to-animation transitions.

Outcome: Stable pivots, responsive transitions and frame-rate-independent clips.

### Game architecture

Path: `skills/grotto-game-architecture/SKILL.md`

Structure game state, simulation clocks and lifecycle ownership; repair restart duplication or stale asynchronous work.

Outcome: One owner for game state, consistent timing and clean restart lifecycles.

### Art direction and asset planning

Path: `skills/grotto-game-art-direction/SKILL.md`

Establish a coherent game visual system and plan, inspect and integrate assets at gameplay scale within the available budget.

Outcome: A consistent visual direction and a verified, budgeted asset set.

### Game audio

Path: `skills/grotto-game-audio/SKILL.md`

Design and integrate game sound, music, browser audio unlock, bounded mixing and playback cleanup within the run budget.

Outcome: Intentional sound with working mute, startup, mixing and teardown.

### Game feel and feedback

Path: `skills/grotto-game-feel-juice/SKILL.md`

Improve responsiveness and readable feedback, tune movement or combat, and fit effects and audio to the intended experience.

Outcome: Responsive actions and readable effects that fit the intended style.

### Playtesting and performance

Path: `skills/grotto-game-playtest/SKILL.md`

Playtest a browser game or diagnose softlocks, input failures, save loss, broken recovery and performance regressions.

Outcome: Reproducible findings from actual play, recovery and measured performance.

### First playable workflow

Path: `skills/grotto-game-production/SKILL.md`

Scope and iterate a Studio game through a risk test, first playable, vertical slice and evidence-backed handoff.

Outcome: A scoped playable slice, clear risks and an evidence-backed iteration plan.

### Game UI and accessibility

Path: `skills/grotto-game-ui-accessibility/SKILL.md`

Design readable HUDs, menus and accessible game interactions with explicit focus, input and assist-setting behavior.

Outcome: Menus and game information usable across input, motion and audio preferences.

### Level design and pacing

Path: `skills/grotto-level-design/SKILL.md`

Design authored levels, teach mechanics through play, tune encounter pacing and validate puzzle or traversal routes.

Outcome: Readable spaces, purposeful encounters and reachable recovery paths.

### Phaser 2D games

Path: `skills/grotto-phaser-2d-builder/SKILL.md`

Build or repair a Studio Phaser game using its installed TypeScript, scene, physics, asset and input helpers.

Outcome: A working 2D game with deliberate scenes, physics and state ownership.

### Pixel art and raster assets

Path: `skills/grotto-pixel-art-assets/SKILL.md`

Create procedural pixel art, pixelify an existing image, or integrate generated raster assets.

Outcome: Consistent, readable sprites and textures connected to real asset files.

### Procedural worlds

Path: `skills/grotto-procedural-generation/SKILL.md`

Generate reproducible playable levels, encounters or loot, and diagnose unreachable goals or unfair seeds.

Outcome: Reproducible worlds validated against the actual movement rules.

### Progression and balance

Path: `skills/grotto-progression-and-balance/SKILL.md`

Design in-game resource sources and sinks, meaningful unlocks and scenario-based balance without duplicating rewards.

Outcome: Useful unlocks and resource rules tuned against representative play.

### Safe game updates

Path: `skills/grotto-studio-game-updates/SKILL.md`

Update an existing Studio game while preserving its identity, save compatibility and publication history.

Outcome: A verified update that preserves game identity and existing progress.

## Platform integrations



### Runtime SDK

Path: `skills/grotto-game-runtime-developer-sdk/SKILL.md`

Integrate or debug Grotto identity, cloud saves, scores, events, or capability-gated multiplayer.

Outcome: Trusted identity, version-aware cloud saves and capability-scoped services.

### Token-gated inventory

Path: `skills/grotto-game-token-gated-inventory/SKILL.md`

Gate game content using Grotto capability-scoped ERC-721 or ERC-1155 inventory.

Outcome: Ownership gates that handle missing capabilities and stale inventory safely.

### External hosting and GitHub

Path: `skills/grotto-hosted-game-github-workflow/SKILL.md`

Maintain an explicitly external, durably hosted game client with a secure Grotto runtime wrapper.

Outcome: A durable external game client with a secure runtime wrapper and release checks.

<!-- generated-skill-catalog:end -->

Public SDK URL:

```html
<script src="https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js"></script>
```

Public Grotto skills page:

https://www.enterthegrotto.xyz/skills

Live Grotto API docs:

https://api.enterthegrotto.xyz/docs

This repository publishes complete skill packages. Keep each skill folder, including references and templates, when installing or sharing it. A raw SKILL.md alone is only the entrypoint. The generated relevance manifest identifies each version and the SHA-256 of every resource.

Studio's minimal-start experiment uses a separate documentation-only projection
of this release: skill routers and Markdown capability references. Template files
remain preserved in the public package for history and compatibility, but Studio
builds neither advertise nor retrieve them. Capability references describe APIs
and design choices without supplying a ready-made game.

## Repository layout

```text
skills/
  grotto-game-runtime-developer-sdk/
    SKILL.md
    references/
      sdk-contract.md
    templates/
      minimal-runtime-game.html
assets/
  grotto-game-runtime-developer-sdk/
    grotto-runtime-sdk-ad-redo.png
  grotto-game-token-gated-inventory/
    grotto-game-token-gated-inventory-ad.png
    grotto-game-token-gated-inventory-ad.svg
  grotto-hosted-game-github-workflow/
    grotto-hosted-game-github-workflow-ad.png
    grotto-hosted-game-github-workflow-ad.svg
relevance/
  manifest.json
```

## Contributing

Open a pull request to add or update a skill. Keep skills creator-facing, practical, and free of private credentials.

Discovery display names, collection, stage and expected outcomes live in each
skill's metadata alongside its version.

Run `npm test` before opening the PR. The zero-dependency validator checks the
manifest, generated README catalog, frontmatter, relationships, links, template
syntax, resource hashes, and credential-shaped values. Run npm run generate:readme after a content or discovery change; it generates both the manifest and README from the skill folders. Edit names, descriptions and tags in SKILL.md; keep selective symptom phrases and reference-only exceptions in relevance/routing.json. Bump the skill version whenever its content changes.

### Safety rules

- Do not commit API keys, bearer tokens, Privy secrets, Railway/Vercel tokens, `gst_*`, or `grs_*` values.
- Redact secrets as `[REDACTED]`.
- Prefer runnable examples and explicit security notes.
- Keep Grotto identity/session guidance clear: games should not trust wallet/user IDs supplied by client-side code.
- Treat optional inventory/multiplayer scopes as explicit per-game platform capabilities.
- Treat `roomId=public` as routing only and atomically consume each multiplayer ticket `jti` once.

## PR watch

This repo is watched for pull requests by Bob/Hermes so skill contributions can be triaged quickly.

## Evaluate a change

The package tests run the frame-clock and seeded-world recipes as code. They
also check the generated catalog and references. These checks establish
specific invariants; they do not establish that an agent makes a better game.

Use the scenarios in [evals/scenarios.json](evals/scenarios.json) for independent
forward tests. Give the agent the request, the skill package and any raw fixture;
do not reveal the expected answer. Record revision, model/configuration,
resources read, completion/cost/time, observable failures and actual browser
evidence. Compare the same scenarios and settings across revisions, and retain
failures. Human playtest judgment is needed for style, readability and fun.

Studio separately runs a creator-request routing benchmark and guarded
retrieval/protocol tests. Selection accuracy, working recipes, actual generated
game behavior and production activation are different evidence.

## Publish and verify

Publish the complete folder tree and generated manifest together. Deploy a
reader that supports references before publishing routed guides. Schema 2 adds
versions and resource hashes; current Studio readers use their bundled release
when a remote is legacy, older, invalid or initially unavailable. Runs pin one
release so pagination and later references cannot silently change underneath
them.

After publishing, run node scripts/check-public-release.mjs. It compares the
public manifest and every advertised resource against this checkout. A source
merge or a matching version label alone is insufficient.

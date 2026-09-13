# Grotto Skills

Public skill repository for The Grotto developer ecosystem.

This repo is intentionally simple: each skill lives under `skills/<skill-name>/` with a `SKILL.md` entry point plus optional `templates/`, `references/`, and `assets/`.

## Included skills

<!-- generated-skill-catalog:start -->

### Grotto 3d Scene Builder

Path: `skills/grotto-3d-scene-builder/SKILL.md`

Build or improve a Three.js game, place animated GLB models, connect physics, or diagnose rendering cost.

### Grotto Core of Gaming

Path: `skills/grotto-core-of-gaming/SKILL.md`

Design or improve a game loop, challenge, progression, feedback, or playtest plan.

### Grotto Cross Device Controls

Path: `skills/grotto-cross-device-controls/SKILL.md`

Build or repair desktop and touch controls, responsive layouts, or input recovery.

### Grotto Game Animation

Path: `skills/grotto-game-animation/SKILL.md`

Animate sprite characters or repair jitter, timing, facing, pivots and movement-to-animation transitions.

### Grotto Game Feel Juice

Path: `skills/grotto-game-feel-juice/SKILL.md`

Improve responsiveness and readable feedback, tune movement or combat, and fit effects and audio to the intended experience.

### Grotto Game Playtest

Path: `skills/grotto-game-playtest/SKILL.md`

Playtest a browser game or diagnose softlocks, input failures, save loss, broken recovery and performance regressions.

### Grotto Game Runtime Developer SDK

Path: `skills/grotto-game-runtime-developer-sdk/SKILL.md`

Integrate or debug Grotto identity, cloud saves, scores, events, or capability-gated multiplayer.

### Grotto Game Token-Gated Inventory

Path: `skills/grotto-game-token-gated-inventory/SKILL.md`

Gate game content using Grotto capability-scoped ERC-721 or ERC-1155 inventory.

### Grotto Hosted Game GitHub Workflow

Path: `skills/grotto-hosted-game-github-workflow/SKILL.md`

Maintain an explicitly external, durably hosted game client with a secure Grotto runtime wrapper.

### Grotto Phaser 2d Builder

Path: `skills/grotto-phaser-2d-builder/SKILL.md`

Build or repair a Studio Phaser game using its installed TypeScript, scene, physics, asset and input helpers.

### Grotto Pixel Art Assets

Path: `skills/grotto-pixel-art-assets/SKILL.md`

Create procedural pixel art, pixelify an existing image, or integrate generated raster assets.

### Grotto Procedural Generation

Path: `skills/grotto-procedural-generation/SKILL.md`

Generate reproducible playable levels, encounters or loot, and diagnose unreachable goals or unfair seeds.

### Grotto Studio Game Updates

Path: `skills/grotto-studio-game-updates/SKILL.md`

Update an existing Studio game while preserving its identity, save compatibility and publication history.

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

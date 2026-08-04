# Grotto Skills

Public skill repository for The Grotto developer ecosystem.

This repo is intentionally simple: each skill lives under `skills/<skill-name>/` with a `SKILL.md` entry point plus optional `templates/`, `references/`, and `assets/`.

## Included skills

<!-- generated-skill-catalog:start -->

### Grotto Game Runtime Developer SDK

Path: `skills/grotto-game-runtime-developer-sdk/SKILL.md`

Core Grotto Runtime SDK guide for trusted identity, bounded cloud sessions, saves, events, capability-gated inventory, and one-use public multiplayer bootstrap tickets.

### Grotto Core of Gaming

Path: `skills/grotto-core-of-gaming/SKILL.md`

Core game-design principles for shaping clear challenge, meaningful choices, readable feedback, fair progression, game feel, and a complete entertaining loop.

### Grotto Game Token-Gated Inventory

Path: `skills/grotto-game-token-gated-inventory/SKILL.md`

Token-gate Grotto game content using capability-gated exact ERC-1155/ERC-721 balances over the immutable verified-wallet launch snapshot.

### Grotto Hosted Game GitHub Workflow

Path: `skills/grotto-hosted-game-github-workflow/SKILL.md`

Maintain Grotto games with GitHub, CI, hosted clients, a secure runtime wrapper, and replay-safe authoritative inventory/multiplayer services.

### Grotto Studio Game Updates

Path: `skills/grotto-studio-game-updates/SKILL.md`

How a creator updates a game in Grotto Studio so the new version reaches players instantly — iterating with B.O.B., keeping cloud saves intact, and rolling back.

### Grotto Pixel Art Assets

Path: `skills/grotto-pixel-art-assets/SKILL.md`

Make game assets cheaply: draw pixel art procedurally in code (free), convert any image to crisp pixel art at runtime (free, zero-dep pixelify), and use cheap AI image generation for sprites/textures when you need raster art.

<!-- generated-skill-catalog:end -->

Public SDK URL:

```html
<script src="https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js"></script>
```

Public Grotto skills page:

https://www.enterthegrotto.xyz/skills

Live Grotto API docs:

https://api.enterthegrotto.xyz/docs

This repo is the canonical public source for skill markdown. Website download links should point at the raw files in this repo instead of maintaining separate markdown copies.

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
syntax, and credential-shaped values. Run `npm run generate:readme` after adding
or renaming a manifest entry.

### Safety rules

- Do not commit API keys, bearer tokens, Privy secrets, Railway/Vercel tokens, `gst_*`, or `grs_*` values.
- Redact secrets as `[REDACTED]`.
- Prefer runnable examples and explicit security notes.
- Keep Grotto identity/session guidance clear: games should not trust wallet/user IDs supplied by client-side code.
- Treat optional inventory/multiplayer scopes as explicit per-game platform capabilities.
- Treat `roomId=public` as routing only and atomically consume each multiplayer ticket `jti` once.

## PR watch

This repo is watched for pull requests by Bob/Hermes so skill contributions can be triaged quickly.

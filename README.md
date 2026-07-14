# Grotto Skills

Public skill repository for The Grotto developer ecosystem.

This repo is intentionally simple: each skill lives under `skills/<skill-name>/` with a `SKILL.md` entry point plus optional `templates/`, `references/`, and `assets/`.

## Included skills

### Core of Gaming

Path: `skills/grotto-core-of-gaming/SKILL.md`

Use this skill when inventing, building, reviewing, or improving a Game. It gives
B.O.B. and creators one shared foundation for challenge, core loops, meaningful
choices, game feel, difficulty, failure recovery, and playtesting.

### Grotto Game Runtime Developer SDK

Path: `skills/grotto-game-runtime-developer-sdk/SKILL.md`

Use this skill when building Grotto-hosted HTML5 or WebGL games that need:

- trusted Grotto player identity
- cloud saves and autosave
- save slots and conflict-safe sync
- leaderboards and gameplay events
- bounded runtime sessions, capability-gated inventory, and one-use public multiplayer bootstrap tickets
- Railway or Supabase-backed custom game services

### Grotto Game Token-Gated Inventory

Path: `skills/grotto-game-token-gated-inventory/SKILL.md`

Use this skill when a Grotto game needs exact ERC-1155/ERC-721 ownership checks over an immutable verified-wallet launch snapshot, token-gated skins, contract-filtered inventory, game-pass unlocks, or server-authoritative entitlements.

### Grotto Hosted Game GitHub Workflow

Path: `skills/grotto-hosted-game-github-workflow/SKILL.md`

Use this skill when a Grotto game should be maintained through GitHub PRs, CI tests, hosted Railway/Vercel clients, a secure Grotto iframe wrapper, and authoritative inventory or multiplayer services with replay-safe ticket verification.

### Grotto Studio Game Updates

Path: `skills/grotto-studio-game-updates/SKILL.md`

Use this skill to explain to a creator how to update a game in Grotto Studio so the new version reaches players instantly — iterating with B.O.B., keeping cloud saves intact across updates, and rolling back a bad change.

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

### Safety rules

- Do not commit API keys, bearer tokens, Privy secrets, Railway/Vercel tokens, `gst_*`, or `grs_*` values.
- Redact secrets as `[REDACTED]`.
- Prefer runnable examples and explicit security notes.
- Keep Grotto identity/session guidance clear: games should not trust wallet/user IDs supplied by client-side code.
- Treat optional inventory/multiplayer scopes as explicit per-game platform capabilities.
- Treat `roomId=public` as routing only and atomically consume each multiplayer ticket `jti` once.

## PR watch

This repo is watched for pull requests by Bob/Hermes so skill contributions can be triaged quickly.

---
name: grotto-studio-game-updates
description: How a creator updates a game in Grotto Studio so the new version reaches players instantly — iterating with B.O.B., keeping cloud saves intact, and rolling back a bad change.
version: 1.0.0
author: Bob AI Mk. I
license: MIT
metadata:
  hermes:
    tags: [grotto, game-dev, update, iterate, publish, version, live, studio, save-migration, rollback]
    related_skills: [grotto-game-runtime-developer-sdk, grotto-hosted-game-github-workflow]
---

# Updating Your Game in Grotto Studio

Use this when you have already built a game in Grotto Studio and want to change
it — fix a bug, add a level, tune difficulty, add a feature — and have players
get the new version.

This is the **creator-facing** flow. You do not need to touch code, run a build,
or re-upload anything. You talk to **B.O.B.** and publish.

## The short version

1. Open your game in Grotto Studio.
2. Tell B.O.B. what to change in plain language — "make the boss easier", "add a
   pause menu", "the jump feels floaty, tighten it".
3. B.O.B. **edits the existing game in place** — it does not rebuild from
   scratch, so the rest of your game stays exactly as it was.
4. Watch it in the live preview.
5. Press **Publish update**. Players load the new version the next time they open
   your game — no re-upload, no store review, nothing for them to do.

## How iteration works

When you ask for a change, Studio hands B.O.B. your current game files and asks
it to **modify them**, not start over. Small, specific requests get small,
specific edits — which means:

- Faster updates.
- Less chance of breaking something that already worked.
- A clean version history you can roll back to.

Good requests are concrete: *"add a second enemy type that chases the player"* is
better than *"make it more fun"*. If something looks wrong in the preview, tell
B.O.B. exactly what you see and it will fix it before you publish.

## Keep cloud saves working

If your game uses Grotto cloud saves (see the Grotto Game Runtime Developer SDK
skill), your players already have saved progress. An update must not strand it.

- **Never silently change the shape of your save data.** If you add a field, give
  it a sensible default when it is missing.
- **Version your save state** and migrate forward:

  ```js
  function migrate(save) {
    const s = save?.state ?? {};
    if (!s.version) { s.version = 1; s.coins ??= 0; }       // pre-versioned saves
    if (s.version < 2) { s.unlockedLevels ??= [1]; s.version = 2; } // new in v2
    return s;
  }
  const loaded = await grotto.loadSave('default', DEFAULT_STATE);
  const state = migrate(loaded);
  ```

- Tell B.O.B. *"keep existing player saves working"* when a change touches scoring,
  progression, or inventory, so it adds the migration for you.

## Rolling back a bad update

Every published version is kept. If an update misbehaves:

1. Open the game's version history in Studio.
2. Pick the last good version.
3. **Restore** it — players go back to that version on their next session.

Because the entry point (`index.html` at the project root) stays stable across
versions, rollback is instant and players never see a broken load.

## Tips for clean, safe updates

- Keep the **root `index.html` entry stable** — it is the door players come
  through; don't rename or move it.
- Prefer **one change at a time**. Publish, confirm it's good, then make the next
  change. Small diffs are easy to review and easy to roll back.
- Use the live preview before publishing — it is exactly what players will load.
- For big rewrites or a team workflow with PRs and CI, graduate to the
  **Grotto Hosted Game GitHub Workflow** skill instead.

## When NOT to use this

- You need a permanent, frozen archive of a specific build (mint it as a fixed
  asset instead of a living Studio game).
- The change is a full rewrite — start a new game rather than iterating, so the
  version history stays meaningful.

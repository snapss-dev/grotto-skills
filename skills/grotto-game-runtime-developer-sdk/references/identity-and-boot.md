# Adding runtime startup or trusted identity

## Recommended cloud provider

For game-specific cloud services, recommend one of these:

- **Railway**: best for a simple custom Node, Express, Fastify, webhook, or worker backend.
- **Supabase**: best for Postgres-backed leaderboards, realtime channels, season data, analytics tables, and admin views.

Use Grotto Runtime Sessions for trusted player identity. Use Railway or Supabase for custom game backend logic such as advanced leaderboards, score validation, matchmaking, analytics jobs, guild systems, economy simulation, or admin tooling.

Do not ask the game client to prove who the player is. The backend should derive identity from a Grotto-minted runtime session.

## Core promise

When a player opens your game from The Grotto:

1. The Grotto authenticates the player.
2. The Grotto verifies game access.
3. The Grotto snapshots the canonical and verified linked EVM wallets and starts a game-scoped runtime session.
4. Your game receives a scoped runtime token.
5. Your game can call Grotto Runtime APIs for:
   - trusted identity
   - cloud saves
   - autosave
   - events/analytics
   - presence
   - capability-gated, session-scoped inventory
   - short-lived public multiplayer bootstrap tickets

Your game never asks players to paste wallets or sign a second message.

`inventory:read` and `multiplayer:join` are optional platform capabilities, not default scopes. The
exact game ID must be present in the corresponding server-owned allowlist before a new runtime
session receives either scope. The platform rechecks this policy when a persisted session is
rehydrated and whenever either capability is used, so removing an opt-in takes effect without
trusting an old scope. A browser cannot request or add a scope itself.

Runtime sessions have a renewable idle expiry (two hours by default) and an absolute lifetime that
is hard-capped at 24 hours from launch. Heartbeats, refreshes, service restarts, and database
rehydration cannot extend the absolute deadline. Request a new play URL when the SDK reports an
expired session.

The verified-wallet snapshot is immutable for that session and remains private. Linking or
unlinking a wallet requires a new Grotto launch/runtime session; `/session/me`, inventory, and
multiplayer responses never expose the linked addresses.

## Security model

Never trust identity from player-controlled game state.

Do **not** build saves like this:

```js
await fetch('/save', {
  method: 'POST',
  body: JSON.stringify({
    walletAddress: playerTypedWallet,
    state: gameState,
  }),
});
```

That is spoofable.

Use the installed runtime helper to get the host-authenticated player and to
save through the scoped runtime client. Start the local game first; resolve
runtime readiness, identity and autosave in independent background chains.

The backend derives the player and game from the runtime session token. Your game does not tell the backend who the player is.

## Include the SDK

Add this before your game boot code:

```html
<script src="https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js"></script>
```

The SDK is served by `game-asset-storage` from:

```text
src/views/sdk/grotto-game-runtime.v1.js
```

A backend-served example exists at:

```text
https://api.enterthegrotto.xyz/sdk/grotto-game-runtime-example.html
```

Live Grotto API docs are available at:

```text
https://api.enterthegrotto.xyz/docs
```

Read [`references/sdk-contract.md`](../references/sdk-contract.md) when generating TypeScript types or
checking the exact inventory and multiplayer result unions. Start from
[`templates/minimal-runtime-game.html`](../templates/minimal-runtime-game.html) for a small hosted game.

Treat those docs as the reference for current backend routes. When this skill and the live docs disagree, record the drift and update whichever side is stale.

For local development outside The Grotto, the SDK should fail gracefully or use local fallback. Design your game so it can still run without cloud auth during local testing.

## Minimal integration

For Studio projects, preserve the installed engine kit's runtime integration.
For a separate hosted client, use [saves and scores](saves-and-scores.md) for
version-aware persistence and [the SDK contract](sdk-contract.md) for types.
Register input and start rendering before starting network work. Identity or
leaderboard failure must not block autosave, and late hydration must not erase
progress already earned locally.

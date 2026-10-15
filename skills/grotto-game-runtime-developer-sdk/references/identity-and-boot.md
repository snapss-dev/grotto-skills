# Adding runtime startup or trusted identity

Select the engine adapter through [Grotto Game Setup](../../grotto-game-setup/SKILL.md).
The browser SDK and Unreal Windows adapter reuse Grotto's base authenticated
admission and scoped runtime APIs. Neither asks for a second Privy login.
Native v1 supports the base identity/save/presence/event scopes only; the optional
capabilities described below apply to separately enabled browser integrations.

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
   - session-scoped inventory
   - short-lived public multiplayer bootstrap tickets

Your game never asks players to paste wallets or sign a second message.

`inventory:read` is a default scope for ordinary published game runtimes. No operator approval,
game allowlist, or contract allowlist is needed. Persisted published-game sessions issued with
older scope lists also receive inventory access on rehydration. Creator-only hosted previews
have identity and save scopes only.

`multiplayer:join` remains optional and requires the exact game ID in its server-owned allowlist.
The platform rechecks multiplayer policy on rehydration and use, so removing its opt-in takes
effect without trusting an old scope. A browser cannot grant itself multiplayer authority.

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

To connect an existing game database or server, follow
[private backend verification](private-backend.md). It supplies the fixed
verification endpoint, bearer transport, `purpose: play` check, expected game,
scope/expiry checks and a server example. The opaque `grs_*` is not a JWT.

## Finding this game's ID when another integration requires it

### Before launch: saved drafts and developer handoff

Use the canonical ID of the saved game, even while it is private:

- After create or update, read `game.id` from the successful
  `POST /api/games` or `PUT /api/games/:id` response. Save that exact returned
  value; do not substitute a proposed `client_game_id`.
- In Creator Hub, find the game under Games and copy its **Game ID**, or open
  **Edit details** and copy it in the editor. The draft save confirmation also
  shows the ID. Updating or publishing that same game keeps its ID.
- An authorized agent can use the owner's bearer-authenticated
  `GET /api/games?creator=<canonical-wallet>&include_drafts=true&include_hidden=true`
  and read each `games[].id`, or use `GET /api/games/:id` to inspect a known
  record. Follow pagination when looking through the owner's catalog. Use the
  verified account's canonical Grotto wallet; a query wallet is not proof of
  ownership. Anonymous and other-account requests cannot discover private drafts.

Give your developer the ID and the engine/configuration step that needs it.
For example: "Use `game-...` as this saved game's canonical ID in the integration
configuration. Launch through Grotto for authenticated identity and saves."
Copy only the game ID, never a bearer token, runtime token or `sessionId`.
A title, slug, Studio project ID, local form draft or license/token address is
not the canonical game ID. A local draft that has not created or linked a game
record may have no game ID yet.

### Before an uploaded build: private hosted preview

When hosted previews are enabled, a verified creator can use **Connect hosted
game** at `/games/hosted-preview`, or bearer-authenticated
`POST /api/games/hosted-preview` with `{ "name": "My game", "url": "https://<exact-host>/" }`.
This returns `gameId` and `previewUrl` and creates a private, review-marked draft
with no uploaded build. The owner-scoped `GET /api/games/:id/hosted-preview`
returns that same `gameId`. Keep this record and update/publish it when ready,
rather than creating a second listing with a different ID.

The creator's hosted preview supports identity and cloud saves only. It grants
no public play, inventory, scores, rewards or transactions. The exact URL and
owner checks remain required. This path needs a hosted HTTPS client; it is not
an empty native-build registration flow. The regular Web upload form still
requires a game file and thumbnail before saving a platform draft.

### After browser launch: host-scoped runtime identity

Most SDK calls, including saves, events, inventory and `requestAction()`, take
no game ID. The Grotto host supplies the authoritative game-scoped session. In
a browser game launched through the Grotto player or connected creator-hosted
preview, read only the public ID after the SDK is ready:

```js
const client = await window.GrottoRuntime.ready();
const gameId = client.runtime.gameId;
```

A standalone Studio canvas or local page may have no authenticated host
descriptor, so do not block authoring while waiting for this value.

Use that value for display or an external service that explicitly requires the
game ID. The runtime descriptor also contains a secret `sessionId`: never log,
copy, put in a URL, or send the whole descriptor to that service. A backend
must still verify the Grotto session instead of trusting a client-supplied ID.

In Studio, inspect the current owner's project or library record for
`platformGameId` / `publishedGameId` when a configuration step needs a
linked canonical game ID. These fields can be empty before linking or
publication; the Studio project ID is a different identifier. Check the
game's publication state separately. A prepared release may return a reserved
`release.gameId`, but that does not mean the game is live. For a connected
hosted preview, use the ID returned by Connect hosted game or the owner-scoped
preview record; the preview reserves the same ID that publication will use.
Do not infer a game ID from a title, slug, or project URL, and do not ask the
creator to paste one unless the authorized records are unavailable and an
explicit external configuration truly cannot proceed without it.

## Include the SDK

Studio already bundles the official SDK in its protected engine runtime. Do not
add a duplicate SDK script there. For a separate hosted client without that
runtime, add this before its game boot code:

```html
<script src="https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js"></script>
```

Use that public SDK URL; the game's project does not need the Grotto server
repository or its internal SDK source path.

Live Grotto API docs are available at:

```text
https://api.enterthegrotto.xyz/docs
```

Read [the SDK contract](sdk-contract.md) when generating TypeScript types or
checking the exact inventory and multiplayer result unions. Author the game
around the creator's intent and integrate only the capabilities it needs.

Treat those docs as the reference for current backend routes. When this skill and the live docs disagree, record the drift and update whichever side is stale.

For local development outside The Grotto, the SDK should fail gracefully or use local fallback. Design your game so it can still run without cloud auth during local testing.

## Minimal integration

For Studio projects, preserve the installed engine kit's runtime integration.
For a separate hosted client, use [saves and scores](saves-and-scores.md) for
version-aware persistence and [the SDK contract](sdk-contract.md) for types.
Register input and start rendering before starting network work. Identity or
leaderboard failure must not block autosave, and late hydration must not erase
progress already earned locally.

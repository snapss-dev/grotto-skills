# Reviewing packaging, security or a complete integration example

## Packaging checklist

Before uploading to The Grotto:

- [ ] Game zip has `index.html` at root.
- [ ] SDK script is included before game boot code.
- [ ] Game starts while runtime readiness is pending and also when it fails.
- [ ] Game has local fallback for local dev or runtime failure.
- [ ] Autosave is enabled for progress games.
- [ ] Save slot names are stable.
- [ ] Game never asks players for wallet addresses as identity proof.
- [ ] Game never stores `grs_*` in exported save files.
- [ ] Game handles cloud save failure without losing current progress.
- [ ] Game handles page reload with cloud load.
- [ ] Inventory is read with `grotto.getInventory()` and fails closed when incomplete.
- [ ] Optional inventory/multiplayer scopes were enabled for the exact published game ID.
- [ ] Multiplayer tickets are requested just before every connect/reconnect and never enter URLs or logs.

## Security checklist

- [ ] Do not send arbitrary `walletAddress` to save APIs.
- [ ] Do not expose admin/API keys in game files.
- [ ] Do not put secrets in event payloads or saves.
- [ ] Do not trust localStorage for competitive/monetized outcomes.
- [ ] Use server-confirmed events for leaderboards or rewards.
- [ ] Keep authoritative multiplayer state on a trusted server.
- [ ] Treat `roomId=public` only as untrusted routing; authorize party/queue/ranked placement server-side.
- [ ] Verify the complete strict multiplayer ticket profile and atomically consume each `jti` once.
- [ ] Refresh JWKS on an unknown `kid` and support current-plus-overlap public keys.

## Common mistakes

### Mistake: Trusting URL params

Bad:

```js
const wallet = new URLSearchParams(location.search).get('wallet');
```

Good:

```js
const me = await grotto.getPlayer();
const wallet = me.player.walletAddress;
```

### Mistake: Saving only on unload

Bad:

```js
window.addEventListener('beforeunload', save);
```

Good:

```js
const autosave = grotto.createAutosave({ getState, applyState, defaultState });
await autosave.start(); // In a background task; never gate input or rendering.
```

### Mistake: No local write-ahead fallback

Bad: only cloud save, so network failure loses progress.

Good: SDK/local save immediately, cloud flush after.

## Integration examples

Preserve the installed Studio runtime helpers. For custom integration, use
[saves and scores](saves-and-scores.md) and [identity and boot](identity-and-boot.md).
Examples are reference material, not an instruction to replace the project's
working engine or delay local gameplay on cloud initialization.

## When to use lower-level backend work instead

Use the implementation skill `grotto-game-api-save-system` when building or changing the Grotto backend/runtime itself.

Use this skill when building a game that consumes the runtime.

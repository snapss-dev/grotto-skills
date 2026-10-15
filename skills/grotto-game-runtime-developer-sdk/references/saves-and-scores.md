# Implementing autosave, migration, save conflicts or leaderboards

## Autosave integration

Preserve Studio's installed autosave helper. The current kit owns `default` for
best-score state; use a distinct stable slot for authored world/inventory or
other unrelated state and keep one owner per slot. When implementing a custom
integration, run setup in a background task after local input and rendering have
started. Use autosave for games with progress.

```js
const autosave = grotto.createAutosave({
  slot: 'game-state',
  defaultState: DEFAULT_STATE,
  getState: () => gameState,
  applyState: (state) => {
    // Define a game-specific merge that preserves progress earned before hydration.
    gameState = mergeSavedWithCurrent(state, gameState);
    renderGame();
  },
  intervalMs: 30000,
  onSaved: ({ version }) => {
    showSaveStatus(`Saved v${version}`);
  },
  onError: (error) => {
    showSaveStatus('Cloud save unavailable');
    console.warn('Autosave failed:', error);
  },
  onConflict: (conflict) => {
    // Reconcile according to the actual game economy and progression rules.
    console.warn('Save conflict:', conflict);
  },
});

await autosave.start(); // Background task only; never gate local boot.
// Re-mark current state after startup so early local progress is persisted.
autosave.markDirty();

function onPlayerDidSomethingImportant() {
  gameState.coins += 1;
  autosave.markDirty();
}
```

The SDK should:

- save locally immediately when dirty
- cloud save every interval
- save on `visibilitychange`
- save on `pagehide`
- retry after transient failures
- preserve progress locally if the network drops

## Manual save/load and multiple slots

Slots and board names match `[A-Za-z0-9_-]{1,64}`; omitted names use `default`.
Save state must be a JSON object or array. Platform defaults are 512 KiB of
UTF-8 serialized state per save and 16 distinct slots per game/player. Events
use `[A-Za-z0-9_.:-]{1,80}` types and at most 16 KiB of serialized payload.
Deployment limits can be stricter; handle validation and rate-limit responses.
Serialize `BigInt` as decimal strings rather than putting it in JSON directly.

Prefer an autosave instance per slot. If you manage saves manually, retain the
version returned by `loadSave`, send it as `{ baseVersion }` to `save`, and
replace the tracked version only after success. Serialize writes within each
slot. Handle `409 SAVE_CONFLICT` by loading and reconciling competing state;
never blindly retry with a fresh version and stale data. Initial creation uses
`baseVersion: 0`. Schema migrations belong in the game state, independently of
this storage version.

`loadSave()` can return local/default state with `offline: true` when cloud reads
fail. A 404 uses local/default state without that flag. Neither establishes a
successful cloud write or that browser storage persisted a backup. Do not grant
valuable server state from a fallback.

The conflict body contains `serverVersion`, `serverUpdatedAt` and `serverState`.
An autosave `onConflict` callback observes that body; returning merged state
does not change the helper's tracked version. Stop that autosave owner, preserve
local progress, resolve competing state, explicitly save against the verified
server version, then start one owner from the resolved save. Test another
conflict during resolution. Call `stop()` on unmount/account change and mark
dirty after a successful restart. A failed `flush()` returns `false`; even
`true` can mean nothing needed writing, so use `onSaved` for a cloud-write receipt.

## Built-in leaderboards

Grotto stores a leaderboard per game — no custom backend is required for a basic
board. Submit a score and the server records the authenticated player's **best** for
that board; read the top entries to display a ranking.

```js
// Submit a score (keeps the player's highest on this board).
await grotto.submitScore(score, { board: 'default', meta: { level } });

// Read the top entries.
const { entries } = await grotto.leaderboard({ board: 'default', limit: 10 });
// entries: [{ rank, wallet, score, meta, updatedAt }, ...]
renderLeaderboard(entries);
```

Notes:

- Boards are simple string keys (e.g. `default`, `weekly`, `endless`). Same naming
  rules as slots.
- Scores are higher-is-better; only a player's best per board is kept.
- Submit finite numeric scores. Read limits default to 50 and are bounded to
  1–500 integer entries; ties sort by stored update time ascending.
- The score value comes from the client. Authentication and server storage do
  not validate the run. Prizes or competitive claims need game-owned server
  validation; this basic board is not an anti-cheat authority.
- `submitScore` is shorthand for `grotto.event('score', { score, board, meta })`,
  so you can also emit raw `score` events if you prefer.
- Reach for Supabase only for needs the built-in board doesn't cover (server-side
  score validation, seasons, complex tie-breakers, analytics joins).
- `leaderboard()` returns an empty board on HTTP 503. Other failures propagate,
  and `submitScore()` rejects on API failure. Catch both in background work.
  `ready()` can reject on a standalone page, where the game owns local play
  and fallback; the SDK does not supply a no-op authenticated client.

## Diagnose lost progress

Separate game schemaVersion, server baseVersion and player/game/slot identity. Confirm the same identity and slot are loaded after refresh, and that a real mutation marks the current state dirty. Reproduce slow initial hydration: progress earned while loading must survive.

Use field-specific reconciliation. Max(bestScore) and union(unlockedLevels) can be valid for monotonic progress. Max(coins) is not a safe general merge for spendable currency, inventory or branching checkpoints; it can refund purchases or duplicate value. Preserve conflicting snapshots and resolve according to domain rules or server authority. Do not silently overwrite a newer state to make a test green.

A save error does not prove a local backup exists. Show cached/offline status only after persistence succeeds, handle unavailable/full browser storage, and report cloud synchronization separately. Test refresh after a mutation, late hydration, conflict, offline/reconnect and an old-schema fixture.

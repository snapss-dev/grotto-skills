# Handling caching, revocation or security review

## Caching and revocation

- Runtime inventory reads require complete 500-item pagination with non-negative safe-integer
  ERC-1155 and ERC-721 totals. Missing totals, provider errors, exceeding
  `GAME_RUNTIME_INVENTORY_MAX_PAGES` (default 20, clamped to 1-100) for a wallet, an invalid/missing
  wallet snapshot, or more than 50 snapshotted wallets fail the whole request with generic
  `503 RUNTIME_INVENTORY_UNAVAILABLE`.
- Strict runtime reads do not serve stale-while-refresh. With default settings, source staleness is
  bounded by the 15-second fresh indexer cache plus the 30-second classified cache: 45 seconds.
- `checkedAt` is response construction time, not proof of a chain read at that instant.
- Avoid adding another cache for valuable grants. If presentation-only code adds a cache, include
  that extra duration in the revocation window.
- Recheck on game boot, reconnect, and before valuable grants. Relaunch after linked-account changes.
- Treat `403` missing scope, `503`, invalid data, or `partial !== false` as no entitlement until a
  newly authorized complete check works. Keep free/default cosmetics playable; never unlock the
  gated benefit on failure.
- Remove cosmetic access after ownership disappears.
- Keep valuable grant records idempotent and auditable.

## Security checklist

- [ ] Use `grotto.getInventory()` rather than a wallet-selected inventory URL.
- [ ] Require `inventory:read` on the runtime session.
- [ ] Confirm the exact game ID is in `GAME_RUNTIME_INVENTORY_GAME_IDS`.
- [ ] Configure `GAME_RUNTIME_INVENTORY_CONTRACTS_JSON` when the game should see only approved contracts.
- [ ] Treat the launch-time wallet snapshot as immutable and require relaunch after account changes.
- [ ] Treat balances as `BigInt` decimal strings.
- [ ] Require complete pagination and fail closed for partial, unproven, or unavailable inventory.
- [ ] Account for the platform's bounded 45-second default source-staleness window.
- [ ] Revoke presentation access after transfers.
- [ ] Make valuable grants server-side and idempotent.
- [ ] Never log, persist, or export the runtime token.

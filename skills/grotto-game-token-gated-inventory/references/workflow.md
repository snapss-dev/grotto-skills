# Token-gated inventory workflow

Which content entitlement must be changed or revalidated without weakening its authority?

## When to repeat

When gated content, entitlement rules, caching or platform inventory contracts change.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

The exact game capability, entitlement rules and prior granted/denied/partial-read cases.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Review the exact game’s inventory:read grant and gate definition. The platform owns capability grants and the immutable verified-wallet session snapshot. Keep free/default content separate from gated entitlement.

2. Define normal, missing-scope, expired-session, partial-read and revocation cases for the changed gate. Use exact decimal-string balances; distinguish cosmetic presentation from valuable server-authoritative rewards.

3. Implement through the existing capability and freshness owners. Failed or partial reads cannot create an entitlement. Keep cache identity and expiry tied to the correct session and gate inputs.

4. Replay granted and denied cases, reload, expiry and relevant ownership changes. Check that inaccessible optional content does not prevent intended free/default play and that stale results cannot silently reopen a gate.

## Verify and decide

Verify authorization and exact balance semantics at their authority boundary. A visible cosmetic or successful client render is not proof that a valuable reward is protected server-side.

A new skin requirement reuses missing-scope and partial-read cases before the cosmetic is considered reliably gated.

## Leave a record for the next pass

Non-secret gate definitions, freshness rules and reproducible entitlement test cases.

Keep gate definitions, cache/freshness assumptions and case results without tokens or private wallet snapshots. Reuse the same denied and partial-read cases after the next content or contract change.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.

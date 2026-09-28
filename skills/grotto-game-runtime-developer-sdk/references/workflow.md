# Runtime SDK workflow

Which requested service boundary needs to be introduced or revalidated in this pass?

## When to repeat

When a service contract, SDK usage, save schema or capability requirement changes.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

The installed runtime, required services and prior identity/save scenarios.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Review the installed runtime and current service requirements. Keep ordinary game design separate from optional integrations. Identify the exact capability, identity and save assumptions affected by the change.

2. Choose the relevant contract reference and define normal, unavailable, expired-session and late-hydration cases. Never treat client-supplied identity as trusted or infer a platform grant from a requested feature.

3. Integrate through the installed helpers without blocking engine boot, input registration or animation on network readiness. Preserve current progress during hydration and use version-aware conflict handling for saves.

4. Replay the service cases and the underlying playable loop. Check missing scopes, save conflicts and recovery. When multiplayer is involved, preserve single-use ticket and server-owned authorization rules.

## Verify and decide

Confirm actual capabilities and session ownership, not only UI visibility. Free/default play should recover appropriately when an optional service is unavailable. Do not expose private wallet snapshots or broaden access as part of a routine pass.

A save-schema change replays old-save hydration and a local-progress conflict before the same workflow is used for the next progression update.

## Leave a record for the next pass

Service requirements, save-version decisions and contract/recovery cases.

Keep only non-secret service requirements, schema/version decisions, tested contract cases and observed recovery. Never retain tokens, wallet snapshots or credentials in an iteration record.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.

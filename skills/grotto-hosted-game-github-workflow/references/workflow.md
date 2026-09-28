# External hosting and GitHub workflow

Which authorized external-client change should this release cycle deliver?

## When to repeat

For each authorized external client release, wrapper change or rollback.
Run one focused pass for the current request; return when new evidence or changed
assumptions make another pass useful. Do not load every reference or rerun every
check on every minor edit.

## Bring forward

The durable hosted origin, reviewed client revision, wrapper contract and rollback target.
If a previous record exists, review its decisions and unresolved findings before
planning. If it does not, establish a small baseline from the current game and
mark missing evidence explicitly.

## Run the cycle

1. Confirm that external hosting is the creator’s requested workflow and that the client has a durable origin. Ordinary Studio builds remain packaged in Studio. Review the current wrapper and previously verified release.

2. Define the client revision and affected identity, message and capability cases. Keep the known hosted origin and trusted parent boundary explicit; a public room name cannot grant multiplayer access.

3. Test the reviewed client and wrapper together through their normal pipeline. Forward runtime messages only across the trusted parent/known-origin relationship, and keep per-game capabilities server-owned.

4. Release only within the current authorization and verify the actually delivered client and wrapper revisions. Recheck boot, identity and recovery on the hosted path. For rollback, verify the chosen target and compatible saves rather than relying on a success toast.

## Verify and decide

Distinguish a source merge, preview deployment, production alias and player-visible wrapper behavior. Do not claim a release from a CI plan or grant new hosting/security access as a side effect of reading the workflow.

A client release that changes save loading repeats the same hosted boot and recovery cases before the production alias is considered accepted.

## Leave a record for the next pass

Client/wrapper revisions, origin decisions, release evidence and verified rollback state.

Keep reviewed client/wrapper revisions, allowed origin, tested cases, actual release receipt and rollback compatibility. Keep credentials and temporary access tokens out of the record.

Use an existing project note or the handoff when no durable note tool is offered.
Keep facts separate from assumptions. The next pass should be able to recover
what was tried, why it was chosen and what the evidence established.

# Delivering and verifying a hosted game

Confirm the [supported frame handoff](wrapper.md) and embedding headers first.

## Delivery sequence

1. Use a branch or isolated worktree. Read the project's setup and use its runtime
   version, package manager, lockfile and actual test scripts.
2. Run meaningful checks and a production build. Keep credentials, runtime session
   tokens and environment files out of Git.
3. Open a pull request with final behavior and verification evidence. Use existing
   project CI; Grotto prescribes no universal Node version or test-runner flag.
4. Deploy the reviewed commit to the intended origin. Verify final URL, redirects,
   iframe headers and production assets.
5. Launch through the actual Grotto player. Verify the public SDK handshake,
   identity, save hydration and a cloud write in that context.
6. Verify feature admission and failure behavior, including account switches and
   expiry. Preview results establish only preview support.
7. Promote the tested build and record commit and URL. Keep a compatible rollback.

For npm projects, npm ci, the project's npm test script and npm run build are common
starting points. Use documented project commands when different. Deployment secrets
belong in the host or CI secret store. The SDK requires no private platform key.

## What verification must establish

- Direct descriptors from the trusted Grotto ancestor are accepted; arbitrary
  wrapper-origin descriptors are rejected.
- Wrong sources/origins, opaque origins and stale messages after navigation cannot
  impersonate the host.
- Local play remains usable while identity is pending or unavailable.
- Identity and saves work in the real launch, including refresh, conflicts, expired
  sessions and logout/account switches.
- CSP, iframe headers and sandbox permissions permit the intended launch without
  broadening SDK authentication.
- Preview scope restrictions hold. A private backend rejects preview, expired,
  revoked, wrong-game and insufficient-scope credentials.
- Inventory and rooms work in a published standard session. External-server
  multiplayer verifies all ticket claims and rejects replay.
- Payment UI handles pending, confirmed, rejected and unavailable outcomes.
  Fixture responses alone do not establish real payment activation.

Test observable SDK/API behavior. A source-string assertion that a wrapper contains
a message name cannot prove its handshake or origin policy.

If the host lacks a stable embedding origin or the published child is not a
supported recipient, use a self-contained reviewed archive. Free managed rooms
need no server signing key or replay store; external-server tickets do.

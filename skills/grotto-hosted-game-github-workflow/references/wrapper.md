# Hosted browser launch and frame requirements

For native games, use [Unreal Windows setup](../../grotto-game-setup/references/unreal-windows.md).
This guide covers a browser game kept on the developer's own HTTPS host.

## The trusted handoff is a prerequisite

The public SDK accepts descriptors only from a trusted Grotto ancestor window
with an allowed Grotto origin. Its hostOrigin must match the actual message origin.
Forwarding through a wrapper changes event.origin to the wrapper origin, so a
generic relay is rejected.

The SDK sends hello to ancestor frames. The Grotto player must recognize the
hosted child as an eligible recipient and reply directly to it. Existing selected
hosted integrations and first-party compatibility paths do not establish universal
support for arbitrary hosted URLs. Typed payment actions also need their own exact
registered origin; an identity handshake does not register an action origin.

Before relying on a published wrapper, verify the exact hosted child receives a
direct trusted reply from the actual Grotto player. This is a platform prerequisite.
Publishing a relay wrapper or testing message names is insufficient. If this
launch path is unavailable, submit a self-contained reviewed browser archive.

Connect hosted preview opens the submitted URL directly. Its session has at most
15 minutes of absolute lifetime and provides identity and saves. It does not
enable inventory, managed rooms or real payments, and does not prove a nested
published wrapper receives a trusted handoff.

## Preparing the hosted game

Control the client repository and deployments. Use a stable HTTPS origin and an
index.html entry point. Local gameplay and local progress should work while
authentication is pending or unavailable.

Load the official SDK in an external client:

~~~html
<script src="https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js"></script>
~~~

Studio already installs the Runtime SDK; do not add a second copy there.
See [identity and boot](../../grotto-game-runtime-developer-sdk/references/identity-and-boot.md).

Inspect final response headers after redirects. X-Frame-Options: DENY or SAMEORIGIN
prevents cross-origin embedding. CSP frame-ancestors must allow every actual
ancestor, including Grotto and any wrapper. Enumerate the required origins.

A sandbox must permit scripts and preserve the child's origin for the SDK's
exact checks. Removing allow-same-origin gives an opaque origin and prevents the
handoff. Add other permissions only when a game feature needs them.

Never forward the complete parent query into a hosted URL. Keep credentials out
of navigation URLs, analytics, logs and durable browser storage.

## Messaging and identity

Validate event.source and event.origin and use an exact targetOrigin. A supported
wrapper must preserve the direct Grotto-to-child handshake; a wrapper-authored
copy cannot substitute for it. Do not modify SDK trusted-origin checks.

On logout/account switch, stop saves, events, rooms and pending actions for the
previous owner. Ignore late responses and hydrate the new player's state through
a fresh client. Cancel stale save loads before applying them. For your own server,
use [backend verification](../../grotto-game-runtime-developer-sdk/references/private-backend.md);
CORS is not authentication.

## Feature activation

Published standard sessions provide inventory and managed rooms. External-server
tickets require operator configuration. Typed payments use a separate reviewed
action and registered-origin path. Neither legacy hello/transaction messages nor
hosted preview grants these features. Follow [capabilities.md](capabilities.md)
and test each feature in the actual launch context.

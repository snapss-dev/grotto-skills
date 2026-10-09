# Building or reviewing the hosted client and wrapper

Select the engine adapter with [Grotto Game Setup](../../grotto-game-setup/SKILL.md).
This guide is the browser-wrapper branch of that setup, using the existing
Runtime SDK handshake. Unreal Windows uses private Desktop IPC instead of a
wrapper. Base browser SSO is not limited to founding creators: the existing
founder/selected-game policy only permits additional credential recipients in
nested frames. Keep that policy and its exact origin/window checks intact.

## Pattern

1. Real game client lives in GitHub.
2. Client deploys to Railway/Vercel/Netlify/Cloudflare Pages over HTTPS.
3. Host auto-deploys from `main` or release tags.
4. Grotto upload is only a tiny `index.html` wrapper.
5. Wrapper iframes the hosted client and forwards Grotto runtime messages.

Benefits: fast updates, PR review, test gates, preview deploys, rollback, and fewer full zip uploads to Grotto.

## Repo layout

```text
my-grotto-game/
  package.json
  src/
  public/
  tests/
  wrapper/index.html
```

## Hosted client requirements

```html
<script src="https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js"></script>
```

Start local rendering and input before runtime readiness, identity or save
requests. Resolve those services in background work and preserve progress earned
before hydration. Use the SDK's version-aware autosave contract rather than
blocking boot on a sequence of network calls.

The hosted URL must be HTTPS.

Inventory is available automatically through every authenticated Grotto runtime session.
Optional multiplayer still requires the exact published game ID to be allowlisted by the platform
operator before a newly launched runtime session receives `multiplayer:join`.

## Grotto wrapper

Author a root `index.html` for the agreed external client. It should size the
iframe to the intended viewport and give it an accessible title. Set an explicit
sandbox and permissions policy from the client's actual needs; do not grant
clipboard, popups, forms or pointer lock solely because a generic wrapper did.

Resolve the configured HTTPS client URL to a known target origin. Build its
query string from deliberately allowed, nonsecret parameters. Never forward the
wrapper's complete query string to another host. Keep the host runtime handshake
separate from navigation and game state.

For messages, validate the data shape and message type. Accept the client's
`grotto:runtime:hello` only from that iframe's `contentWindow` and expected origin,
then request the runtime from the wrapper's parent. Accept `grotto:runtime` only
from the parent host, and forward it with the known client origin as the exact
`targetOrigin`. Preserve the SDK protocol; do not create a parallel identity
system. Check the parent's expected origin where the embedding contract supplies
it.

Only forward `grotto:runtime` from the wrapper's parent and only accept
`grotto:runtime:hello` from the hosted iframe. Never copy the `grs_*` session into the hosted URL,
query string, logs, analytics, localStorage, or build artifacts.

An existing approved game may also use the legacy `bobert:hello` and
`bobert:tx` route. Preserve its existing exact source, origin and descendant
checks when updating that wrapper; do not add a general message forwarder to
new wrappers. The transaction relay requires a moderator-approved target and
selector policy bound to the current build and retains the wallet confirmation.
It is separate from the typed `GrottoRuntime.requestAction()` API. A `grs_*`
runtime session and a hosted URL do not grant that legacy transaction policy.

# Testing, publishing or rolling back an external client

## Maintenance loop

1. Branch in GitHub.
2. Change game client.
3. Run tests/build locally.
4. Open PR.
5. CI runs unit/lint/build/Playwright checks.
6. Merge to `main`.
7. Railway/Vercel auto-deploys.
8. Existing Grotto wrapper loads new client.
9. Verify optional capability scopes and custom-service health with a newly launched session.
10. Roll back by reverting Git or rolling back deploy.

## Minimal CI

```yaml
name: game-client-ci
on: [pull_request]
jobs:
  test-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm test -- --run
      - run: npm run build
```

## Wrapper regression test

```js
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
const wrapper = readFileSync('wrapper/index.html', 'utf8');
describe('Grotto wrapper', () => {
  it('embeds hosted client and forwards runtime', () => {
    expect(wrapper).toContain('https://my-game.up.railway.app');
    expect(wrapper).toContain('grotto:runtime:hello');
    expect(wrapper).toContain('grotto:runtime');
    expect(wrapper).toContain('postMessage');
    expect(wrapper).toContain('event.source === parent');
    expect(wrapper).toContain('event.source === iframe.contentWindow');
  });
});
```

## Do not use when

- game must be a permanent self-contained archive
- hosted domain is not durable
- third-party scripts are unstable
- wrapper cannot forward runtime messages due sandbox/CSP
- project cannot provide shared atomic replay storage for authoritative multiplayer

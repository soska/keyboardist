# 🎹 Keyboardist

![](assets/cover.png)

A declarative way to add keyboard shortcuts to your browser applications.

```javascript
import { createListener } from "keyboardist";

const listener = createListener();

listener.subscribe("shift+down", () => {
  console.log("Pressed Shift + down");
});

// bindings can live on stackable layers — a modal can own the
// keyboard and hand it back when it closes
const modal = listener.layer("modal", { escape: close }, { exclusive: true });
const pop = modal.push();
```

## Why

Anyone can write one `keydown` listener. What accumulates after that —
canonical key names instead of modifier-flag chains, staying quiet while the
user types into inputs and contenteditables, preventing default only on real
matches, and above all **layers** (a modal or command palette taking over the
keyboard and handing it back cleanly, even when overlapping) — is the code
every app ends up writing badly under deadline. Keyboardist is that code,
extracted, tested, ~3 kB gzipped with zero dependencies. The longer
version is in the
[package README](packages/keyboardist/README.md#why-not-just-addeventlistener).

This is the Keyboardist monorepo:

| Package | Description |
| --- | --- |
| [`packages/keyboardist`](packages/keyboardist) | The [`keyboardist`](https://www.npmjs.com/package/keyboardist) npm package — core plus React hooks/components at the `keyboardist/react` subpath. Docs live in its [README](packages/keyboardist/README.md) |
| [`apps/website`](apps/website) | The demo website |

## Development

Requires Node 24 and [pnpm](https://pnpm.io):

```sh
pnpm install
pnpm check   # lint + typecheck + test + build
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

## Releases

Versioning and publishing are automated with
[Changesets](https://github.com/changesets/changesets); the changelog lives in
[`packages/keyboardist/CHANGELOG.md`](packages/keyboardist/CHANGELOG.md) once
the first automated release lands.

The pre-monorepo 2.x state of this repository is preserved on the
[`v2` branch](https://github.com/soska/keyboardist/tree/v2) and the
`archive/v2-final` tag.

## License

MIT © [Armando Sosa](https://armandososa.org)

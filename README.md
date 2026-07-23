# Singleton SD Public Assets

This repository publishes company logo assets, favicons, PWA manifests, and
Open Graph images for Singleton SD products and sites.

Public builds are served at
[assets.singletonsd.com](https://assets.singletonsd.com)
(GitLab Pages custom domain — see **DS-33**).

## Sources

- Dark mark: `src/logo/sources/dark.png` (favicons + dark static variants)
- Light mark: `src/logo/sources/light.png` (light static variants)
- OG defaults: `src/og-image/{dark,light}/og-default.jpg` (optional `@2` / square)

Variant rules:

- Dark: no white fill, no black border
- Light: no black fill, no white border

Contributor workflow: [Logo Asset Workflow](./docs/logo-asset-workflow.md).

## Quick reference

- Default favicon manifest:
  [circle / bg-none / site.webmanifest](./favicons/circle/bg-none/site.webmanifest)
- Default favicon PNG:
  [circle / bg-none / favicon-32x32.png](./favicons/circle/bg-none/favicon-32x32.png)
- Static logos:
  under `./logo/static/{dark|light}/{circle|square}/.../{320|512|…}.png`

## How to use

### Manifest in HTML

```html
<link rel="manifest" href="./favicons/circle/bg-none/site.webmanifest" />
<link rel="apple-touch-icon" href="./favicons/circle/bg-none/apple-touch-icon.png" />
<link
  rel="icon"
  type="image/png"
  sizes="32x32"
  href="./favicons/circle/bg-none/favicon-32x32.png"
/>
<link
  rel="icon"
  type="image/png"
  sizes="16x16"
  href="./favicons/circle/bg-none/favicon-16x16.png"
/>
<link rel="shortcut icon" href="./favicons/circle/bg-none/favicon.png" />
```

CDN URLs omit `/dist` because Pages serves the `dist/` tree at the site root
(for example `https://assets.singletonsd.com/favicons/...`).

## Build

```sh
yarn install
yarn build
```

- CI (`CI=true`): static logo PNGs capped at `<= 512px`
- Override: `LOGO_STATIC_MAX_SIZE=<number>`

Scripts:

| Script | Purpose |
|--------|---------|
| `yarn build` | Full publish build into `dist/` |
| `yarn build-manifest-icons` | Favicons + `site.webmanifest` |
| `yarn build-static-logo-assets` | Static logo PNGs |
| `yarn generate-html` | README → `index.html` |

## Folder structure

```sh
src/
├── logo/
│   ├── config/     # shapes, backgrounds, borders, variants
│   └── sources/    # dark.png, light.png
└── og-image/
    ├── dark/       # og-default.jpg (+ optional @2 / square)
    └── light/

dist/               # generated; served by GitLab Pages
├── index.html
├── favicons/
├── logo/static/{dark|light}/
└── og-image/
```

## Notes

- Manifest `name` / `short_name`: `Singleton SD` / `SSD`
- Animations / expression pipelines are intentionally out of scope

---

© 2026 Singleton SD. All rights reserved.

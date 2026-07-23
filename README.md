# Singleton SD Public Assets

This repository publishes company logo assets, favicons, PWA manifests, and
Open Graph images for Singleton SD products and sites.

Public builds are served at
[assets.singletonsd.com](https://assets.singletonsd.com)
(GitLab Pages custom domain — see **DS-33**).

## Status (skeleton)

This is the initial skeleton. A full `yarn build` requires:

1. Canonical mark: `src/logo/sources/default/mark.png` (**DS-3** / **DS-34**)
2. OG JPEGs under `src/og-image/dark` and `src/og-image/light` (**DS-34**)

Until those land, use the config and scripts to prepare variants. Contributor
workflow: [Logo Asset Workflow](./docs/logo-asset-workflow.md).

## Quick reference (after first successful build)

- Default favicon manifest:
  [circle / bg-none / site.webmanifest](./favicons/circle/bg-none/site.webmanifest)
- Default favicon PNG:
  [circle / bg-none / favicon-32x32.png](./favicons/circle/bg-none/favicon-32x32.png)
- Static mark sizes:
  under `./logo/static/mark/{circle|square}/.../{320|512|…}.png`

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
| `yarn build-static-logo-assets` | Static mark PNGs |
| `yarn generate-html` | README → `index.html` |

## Folder structure

```sh
src/
├── logo/
│   ├── config/          # shapes, backgrounds, borders, variants
│   └── sources/default/ # mark.png (placeholder until DS-34)
└── og-image/
    ├── dark/            # og-default.jpg, og-square.jpg
    └── light/

dist/                    # generated; served by GitLab Pages
├── index.html
├── favicons/
├── logo/static/mark/
└── og-image/
```

## Notes

- Manifest `name` / `short_name`: `Singleton SD` / `SSD`
- Backgrounds start as transparent, white, and black until design colors arrive
- Animations / expression pipelines are intentionally out of scope

---

© 2026 Singleton SD. All rights reserved.

# Singleton SD Public Assets

This repository publishes company logo assets, favicons, PWA manifests, and
Open Graph images for Singleton SD products and sites.

Public builds are served at
[assets.singletonsd.com](https://assets.singletonsd.com)
(GitLab Pages custom domain — see **DS-33**).

## Quick Downloads

Use these defaults when you do not need a specific variant:

- Default dark logo (512):
  [circle / bg-none / 512.png](./logo/static/dark/circle/bg-none/512.png)
- Default light logo (512):
  [circle / bg-none / 512.png](./logo/static/light/circle/bg-none/512.png)
- Default dark favicon manifest:
  [circle / bg-none / site.webmanifest](./favicons/circle/bg-none/site.webmanifest)
- Default dark favicon PNG:
  [circle / bg-none / favicon-32x32.png](./favicons/circle/bg-none/favicon-32x32.png)
- Default dark OG image:
  [og-image / dark / og-default.jpg](./og-image/dark/og-default.jpg)
- Default light OG image:
  [og-image / light / og-default.jpg](./og-image/light/og-default.jpg)

High-resolution static logos (for example `1024.png` / `4096.png`) are available
in full local builds (`yarn build` without a static size cap).

## Sources

- Dark mark: `src/logo/sources/dark.png` (favicons + dark static variants)
- Light mark: `src/logo/sources/light.png` (light static variants)
- Wordmarks: `src/logo/wordmark/sources/{legal,descriptor,compact}/{light,dark}.png`
- OG defaults: `src/og-image/{dark,light}/og-default.jpg` (optional `@2` / square)

Variant rules:

- Dark mark: no white fill, no black border
- Light mark: no black fill, no white border
- Wordmark light: `bg-gray-light`, `bg-white`, `bg-none`
- Wordmark dark: `bg-gray`, `bg-black`, `bg-none`

Contributor workflow: [Logo Asset Workflow](./docs/logo-asset-workflow.md).
Wordmark drop guide: [src/logo/wordmark/README.md](./src/logo/wordmark/README.md).

---

## Visual Preview

### Circle Favicons (from dark mark)

| Variant                | Preview                                                                                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **bg-none**            | [<img src="./favicons/circle/bg-none/favicon-32x32.png" alt="Circle bg-none" width="32" height="32">](./favicons/circle/bg-none/android-chrome-512x512.png)                            |
| **bg-none / bd-white** | [<img src="./favicons/circle/bg-none/bd-white/favicon-32x32.png" alt="Circle bg-none bd-white" width="32" height="32">](./favicons/circle/bg-none/bd-white/android-chrome-512x512.png) |
| **bg-black**           | [<img src="./favicons/circle/bg-black/favicon-32x32.png" alt="Circle bg-black" width="32" height="32">](./favicons/circle/bg-black/android-chrome-512x512.png)                         |

### Square Favicons (from dark mark)

| Variant                | Preview                                                                                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **bg-none**            | [<img src="./favicons/square/bg-none/favicon-32x32.png" alt="Square bg-none" width="32" height="32">](./favicons/square/bg-none/android-chrome-512x512.png)                            |
| **bg-none / bd-white** | [<img src="./favicons/square/bg-none/bd-white/favicon-32x32.png" alt="Square bg-none bd-white" width="32" height="32">](./favicons/square/bg-none/bd-white/android-chrome-512x512.png) |
| **bg-black**           | [<img src="./favicons/square/bg-black/favicon-32x32.png" alt="Square bg-black" width="32" height="32">](./favicons/square/bg-black/android-chrome-512x512.png)                         |

### Static Logos (512)

| Variant                         | Preview                                                                                                                                                              |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **dark / circle / bg-none**     | [<img src="./logo/static/dark/circle/bg-none/512.png" alt="Dark circle bg-none" width="48" height="48">](./logo/static/dark/circle/bg-none/512.png)                   |
| **dark / circle / bg-black**    | [<img src="./logo/static/dark/circle/bg-black/512.png" alt="Dark circle bg-black" width="48" height="48">](./logo/static/dark/circle/bg-black/512.png)                |
| **dark / circle / bd-white**    | [<img src="./logo/static/dark/circle/bg-none/bd-white/512.png" alt="Dark circle bd-white" width="48" height="48">](./logo/static/dark/circle/bg-none/bd-white/512.png) |
| **light / circle / bg-none**    | [<img src="./logo/static/light/circle/bg-none/512.png" alt="Light circle bg-none" width="48" height="48">](./logo/static/light/circle/bg-none/512.png)                |
| **light / circle / bg-white**   | [<img src="./logo/static/light/circle/bg-white/512.png" alt="Light circle bg-white" width="48" height="48">](./logo/static/light/circle/bg-white/512.png)             |
| **light / circle / bd-black**   | [<img src="./logo/static/light/circle/bg-none/bd-black/512.png" alt="Light circle bd-black" width="48" height="48">](./logo/static/light/circle/bg-none/bd-black/512.png) |

### OG Images

| Variant            | Preview                                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **dark / default** | [<img src="./og-image/dark/og-default.jpg" alt="OG Image dark default" width="120" height="63">](./og-image/dark/og-default.jpg)    |
| **light / default**| [<img src="./og-image/light/og-default.jpg" alt="OG Image light default" width="120" height="63">](./og-image/light/og-default.jpg) |

---

## Available Manifest Files

- [`favicons/circle/bg-none/site.webmanifest`](./favicons/circle/bg-none/site.webmanifest): Transparent circle icons
- [`favicons/circle/bg-none/bd-white/site.webmanifest`](./favicons/circle/bg-none/bd-white/site.webmanifest): Transparent circle with white border
- [`favicons/circle/bg-black/site.webmanifest`](./favicons/circle/bg-black/site.webmanifest): Circle on black background
- [`favicons/square/bg-none/site.webmanifest`](./favicons/square/bg-none/site.webmanifest): Transparent square icons
- [`favicons/square/bg-none/bd-white/site.webmanifest`](./favicons/square/bg-none/bd-white/site.webmanifest): Transparent square with white border
- [`favicons/square/bg-black/site.webmanifest`](./favicons/square/bg-black/site.webmanifest): Square on black background

---

## How to Use

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

### Download Asset Links

#### Favicons — circle / bg-none

- [android-chrome-192x192.png](./favicons/circle/bg-none/android-chrome-192x192.png)
- [android-chrome-512x512.png](./favicons/circle/bg-none/android-chrome-512x512.png)
- [apple-touch-icon.png](./favicons/circle/bg-none/apple-touch-icon.png)
- [favicon-16x16.png](./favicons/circle/bg-none/favicon-16x16.png)
- [favicon-32x32.png](./favicons/circle/bg-none/favicon-32x32.png)
- [favicon-4096x4096.png](./favicons/circle/bg-none/favicon-4096x4096.png)
- [favicon.png](./favicons/circle/bg-none/favicon.png)
- [site.webmanifest](./favicons/circle/bg-none/site.webmanifest)

#### Favicons — circle / bg-none / bd-white

- [android-chrome-192x192.png](./favicons/circle/bg-none/bd-white/android-chrome-192x192.png)
- [android-chrome-512x512.png](./favicons/circle/bg-none/bd-white/android-chrome-512x512.png)
- [apple-touch-icon.png](./favicons/circle/bg-none/bd-white/apple-touch-icon.png)
- [favicon-16x16.png](./favicons/circle/bg-none/bd-white/favicon-16x16.png)
- [favicon-32x32.png](./favicons/circle/bg-none/bd-white/favicon-32x32.png)
- [favicon-4096x4096.png](./favicons/circle/bg-none/bd-white/favicon-4096x4096.png)
- [favicon.png](./favicons/circle/bg-none/bd-white/favicon.png)
- [site.webmanifest](./favicons/circle/bg-none/bd-white/site.webmanifest)

#### Favicons — circle / bg-black

- [android-chrome-192x192.png](./favicons/circle/bg-black/android-chrome-192x192.png)
- [android-chrome-512x512.png](./favicons/circle/bg-black/android-chrome-512x512.png)
- [apple-touch-icon.png](./favicons/circle/bg-black/apple-touch-icon.png)
- [favicon-16x16.png](./favicons/circle/bg-black/favicon-16x16.png)
- [favicon-32x32.png](./favicons/circle/bg-black/favicon-32x32.png)
- [favicon-4096x4096.png](./favicons/circle/bg-black/favicon-4096x4096.png)
- [favicon.png](./favicons/circle/bg-black/favicon.png)
- [site.webmanifest](./favicons/circle/bg-black/site.webmanifest)

#### Favicons — square / bg-none

- [android-chrome-192x192.png](./favicons/square/bg-none/android-chrome-192x192.png)
- [android-chrome-512x512.png](./favicons/square/bg-none/android-chrome-512x512.png)
- [apple-touch-icon.png](./favicons/square/bg-none/apple-touch-icon.png)
- [favicon-16x16.png](./favicons/square/bg-none/favicon-16x16.png)
- [favicon-32x32.png](./favicons/square/bg-none/favicon-32x32.png)
- [favicon-4096x4096.png](./favicons/square/bg-none/favicon-4096x4096.png)
- [favicon.png](./favicons/square/bg-none/favicon.png)
- [site.webmanifest](./favicons/square/bg-none/site.webmanifest)

#### Favicons — square / bg-none / bd-white

- [android-chrome-192x192.png](./favicons/square/bg-none/bd-white/android-chrome-192x192.png)
- [android-chrome-512x512.png](./favicons/square/bg-none/bd-white/android-chrome-512x512.png)
- [apple-touch-icon.png](./favicons/square/bg-none/bd-white/apple-touch-icon.png)
- [favicon-16x16.png](./favicons/square/bg-none/bd-white/favicon-16x16.png)
- [favicon-32x32.png](./favicons/square/bg-none/bd-white/favicon-32x32.png)
- [favicon-4096x4096.png](./favicons/square/bg-none/bd-white/favicon-4096x4096.png)
- [favicon.png](./favicons/square/bg-none/bd-white/favicon.png)
- [site.webmanifest](./favicons/square/bg-none/bd-white/site.webmanifest)

#### Favicons — square / bg-black

- [android-chrome-192x192.png](./favicons/square/bg-black/android-chrome-192x192.png)
- [android-chrome-512x512.png](./favicons/square/bg-black/android-chrome-512x512.png)
- [apple-touch-icon.png](./favicons/square/bg-black/apple-touch-icon.png)
- [favicon-16x16.png](./favicons/square/bg-black/favicon-16x16.png)
- [favicon-32x32.png](./favicons/square/bg-black/favicon-32x32.png)
- [favicon-4096x4096.png](./favicons/square/bg-black/favicon-4096x4096.png)
- [favicon.png](./favicons/square/bg-black/favicon.png)
- [site.webmanifest](./favicons/square/bg-black/site.webmanifest)

#### Logo static — dark / circle

- [bg-none / 320.png](./logo/static/dark/circle/bg-none/320.png)
- [bg-none / 512.png](./logo/static/dark/circle/bg-none/512.png)
- [bg-none / bd-white / 512.png](./logo/static/dark/circle/bg-none/bd-white/512.png)
- [bg-black / 512.png](./logo/static/dark/circle/bg-black/512.png)

#### Logo static — dark / square

- [bg-none / 512.png](./logo/static/dark/square/bg-none/512.png)
- [bg-none / bd-white / 512.png](./logo/static/dark/square/bg-none/bd-white/512.png)
- [bg-black / 512.png](./logo/static/dark/square/bg-black/512.png)

#### Logo static — light / circle

- [bg-none / 320.png](./logo/static/light/circle/bg-none/320.png)
- [bg-none / 512.png](./logo/static/light/circle/bg-none/512.png)
- [bg-none / bd-black / 512.png](./logo/static/light/circle/bg-none/bd-black/512.png)
- [bg-white / 512.png](./logo/static/light/circle/bg-white/512.png)

#### Logo static — light / square

- [bg-none / 512.png](./logo/static/light/square/bg-none/512.png)
- [bg-none / bd-black / 512.png](./logo/static/light/square/bg-none/bd-black/512.png)
- [bg-white / 512.png](./logo/static/light/square/bg-white/512.png)

#### OG images

- [dark / og-default.jpg](./og-image/dark/og-default.jpg)
- [dark / og-default@2.png](./og-image/dark/og-default@2.png)
- [light / og-default.jpg](./og-image/light/og-default.jpg)
- [light / og-default@2.png](./og-image/light/og-default@2.png)

---

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
| `yarn build-static-logo-assets` | Static icon-mark PNGs |
| `yarn build-wordmark-assets` | Wordmark lockup PNGs (+ optional SVG copy) |
| `yarn generate-html` | README → `index.html` |

## Folder structure

```sh
src/
├── logo/
│   ├── config/     # icon mark: shapes, backgrounds, borders, variants
│   ├── sources/    # dark.png, light.png
│   └── wordmark/   # lockups: legal / descriptor / compact
│       ├── config/
│       └── sources/{legal,descriptor,compact}/
└── og-image/
    ├── dark/       # og-default.jpg (+ optional @2 / square)
    └── light/

dist/               # generated; served by GitLab Pages
├── index.html
├── favicons/
├── logo/static/{dark|light}/
├── logo/wordmark/{legal|descriptor|compact}/
└── og-image/
```

## Notes

- Manifest `name` / `short_name`: `Singleton SD` / `SSD`
- Animations / expression pipelines are intentionally out of scope

---

© 2026 Singleton SD. All rights reserved.

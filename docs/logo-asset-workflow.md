# Logo Asset Workflow

Editable source inputs and generated public outputs stay separate.

## Source layout

```sh
src/logo/
├── sources/
│   └── default/
│       └── mark.png          # canonical company mark (required for yarn build)
└── config/
    ├── backgrounds.json
    ├── borders.json
    ├── output-presets.json
    ├── shapes.json
    ├── size-groups.json
    └── variants.json
```

Open Graph JPEGs live under `src/og-image/{dark,light}/`.

Generated files belong in `dist/`, not `src/`.

## Outputs

```sh
dist/
├── index.html
├── favicons/{circle|square}/.../
├── logo/static/mark/{shape}/{background}/[border/]{size}.png
└── og-image/{dark,light}/...
```

## Commands

```sh
yarn build-manifest-icons
yarn build-static-logo-assets
yarn generate-html
yarn build
```

CI caps static logo PNGs at `<= 512px` when `CI=true`. Override with
`LOGO_STATIC_MAX_SIZE=<n>`.

## Adding brand colors

Until DS-4 delivers the final palette, backgrounds are limited to transparent,
white, and black. Add named fills in `backgrounds.json` and approve them in
`variants.json` when design hands off colors.

## Artwork blockers

- Company mark PNG: blocked by **DS-3** / implemented in **DS-34**
- OG JPEGs: **DS-34**
- Custom domain `assets.singletonsd.com`: **DS-33**

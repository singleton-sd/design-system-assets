# Logo Asset Workflow

Editable source inputs and generated public outputs stay separate.

## Source layout

```sh
src/logo/
├── sources/
│   ├── dark.png              # primary mark → favicons + dark static
│   └── light.png             # light-theme mark → light static
└── config/
    ├── backgrounds.json
    ├── borders.json
    ├── output-presets.json
    ├── shapes.json
    ├── size-groups.json
    └── variants.json
```

Open Graph files live under `src/og-image/{dark,light}/`. Required:
`og-default.jpg`. Optional: `og-default@2.png`, `og-square.jpg`.

Generated files belong in `dist/`, not `src/`.

## Variant rules

| Source | Allowed backgrounds | Allowed borders |
|--------|---------------------|-----------------|
| Dark | `bg-none`, `bg-black` | `none`, `bd-white` |
| Light | `bg-none`, `bg-white` | `none`, `bd-black` |

## Outputs

```sh
dist/
├── index.html
├── favicons/{circle|square}/.../
├── logo/static/{dark|light}/{shape}/{background}/[border/]{size}.png
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

## Related tickets

- **DS-33** — custom domain `assets.singletonsd.com`

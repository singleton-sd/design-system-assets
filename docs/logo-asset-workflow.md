# Logo Asset Workflow

Editable source inputs and generated public outputs stay separate.

## Source layout

```sh
src/logo/
├── sources/
│   ├── dark.png              # primary mark → favicons + dark static
│   └── light.png             # light-theme mark → light static
├── config/                   # icon mark presets
│   ├── backgrounds.json
│   ├── borders.json
│   ├── output-presets.json
│   ├── shapes.json
│   ├── size-groups.json
│   └── variants.json
└── wordmark/                 # horizontal lockups (DS-35)
    ├── README.md
    ├── config/
    │   ├── backgrounds.json
    │   ├── output-presets.json
    │   ├── render.json
    │   ├── roles.json
    │   ├── size-groups.json
    │   └── variants.json
    └── sources/
        ├── legal/{light,dark}.png
        ├── descriptor/{light,dark}.png
        └── compact/{light,dark}.png
```

Open Graph files live under `src/og-image/{dark,light}/`. Required:
`og-default.jpg`. Optional: `og-default@2.png`, `og-square.jpg`.

Generated files belong in `dist/`, not `src/`.

## Variant rules — icon mark

| Source | Allowed backgrounds | Allowed borders |
|--------|---------------------|-----------------|
| Dark | `bg-none`, `bg-black` | `none`, `bd-white` |
| Light | `bg-none`, `bg-white` | `none`, `bd-black` |

## Variant rules — wordmark

| Theme source | Backgrounds |
|--------------|-------------|
| `light.png` (black text) | `bg-gray-light`, `bg-white`, `bg-none` |
| `dark.png` (white text) | `bg-gray`, `bg-black`, `bg-none` |

Roles: `legal`, `descriptor`, `compact`. Masters must be transparent (no baked background).

## Outputs

```sh
dist/
├── index.html
├── brand/index.html
├── favicons/{circle|square}/.../
├── logo/static/{dark|light}/{shape}/{background}/[border/]{size}.png
├── logo/wordmark/{legal|descriptor|compact}/{light|dark}/{background}/{width}.png
├── email/signature/{light|dark}/{background}/{width}.png
├── documents/letterhead/{light|dark}/{background}/{width}.png
├── documents/footer/{light|dark}/{background}/{width}.png
└── og-image/{dark,light}/...
```

Email/docs packs also sync masters into:

```sh
src/email/signature/{light,dark}.{png,svg}
src/documents/letterhead/{light,dark}.{png,svg}
src/documents/footer/{light,dark}.{png,svg}
```

## Commands

```sh
yarn build-manifest-icons
yarn build-static-logo-assets
yarn build-wordmark-assets
yarn build-email-docs-assets
yarn generate-html
yarn generate-brand-html
yarn build
```

CI caps static logo PNGs at `<= 512px` when `CI=true`. Override with
`LOGO_STATIC_MAX_SIZE=<n>`.

Wordmark widths default-cap at `<= 2560px` in CI. Override with
`WORDMARK_STATIC_MAX_SIZE=<n>` (falls back to `LOGO_STATIC_MAX_SIZE` if set).

## Related tickets

- **DS-33** — custom domain `assets.singletonsd.com`
- **DS-35** — wordmark lockups (legal / descriptor / compact)
- **DS-44** — email signature + document letterhead/footer packs

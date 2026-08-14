# Brand assets

Source of truth for **logo/favicon/OG binaries** is this package (`@singleton-sd/assets`), published at [assets.singletonsd.com](https://assets.singletonsd.com).

Token **values** live in `@singleton-sd/tokens`. Penpot is the style-guide home (`Singleton SD — Brand System`).

Shareable snapshot (no Penpot login): [assets.singletonsd.com/brand/](https://assets.singletonsd.com/brand/). Print from the browser to save a PDF.

## Formats

- **SVG** — preferred for web and print vectors. Drop masters next to PNGs (`light.svg` / `dark.svg`).
- **PNG** — required for email and for the existing favicon/OG pipeline.

## Roles

Wordmarks use assets names, not Figma names:

| Role | Wording | Typical use |
| --- | --- | --- |
| `legal` | `</ SINGLETON >` + Software Pty Ltd | Letters, contracts |
| `descriptor` | `</ SINGLETON >` + Software Development | Web, marketing |
| `compact` | `</ SINGLETON SD >` | Nav, signatures |

Mark (circular S) lives under `src/logo/sources/`.

## Usage

- Do not stretch. Keep aspect ratio.
- Clear space = mark height (measure from assets/Penpot).
- Light masters on `bg-gray-light`, `bg-white`, `bg-none`. Dark masters on `bg-gray`, `bg-black`, `bg-none`.
- Trademark line for documents/emails: _Singleton Software Pty Ltd. All rights reserved._ (placeholder until legal copy is confirmed).

## Layout

```text
src/logo/                 # mark + static variants
src/logo/wordmark/        # legal / descriptor / compact
src/og-image/
src/email/signature/      # compact masters for mail signatures
src/documents/letterhead/ # legal masters for letters/contracts
src/documents/footer/     # legal masters sized for footers
```

## Email & docs packs (DS-44)

```sh
yarn build-email-docs-assets
```

Writes sized PNGs under `dist/email/` and `dist/documents/`, and refreshes pack masters under `src/email` / `src/documents` from wordmark sources.

| Pack | Role | Typical widths |
| --- | --- | --- |
| Email signature | `compact` | 320–800 |
| Letterhead | `legal` | 1200–2400 |
| Footer | `legal` | 400–800 |

See [docs/logo-asset-workflow.md](docs/logo-asset-workflow.md).

# Brand assets

Source of truth for **logo/favicon/OG binaries** is this package (`@singleton-sd/assets`), published at [assets.singletonsd.com](https://assets.singletonsd.com).

Token **values** live in `@singleton-sd/tokens`. Penpot is the style-guide home (`Singleton SD — Brand System`).

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
src/email/                # signature blocks
src/documents/            # letterhead / footer marks
```

See [docs/logo-asset-workflow.md](docs/logo-asset-workflow.md).

# Brand assets

Source of truth for **logo/favicon/OG binaries** is this package (`@singleton-sd/assets`), published at [assets.singletonsd.com](https://assets.singletonsd.com).

Token **values** live in `@singleton-sd/tokens` — [AGENTS.md](https://gitlab.com/singleton-sd/design-system/tokens/-/blob/main/AGENTS.md) · [docs/FOUNDATIONS.md](https://gitlab.com/singleton-sd/design-system/tokens/-/blob/main/docs/FOUNDATIONS.md) · gallery https://tokens.design.singletonsd.com/. Penpot is the style-guide home (`Singleton SD — Brand System`). CSS color roles use `--ssd-*` (see tokens FOUNDATIONS); do not treat `--fg-*` as the live API.

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

## Typography

Brand font: **Plus Jakarta Sans** ([Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans), SIL Open Font License 1.1). It replaced Open Sauce Sans in November 2026.

| Use | Weight |
| --- | --- |
| Headings | 700 |
| Body | 400 |
| Lockup descriptors (`SOFTWARE DEVELOPMENT`, `SOFTWARE PTY LTD`) | 500 |
| `</ SINGLETON >` wordmark and `</S>` mark | 700 |

Every wordmark and mark SVG has its text converted to outlines, so no font needs to be installed to use them. Token values (`--ssd-font-family-heading` / `--ssd-font-family-body`) live in `@singleton-sd/tokens`.

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

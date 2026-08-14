# Document assets

Letterhead and footer marks for PDF/print. Prefer SVG; keep PNG fallbacks.

## Pack masters

Synced from wordmark `legal` masters by `yarn build-email-docs-assets`:

```text
src/documents/letterhead/{light,dark}.{png,svg}
src/documents/footer/{light,dark}.{png,svg}
```

Footer uses the same legal artwork; size it smaller in layout (see CDN widths).

## CDN outputs

```text
dist/documents/letterhead/{light|dark}/{bg-none|bg-white|bg-black}/{1200|1600|2400}.png
dist/documents/footer/{light|dark}/{bg-none|bg-white|bg-black}/{400|600|800}.png
```

- Light theme: `bg-none`, `bg-white`
- Dark theme: `bg-none`, `bg-black`

SVG masters are copied next to each theme folder as `{light|dark}.svg`.

## Usage

- Role: **legal** (`</ SINGLETON >` + Software Pty Ltd)
- Spelling must remain **SOFTWARE PTY LTD**
- Prefer SVG in print/PDF pipelines; PNG for Word/email-adjacent exports

Trademark line (placeholder): _Singleton Software Pty Ltd. All rights reserved._

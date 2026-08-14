# Email assets

PNG signature lockups for email clients (SVG support is unreliable in mail).

## Pack masters

Synced from wordmark `compact` masters by `yarn build-email-docs-assets`:

```text
src/email/signature/{light,dark}.{png,svg}
```

## CDN outputs

```text
dist/email/signature/{light|dark}/{bg-none|bg-white|bg-black}/{320|480|640|800}.png
```

- Light theme: `bg-none`, `bg-white`
- Dark theme: `bg-none`, `bg-black`

Opaque backgrounds are preferred when the mail client composites poorly against transparency.

## Usage

- Role: **compact** (`</ SINGLETON SD >`)
- Do not stretch; keep aspect ratio
- Prefer `640.png` for most signatures; use `800.png` for high-DPI

Trademark line (placeholder): _Singleton Software Pty Ltd. All rights reserved._

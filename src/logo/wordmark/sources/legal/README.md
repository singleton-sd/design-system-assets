# Wordmark sources — legal

Place transparent PNG masters here (no baked-in background):

| File | Contents |
|------|----------|
| `light.png` | Black text + gold `</` `>` — used for light-gray / white / transparent |
| `dark.png` | White text + gold `</` `>` — used for medium-gray / black / transparent |

Lockup text (do not drop masters until the Figma layer is corrected):

```text
</ SINGLETON >
SOFTWARE PTY LTD
```

The Figma `company_name` component still outlines **SOTFWARE PTY LTD**. Descriptor and compact masters were exported; legal is withheld so the misspelling does not ship on the CDN.

Optional SVG masters (`light.svg`, `dark.svg`) are copied to `dist` as-is when present.

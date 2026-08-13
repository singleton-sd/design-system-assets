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

The Figma `company_name` text nodes still read **SOTFWARE PTY LTD** (light `2130:50`, dark `2453:392`). Descriptor, compact, and S-mark PNG masters were exported at scale 4; legal is withheld so the misspelling does not ship on the CDN.

Optional SVG masters (`light.svg`, `dark.svg`) are copied to `dist` as-is when present.

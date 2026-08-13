# Wordmark lockups

Horizontal Singleton wordmarks / lockups (separate from the circular icon mark).

## Drop masters here

```text
src/logo/wordmark/sources/
├── legal/
│   ├── light.png    # black text + gold brackets
│   ├── dark.png     # white text + gold brackets
│   ├── light.svg    # optional vector master
│   └── dark.svg
├── descriptor/
│   ├── light.png
│   └── dark.png
└── compact/
    ├── light.png
    └── dark.png
```

| Role | Wording | Typical use |
|------|---------|-------------|
| `legal` | `</ SINGLETON >` + Software Pty Ltd | Letters, contracts |
| `descriptor` | `</ SINGLETON >` + Software Development | Web, marketing |
| `compact` | `</ SINGLETON SD >` | Nav, signatures |

Export masters **without** background fill (transparent). The build composites the four style backgrounds.

Fix **SOTFWARE → SOFTWARE** in the legal lockup before exporting.

## Generated styles

| Theme source | Backgrounds |
|--------------|-------------|
| `light.png` | `bg-gray-light`, `bg-white`, `bg-none` |
| `dark.png` | `bg-gray`, `bg-black`, `bg-none` |

Output:

```text
dist/logo/wordmark/{legal|descriptor|compact}/{light|dark}/{bg-...}/{width}.png
```

Build: `yarn build-wordmark-assets` (also runs as part of `yarn build`).

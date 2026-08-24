# Product assets repository recipe

Every Singleton SD product has a public, independently versioned assets
repository because its marketing, application, API, firmware, email, and
documentation consumers live in separate repositories.

## Mandatory production scope

Every product repository must ship approved:

- light and dark logo variants;
- product wordmark roles;
- favicon and application icons;
- Open Graph images;
- illustrations;
- screenshots;
- marketing and social images;
- email assets;
- document assets; and
- a public brand-guide/catalog page.

Empty placeholder categories are acceptable while creating the identity, but a
product is not ready to market until each category has been reviewed and its
production inventory is represented in `dist/manifest.json`.

## Repository contract

```text
config/product.json        Product identity and public URL
src/                       Approved source-of-truth artwork
src/logo/                  Mark and wordmark masters
src/og-image/              Social/Open Graph masters
src/illustrations/         Approved illustrations
src/screenshots/           Approved current product screenshots
src/marketing/             Campaign, store, launch, and social artwork
src/email/                 Email-compatible masters
src/documents/             Document and print masters
scripts/                   Platform-independent validation and generation
templates/                 Catalog and brand-guide presentation
dist/                      Generated public output; never edited manually
```

Use lowercase kebab-case paths. Concepts from AI or design tools stay outside
the approved source paths until the repository owner approves them.

## Required commands

```sh
yarn install --frozen-lockfile
yarn validate
yarn test
yarn build
```

The build must start clean, generate the complete `dist/` catalog, produce
`dist/manifest.json`, and leave committed sources unchanged.

## Publishing contract

`main` publishes the current catalog at the Pages root. Every valid stable
semantic version tag (`1.2.3` or `v1.2.3`) also
publishes an immutable snapshot:

```text
https://<asset-host>/releases/1.2.3/
```

Before publishing, the workflow validates the tag and rejects the deployment if
`releases/<tag>/` already exists. This prevents a moved or force-updated tag from
overwriting an immutable snapshot. The tag workflow creates a GitHub Release
containing the same generated output, its manifest, and a SHA-256 checksum.
Firmware and other pinned consumers use a tagged Pages path or release archive;
ordinary web consumers may use the root.

## Creating a product repository

1. Copy this repository without its Git history.
2. Replace repository/package metadata and `config/product.json`.
3. Replace all Singleton corporate masters with approved product masters.
4. Replace corporate copy and the brand-guide presentation.
5. Populate every mandatory production category.
6. Run validation and build locally.
7. Enable GitHub Actions with read/write workflow permissions.
8. Configure Pages to deploy from the `gh-pages` branch.
9. Publish the first version tag and verify both `/releases/<tag>/` and its
   GitHub Release archive.
10. Configure the product asset domain when required.

## Approval boundary

```text
generated concept -> owner review -> approved src asset -> build -> published dist
```

Only the repository owner can make the final approval. Agents may generate,
prepare, validate, and optimise assets, but must not promote an unreviewed
concept into an approved source path.

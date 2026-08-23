#!/usr/bin/env node

import { createHash } from 'node:crypto';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

interface PackageJson {
  version: string;
}

interface ProductConfig {
  id: string;
  name: string;
  publicUrl: string;
}

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

function mediaType(file: string): string {
  const types: Record<string, string> = {
    '.css': 'text/css', '.html': 'text/html', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
    '.webmanifest': 'application/manifest+json',
  };
  return types[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    }),
  );
  return nested.flat();
}

async function main(): Promise<void> {
  const [product, packageJson] = await Promise.all([
    fs.readFile(path.join(ROOT, 'config', 'product.json'), 'utf8').then((value) => JSON.parse(value) as ProductConfig),
    fs.readFile(path.join(ROOT, 'package.json'), 'utf8').then((value) => JSON.parse(value) as PackageJson),
  ]);
  const files = (await walk(DIST))
    .filter((file) => path.basename(file) !== 'manifest.json')
    .sort();
  const assets = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(file);
      const relativePath = path.relative(DIST, file).replaceAll(path.sep, '/');
      return {
        path: relativePath,
        mediaType: mediaType(file),
        bytes: content.byteLength,
        sha256: createHash('sha256').update(content).digest('hex'),
      };
    }),
  );
  const manifest = {
    schemaVersion: 1,
    product: { id: product.id, name: product.name, publicUrl: product.publicUrl },
    version: packageJson.version,
    assets,
  };
  await fs.writeFile(path.join(DIST, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Generated dist/manifest.json with ${assets.length} assets.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`\nError: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}

export { main };

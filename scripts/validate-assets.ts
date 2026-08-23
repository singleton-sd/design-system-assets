#!/usr/bin/env node

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

interface ProductConfig {
  id: string;
  name: string;
  shortName: string;
  publicUrl: string;
  themeColor: string;
  backgroundColor: string;
}

const ROOT = process.cwd();
const REQUIRED_FILES = [
  'config/product.json',
  'src/logo/sources/light.svg',
  'src/logo/sources/dark.svg',
  'src/logo/sources/light.png',
  'src/logo/sources/dark.png',
  'src/og-image/light/og-default.jpg',
  'src/og-image/dark/og-default.jpg',
];
const REQUIRED_DIRECTORIES = [
  'src/logo/wordmark/sources',
  'src/illustrations',
  'src/screenshots',
  'src/marketing',
  'src/email',
  'src/documents',
];

async function assertExists(relativePath: string, directory = false): Promise<void> {
  const stat = await fs.stat(path.join(ROOT, relativePath)).catch(() => null);
  if (!stat || (directory ? !stat.isDirectory() : !stat.isFile())) {
    throw new Error(`Missing required ${directory ? 'directory' : 'file'}: ${relativePath}`);
  }
}

async function validateSvg(relativePath: string): Promise<void> {
  const content = await fs.readFile(path.join(ROOT, relativePath), 'utf8');
  const forbidden = [/<script\b/i, /\son\w+\s*=/i, /(?:href|src)\s*=\s*["']https?:/i];
  if (!/<svg\b/i.test(content) || !/viewBox\s*=/.test(content)) {
    throw new Error(`${relativePath} must be an SVG with a viewBox.`);
  }
  if (forbidden.some((pattern) => pattern.test(content))) {
    throw new Error(`${relativePath} contains active content or an external reference.`);
  }
}

async function findFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? findFiles(full) : [full];
    }),
  );
  return results.flat();
}

async function main(): Promise<void> {
  await Promise.all(REQUIRED_FILES.map((file) => assertExists(file)));
  await Promise.all(REQUIRED_DIRECTORIES.map((dir) => assertExists(dir, true)));

  const config = JSON.parse(
    await fs.readFile(path.join(ROOT, 'config', 'product.json'), 'utf8'),
  ) as ProductConfig;
  for (const key of ['id', 'name', 'shortName', 'publicUrl', 'themeColor', 'backgroundColor'] as const) {
    if (!config[key]) throw new Error(`config/product.json must define ${key}.`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(config.id)) {
    throw new Error('config/product.json id must use lowercase kebab-case.');
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(config.themeColor) || !/^#[0-9A-Fa-f]{6}$/.test(config.backgroundColor)) {
    throw new Error('Product colours must use six-digit hexadecimal values.');
  }

  const sourceFiles = await findFiles(path.join(ROOT, 'src'));
  const svgFiles = sourceFiles
    .filter((name) => name.endsWith('.svg'))
    .map((name) => path.relative(ROOT, name).replaceAll(path.sep, '/'));
  await Promise.all(svgFiles.map(validateSvg));
  console.log(`Validated ${REQUIRED_FILES.length} required files and ${svgFiles.length} SVG masters.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`\nError: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}

export { main };

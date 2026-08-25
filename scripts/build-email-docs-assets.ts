#!/usr/bin/env node

/**
 * Build email signature and document letterhead/footer packs from wordmark masters.
 * DS-44 / A.4
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
  BackgroundPreset,
  createWordmarkPng,
} from './lib/wordmark-image';

type Theme = 'light' | 'dark';

interface PackSpec {
  role: 'compact' | 'legal';
  theme: Theme;
  source: `${Theme}.png`;
  backgrounds: string[];
  widths: number[];
  outputPath: string;
}

const ROOT = process.cwd();
const WORDMARK_SOURCES = path.join(ROOT, 'src', 'logo', 'wordmark', 'sources');
const WORDMARK_CONFIG = path.join(ROOT, 'src', 'logo', 'wordmark', 'config');
const DIST = path.join(ROOT, 'dist');
const PADDING_RATIO = 0.08;

const EMAIL_WIDTHS = [320, 480, 640, 800];
const LETTERHEAD_WIDTHS = [1200, 1600, 2400];
const FOOTER_WIDTHS = [400, 600, 800];

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, 'utf8')) as T;
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function copyIfExists(from: string, to: string): Promise<boolean> {
  try {
    await ensureDir(path.dirname(to));
    await fs.copyFile(from, to);
    return true;
  } catch {
    return false;
  }
}

async function buildPack(
  backgrounds: Record<string, BackgroundPreset>,
  pack: PackSpec,
): Promise<number> {
  const sourceFile = path.join(WORDMARK_SOURCES, pack.role, pack.source);
  let count = 0;

  for (const bgKey of pack.backgrounds) {
    const background = backgrounds[bgKey];
    if (!background) {
      throw new Error(`Unknown background preset: ${bgKey}`);
    }

    for (const width of pack.widths) {
      const outputFile = path.join(DIST, pack.outputPath, bgKey, `${width}.png`);
      await createWordmarkPng({
        sourceFile,
        outputFile,
        width,
        background,
        paddingRatio: PADDING_RATIO,
      });
      count += 1;
    }
  }

  // SVG companions (theme master) next to transparent pack root
  const svgName = `${pack.theme}.svg`;
  const svgSrc = path.join(WORDMARK_SOURCES, pack.role, svgName);
  const svgDest = path.join(DIST, pack.outputPath, svgName);
  await copyIfExists(svgSrc, svgDest);

  return count;
}

async function main(): Promise<void> {
  const backgrounds = await readJson<Record<string, BackgroundPreset>>(
    path.join(WORDMARK_CONFIG, 'backgrounds.json'),
  );

  const packs: PackSpec[] = [
    {
      role: 'compact',
      theme: 'light',
      source: 'light.png',
      backgrounds: ['bg-none', 'bg-white'],
      widths: EMAIL_WIDTHS,
      outputPath: 'email/signature/light',
    },
    {
      role: 'compact',
      theme: 'dark',
      source: 'dark.png',
      backgrounds: ['bg-none', 'bg-black'],
      widths: EMAIL_WIDTHS,
      outputPath: 'email/signature/dark',
    },
    {
      role: 'legal',
      theme: 'light',
      source: 'light.png',
      backgrounds: ['bg-none', 'bg-white'],
      widths: LETTERHEAD_WIDTHS,
      outputPath: 'documents/letterhead/light',
    },
    {
      role: 'legal',
      theme: 'dark',
      source: 'dark.png',
      backgrounds: ['bg-none', 'bg-black'],
      widths: LETTERHEAD_WIDTHS,
      outputPath: 'documents/letterhead/dark',
    },
    {
      role: 'legal',
      theme: 'light',
      source: 'light.png',
      backgrounds: ['bg-none', 'bg-white'],
      widths: FOOTER_WIDTHS,
      outputPath: 'documents/footer/light',
    },
    {
      role: 'legal',
      theme: 'dark',
      source: 'dark.png',
      backgrounds: ['bg-none', 'bg-black'],
      widths: FOOTER_WIDTHS,
      outputPath: 'documents/footer/dark',
    },
  ];

  let total = 0;
  for (const pack of packs) {
    total += await buildPack(backgrounds, pack);
  }

  console.log(`Built ${total} email/docs PNGs under dist/email and dist/documents`);
}

if (require.main === module) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error('\nError:', message);
    process.exit(1);
  });
}

export { main };

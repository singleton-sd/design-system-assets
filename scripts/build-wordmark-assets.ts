#!/usr/bin/env node

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
  BackgroundPreset,
  WordmarkVariant,
  createWordmarkPng,
  getApprovedVariants,
  getVariantOutputDir,
} from './lib/wordmark-image';

type ConfigMap<T> = Record<string, T>;

interface RolePreset {
  name: string;
  description: string;
  sourceDir: string;
}

interface OutputPreset {
  role: string;
  theme: string;
  source: string;
  sizeGroup: string;
  outputPath: string;
  variantGroup: string;
}

interface RenderConfig {
  paddingRatio: number;
}

const ROOT = process.cwd();
const WORDMARK_DIR = path.join(ROOT, 'src', 'logo', 'wordmark');
const CONFIG_DIR = path.join(WORDMARK_DIR, 'config');
const SOURCES_DIR = path.join(WORDMARK_DIR, 'sources');
const DIST_DIR = path.join(ROOT, 'dist');
const DEFAULT_CI_STATIC_MAX_SIZE = 2560;
const OPTIONAL_SVG_NAMES = ['light.svg', 'dark.svg'] as const;

async function readJson<T>(fileName: string): Promise<T> {
  const filePath = path.join(CONFIG_DIR, fileName);
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content) as T;
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function pruneStalePngSizes(outputDir: string, allowedSizes: Set<number>): Promise<void> {
  let entries;

  try {
    entries = await fs.readdir(outputDir, { withFileTypes: true, encoding: 'utf8' });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.png')) {
      continue;
    }

    const sizeCandidate = Number.parseInt(path.basename(entry.name, '.png'), 10);

    if (!Number.isFinite(sizeCandidate)) {
      continue;
    }

    if (!allowedSizes.has(sizeCandidate)) {
      await fs.rm(path.join(outputDir, entry.name), { force: true });
    }
  }
}

function assertConfigured<T>(configs: ConfigMap<T>, key: string, type: string): T {
  const config = configs[key];

  if (!config) {
    throw new Error(`Unknown ${type} preset: ${key}`);
  }

  return config;
}

function getStaticMaxSize(): number | null {
  const envMaxSize = process.env.WORDMARK_STATIC_MAX_SIZE ?? process.env.LOGO_STATIC_MAX_SIZE;

  if (envMaxSize) {
    const parsed = Number.parseInt(envMaxSize, 10);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      throw new Error(`WORDMARK_STATIC_MAX_SIZE must be a positive integer, received: ${envMaxSize}`);
    }

    return parsed;
  }

  if (process.env.CI) {
    return DEFAULT_CI_STATIC_MAX_SIZE;
  }

  return null;
}

async function copyOptionalSvgs(roleSourceDir: string, themeOutputBase: string, theme: string): Promise<void> {
  const svgName = `${theme}.svg` as (typeof OPTIONAL_SVG_NAMES)[number];
  const sourceSvg = path.join(roleSourceDir, svgName);

  if (!(await fileExists(sourceSvg))) {
    return;
  }

  await ensureDir(themeOutputBase);
  const destSvg = path.join(themeOutputBase, svgName);
  await fs.copyFile(sourceSvg, destSvg);
  console.log(`Copied ${path.relative(ROOT, sourceSvg)} → ${path.relative(ROOT, destSvg)}`);
}

async function main(): Promise<void> {
  const [backgrounds, roles, sizeGroups, outputPresets, variantGroups, render] = await Promise.all([
    readJson<ConfigMap<BackgroundPreset>>('backgrounds.json'),
    readJson<ConfigMap<RolePreset>>('roles.json'),
    readJson<ConfigMap<number[]>>('size-groups.json'),
    readJson<ConfigMap<OutputPreset>>('output-presets.json'),
    readJson<ConfigMap<WordmarkVariant[]>>('variants.json'),
    readJson<RenderConfig>('render.json'),
  ]);

  if (typeof render.paddingRatio !== 'number' || render.paddingRatio < 0 || render.paddingRatio >= 0.5) {
    throw new Error('render.json paddingRatio must be a number in [0, 0.5).');
  }

  const presets = Object.entries(outputPresets).sort(([a], [b]) => a.localeCompare(b));
  const staticMaxSize = getStaticMaxSize();
  let generatedCount = 0;
  let skippedCount = 0;

  for (const [presetName, preset] of presets) {
    assertConfigured(roles, preset.role, 'role');

    const configuredSizes = sizeGroups[preset.sizeGroup];

    if (!configuredSizes) {
      throw new Error(`Unknown size group: ${preset.sizeGroup}`);
    }

    const sizes =
      staticMaxSize === null ? configuredSizes : configuredSizes.filter((size) => size <= staticMaxSize);

    if (sizes.length === 0) {
      throw new Error(
        `${presetName} has no wordmark sizes <= ${staticMaxSize}. ` +
          'Increase WORDMARK_STATIC_MAX_SIZE or update size groups.',
      );
    }

    const roleSourceDir = path.join(SOURCES_DIR, preset.role);
    const sourceFile = path.join(roleSourceDir, preset.source);

    if (!(await fileExists(sourceFile))) {
      console.warn(
        `Skipping ${presetName}: missing source ${path.relative(ROOT, sourceFile)}. ` +
          'See src/logo/wordmark/README.md.',
      );
      skippedCount += 1;
      continue;
    }

    const variants = getApprovedVariants(
      presetName,
      assertConfigured(variantGroups, preset.variantGroup, 'variant group'),
    );
    const themeOutputBase = path.join(DIST_DIR, preset.outputPath);

    await copyOptionalSvgs(roleSourceDir, themeOutputBase, preset.theme);

    if (staticMaxSize !== null) {
      console.log(`Capping wordmark widths at ${staticMaxSize}px for ${presetName}: ${sizes.join(', ')}`);
    }

    for (const variant of variants) {
      const background = assertConfigured(backgrounds, variant.background, 'background');
      const outputDir = getVariantOutputDir(DIST_DIR, preset.outputPath, variant);

      await ensureDir(outputDir);
      await pruneStalePngSizes(outputDir, new Set(sizes));

      for (const width of sizes) {
        const outputFile = path.join(outputDir, `${width}.png`);

        console.log(`Creating ${path.relative(ROOT, outputFile)}`);
        await createWordmarkPng({
          sourceFile,
          outputFile,
          width,
          background,
          paddingRatio: render.paddingRatio,
        });
        generatedCount += 1;
      }
    }
  }

  if (generatedCount === 0 && skippedCount > 0) {
    console.warn(
      'No wordmark assets generated. Add light.png / dark.png under src/logo/wordmark/sources/{legal,descriptor,compact}/.',
    );
    return;
  }

  console.log(`Wordmark assets created successfully (${generatedCount} PNG(s), ${skippedCount} preset(s) skipped).`);
}

if (require.main === module) {
  main().catch((error) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('\nError:', errorMessage);
    process.exit(1);
  });
}

#!/usr/bin/env node

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
  BackgroundPreset,
  BorderPreset,
  OutputVariant,
  ShapePreset,
  createLogoPng,
  getApprovedVariants,
  getVariantOutputDir,
} from './lib/logo-image';

type ConfigMap<T> = Record<string, T>;

interface OutputPreset {
  source: string;
  sizeGroup: string;
  outputType: 'manifest' | 'static';
  outputPath: string;
  variants?: OutputVariant[];
  variantGroup?: string;
}

const ROOT = process.cwd();
const LOGO_DIR = path.join(ROOT, 'src', 'logo');
const CONFIG_DIR = path.join(LOGO_DIR, 'config');
const SOURCES_DIR = path.join(LOGO_DIR, 'sources');
const DIST_DIR = path.join(ROOT, 'dist');
const FORBIDDEN_STATIC_SIZES = new Set([16, 32, 180, 192]);
const DEFAULT_CI_STATIC_MAX_SIZE = 512;

async function readJson<T>(fileName: string): Promise<T> {
  const filePath = path.join(CONFIG_DIR, fileName);
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content) as T;
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
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
      const staleFile = path.join(outputDir, entry.name);
      await fs.rm(staleFile, { force: true });
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

function getPresetVariants(
  presetName: string,
  preset: OutputPreset,
  variantGroups: ConfigMap<OutputVariant[]>,
): OutputVariant[] {
  if (preset.variants) {
    return getApprovedVariants(presetName, preset.variants);
  }

  if (preset.variantGroup) {
    const variants = assertConfigured(variantGroups, preset.variantGroup, 'variant group');

    return getApprovedVariants(presetName, variants);
  }

  throw new Error(`${presetName} must define variants or variantGroup.`);
}

function getStaticPresets(presets: ConfigMap<OutputPreset>): [string, OutputPreset][] {
  return Object.entries(presets)
    .filter(([, preset]) => preset.outputType === 'static')
    .sort(([a], [b]) => a.localeCompare(b));
}

function assertStaticSizes(presetName: string, sizeGroup: string, sizes: number[]): void {
  if (sizeGroup === 'manifest') {
    throw new Error(`${presetName} must not use the manifest size group.`);
  }

  const forbiddenSizes = sizes.filter((size) => FORBIDDEN_STATIC_SIZES.has(size));

  if (forbiddenSizes.length > 0) {
    throw new Error(`${presetName} includes favicon-only sizes: ${forbiddenSizes.join(', ')}.`);
  }
}

function getStaticMaxSize(): number | null {
  const envMaxSize = process.env.LOGO_STATIC_MAX_SIZE;

  if (envMaxSize) {
    const parsed = Number.parseInt(envMaxSize, 10);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      throw new Error(`LOGO_STATIC_MAX_SIZE must be a positive integer, received: ${envMaxSize}`);
    }

    return parsed;
  }

  if (process.env.CI) {
    return DEFAULT_CI_STATIC_MAX_SIZE;
  }

  return null;
}

async function main(): Promise<void> {
  const [backgrounds, borders, shapes, sizeGroups, outputPresets, variantGroups] = await Promise.all([
    readJson<ConfigMap<BackgroundPreset>>('backgrounds.json'),
    readJson<ConfigMap<BorderPreset>>('borders.json'),
    readJson<ConfigMap<ShapePreset>>('shapes.json'),
    readJson<ConfigMap<number[]>>('size-groups.json'),
    readJson<ConfigMap<OutputPreset>>('output-presets.json'),
    readJson<ConfigMap<OutputVariant[]>>('variants.json'),
  ]);

  const staticPresets = getStaticPresets(outputPresets);
  const staticMaxSize = getStaticMaxSize();

  if (staticPresets.length === 0) {
    console.warn('No static logo output presets found.');
    return;
  }

  for (const [presetName, preset] of staticPresets) {
    const configuredSizes = sizeGroups[preset.sizeGroup];

    if (!configuredSizes) {
      throw new Error(`Unknown size group: ${preset.sizeGroup}`);
    }

    const sizes =
      staticMaxSize === null ? configuredSizes : configuredSizes.filter((size) => size <= staticMaxSize);

    if (sizes.length === 0) {
      throw new Error(
        `${presetName} has no static sizes <= ${staticMaxSize}. ` +
          'Increase LOGO_STATIC_MAX_SIZE or update size groups.',
      );
    }

    assertStaticSizes(presetName, preset.sizeGroup, sizes);

    const sourceFile = path.join(SOURCES_DIR, preset.source);
    const variants = getPresetVariants(presetName, preset, variantGroups);

    if (staticMaxSize !== null) {
      console.log(`Capping static sizes at ${staticMaxSize}px for ${presetName}: ${sizes.join(', ')}`);
    }

    for (const variant of variants) {
      const shape = assertConfigured(shapes, variant.shape, 'shape');
      const background = variant.background
        ? assertConfigured(backgrounds, variant.background, 'background')
        : undefined;
      const border = assertConfigured(borders, variant.border, 'border');
      const outputDir = getVariantOutputDir(DIST_DIR, preset.outputPath, variant);

      await ensureDir(outputDir);
      await pruneStalePngSizes(outputDir, new Set(sizes));

      for (const size of sizes) {
        const outputFile = path.join(outputDir, `${size}.png`);

        console.log(`Creating ${path.relative(ROOT, outputFile)}`);
        await createLogoPng({ sourceFile, outputFile, size, shape, background, border });
      }
    }
  }

  console.log('Static logo assets created successfully.');
}

if (require.main === module) {
  main().catch((error) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('\nError:', errorMessage);
    process.exit(1);
  });
}

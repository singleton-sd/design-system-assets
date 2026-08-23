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

interface ManifestIcon {
  src: string;
  sizes: string;
  type: 'image/png';
}

interface WebManifest {
  name: string;
  short_name: string;
  icons: ManifestIcon[];
  theme_color: string;
  background_color: string;
  display: 'standalone';
}

interface ProductConfig {
  name: string;
  shortName: string;
  themeColor: string;
  backgroundColor: string;
}

const ROOT = process.cwd();
const LOGO_DIR = path.join(ROOT, 'src', 'logo');
const CONFIG_DIR = path.join(LOGO_DIR, 'config');
const SOURCES_DIR = path.join(LOGO_DIR, 'sources');
const DIST_DIR = path.join(ROOT, 'dist');
const MANIFEST_SIZE_GROUP = 'manifest';

const OUTPUT_FILES: Record<number, string[]> = {
  16: ['favicon-16x16.png'],
  32: ['favicon-32x32.png', 'favicon.png'],
  180: ['apple-touch-icon.png'],
  192: ['android-chrome-192x192.png'],
  512: ['android-chrome-512x512.png'],
  4096: ['favicon-4096x4096.png'],
};

async function readJson<T>(fileName: string): Promise<T> {
  const filePath = path.join(CONFIG_DIR, fileName);
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content) as T;
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
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

function getManifestPreset(presets: ConfigMap<OutputPreset>): [string, OutputPreset] {
  const manifestPresets = Object.entries(presets).filter(
    ([, preset]) => preset.outputType === 'manifest' && preset.sizeGroup === MANIFEST_SIZE_GROUP,
  );

  if (manifestPresets.length !== 1) {
    throw new Error(`Expected exactly one ${MANIFEST_SIZE_GROUP} output preset, found ${manifestPresets.length}.`);
  }

  return manifestPresets[0];
}

function getOutputFileNames(size: number): string[] {
  const outputFiles = OUTPUT_FILES[size];

  if (!outputFiles) {
    throw new Error(`No manifest output filename configured for ${size}px.`);
  }

  return outputFiles;
}

function createWebManifest(product: ProductConfig): WebManifest {
  return {
    name: product.name,
    short_name: product.shortName,
    icons: [192, 512].map((size) => ({
      src: `android-chrome-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
    })),
    theme_color: product.themeColor,
    background_color: product.backgroundColor,
    display: 'standalone',
  };
}

async function main(): Promise<void> {
  const [backgrounds, borders, shapes, sizeGroups, outputPresets, variantGroups, product] = await Promise.all([
    readJson<ConfigMap<BackgroundPreset>>('backgrounds.json'),
    readJson<ConfigMap<BorderPreset>>('borders.json'),
    readJson<ConfigMap<ShapePreset>>('shapes.json'),
    readJson<ConfigMap<number[]>>('size-groups.json'),
    readJson<ConfigMap<OutputPreset>>('output-presets.json'),
    readJson<ConfigMap<OutputVariant[]>>('variants.json'),
    fs
      .readFile(path.join(ROOT, 'config', 'product.json'), 'utf8')
      .then((content) => JSON.parse(content) as ProductConfig),
  ]);

  const [presetName, preset] = getManifestPreset(outputPresets);
  const sizes = sizeGroups[preset.sizeGroup];

  if (!sizes) {
    throw new Error(`Unknown size group: ${preset.sizeGroup}`);
  }

  const sourceFile = path.join(SOURCES_DIR, preset.source);
  const variants = getPresetVariants(presetName, preset, variantGroups);

  for (const variant of variants) {
    const shape = assertConfigured(shapes, variant.shape, 'shape');
    const background = variant.background
      ? assertConfigured(backgrounds, variant.background, 'background')
      : undefined;
    const border = assertConfigured(borders, variant.border, 'border');
    const outputDir = getVariantOutputDir(DIST_DIR, preset.outputPath, variant);
    await ensureDir(outputDir);

    for (const size of sizes) {
      for (const fileName of getOutputFileNames(size)) {
        const outputFile = path.join(outputDir, fileName);

        console.log(`Creating ${path.relative(ROOT, outputFile)}`);
        await createLogoPng({ sourceFile, outputFile, size, shape, background, border });
      }
    }

    const manifestFile = path.join(outputDir, 'site.webmanifest');
    const manifest = createWebManifest(product);

    await fs.writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    console.log(`Creating ${path.relative(ROOT, manifestFile)}`);
  }

  console.log('Manifest icons created successfully.');
}

if (require.main === module) {
  main().catch((error) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('\nError:', errorMessage);
    process.exit(1);
  });
}

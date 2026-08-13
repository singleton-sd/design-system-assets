import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import sharp from 'sharp';
import {
  buildCacheKey,
  cacheFilePath,
  isCacheDisabled,
  tryCopyFromCache,
  writeCacheFromOutput,
} from './logo-render-cache';

sharp.cache(false);
sharp.concurrency(1);

interface BackgroundPreset {
  name: string;
  fill: string | null;
}

interface WordmarkVariant {
  background: string;
  productionApproved: boolean;
}

interface WordmarkImageOptions {
  sourceFile: string;
  outputFile: string;
  width: number;
  background?: BackgroundPreset;
  paddingRatio: number;
}

const LARGE_ICON_SIZE_THRESHOLD = 1024;

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

function getPngOptions(size: number): sharp.PngOptions {
  if (size >= LARGE_ICON_SIZE_THRESHOLD) {
    return {
      compressionLevel: 9,
      effort: 10,
      palette: true,
      colors: 256,
      quality: 100,
    };
  }

  return {
    compressionLevel: 9,
    effort: 10,
  };
}

function getApprovedVariants(presetName: string, variants: WordmarkVariant[]): WordmarkVariant[] {
  const approvedVariants = variants.filter((variant) => variant.productionApproved);

  if (approvedVariants.length === 0) {
    throw new Error(`${presetName} must include at least one production-approved variant.`);
  }

  return approvedVariants;
}

function getVariantOutputDir(rootDir: string, outputPath: string, variant: WordmarkVariant): string {
  return path.join(rootDir, outputPath, variant.background);
}

function parseFill(fill: string | null | undefined): { r: number; g: number; b: number; alpha: number } {
  if (!fill) {
    return { r: 0, g: 0, b: 0, alpha: 0 };
  }

  return {
    r: Number.parseInt(fill.slice(1, 3), 16),
    g: Number.parseInt(fill.slice(3, 5), 16),
    b: Number.parseInt(fill.slice(5, 7), 16),
    alpha: 1,
  };
}

async function createWordmarkPng(options: WordmarkImageOptions): Promise<void> {
  await ensureDir(path.dirname(options.outputFile));
  const pngOptions = getPngOptions(options.width);

  let cachePath: string | null = null;

  if (!isCacheDisabled()) {
    const key = await buildCacheKey(
      options.sourceFile,
      options.width,
      'none',
      options.background?.fill,
      `wordmark-pad:${options.paddingRatio}`,
      0,
    );
    cachePath = await cacheFilePath(key);

    if (await tryCopyFromCache(cachePath, options.outputFile)) {
      return;
    }
  }

  const pad = Math.max(0, Math.round(options.width * options.paddingRatio));
  const contentWidth = Math.max(1, options.width - pad * 2);
  const resized = await sharp(options.sourceFile)
    .resize({ width: contentWidth, fit: 'inside', withoutEnlargement: false })
    .png(pngOptions)
    .toBuffer();
  const resizedMeta = await sharp(resized).metadata();
  const contentHeight = resizedMeta.height ?? 1;
  const height = contentHeight + pad * 2;
  const left = Math.round((options.width - (resizedMeta.width ?? contentWidth)) / 2);
  const top = pad;

  await sharp({
    create: {
      width: options.width,
      height,
      channels: 4,
      background: parseFill(options.background?.fill),
    },
  })
    .composite([{ input: resized, left, top }])
    .png(pngOptions)
    .toFile(options.outputFile);

  if (cachePath) {
    await writeCacheFromOutput(cachePath, options.outputFile);
  }
}

export {
  BackgroundPreset,
  WordmarkImageOptions,
  WordmarkVariant,
  createWordmarkPng,
  getApprovedVariants,
  getVariantOutputDir,
};

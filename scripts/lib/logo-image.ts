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

interface BorderPreset {
  name: string;
  color: string | null;
  widthRatio: number;
}

interface ShapePreset {
  name: string;
  clip: 'none' | 'circle';
}

interface OutputVariant {
  shape: string;
  background?: string;
  border: string;
  productionApproved: boolean;
}

interface LogoImageOptions {
  sourceFile: string;
  outputFile: string;
  size: number;
  shape: ShapePreset;
  background?: BackgroundPreset;
  border: BorderPreset;
}

const NO_BORDER = 'none';
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

function getApprovedVariants(presetName: string, variants: OutputVariant[]): OutputVariant[] {
  const approvedVariants = variants.filter((variant) => variant.productionApproved);

  if (approvedVariants.length === 0) {
    throw new Error(`${presetName} must include at least one production-approved variant.`);
  }

  return approvedVariants;
}

function getVariantOutputDir(rootDir: string, outputPath: string, variant: OutputVariant): string {
  const segments = [rootDir, outputPath, variant.shape];

  if (variant.background) {
    segments.push(variant.background);
  }

  if (variant.border !== NO_BORDER) {
    segments.push(variant.border);
  }

  return path.join(...segments);
}

function getCircleMask(size: number): Buffer {
  return Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>` +
      '</svg>',
  );
}

function getBorderOverlay(size: number, shape: ShapePreset, border: BorderPreset): Buffer | null {
  if (!border.color || border.widthRatio <= 0) {
    return null;
  }

  const width = Math.max(1, Math.round(size * border.widthRatio));
  const inset = width / 2;
  const stroke = `stroke="${border.color}" stroke-width="${width}" fill="none"`;
  const element =
    shape.clip === 'circle'
      ? `<circle cx="${size / 2}" cy="${size / 2}" r="${(size - width) / 2}" ${stroke}/>`
      : `<rect x="${inset}" y="${inset}" width="${size - width}" height="${size - width}" ${stroke}/>`;

  return Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${element}</svg>`,
  );
}

async function createLogoPng(options: LogoImageOptions): Promise<void> {
  await ensureDir(path.dirname(options.outputFile));
  const pngOptions = getPngOptions(options.size);

  let cachePath: string | null = null;

  if (!isCacheDisabled()) {
    const key = await buildCacheKey(
      options.sourceFile,
      options.size,
      options.shape.clip,
      options.background?.fill,
      options.border.color,
      options.border.widthRatio,
    );
    cachePath = await cacheFilePath(key);

    if (await tryCopyFromCache(cachePath, options.outputFile)) {
      return;
    }
  }

  const background = options.background?.fill
    ? {
        r: Number.parseInt(options.background.fill.slice(1, 3), 16),
        g: Number.parseInt(options.background.fill.slice(3, 5), 16),
        b: Number.parseInt(options.background.fill.slice(5, 7), 16),
        alpha: 1,
      }
    : { r: 0, g: 0, b: 0, alpha: 0 };
  const source = await sharp(options.sourceFile)
    .resize(options.size, options.size)
    .png(pngOptions)
    .toBuffer();
  const imageBuffer = await sharp({
    create: {
      width: options.size,
      height: options.size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: source, left: 0, top: 0 }])
    .png(pngOptions)
    .toBuffer();
  const composites: sharp.OverlayOptions[] = [];
  const borderOverlay = getBorderOverlay(options.size, options.shape, options.border);

  if (options.shape.clip === 'circle') {
    composites.push({ input: getCircleMask(options.size), blend: 'dest-in' });
  }

  if (borderOverlay) {
    composites.push({ input: borderOverlay, left: 0, top: 0 });
  }

  await sharp(imageBuffer).composite(composites).png(pngOptions).toFile(options.outputFile);

  if (cachePath) {
    await writeCacheFromOutput(cachePath, options.outputFile);
  }
}

export {
  BackgroundPreset,
  BorderPreset,
  LogoImageOptions,
  OutputVariant,
  ShapePreset,
  createLogoPng,
  getApprovedVariants,
  getVariantOutputDir,
};

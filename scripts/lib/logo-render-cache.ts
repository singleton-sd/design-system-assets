import * as crypto from 'node:crypto';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const CACHE_DIR = path.join(process.cwd(), '.tmp', 'logo-render-cache');

/** Config files whose presets flow into `createLogoPng` (shape / fill / border). */
const LOGO_RENDER_CONFIG_FILES = [
  'src/logo/config/backgrounds.json',
  'src/logo/config/borders.json',
  'src/logo/config/shapes.json',
] as const;

async function getLogoImageSourceFingerprint(): Promise<string> {
  const logoImagePath = path.join(__dirname, 'logo-image.ts');

  try {
    const stat = await fs.stat(logoImagePath);

    return `logo-image.ts:${stat.mtimeMs}:${stat.size}`;
  } catch {
    return 'logo-image.ts:missing';
  }
}

async function getLogoConfigFingerprint(): Promise<string> {
  const parts: string[] = [];

  for (const rel of LOGO_RENDER_CONFIG_FILES) {
    const absolute = path.join(process.cwd(), rel);

    try {
      const stat = await fs.stat(absolute);
      parts.push(`${rel}:${stat.mtimeMs}:${stat.size}`);
    } catch {
      parts.push(`${rel}:missing`);
    }
  }

  return parts.join('|');
}

function isCacheDisabled(): boolean {
  const v = process.env.LOGO_RENDER_CACHE;

  if (!v) {
    return false;
  }

  return v === '0' || v.toLowerCase() === 'false' || v.toLowerCase() === 'no';
}

async function buildCacheKey(
  sourceFile: string,
  outputSize: number,
  shapeClip: 'none' | 'circle',
  backgroundFill: string | null | undefined,
  borderColor: string | null,
  borderWidthRatio: number,
): Promise<string> {
  const normalizedSource = path.normalize(path.resolve(sourceFile));
  const [sourceStat, rendererFingerprint, configFingerprint] = await Promise.all([
    fs.stat(normalizedSource),
    getLogoImageSourceFingerprint(),
    getLogoConfigFingerprint(),
  ]);
  const fillPart = backgroundFill ?? '';
  const borderPart = borderColor ?? '';
  const payload = [
    rendererFingerprint,
    configFingerprint,
    path.relative(process.cwd(), normalizedSource),
    sourceStat.mtimeMs,
    sourceStat.size,
    outputSize,
    shapeClip,
    fillPart,
    borderPart,
    borderWidthRatio,
  ].join('\0');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

async function cacheFilePath(key: string): Promise<string> {
  await fs.mkdir(CACHE_DIR, { recursive: true });

  const prefix = key.slice(0, 2);

  return path.join(CACHE_DIR, prefix, `${key}.png`);
}

async function tryCopyFromCache(cachePath: string, outputFile: string): Promise<boolean> {
  try {
    await fs.copyFile(cachePath, outputFile);

    return true;
  } catch {
    return false;
  }
}

async function writeCacheFromOutput(cachePath: string, outputFile: string): Promise<void> {
  const dir = path.dirname(cachePath);

  await fs.mkdir(dir, { recursive: true });

  const tmp = path.join(dir, `${path.basename(cachePath)}.${process.pid}.${Date.now()}.tmp`);

  try {
    await fs.copyFile(outputFile, tmp);
    await fs.rename(tmp, cachePath);
  } catch {
    try {
      await fs.unlink(tmp);
    } catch {
      /* ignore */
    }
  }
}

export { buildCacheKey, cacheFilePath, isCacheDisabled, tryCopyFromCache, writeCacheFromOutput };

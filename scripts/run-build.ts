#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.join(__dirname, '..');

const OG_IMAGE_SRC = path.join(ROOT, 'src', 'og-image');
const OG_IMAGE_DEST_REL = 'og-image';

function removeNonAssetFiles(dir: string): void {
  let entries;

  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const ent of entries) {
    const full = path.join(dir, ent.name);

    if (ent.isDirectory()) {
      removeNonAssetFiles(full);
    } else if (ent.name === '.gitkeep' || ent.name.toLowerCase() === 'readme.md') {
      fs.unlinkSync(full);
    }
  }
}

const REQUIRED_OG_IMAGES_REL = [
  path.join(OG_IMAGE_DEST_REL, 'dark', 'og-default.jpg'),
  path.join(OG_IMAGE_DEST_REL, 'light', 'og-default.jpg'),
] as const;

function copyOgImagesToDist(distDir: string): void {
  if (!fs.existsSync(OG_IMAGE_SRC)) {
    throw new Error(
      `Missing ${path.relative(ROOT, OG_IMAGE_SRC)}. Add Open Graph JPEGs under src/og-image/dark and src/og-image/light (see README).`,
    );
  }

  const destDir = path.join(distDir, OG_IMAGE_DEST_REL);

  fs.rmSync(destDir, { recursive: true, force: true });
  fs.cpSync(OG_IMAGE_SRC, destDir, { recursive: true });
  removeNonAssetFiles(destDir);
  console.log(`Copied ${path.relative(ROOT, OG_IMAGE_SRC)} → ${path.relative(ROOT, destDir)}`);

  for (const rel of REQUIRED_OG_IMAGES_REL) {
    const filePath = path.join(distDir, rel);

    if (!fs.existsSync(filePath)) {
      throw new Error(
        `After OG image copy, expected file is missing: ${rel}. Commit JPEGs under ${path.relative(ROOT, OG_IMAGE_SRC)}/ (see DS-34).`,
      );
    }
  }
}

function runYarnScript(scriptName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('yarn', [scriptName], {
      cwd: ROOT,
      stdio: 'inherit',
      shell: true,
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`yarn ${scriptName} exited with code ${code}`));
    });
  });
}

async function main(): Promise<void> {
  const distDir = path.join(ROOT, 'dist');

  const results = await Promise.allSettled([
    runYarnScript('generate-html'),
    runYarnScript('build-manifest-icons'),
    runYarnScript('build-static-logo-assets'),
    runYarnScript('build-wordmark-assets'),
    runYarnScript('build-email-docs-assets'),
  ]);

  const failures = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');

  if (failures.length > 0) {
    for (const f of failures) {
      const message = f.reason instanceof Error ? f.reason.message : String(f.reason);
      console.error(message);
    }
    process.exit(1);
  }

  fs.mkdirSync(distDir, { recursive: true });

  const indexSrc = path.join(ROOT, 'index.html');
  const indexDest = path.join(distDir, 'index.html');
  fs.copyFileSync(indexSrc, indexDest);
  copyOgImagesToDist(distDir);
}

if (require.main === module) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error('\nError:', message);
    process.exit(1);
  });
}

export { main };

#!/usr/bin/env node

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { constructReleaseUrl, createFooter } from './generate-html';

interface PackageJson {
  version: string;
  repository?: string | { url?: string };
}

const ROOT = process.cwd();
const PACKAGE_FILE = path.join(ROOT, 'package.json');
const TEMPLATE_FILE = path.join(ROOT, 'templates', 'html', 'brand.html.template');
const OUTPUT_FILE = path.join(ROOT, 'brand', 'index.html');

async function readText(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to read ${path.relative(ROOT, filePath)}: ${message}`);
  }
}

function assertTemplatePlaceholders(template: string): void {
  for (const placeholder of ['{{VERSION}}', '{{FOOTER}}']) {
    if (!template.includes(placeholder)) {
      throw new Error(`Brand template is missing required placeholder: ${placeholder}`);
    }
  }
}

async function generateBrandHtml(): Promise<void> {
  const [template, packageRaw] = await Promise.all([
    readText(TEMPLATE_FILE),
    readText(PACKAGE_FILE),
  ]);
  const packageJson = JSON.parse(packageRaw) as PackageJson;

  if (!packageJson.version) {
    throw new Error('package.json must define a version.');
  }

  assertTemplatePlaceholders(template);

  const releaseUrl = constructReleaseUrl(packageJson.version, packageJson.repository);
  const html = template
    .replace('{{VERSION}}', packageJson.version)
    .replace('{{FOOTER}}', createFooter(packageJson.version, releaseUrl));

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, html);
  console.log(`Generated ${path.relative(ROOT, OUTPUT_FILE)} for version ${packageJson.version}.`);
}

if (require.main === module) {
  generateBrandHtml().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error('\nError:', message);
    process.exit(1);
  });
}

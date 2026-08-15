#!/usr/bin/env node

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { marked } from 'marked';
import { enhanceReadmeHtml } from './lib/enhance-readme-html';

interface PackageJson {
  version: string;
  repository?: string | { url?: string };
}

const ROOT = process.cwd();
const README_FILE = path.join(ROOT, 'README.md');
const PACKAGE_FILE = path.join(ROOT, 'package.json');
const TEMPLATE_FILE = path.join(ROOT, 'templates', 'html', 'index.html.template');
const OUTPUT_FILE = path.join(ROOT, 'index.html');
const DEFAULT_REPO_URL = 'https://gitlab.com/singleton-sd/design-system/assets';

async function readText(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to read ${path.relative(ROOT, filePath)}: ${message}`);
  }
}

async function readPackageJson(): Promise<PackageJson> {
  const content = await readText(PACKAGE_FILE);

  return JSON.parse(content) as PackageJson;
}

function constructReleaseUrl(version: string, repository?: string | { url?: string }): string {
  const repoUrl = typeof repository === 'string' ? repository : repository?.url ?? '';

  if (repoUrl.includes('gitlab.com')) {
    const webUrl = repoUrl
      .replace(/\.git$/, '')
      .replace(/^git\+/, '')
      .replace(/^git@gitlab\.com:/, 'https://gitlab.com/')
      .replace(/^https?:\/\/gitlab\.com\//, 'https://gitlab.com/');

    return `${webUrl}/-/releases/${version}`;
  }

  return `${DEFAULT_REPO_URL}/-/releases/${version}`;
}

function createFooter(version: string, releaseUrl: string): string {
  return `
<footer>
  <a href="${DEFAULT_REPO_URL}" target="_blank" rel="noopener noreferrer">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"></path>
      <path d="M9 18c-4.51 2-5-2-7-2"></path>
    </svg>
    Source Code
  </a>
  <a href="${releaseUrl}" target="_blank" rel="noopener noreferrer" class="version">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 16v-4M12 8h.01"></path>
    </svg>
    ${version}
  </a>
</footer>`;
}

function assertTemplatePlaceholders(template: string): void {
  for (const placeholder of ['{{VERSION}}', '{{CONTENT}}', '{{NAV}}', '{{FOOTER}}']) {
    if (!template.includes(placeholder)) {
      throw new Error(`Template is missing required placeholder: ${placeholder}`);
    }
  }
}

async function generateHtml(): Promise<void> {
  const [readme, template, packageJson] = await Promise.all([
    readText(README_FILE),
    readText(TEMPLATE_FILE),
    readPackageJson(),
  ]);

  if (!packageJson.version) {
    throw new Error('package.json must define a version.');
  }

  assertTemplatePlaceholders(template);

  const markdownHtml = await marked.parse(readme);
  const { content, nav } = enhanceReadmeHtml(markdownHtml);
  const releaseUrl = constructReleaseUrl(packageJson.version, packageJson.repository);
  const html = template
    .replaceAll('{{VERSION}}', packageJson.version)
    .replaceAll('{{NAV}}', nav)
    .replaceAll('{{CONTENT}}', content.trim())
    .replaceAll('{{FOOTER}}', createFooter(packageJson.version, releaseUrl));

  await fs.writeFile(OUTPUT_FILE, html);
  console.log(`Generated ${path.relative(ROOT, OUTPUT_FILE)} for version ${packageJson.version}.`);
}

export { constructReleaseUrl, createFooter };

if (require.main === module) {
  generateHtml().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error('\nError:', message);
    process.exit(1);
  });
}

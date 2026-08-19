const DEFAULT_REPO_URL = 'https://gitlab.com/singleton-sd/design-system/assets';

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

export { constructReleaseUrl, createFooter };

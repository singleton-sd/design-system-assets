const FILE_HREF = /\.(?:png|jpe?g|svg|gif|webp|webmanifest)(?:\?|$)/i;

export function slugifyHeading(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, 'and')
    .replace(/&[a-z0-9#]+;/gi, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function previewWellClass(src: string): string {
  const kinds = ['preview-well'];

  if (src.includes('/og-image/')) {
    kinds.push('is-og', 'is-framed');
    return kinds.join(' ');
  }

  if (src.includes('/wordmark/')) {
    kinds.push('is-wordmark');
  } else if (src.includes('/favicons/')) {
    kinds.push('is-favicon');
  } else {
    kinds.push('is-mark');
  }

  const isDarkAsset = /\/dark\//.test(src) || /\/favicons\//.test(src);
  const isTransparent = /bg-none/.test(src);

  if (/bg-black/.test(src) || /bg-white/.test(src) || /bg-gray/.test(src)) {
    kinds.push('is-on-muted');
  } else if (isTransparent && isDarkAsset) {
    kinds.push('is-on-dark');
  } else {
    kinds.push('is-on-checker');
  }

  return kinds.join(' ');
}

function tableRows(tableInner: string): string[] {
  return [...tableInner.matchAll(/<tr(?:\s[^>]*)?>([\s\S]*?)<\/tr>/gi)].map((match) => match[1]);
}

function tableCells(rowHtml: string): string[] {
  return [...rowHtml.matchAll(/<t[dh](?:\s[^>]*)?>([\s\S]*?)<\/t[dh]>/gi)].map((match) =>
    match[1].trim(),
  );
}

function addHeadingIds(html: string): string {
  return html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (full, level: string, inner: string) => {
    const id = slugifyHeading(inner);

    if (!id) {
      return full;
    }

    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
}

function convertGlanceTable(html: string): string {
  return html.replace(
    /(<h2[^>]*>At a glance<\/h2>)([\s\S]*?)(<table(?:\s[^>]*)?>[\s\S]*?<\/table>)/i,
    (full, heading: string, between: string, table: string) => {
      const inner = table.replace(/^<table[^>]*>/i, '').replace(/<\/table>$/i, '');
      const rows = tableRows(inner);

      if (rows.length < 2) {
        return full;
      }

      const cards = rows.slice(1).map((row) => {
        const [asset = '', preview = '', download = ''] = tableCells(row);

        return [
          '<article class="glance-card">',
          `<div class="glance-card__preview">${preview}</div>`,
          `<div class="glance-card__label">${asset}</div>`,
          `<div class="glance-card__downloads">${download}</div>`,
          '</article>',
        ].join('\n');
      });

      return `${heading}${between}<div class="glance-grid">\n${cards.join('\n')}\n</div>`;
    },
  );
}

function classifyTables(html: string): string {
  return html
    .replace(/<table>/g, '<div class="asset-table-wrap"><table class="asset-table">')
    .replace(/<\/table>/g, '</table></div>');
}

function wrapPreviewImages(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = tag.match(/\bsrc="([^"]*)"/i)?.[1] ?? '';

    return `<span class="${previewWellClass(src)}">${tag}</span>`;
  });
}

function markFileChips(html: string): string {
  return html.replace(
    /<a\s+href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/gi,
    (full, href: string, extra: string, inner: string) => {
      if (!FILE_HREF.test(href)) {
        return full;
      }

      if (/<img\b/i.test(inner) || /preview-well/.test(inner) || /\bfile-chip\b/.test(extra)) {
        return full;
      }

      const extras = /\bclass="/.test(extra)
        ? extra.replace(/class="([^"]*)"/, 'class="$1 file-chip"')
        : `${extra} class="file-chip"`;

      return `<a href="${href}"${extras}>${inner}</a>`;
    },
  );
}

export function buildSectionNav(html: string): string {
  return [...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)]
    .map((match) => {
      const label = match[2].replace(/<[^>]+>/g, '').trim();

      return `<a href="#${match[1]}">${label}</a>`;
    })
    .join('\n');
}

export function enhanceReadmeHtml(html: string): { content: string; nav: string } {
  let content = html;

  content = addHeadingIds(content);
  content = convertGlanceTable(content);
  content = classifyTables(content);
  content = wrapPreviewImages(content);
  content = markFileChips(content);

  return { content, nav: buildSectionNav(content) };
}

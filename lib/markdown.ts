import { marked } from 'marked';

// Configure marked with custom renderer
const renderer = new marked.Renderer();

// Custom Table Renderer: wraps table in responsive overflow-x container and renders cells cleanly
renderer.table = function (token) {
  let headerCells = '';
  if (token.header) {
    for (let s = 0; s < token.header.length; s++) {
      headerCells += this.tablecell(token.header[s]);
    }
  }
  const headerRow = this.tablerow({ text: headerCells });

  let bodyRows = '';
  if (token.rows) {
    for (let s = 0; s < token.rows.length; s++) {
      const row = token.rows[s];
      let rowCells = '';
      for (let i = 0; i < row.length; i++) {
        rowCells += this.tablecell(row[i]);
      }
      bodyRows += this.tablerow({ text: rowCells });
    }
  }

  return `
    <div class="table-container my-6 rounded-xl border border-separator overflow-x-auto shadow-xs">
      <table class="w-full text-left border-collapse text-xs md:text-sm">
        <thead class="bg-bg-subtle border-b border-separator text-text font-bold">
          ${headerRow}
        </thead>
        <tbody class="divide-y divide-separator bg-bg-card text-text-secondary">
          ${bodyRows}
        </tbody>
      </table>
    </div>
  `;
};

renderer.tablerow = function ({ text }) {
  return `<tr class="hover:bg-bg-subtle/50 transition-colors">${text}</tr>`;
};

renderer.tablecell = function (cell: any) {
  let content = this.parser.parseInline(cell.tokens || []) || cell.text;

  // Safe cell rendering: guard against [object Object] and object payloads
  if (content === null || content === undefined) {
    content = '—';
  } else if (typeof content === 'object') {
    const label = (content as any).text ?? (content as any).value ?? (content as any).label ?? '';
    const note = (content as any).note ? ` (${(content as any).note})` : '';
    if ((content as any).href) {
      content = `<a href="${(content as any).href}" class="text-accent underline font-semibold hover:opacity-80">${label}</a>${note}`;
    } else {
      content = `${label}${note}` || '—';
    }
  } else if (typeof content === 'string') {
    if (content.includes('[object Object]')) {
      content = content.replace(/\[object Object\]/g, '—');
    }
  }

  const tag = cell.header ? 'th' : 'td';
  const alignClass = cell.align ? ` text-${cell.align}` : ' text-left';
  const paddingClass = cell.header ? 'px-4 py-3 font-semibold text-text' : 'px-4 py-3 text-text-secondary';
  return `<${tag} class="${alignClass} ${paddingClass}">${content}</${tag}>`;
};

// Custom Headings Renderer
renderer.heading = function (token: any) {
  const depth = token.depth;
  const content = this.parser.parseInline(token.tokens || []) || token.text;
  if (depth === 2) {
    return `<h2 class="text-xl md:text-2xl font-bold text-text mt-8 mb-3 pt-2 border-t border-separator/40 first:border-t-0 first:pt-0">${content}</h2>`;
  }
  if (depth === 3) {
    return `<h3 class="text-lg md:text-xl font-bold text-text mt-6 mb-2">${content}</h3>`;
  }
  if (depth === 4) {
    return `<h4 class="text-base font-bold text-text mt-4 mb-2">${content}</h4>`;
  }
  return `<h${depth} class="font-bold text-text my-2">${content}</h${depth}>`;
};

// Custom List Renderers
renderer.list = function (token: any) {
  const tag = token.ordered ? 'ol' : 'ul';
  const listClass = token.ordered
    ? 'list-decimal pl-5 space-y-2 my-4 text-text-secondary'
    : 'list-disc pl-5 space-y-2 my-4 text-text-secondary';
  let body = '';
  if (token.items) {
    for (const item of token.items) {
      body += this.listitem(item);
    }
  }
  return `<${tag} class="${listClass}">${body}</${tag}>`;
};

renderer.listitem = function (item: any) {
  const content = this.parser.parse(item.tokens || []);
  return `<li class="leading-relaxed pl-1">${content}</li>`;
};

// Custom Paragraph Renderer - preserves inline links and formatting
renderer.paragraph = function (token: any) {
  const content = this.parser.parseInline(token.tokens || []) || token.text;
  return `<p class="leading-relaxed text-text-secondary my-3.5">${content}</p>`;
};

// Custom Link Renderer
renderer.link = function (token: any) {
  let cleanHref = token.href || '#';
  // Strip search redirects
  cleanHref = cleanHref
    .replace(/^https:\/\/www\.google\.com\/search\?q=%2F/, '/')
    .replace(/^https:\/\/www\.google\.com\/search\?q=\//, '/')
    .replace(/^https:\/\/www\.google\.com\/search\?q=/, '');

  const titleAttr = token.title ? ` title="${token.title}"` : '';
  const isExternal = cleanHref.startsWith('http') && !cleanHref.includes('pakaitools.store');
  const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  const content = this.parser.parseInline(token.tokens || []) || token.text;
  return `<a href="${cleanHref}" class="text-accent underline font-medium hover:opacity-80 transition-opacity"${titleAttr}${targetAttr}>${content}</a>`;
};

// Custom Strong & Em
renderer.strong = function (token: any) {
  const content = this.parser.parseInline(token.tokens || []) || token.text;
  return `<strong class="font-bold text-text">${content}</strong>`;
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
});

export function cleanMarkdownSource(content: string): string {
  if (!content) return '';
  let cleaned = content
    .replace(/https:\/\/www\.google\.com\/search\?q=%2F([^)]+)%2F/g, '/$1/')
    .replace(/https:\/\/www\.google\.com\/search\?q=(\/[^)\s]+)/g, '$1')
    .replace(/https:\/\/www\.google\.com\/search\?q=/g, '');

  // Convert raw unlinked WhatsApp/phone numbers into clickable markdown links
  cleaned = cleaned.replace(
    /(?:\[([^\]]+)\]\((https:\/\/wa\.me\/[^\)]+)\))|(\+92\s*321\s*9305619|\+923219305619|0321\s*9305619|03219305619)/g,
    (match, existingText, existingUrl, rawNumber) => {
      if (existingText && existingUrl) {
        return match;
      }
      return `[${rawNumber}](https://wa.me/923219305619?text=Hi%20PakAITools%2C%20I%20have%20a%20question.)`;
    }
  );

  return cleaned;
}

export function renderMarkdown(content: string): string {
  if (!content) return '';
  const cleaned = cleanMarkdownSource(content);
  return marked.parse(cleaned) as string;
}

export function renderInline(content: string): string {
  if (!content) return '';
  const cleaned = cleanMarkdownSource(content);
  return marked.parseInline(cleaned) as string;
}

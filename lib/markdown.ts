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
  const content = this.parser.parseInline(cell.tokens || []) || cell.text;
  const tag = cell.header ? 'th' : 'td';
  const alignClass = cell.align ? ` text-${cell.align}` : ' text-left';
  const paddingClass = cell.header ? 'px-4 py-3 font-semibold text-text' : 'px-4 py-3 text-text-secondary';
  return `<${tag} class="${alignClass} ${paddingClass}">${content}</${tag}>`;
};

// Custom Headings Renderer
renderer.heading = function ({ text, depth }) {
  if (depth === 2) {
    return `<h2 class="text-xl md:text-2xl font-bold text-text mt-8 mb-3 pt-2 border-t border-separator/40 first:border-t-0 first:pt-0">${text}</h2>`;
  }
  if (depth === 3) {
    return `<h3 class="text-lg md:text-xl font-bold text-text mt-6 mb-2">${text}</h3>`;
  }
  if (depth === 4) {
    return `<h4 class="text-base font-bold text-text mt-4 mb-2">${text}</h4>`;
  }
  return `<h${depth} class="font-bold text-text my-2">${text}</h${depth}>`;
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

// Custom Paragraph Renderer
renderer.paragraph = function ({ text }) {
  return `<p class="leading-relaxed text-text-secondary my-3.5">${text}</p>`;
};

// Custom Link Renderer
renderer.link = function ({ href, title, text }) {
  let cleanHref = href || '#';
  // Strip search redirects
  cleanHref = cleanHref
    .replace(/^https:\/\/www\.google\.com\/search\?q=%2F/, '/')
    .replace(/^https:\/\/www\.google\.com\/search\?q=\//, '/')
    .replace(/^https:\/\/www\.google\.com\/search\?q=/, '');

  const titleAttr = title ? ` title="${title}"` : '';
  const isExternal = cleanHref.startsWith('http') && !cleanHref.includes('pakaitools.store');
  const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a href="${cleanHref}" class="text-accent underline font-medium hover:opacity-80 transition-opacity"${titleAttr}${targetAttr}>${text}</a>`;
};

// Custom Strong & Em
renderer.strong = function ({ text }) {
  return `<strong class="font-bold text-text">${text}</strong>`;
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
});

export function cleanMarkdownSource(content: string): string {
  if (!content) return '';
  return content
    .replace(/https:\/\/www\.google\.com\/search\?q=%2F([^)]+)%2F/g, '/$1/')
    .replace(/https:\/\/www\.google\.com\/search\?q=(\/[^)\s]+)/g, '$1')
    .replace(/https:\/\/www\.google\.com\/search\?q=/g, '');
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

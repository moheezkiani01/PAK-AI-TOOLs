import { marked } from 'marked';

// Configure marked with custom renderer
const renderer = new marked.Renderer();

// Custom Table Renderer: wraps table in responsive overflow-x container
renderer.table = function ({ header, rows }) {
  return `
    <div class="table-container my-6 rounded-xl border border-separator overflow-hidden shadow-xs">
      <table class="w-full text-left border-collapse text-xs md:text-sm">
        <thead class="bg-bg-subtle border-b border-separator text-text font-bold">
          ${header}
        </thead>
        <tbody class="divide-y divide-separator bg-bg-card text-text-secondary">
          ${rows}
        </tbody>
      </table>
    </div>
  `;
};

renderer.tablerow = function ({ text }) {
  return `<tr class="hover:bg-bg-subtle/50 transition-colors">${text}</tr>`;
};

renderer.tablecell = function ({ text, header, align }) {
  const tag = header ? 'th' : 'td';
  const alignClass = align ? `text-${align}` : 'text-left';
  const paddingClass = header ? 'px-4 py-3 font-semibold text-text' : 'px-4 py-3 text-text-secondary';
  return `<${tag} class="${alignClass} ${paddingClass}">${text}</${tag}>`;
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
renderer.list = function ({ ordered, items }) {
  const tag = ordered ? 'ol' : 'ul';
  const listClass = ordered ? 'list-decimal pl-5 space-y-2 my-4 text-text-secondary' : 'list-disc pl-5 space-y-2 my-4 text-text-secondary';
  let body = '';
  for (const item of items) {
    body += renderer.listitem(item);
  }
  return `<${tag} class="${listClass}">${body}</${tag}>`;
};

renderer.listitem = function ({ text }) {
  return `<li class="leading-relaxed pl-1">${text}</li>`;
};

// Custom Paragraph Renderer
renderer.paragraph = function ({ text }) {
  return `<p class="leading-relaxed text-text-secondary my-3.5">${text}</p>`;
};

// Custom Link Renderer
renderer.link = function ({ href, title, text }) {
  const titleAttr = title ? ` title="${title}"` : '';
  const isExternal = href?.startsWith('http') && !href?.includes('pakaitools.store');
  const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a href="${href}" class="text-accent underline font-medium hover:opacity-80 transition-opacity"${titleAttr}${targetAttr}>${text}</a>`;
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

export function renderMarkdown(content: string): string {
  if (!content) return '';
  return marked.parse(content) as string;
}

import React from 'react';
import Link from 'next/link';

export type Cell =
  | string
  | number
  | boolean
  | null
  | undefined
  | { text?: string; value?: string; href?: string; note?: string; [key: string]: unknown };

export function renderCell(c: Cell): React.ReactNode {
  if (c === null || c === undefined) return '—';
  if (typeof c === 'boolean') return c ? 'Yes' : 'No';
  if (typeof c === 'number') return String(c);

  if (typeof c === 'string') {
    if (c === '[object Object]') return '—';

    // Parse markdown link [label](url) if present
    const linkMatch = c.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isInternal = url.startsWith('/');
      if (isInternal) {
        return (
          <Link href={url} className="text-accent underline font-semibold hover:opacity-80 transition-opacity">
            {label}
          </Link>
        );
      }
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline font-semibold hover:opacity-80 transition-opacity"
        >
          {label}
        </a>
      );
    }
    return c;
  }

  // Cell is an object { text, value, href, note }
  const label = c.text ?? c.value ?? '';
  const note = c.note ? ` (${c.note})` : '';

  if (c.href) {
    const isInternal = c.href.startsWith('/');
    if (isInternal) {
      return (
        <Link href={c.href} className="text-accent underline font-semibold hover:opacity-80 transition-opacity">
          {label || c.href}
          {note}
        </Link>
      );
    }
    return (
      <a
        href={c.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline font-semibold hover:opacity-80 transition-opacity"
      >
        {label || c.href}
        {note}
      </a>
    );
  }

  return (
    <>
      {label || '—'}
      {note}
    </>
  );
}

export function ComparisonTable({
  caption,
  headers,
  rows,
  className = '',
}: {
  caption: string;
  headers: string[];
  rows: Cell[][];
  className?: string;
}) {
  if (!headers || headers.length === 0 || !rows || rows.length === 0) {
    return null;
  }

  return (
    <div className={`overflow-x-auto my-6 rounded-xl border border-separator shadow-xs ${className}`}>
      <table className="w-full text-left border-collapse text-xs md:text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-bg-subtle border-b border-separator text-text font-bold">
          <tr>
            {headers.map((h, i) => (
              <th key={i} scope="col" className="px-4 py-3 font-semibold text-text whitespace-nowrap">
                {renderCell(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-separator bg-bg-card text-text-secondary">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-bg-subtle/50 transition-colors">
              {r.map((c, j) =>
                j === 0 ? (
                  <th key={j} scope="row" className="px-4 py-3 font-semibold text-text whitespace-nowrap">
                    {renderCell(c)}
                  </th>
                ) : (
                  <td key={j} className="px-4 py-3 text-text-secondary">
                    {renderCell(c)}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

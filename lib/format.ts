/**
 * Utility helpers for formatting text and pluralizing words consistently.
 */

export function pluralize(count: number, singular: string, plural?: string): string {
  const p = plural || `${singular}s`;
  return `${count} ${count === 1 ? singular : p}`;
}

export function formatBrandCount(count: number): string {
  return pluralize(count, 'brand', 'brands');
}

export function formatPlanCount(count: number): string {
  return pluralize(count, 'plan', 'plans');
}

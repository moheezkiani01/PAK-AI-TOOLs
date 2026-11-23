import { SITE } from './site.config';

export function formatPkr(amount: number): string {
  return 'Rs. ' + amount.toLocaleString('en-PK');
}

export function formatUsd(pkrAmount: number): string {
  const usd = Math.ceil((pkrAmount / SITE.pkrPerUsd) * 100) / 100;
  return '$' + usd.toFixed(2);
}

export function pkrToUsd(pkrAmount: number): number {
  return Math.ceil((pkrAmount / SITE.pkrPerUsd) * 100) / 100;
}

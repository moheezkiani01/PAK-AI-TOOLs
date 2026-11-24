/**
 * Single source of truth for payment methods accepted by PakAITools.
 *
 * NOTE FOR OPERATOR REVIEW:
 * - JazzCash, EasyPaisa, SadaPay, NayaPay: Confirmed core local Pakistani wallets.
 * - UBL (Bank Transfer) & Raast: Both are active interbank methods; Raast is instant.
 * - Binance Pay (USDT): Used for overseas Pakistanis & international buyers.
 */

export interface PaymentMethodItem {
  name: string;
  slug: string;
  type: 'wallet' | 'digital-bank' | 'bank-transfer' | 'crypto';
  currency: 'PKR' | 'USDT';
  active: boolean;
  isInternational: boolean;
  transferSpeed: string;
  feeText: string;
  bestFor: string;
  requiresConfirmation?: boolean;
}

export const PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    name: 'JazzCash',
    slug: 'jazzcash',
    type: 'wallet',
    currency: 'PKR',
    active: true,
    isInternational: false,
    transferSpeed: 'Instant (1 min)',
    feeText: 'Rs. 0',
    bestFor: 'Students & fast individual purchases nationwide',
  },
  {
    name: 'EasyPaisa',
    slug: 'easypaisa',
    type: 'wallet',
    currency: 'PKR',
    active: true,
    isInternational: false,
    transferSpeed: 'Instant (1 min)',
    feeText: 'Rs. 0',
    bestFor: 'Everyday plan orders and quick mobile transfers',
  },
  {
    name: 'SadaPay',
    slug: 'sadapay',
    type: 'digital-bank',
    currency: 'PKR',
    active: true,
    isInternational: false,
    transferSpeed: 'Instant (1 min)',
    feeText: 'Rs. 0',
    bestFor: 'Freelancers & remote tech workers',
  },
  {
    name: 'NayaPay',
    slug: 'nayapay',
    type: 'digital-bank',
    currency: 'PKR',
    active: true,
    isInternational: false,
    transferSpeed: 'Instant (1 min)',
    feeText: 'Rs. 0',
    bestFor: 'Digital creators & agency professionals',
  },
  {
    name: 'Raast / Bank Transfer (UBL)',
    slug: 'raast-ubl',
    type: 'bank-transfer',
    currency: 'PKR',
    active: true,
    isInternational: false,
    transferSpeed: 'Instant (Real-time)',
    feeText: 'Rs. 0',
    bestFor: 'Direct account-to-account transfer from any Pakistani bank (UBL/Raast)',
    requiresConfirmation: true, // Highlighted for user confirmation
  },
  {
    name: 'Binance Pay (USDT)',
    slug: 'binance-pay',
    type: 'crypto',
    currency: 'USDT',
    active: true,
    isInternational: true,
    transferSpeed: '5–15 mins',
    feeText: 'Network standard',
    bestFor: 'Overseas Pakistanis & international digital workers',
    requiresConfirmation: true, // Highlighted for user confirmation
  },
];

export function getActivePaymentMethods(): PaymentMethodItem[] {
  return PAYMENT_METHODS.filter((m) => m.active);
}

/**
 * Standard complete text for headers, FAQs, and policy references:
 * "JazzCash, EasyPaisa, SadaPay, NayaPay, Raast / UBL (bank transfer), and Binance Pay (USDT)"
 */
export function getPaymentMethodsText(): string {
  const active = getActivePaymentMethods();
  if (active.length <= 1) return active[0]?.name || '';
  const names = active.map((m) => m.name);
  const last = names.pop();
  return `${names.join(', ')} and ${last}`;
}

/**
 * Short text for hero descriptions and order cards (e.g. "JazzCash, EasyPaisa, SadaPay, NayaPay, or Binance Pay")
 */
export function getShortPaymentMethodsText(): string {
  return 'JazzCash, EasyPaisa, SadaPay, NayaPay, or Binance Pay';
}

/**
 * Clean compact text for 150-char meta descriptions
 */
export function getMetaPaymentMethodsText(): string {
  return 'JazzCash, EasyPaisa, SadaPay or NayaPay';
}

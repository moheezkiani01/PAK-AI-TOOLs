import { getActivePaymentMethods, getPaymentMethodsText } from './payment-methods';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://pakaitools.store').replace(/\/+$/, '');

export const SITE = {
  domain: SITE_URL,
  url: SITE_URL,
  name: 'PakAITools',
  founder: 'Moheez Kiani',
  whatsapp: '923219305619',
  whatsappDisplay: '+92 321 9305619',
  email: 'support@pakaitools.store',
  pkrPerUsd: 280,
  rateDate: '2026-11-22',
  rateDateDisplay: 'November 22, 2026',
  pricesReviewedOn: '2026-11-22',
  pricesReviewedDisplay: 'November 22, 2026',
  priceValidUntil: '2027-02-20',
  showBrandLogos: true,
  deliveryText: 'Within 15 minutes after payment verification',
  paymentMethods: getActivePaymentMethods().map((m) => m.name),
  paymentMethodsText: getPaymentMethodsText(),
} as const;

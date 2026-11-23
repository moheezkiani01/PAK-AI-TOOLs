import { SITE } from './site.config';
import { formatPkr } from './money';

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function getGeneralWhatsAppMessage(pageUrl?: string): string {
  const url = pageUrl ? `\nPage: ${pageUrl}` : '';
  return `Hi PakAITools 👋 I need help choosing a plan.${url}`;
}

export function getProductWhatsAppMessage(
  planName: string,
  price: number | null,
  duration: string,
  pageUrl: string,
  isUsd = false
): string {
  if (price === null) {
    return `Hi PakAITools 👋 Please share today's price for: ${planName}\nPage: ${pageUrl}`;
  }

  const priceText = formatPkr(price);
  let msg = `Hi PakAITools 👋 I want to order:\n• Plan: ${planName}\n• Price: ${priceText} (${duration})\n• Page: ${pageUrl}\nPayment method: ____`;
  if (isUsd) {
    msg += '\nI am paying by Binance.';
  }
  return msg;
}

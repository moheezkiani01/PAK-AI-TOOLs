import { SITE } from './site.config';
import { formatPkr } from './money';

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function getGeneralWhatsAppMessage(pageUrl?: string): string {
  if (!pageUrl || pageUrl === SITE.domain || pageUrl === `${SITE.domain}/`) {
    return 'Hi PakAITools, I need help choosing a plan.';
  }
  return `Hi PakAITools, I need help choosing a plan. Page: ${pageUrl}`;
}

export function getCategoryWhatsAppMessage(categoryName: string, pageUrl: string): string {
  return `Hi PakAITools, I'm looking at ${categoryName}. Can you help me choose a plan? Page: ${pageUrl}`;
}

export function getBrandWhatsAppMessage(brandName: string, pageUrl: string): string {
  return `Hi PakAITools, I'm interested in ${brandName} plans. Can you help me choose? Page: ${pageUrl}`;
}

export function getPriceListWhatsAppMessage(pageUrl: string): string {
  return `Hi PakAITools, I'm checking the price list. Can you help me choose a plan? Page: ${pageUrl}`;
}

export function getBlogWhatsAppMessage(postTitle: string, pageUrl: string): string {
  return `Hi PakAITools, I read "${postTitle}" and want help choosing a plan. Page: ${pageUrl}`;
}

export function getComparisonWhatsAppMessage(title: string, pageUrl: string): string {
  return `Hi PakAITools, I'm comparing ${title} and want help choosing a plan. Page: ${pageUrl}`;
}

export function getPolicyWhatsAppMessage(pageName: string, pageUrl: string): string {
  return `Hi PakAITools, I have a question about ${pageName}. Page: ${pageUrl}`;
}

export function getProductWhatsAppMessage(
  planName: string,
  price: number | null,
  duration: string,
  pageUrl: string,
  isUsd = false
): string {
  const priceText = price !== null ? formatPkr(price) : 'Live quote';
  let msg = `Hi PakAITools, I want to order:\nPlan: ${planName}\nPrice: ${priceText}\nDuration: ${duration}\nPage: ${pageUrl}\nPayment method: ____`;
  if (isUsd) {
    msg += '\n(Paying by Binance/crypto)';
  }
  return msg;
}

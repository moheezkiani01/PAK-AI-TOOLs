import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site.config';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cart/', '/checkout/', '/search', '/*?sort=', '/*?filter='],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'PerplexityBot',
          'Perplexity-User',
          'ClaudeBot',
          'Claude-SearchBot',
          'Claude-User',
        ],
        allow: '/',
        disallow: ['/cart/', '/checkout/', '/search'],
      },
    ],
    sitemap: `${SITE.domain}/sitemap.xml`,
  };
}

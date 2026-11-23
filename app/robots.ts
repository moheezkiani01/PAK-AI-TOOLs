import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site.config';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'GPTBot',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
        ],
        allow: '/',
      },
    ],
    sitemap: [`${SITE.domain}/sitemap_index.xml`, `${SITE.domain}/sitemap.xml`],
  };
}

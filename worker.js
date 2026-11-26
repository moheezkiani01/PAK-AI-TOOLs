export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Canonical Host: Redirect www to apex domain
    if (url.hostname === 'www.pakaitools.store') {
      url.hostname = 'pakaitools.store';
      return Response.redirect(url.toString(), 301);
    }

    // Support /news and /news/ by routing to /ai-news/
    if (url.pathname === '/news' || url.pathname === '/news/') {
      url.pathname = '/ai-news/';
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname.startsWith('/news/')) {
      url.pathname = url.pathname.replace(/^\/news\//, '/ai-news/');
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);

    // Guard brand-card-fixtures
    if (url.pathname.startsWith('/brand-card-fixtures')) {
      const headers = new Headers(response.headers);
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    // Pre-Launch Staging Guardrail:
    // Add X-Robots-Tag: noindex, nofollow and prevent edge/browser caching on staging (*.workers.dev)
    // Automatically excluded when served on production custom domain (pakaitools.store)
    if (url.hostname.endsWith('.workers.dev')) {
      const headers = new Headers(response.headers);
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  },
};

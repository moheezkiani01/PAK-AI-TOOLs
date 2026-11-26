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

    // Pre-Launch Staging Guardrail:
    // Add X-Robots-Tag: noindex, nofollow on staging (*.workers.dev)
    // Automatically excluded when served on production custom domain (pakaitools.store)
    if (url.hostname.endsWith('.workers.dev')) {
      const headers = new Headers(response.headers);
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  },
};

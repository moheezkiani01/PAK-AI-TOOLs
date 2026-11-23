export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    // 301 Redirect any traffic from *.workers.dev or www.pakaitools.store to apex https://pakaitools.store
    if (
      host !== 'pakaitools.store' &&
      !host.includes('localhost') &&
      !host.includes('127.0.0.1')
    ) {
      url.protocol = 'https:';
      url.hostname = 'pakaitools.store';
      url.port = '';
      return Response.redirect(url.toString(), 301);
    }

    // Serve static assets from Cloudflare Assets
    return env.ASSETS.fetch(request);
  },
};

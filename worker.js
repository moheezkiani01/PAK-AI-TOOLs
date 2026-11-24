// Redirects external domains and www to the main domain, then serves your static site.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1";

    if (host !== "pakaitools.store" && !isLocal) {
      url.protocol = "https:";
      url.hostname = "pakaitools.store";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};

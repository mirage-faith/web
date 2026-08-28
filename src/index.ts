/**
 * mirage.faith — static site + minimal API.
 *
 * Learnings applied from the aintservice.com bootstrap:
 * one canonical hostname (www 301s to apex), build identity in
 * /api/health (verifies every pipeline hop), assets served free via
 * Workers Static Assets.
 */
import { BUILD_INFO } from "../generated/build-info";

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname === "www.mirage.faith") {
      url.hostname = "mirage.faith";
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === "/api/health") {
      const meta = env.CF_VERSION_METADATA;
      return Response.json({
        service: "mirage-web",
        status: "ok",
        timestamp: new Date().toISOString(),
        build: BUILD_INFO,
        deployment: { versionId: meta.id || "unknown", deployedAt: meta.timestamp || "unknown" },
      });
    }
    if (url.pathname.startsWith("/api/")) {
      return Response.json({ error: "not found" }, { status: 404 });
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

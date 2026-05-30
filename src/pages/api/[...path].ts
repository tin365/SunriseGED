import type { APIRoute } from 'astro';

// Server-rendered: this runs inside the Pages Worker, not at build time.
export const prerender = false;

// Forward every /api/* request to the deployed API Worker via a Pages
// Service Binding named "API" (configure it in the Cloudflare dashboard:
// Pages project -> Settings -> Functions -> Service bindings ->
//   Variable name: API   Service: sunrise-ged-api).
//
// Because the request goes through the Pages origin, the Worker's
// `sunrise_session` cookie (SameSite=Strict) is set on the same domain,
// so the admin login + forms work with no CORS.
export const ALL: APIRoute = ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  const api = env?.API;
  if (!api || typeof api.fetch !== 'function') {
    return new Response(
      JSON.stringify({ error: 'API service binding "API" is not configured on this Pages project.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return api.fetch(request);
};

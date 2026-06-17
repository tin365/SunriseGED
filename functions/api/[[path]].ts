/// <reference types="@cloudflare/workers-types" />

// Cloudflare Pages Function: forward every /api/* request to the deployed API
// Worker via a Pages service binding named "API" (declared in the root
// wrangler.toml `[[services]]`, or in the dashboard under
// Settings -> Functions -> Service bindings).
//
// Because the request goes through the Pages origin it stays same-origin, so
// the Worker's `sunrise_session` cookie (SameSite=Strict) works with no CORS.
// Do NOT point the frontend at the Worker's *.workers.dev URL directly — that
// would break the session cookie and the admin login.

interface Env {
  API: Fetcher;
}

export const onRequest: PagesFunction<Env> = ({ request, env }) => {
  if (!env.API || typeof env.API.fetch !== 'function') {
    return new Response(
      JSON.stringify({ error: 'API service binding "API" is not configured on this Pages project.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return env.API.fetch(request);
};

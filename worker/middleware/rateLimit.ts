import type { Context, Next } from 'hono';
import type { AppBindings } from '../types';

function limits(path: string, method: string) {
  if (path === '/api/auth/login') return { max: 5, windowSeconds: 15 * 60 };
  if (path === '/api/enroll' && method === 'POST') return { max: 3, windowSeconds: 60 * 60 };
  if (path === '/api/email/contact') return { max: 5, windowSeconds: 60 * 60 };
  return { max: 100, windowSeconds: 60 };
}

export async function rateLimitMiddleware(c: Context<AppBindings>, next: Next) {
  const { max, windowSeconds } = limits(new URL(c.req.url).pathname, c.req.method);
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('x-forwarded-for') || 'local';
  const key = `${ip}:${c.req.method}:${new URL(c.req.url).pathname}`;
  const now = Math.floor(Date.now() / 1000);
  const row = await c.env.DB.prepare('SELECT count, strftime("%s", window_start) AS started FROM rate_limits WHERE key = ?').bind(key).first<{ count: number; started: string }>();

  if (!row || now - Number(row.started) >= windowSeconds) {
    await c.env.DB.prepare('INSERT OR REPLACE INTO rate_limits (key, count, window_start) VALUES (?, 1, datetime("now"))').bind(key).run();
    return next();
  }

  if (row.count >= max) {
    const retryAfter = Math.max(1, windowSeconds - (now - Number(row.started)));
    c.header('Retry-After', String(retryAfter));
    return c.json({ error: 'Too many requests' }, 429);
  }

  await c.env.DB.prepare('UPDATE rate_limits SET count = count + 1 WHERE key = ?').bind(key).run();
  await next();
}

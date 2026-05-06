import type { Context, Next } from 'hono';
import type { AppBindings, AuthUser } from '../types';
import { sha256, verifyToken } from '../lib/jwt';

function bearerToken(c: Context) {
  const auth = c.req.header('Authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  const cookie = c.req.header('Cookie') || '';
  return cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith('sunrise_session='))?.split('=')[1];
}

export async function requireAuth(c: Context<AppBindings>, next: Next) {
  const token = bearerToken(c);
  if (!token) return c.json({ error: 'Authentication required' }, 401);

  try {
    const payload = await verifyToken(c.env.JWT_SECRET, token);
    if (payload.kind === 'pre_2fa') return c.json({ error: 'Full session required' }, 401);

    const tokenHash = await sha256(token);
    const session = await c.env.DB.prepare('SELECT id FROM sessions WHERE id = ? AND token_hash = ? AND expires_at > datetime("now")')
      .bind(payload.sessionId, tokenHash)
      .first();
    if (!session) return c.json({ error: 'Session expired' }, 401);

    const user: AuthUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId
    };
    c.set('user', user);
    await next();
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }
}

export function requireRole(...roles: AuthUser['role'][]) {
  return async (c: Context<AppBindings>, next: Next) => {
    const user = c.get('user');
    if (!user || !roles.includes(user.role)) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    await next();
  };
}

export async function logActivity(c: Context<AppBindings>, action: string, resourceType?: string, resourceId?: string, details?: unknown) {
  const user = c.get('user');
  await c.env.DB.prepare('INSERT INTO activity_log (user_id, action, resource_type, resource_id, details, ip) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(user?.id ?? null, action, resourceType ?? null, resourceId ?? null, details ? JSON.stringify(details) : null, c.req.header('CF-Connecting-IP') || c.req.header('x-forwarded-for') || 'unknown')
    .run();
}

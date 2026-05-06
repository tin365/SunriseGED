import { Hono } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';
import type { Context } from 'hono';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { AppBindings, AuthUser } from '../types';
import { createId, sha256, signToken, verifyToken } from '../lib/jwt';
import { generateTotpSecret, verifyTotp } from '../lib/totp';
import { stripTags } from '../lib/sanitize';
import { logActivity, requireAuth } from '../middleware/jwt';

const app = new Hono<AppBindings>();
const sessionTtl = 8 * 60 * 60;
const preTtl = 5 * 60;

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
const setupSchema = z.object({
  token: z.string().min(16),
  email: z.string().email(),
  password: z.string().min(12),
  name: z.string().min(2)
});

type DbUser = {
  id: string;
  email: string;
  password_hash: string;
  role: AuthUser['role'];
  name: string;
  totp_secret: string | null;
  totp_enabled: number;
  failed_login_count: number;
  locked_until: string | null;
  is_active: number;
};

async function issueSession(c: Context<AppBindings>, user: DbUser) {
  const sessionId = createId('ses');
  const token = await signToken(c.env.JWT_SECRET, { sub: user.id, email: user.email, role: user.role, sessionId, kind: 'session' }, sessionTtl);
  const tokenHash = await sha256(token);
  await c.env.DB.prepare('INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, datetime("now", "+8 hours"))')
    .bind(sessionId, user.id, tokenHash)
    .run();
  await c.env.DB.prepare('UPDATE users SET last_login = datetime("now"), failed_login_count = 0, locked_until = NULL WHERE id = ?').bind(user.id).run();
  setCookie(c, 'sunrise_session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',
    maxAge: sessionTtl
  });
  return token;
}

app.post('/setup-admin', async (c) => {
  const input = setupSchema.safeParse(stripTags(await c.req.json()));
  if (!input.success) return c.json({ error: 'Invalid setup data', issues: input.error.flatten() }, 400);
  if (input.data.token !== c.env.ADMIN_SETUP_TOKEN) return c.json({ error: 'Invalid setup token' }, 403);

  const count = await c.env.DB.prepare('SELECT COUNT(*) AS count FROM users WHERE role = "super_admin" AND is_active = 1').first<{ count: number }>();
  if ((count?.count ?? 0) > 0) return c.json({ error: 'Super admin already exists' }, 409);

  const hash = await bcrypt.hash(input.data.password, 12);
  const id = createId('usr');
  await c.env.DB.prepare('INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, "super_admin", ?)')
    .bind(id, input.data.email.toLowerCase(), hash, input.data.name)
    .run();
  await c.env.DB.prepare('INSERT INTO activity_log (user_id, action, resource_type, resource_id, ip) VALUES (?, "setup_admin", "user", ?, ?)')
    .bind(id, id, c.req.header('CF-Connecting-IP') || 'unknown')
    .run();
  return c.json({ success: true });
});

app.post('/login', async (c) => {
  const input = loginSchema.safeParse(stripTags(await c.req.json()));
  if (!input.success) return c.json({ error: 'Invalid credentials' }, 400);
  const email = input.data.email.toLowerCase();
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1').bind(email).first<DbUser>();
  const generic = { error: 'Invalid credentials' };

  if (!user) return c.json(generic, 401);
  if (user.locked_until && new Date(user.locked_until) > new Date()) return c.json({ error: 'Account locked. Try again later.' }, 423);

  const ok = await bcrypt.compare(input.data.password, user.password_hash);
  if (!ok) {
    const failed = user.failed_login_count + 1;
    if (failed >= 10) {
      await c.env.DB.prepare('UPDATE users SET failed_login_count = ?, locked_until = datetime("now", "+15 minutes") WHERE id = ?').bind(failed, user.id).run();
    } else {
      await c.env.DB.prepare('UPDATE users SET failed_login_count = ? WHERE id = ?').bind(failed, user.id).run();
    }
    await c.env.DB.prepare('INSERT INTO activity_log (user_id, action, ip, details) VALUES (?, "login_failed", ?, ?)')
      .bind(user.id, c.req.header('CF-Connecting-IP') || 'unknown', JSON.stringify({ email }))
      .run();
    return c.json(generic, 401);
  }

  if (user.totp_enabled) {
    const token = await signToken(c.env.JWT_SECRET, { sub: user.id, email: user.email, role: user.role, sessionId: createId('pre'), kind: 'pre_2fa' }, preTtl);
    return c.json({ requires2FA: true, token, expiresIn: preTtl });
  }

  const token = await issueSession(c, user);
  c.set('user', { id: user.id, email: user.email, role: user.role, sessionId: '' });
  await logActivity(c, 'login', 'user', user.id);
  return c.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name }, expiresIn: sessionTtl });
});

app.post('/verify-totp', async (c) => {
  const body = z.object({ token: z.string(), code: z.string().regex(/^\d{6}$/) }).safeParse(stripTags(await c.req.json()));
  if (!body.success) return c.json({ error: 'Invalid verification data' }, 400);
  const payload = await verifyToken(c.env.JWT_SECRET, body.data.token);
  if (payload.kind !== 'pre_2fa') return c.json({ error: 'Invalid verification token' }, 401);
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ? AND is_active = 1').bind(payload.sub).first<DbUser>();
  if (!user?.totp_secret || !verifyTotp(user.email, user.totp_secret, body.data.code)) return c.json({ error: 'Invalid TOTP code' }, 401);
  const token = await issueSession(c, user);
  c.set('user', { id: user.id, email: user.email, role: user.role, sessionId: '' });
  await logActivity(c, 'login_2fa', 'user', user.id);
  return c.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name }, expiresIn: sessionTtl });
});

app.post('/setup-totp', requireAuth, async (c) => {
  const user = c.get('user');
  const { secret, uri } = generateTotpSecret(user.email);
  await c.env.DB.prepare('UPDATE users SET totp_secret = ?, totp_enabled = 0 WHERE id = ?').bind(secret, user.id).run();
  const qr = await QRCode.toDataURL(uri);
  await logActivity(c, 'setup_totp_started', 'user', user.id);
  return c.json({ secret, qr });
});

app.post('/confirm-totp', requireAuth, async (c) => {
  const body = z.object({ code: z.string().regex(/^\d{6}$/) }).safeParse(stripTags(await c.req.json()));
  if (!body.success) return c.json({ error: 'Invalid TOTP code' }, 400);
  const current = c.get('user');
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(current.id).first<DbUser>();
  if (!user?.totp_secret || !verifyTotp(user.email, user.totp_secret, body.data.code)) return c.json({ error: 'Invalid TOTP code' }, 400);
  await c.env.DB.prepare('UPDATE users SET totp_enabled = 1 WHERE id = ?').bind(current.id).run();
  await logActivity(c, 'setup_totp_confirmed', 'user', current.id);
  return c.json({ success: true });
});

app.post('/logout', requireAuth, async (c) => {
  const user = c.get('user');
  await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(user.sessionId).run();
  await logActivity(c, 'logout', 'session', user.sessionId);
  deleteCookie(c, 'sunrise_session', { path: '/' });
  return c.json({ success: true });
});

app.get('/me', requireAuth, async (c) => {
  const user = c.get('user');
  const profile = await c.env.DB.prepare('SELECT id, email, role, name, totp_enabled, created_at, last_login FROM users WHERE id = ?').bind(user.id).first();
  return c.json({ user: profile });
});

app.post('/change-password', requireAuth, async (c) => {
  const body = z.object({ currentPassword: z.string().min(8), newPassword: z.string().min(12) }).safeParse(stripTags(await c.req.json()));
  if (!body.success) return c.json({ error: 'Invalid password data' }, 400);
  const current = c.get('user');
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(current.id).first<DbUser>();
  if (!user || !(await bcrypt.compare(body.data.currentPassword, user.password_hash))) return c.json({ error: 'Current password is incorrect' }, 400);
  const hash = await bcrypt.hash(body.data.newPassword, 12);
  await c.env.DB.prepare('UPDATE users SET password_hash = ?, must_change_password = 0 WHERE id = ?').bind(hash, current.id).run();
  await c.env.DB.prepare('DELETE FROM sessions WHERE user_id = ? AND id <> ?').bind(current.id, current.sessionId).run();
  await logActivity(c, 'change_password', 'user', current.id);
  return c.json({ success: true });
});

export default app;

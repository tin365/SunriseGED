import { Hono } from 'hono';
import { z } from 'zod';
import type { AppBindings } from '../types';
import { createId } from '../lib/jwt';
import { stripTags } from '../lib/sanitize';
import { logActivity, requireAuth, requireRole } from '../middleware/jwt';

const app = new Hono<AppBindings>();

const postSchema = z.object({
  title_en: z.string().min(2),
  title_my: z.string().optional().default(''),
  title_th: z.string().optional().default(''),
  body_en: z.string().min(2),
  body_my: z.string().optional().default(''),
  body_th: z.string().optional().default(''),
  excerpt_en: z.string().optional().default(''),
  excerpt_my: z.string().optional().default(''),
  excerpt_th: z.string().optional().default(''),
  type: z.enum(['news', 'activity', 'announcement', 'achievement']).default('news'),
  status: z.enum(['draft', 'published']).default('draft'),
  featured_image: z.string().optional().default('')
});

app.get('/', async (c) => {
  const limit = Math.min(Number(c.req.query('limit') || 12), 50);
  const offset = Number(c.req.query('offset') || 0);
  const type = c.req.query('type');
  const includeDrafts = c.req.query('admin') === '1';
  const status = includeDrafts ? '%' : 'published';
  const result = type
    ? await c.env.DB.prepare('SELECT * FROM posts WHERE status LIKE ? AND type = ? ORDER BY published_at DESC, created_at DESC LIMIT ? OFFSET ?').bind(status, type, limit, offset).all()
    : await c.env.DB.prepare('SELECT * FROM posts WHERE status LIKE ? ORDER BY published_at DESC, created_at DESC LIMIT ? OFFSET ?').bind(status, limit, offset).all();
  return c.json({ items: result.results });
});

app.get('/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM posts WHERE id = ? AND (status = "published" OR ? = "1")').bind(c.req.param('id'), c.req.query('admin') || '').first();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json({ item: row });
});

app.post('/', requireAuth, requireRole('super_admin', 'editor'), async (c) => {
  const parsed = postSchema.safeParse(stripTags(await c.req.json()));
  if (!parsed.success) return c.json({ error: 'Validation failed', issues: parsed.error.flatten() }, 400);
  const id = createId('post');
  const p = parsed.data;
  const user = c.get('user');
  await c.env.DB.prepare(`INSERT INTO posts (id, title_en, title_my, title_th, body_en, body_my, body_th, excerpt_en, excerpt_my, excerpt_th, type, status, featured_image, author_id, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 'published' THEN datetime('now') ELSE NULL END)`)
    .bind(id, p.title_en, p.title_my, p.title_th, p.body_en, p.body_my, p.body_th, p.excerpt_en, p.excerpt_my, p.excerpt_th, p.type, p.status, p.featured_image, user.id, p.status)
    .run();
  await logActivity(c, 'create_post', 'post', id, { status: p.status, type: p.type });
  return c.json({ success: true, id }, 201);
});

app.put('/:id', requireAuth, requireRole('super_admin', 'editor'), async (c) => {
  const parsed = postSchema.safeParse(stripTags(await c.req.json()));
  if (!parsed.success) return c.json({ error: 'Validation failed', issues: parsed.error.flatten() }, 400);
  const id = c.req.param('id');
  const p = parsed.data;
  await c.env.DB.prepare(`UPDATE posts SET title_en=?, title_my=?, title_th=?, body_en=?, body_my=?, body_th=?, excerpt_en=?, excerpt_my=?, excerpt_th=?, type=?, status=?, featured_image=?, updated_at=datetime('now'), published_at=CASE WHEN ?='published' AND published_at IS NULL THEN datetime('now') ELSE published_at END WHERE id=?`)
    .bind(p.title_en, p.title_my, p.title_th, p.body_en, p.body_my, p.body_th, p.excerpt_en, p.excerpt_my, p.excerpt_th, p.type, p.status, p.featured_image, p.status, id)
    .run();
  await logActivity(c, 'update_post', 'post', id, { status: p.status });
  return c.json({ success: true });
});

app.patch('/:id/publish', requireAuth, requireRole('super_admin', 'editor'), async (c) => {
  const body = z.object({ status: z.enum(['draft', 'published']) }).safeParse(stripTags(await c.req.json()));
  if (!body.success) return c.json({ error: 'Invalid status' }, 400);
  const id = c.req.param('id');
  await c.env.DB.prepare('UPDATE posts SET status = ?, published_at = CASE WHEN ? = "published" THEN COALESCE(published_at, datetime("now")) ELSE NULL END, updated_at = datetime("now") WHERE id = ?')
    .bind(body.data.status, body.data.status, id)
    .run();
  await logActivity(c, 'publish_post', 'post', id, body.data);
  return c.json({ success: true });
});

app.delete('/:id', requireAuth, requireRole('super_admin'), async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
  await logActivity(c, 'delete_post', 'post', id);
  return c.json({ success: true });
});

export default app;

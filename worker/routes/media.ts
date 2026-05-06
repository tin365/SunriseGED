import { Hono } from 'hono';
import { z } from 'zod';
import type { AppBindings } from '../types';
import { createId } from '../lib/jwt';
import { extractYoutubeId, mediaKey, publicMediaUrl } from '../lib/r2';
import { stripTags } from '../lib/sanitize';
import { logActivity, requireAuth, requireRole } from '../middleware/jwt';

const app = new Hono<AppBindings>();

app.get('/', async (c) => {
  const type = c.req.query('type');
  const limit = Math.min(Number(c.req.query('limit') || 24), 60);
  const offset = Number(c.req.query('offset') || 0);
  const result = type && ['photo', 'document', 'youtube'].includes(type)
    ? await c.env.DB.prepare('SELECT * FROM media WHERE type = ? ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(type, limit, offset).all()
    : await c.env.DB.prepare('SELECT * FROM media ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(limit, offset).all();
  return c.json({ items: result.results });
});

app.post('/upload', requireAuth, requireRole('super_admin', 'editor'), async (c) => {
  const form = await c.req.formData();
  const file = form.get('file');
  const title = String(stripTags(form.get('title') || 'Uploaded file'));
  const type = String(stripTags(form.get('type') || 'photo'));
  if (!(file instanceof File)) return c.json({ error: 'File required' }, 400);
  if (!['photo', 'document'].includes(type)) return c.json({ error: 'Invalid media type' }, 400);
  if (file.size > 25 * 1024 * 1024) return c.json({ error: 'File too large' }, 400);

  const key = mediaKey(file.name);
  await c.env.STORAGE.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' }
  });
  const id = createId('media');
  const url = publicMediaUrl(c.env.PUBLIC_R2_BASE_URL || c.env.SITE_URL, key);
  await c.env.DB.prepare('INSERT INTO media (id, type, title_en, url, thumbnail_url, r2_key, file_size, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, type, title, url, type === 'photo' ? url : null, key, file.size, c.get('user').id)
    .run();
  await logActivity(c, 'upload_media', 'media', id, { type, key });
  return c.json({ success: true, id, url, key });
});

app.post('/youtube', requireAuth, requireRole('super_admin', 'editor'), async (c) => {
  const body = z.object({ url: z.string().url(), title_en: z.string().min(2), title_my: z.string().optional().default(''), title_th: z.string().optional().default('') }).safeParse(stripTags(await c.req.json()));
  if (!body.success) return c.json({ error: 'Invalid YouTube data' }, 400);
  const youtubeId = extractYoutubeId(body.data.url);
  if (!youtubeId) return c.json({ error: 'Could not read YouTube video ID' }, 400);
  const id = createId('media');
  const thumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  await c.env.DB.prepare('INSERT INTO media (id, type, title_en, title_my, title_th, url, thumbnail_url, youtube_id, uploaded_by) VALUES (?, "youtube", ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, body.data.title_en, body.data.title_my, body.data.title_th, body.data.url, thumbnail, youtubeId, c.get('user').id)
    .run();
  await logActivity(c, 'add_youtube_media', 'media', id, { youtubeId });
  return c.json({ success: true, id, thumbnail, youtubeId });
});

app.delete('/:id', requireAuth, requireRole('super_admin', 'editor'), async (c) => {
  const id = c.req.param('id');
  const media = await c.env.DB.prepare('SELECT r2_key FROM media WHERE id = ?').bind(id).first<{ r2_key: string | null }>();
  if (!media) return c.json({ error: 'Not found' }, 404);
  if (media.r2_key) await c.env.STORAGE.delete(media.r2_key);
  await c.env.DB.prepare('DELETE FROM media WHERE id = ?').bind(id).run();
  await logActivity(c, 'delete_media', 'media', id);
  return c.json({ success: true });
});

export default app;

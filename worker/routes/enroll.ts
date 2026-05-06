import { Hono } from 'hono';
import { z } from 'zod';
import type { AppBindings } from '../types';
import { createId } from '../lib/jwt';
import { enrollmentReceivedTemplate, newEnrollmentAlertTemplate, sendEmail, statusUpdateTemplate } from '../lib/email';
import { stripTags } from '../lib/sanitize';
import { logActivity, requireAuth, requireRole } from '../middleware/jwt';

const app = new Hono<AppBindings>();

const enrollmentSchema = z.object({
  full_name: z.string().min(2),
  burmese_name: z.string().optional().default(''),
  date_of_birth: z.string().min(8),
  gender: z.enum(['male', 'female', 'other']),
  nationality: z.string().optional().default('Myanmar'),
  phone: z.string().optional().default(''),
  email: z.string().email().optional().or(z.literal('')).default(''),
  parent_name: z.string().min(2),
  parent_phone: z.string().min(4),
  address: z.string().min(5),
  previous_education: z.string().optional().default(''),
  english_level: z.string().optional().default(''),
  heard_from: z.string().optional().default(''),
  reason: z.string().min(50),
  language: z.enum(['en', 'my', 'th']).optional().default('en')
});

app.post('/', async (c) => {
  const parsed = enrollmentSchema.safeParse(stripTags(await c.req.json()));
  if (!parsed.success) return c.json({ error: 'Validation failed', issues: parsed.error.flatten() }, 400);
  const data = parsed.data;
  const id = createId('enr');

  await c.env.DB.prepare(`INSERT INTO enrollments
    (id, full_name, burmese_name, date_of_birth, gender, nationality, phone, email, parent_name, parent_phone, address, previous_education, english_level, heard_from, reason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, data.full_name, data.burmese_name, data.date_of_birth, data.gender, data.nationality, data.phone, data.email, data.parent_name, data.parent_phone, data.address, data.previous_education, data.english_level, data.heard_from, data.reason)
    .run();

  const adminTemplate = newEnrollmentAlertTemplate(c.env, data);
  await sendEmail(c.env, { to: c.env.ADMIN_EMAIL || 'admin@sunrisegeded.org', ...adminTemplate });
  if (data.email) {
    const studentTemplate = enrollmentReceivedTemplate(c.env, data.language, data);
    await sendEmail(c.env, { to: data.email, ...studentTemplate });
  }

  await c.env.DB.prepare('INSERT INTO activity_log (action, resource_type, resource_id, ip, details) VALUES ("enrollment_submitted", "enrollment", ?, ?, ?)')
    .bind(id, c.req.header('CF-Connecting-IP') || 'unknown', JSON.stringify({ full_name: data.full_name }))
    .run();
  return c.json({ success: true, id }, 201);
});

app.get('/', requireAuth, async (c) => {
  const status = c.req.query('status');
  const search = `%${c.req.query('search') || ''}%`;
  const limit = Math.min(Number(c.req.query('limit') || 50), 100);
  const offset = Number(c.req.query('offset') || 0);
  const query = status
    ? c.env.DB.prepare('SELECT * FROM enrollments WHERE status = ? AND (full_name LIKE ? OR burmese_name LIKE ?) ORDER BY submitted_at DESC LIMIT ? OFFSET ?').bind(status, search, search, limit, offset)
    : c.env.DB.prepare('SELECT * FROM enrollments WHERE full_name LIKE ? OR burmese_name LIKE ? ORDER BY submitted_at DESC LIMIT ? OFFSET ?').bind(search, search, limit, offset);
  const result = await query.all();
  return c.json({ items: result.results });
});

app.get('/:id', requireAuth, async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM enrollments WHERE id = ?').bind(c.req.param('id')).first();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json({ item: row });
});

app.patch('/:id', requireAuth, requireRole('super_admin', 'editor'), async (c) => {
  const body = z.object({ status: z.enum(['pending', 'approved', 'rejected', 'waitlist']).optional(), notes: z.string().optional(), email: z.string().email().optional().or(z.literal('')) }).safeParse(stripTags(await c.req.json()));
  if (!body.success) return c.json({ error: 'Invalid update' }, 400);
  const user = c.get('user');
  const id = c.req.param('id');
  await c.env.DB.prepare('UPDATE enrollments SET status = COALESCE(?, status), notes = COALESCE(?, notes), reviewed_at = datetime("now"), reviewed_by = ? WHERE id = ?')
    .bind(body.data.status ?? null, body.data.notes ?? null, user.id, id)
    .run();
  const enrollment = await c.env.DB.prepare('SELECT * FROM enrollments WHERE id = ?').bind(id).first<{ email?: string; status: string }>();
  if (body.data.status && enrollment?.email) {
    const template = statusUpdateTemplate(c.env, body.data.status);
    await sendEmail(c.env, { to: enrollment.email, ...template });
  }
  await logActivity(c, 'update_enrollment', 'enrollment', id, body.data);
  return c.json({ success: true });
});

app.delete('/:id', requireAuth, requireRole('super_admin'), async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM enrollments WHERE id = ?').bind(id).run();
  await logActivity(c, 'delete_enrollment', 'enrollment', id);
  return c.json({ success: true });
});

export default app;

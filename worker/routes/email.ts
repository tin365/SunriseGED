import { Hono } from 'hono';
import { z } from 'zod';
import type { AppBindings } from '../types';
import { createId } from '../lib/jwt';
import { contactConfirmationTemplate, sendEmail } from '../lib/email';
import { stripTags } from '../lib/sanitize';
import { logActivity, requireAuth, requireRole } from '../middleware/jwt';

const app = new Hono<AppBindings>();

app.post('/contact', async (c) => {
  const body = z.object({
    name: z.string().min(2),
    email: z.string().email().optional().or(z.literal('')).default(''),
    phone: z.string().optional().default(''),
    message: z.string().min(10),
    language: z.enum(['en', 'my', 'th']).default('en')
  }).safeParse(stripTags(await c.req.json()));
  if (!body.success) return c.json({ error: 'Validation failed', issues: body.error.flatten() }, 400);
  const id = createId('msg');
  const data = body.data;
  await c.env.DB.prepare('INSERT INTO contact_messages (id, name, email, phone, message, language) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(id, data.name, data.email, data.phone, data.message, data.language)
    .run();
  await sendEmail(c.env, {
    to: c.env.ADMIN_EMAIL || 'admin@sunrisegeded.org',
    subject: `New contact message from ${data.name}`,
    html: `<p>${data.message.replace(/\n/g, '<br>')}</p><p>Email: ${data.email || 'not provided'}<br>Phone: ${data.phone || 'not provided'}</p>`
  });
  if (data.email) await sendEmail(c.env, { to: data.email, ...contactConfirmationTemplate(c.env, data.language) });
  return c.json({ success: true, id });
});

app.post('/enrollment-confirm', requireAuth, requireRole('super_admin', 'editor'), async (c) => {
  await logActivity(c, 'send_enrollment_confirmation');
  return c.json({ success: true });
});

app.post('/announcement', requireAuth, requireRole('super_admin'), async (c) => {
  const body = z.object({ subject: z.string().min(3), html: z.string().min(10), recipients: z.array(z.string().email()).min(1).max(500) }).safeParse(await c.req.json());
  if (!body.success) return c.json({ error: 'Invalid announcement' }, 400);
  const html = `${body.data.html}<p style="font-size:12px;color:#777"><a href="${c.env.SITE_URL}/unsubscribe">Unsubscribe</a></p>`;
  await sendEmail(c.env, { to: body.data.recipients, subject: body.data.subject, html });
  await logActivity(c, 'send_announcement', 'email', undefined, { count: body.data.recipients.length });
  return c.json({ success: true });
});

export default app;

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppBindings } from '../types';
import { requireAuth, requireRole, logActivity } from '../middleware/jwt';

const app = new Hono<AppBindings>();

app.get('/bridge-config', requireAuth, async (c) => {
  return c.json({
    localStatusUrl: 'http://localhost:7337/status',
    localPrintUrl: 'http://localhost:7337/print',
    scanUploadUrl: `${c.env.SITE_URL}/api/media/upload`
  });
});

app.post('/job', requireAuth, requireRole('super_admin', 'editor'), async (c) => {
  const body = z.object({ url: z.string().url(), title: z.string().min(1) }).safeParse(await c.req.json());
  if (!body.success) return c.json({ error: 'Invalid print job' }, 400);
  await logActivity(c, 'create_print_job', 'print', undefined, body.data);
  return c.json({ success: true, bridgeUrl: 'http://localhost:7337/print', job: body.data });
});

export default app;

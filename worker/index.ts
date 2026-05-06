import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import authRoutes from './routes/auth';
import enrollRoutes from './routes/enroll';
import postsRoutes from './routes/posts';
import mediaRoutes from './routes/media';
import emailRoutes from './routes/email';
import printRoutes from './routes/print';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { allowedOrigins } from './middleware/cors';
import type { AppBindings } from './types';

const app = new Hono<AppBindings>();

app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', async (c, next) => {
  c.header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' connect.facebook.net; img-src 'self' data: https: img.youtube.com; frame-src https://www.google.com https://maps.google.com https://www.youtube.com; connect-src 'self' https://api.resend.com http://localhost:7337; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
  c.header('X-Frame-Options', 'DENY');
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  await next();
});
app.use('*', cors({
  origin: allowedOrigins,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));
app.use('/api/*', rateLimitMiddleware);

app.route('/api/auth', authRoutes);
app.route('/api/enroll', enrollRoutes);
app.route('/api/posts', postsRoutes);
app.route('/api/media', mediaRoutes);
app.route('/api/email', emailRoutes);
app.route('/api/print', printRoutes);

app.get('/api/health', (c) => c.json({ status: 'ok', ts: Date.now() }));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;

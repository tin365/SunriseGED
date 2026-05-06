import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  if (!path.startsWith('/admin') || path === '/admin/login') return next();
  const cookie = context.cookies.get('sunrise_session')?.value;
  if (!cookie) return context.redirect('/admin/login');
  return next();
});

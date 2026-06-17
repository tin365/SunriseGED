import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type AuthState = 'checking' | 'authed' | 'guest';

/**
 * Client-side guard for /admin routes (replaces the old Astro auth middleware).
 * The real enforcement is server-side: the API Worker validates the HttpOnly
 * `sunrise_session` cookie on every protected /api call. Here we just call
 * GET /api/auth/me (same-origin → cookie travels) to decide whether to render
 * the admin UI or bounce to the login screen.
 */
export default function RequireAuth() {
  const [state, setState] = useState<AuthState>('checking');

  useEffect(() => {
    let alive = true;
    fetch('/api/auth/me', { headers: { Accept: 'application/json' } })
      .then((res) => alive && setState(res.ok ? 'authed' : 'guest'))
      .catch(() => alive && setState('guest'));
    return () => {
      alive = false;
    };
  }, []);

  if (state === 'checking') {
    return (
      <div className="grid min-h-screen place-items-center bg-paper-deep">
        <div className="flex items-center gap-3 text-ink-soft">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-line-strong border-t-ember" aria-hidden="true" />
          <span className="text-sm font-medium">Loading…</span>
        </div>
      </div>
    );
  }

  if (state === 'guest') return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}

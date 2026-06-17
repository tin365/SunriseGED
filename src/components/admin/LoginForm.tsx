import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const navigate = useNavigate();
  const [preToken, setPreToken] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      if (data.requires2FA) {
        setPreToken(data.token);
      } else {
        localStorage.setItem('sunrise_token', data.token);
        navigate('/admin');
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const code = String(new FormData(event.currentTarget).get('code') || '');
    try {
      const res = await fetch('/api/auth/verify-totp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: preToken, code }) });
      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid TOTP');
      localStorage.setItem('sunrise_token', data.token);
      navigate('/admin');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Invalid TOTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-card border border-line bg-surface p-6 shadow-warm sm:p-7">
      {!preToken ? (
        <form onSubmit={login} className="grid gap-4">
          <label>
            <span className="field-label">Email</span>
            <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="input" />
          </label>
          <label>
            <span className="field-label">Password</span>
            <input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" className="input" />
          </label>
          <button disabled={loading} className="btn btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="grid gap-4">
          <p className="text-sm font-semibold text-ink">Two-factor authentication</p>
          <input name="code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required placeholder="000000" className="input text-center text-2xl font-semibold tracking-[0.5em]" />
          <p className="text-sm leading-relaxed text-ink-muted">Enter the current 6-digit code from your authenticator app. It changes every 30 seconds.</p>
          <button disabled={loading} className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Verifying…' : 'Verify'}
          </button>
        </form>
      )}
      {message && (
        <p className="mt-4 rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember-deep">{message}</p>
      )}
      <p className="mt-5 text-xs leading-relaxed text-ink-muted">Forgot your password? Contact a super admin — public registration is disabled.</p>
    </div>
  );
}

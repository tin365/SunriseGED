import { useState } from 'react';

export default function LoginForm() {
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
        window.location.href = '/admin';
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
      window.location.href = '/admin';
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Invalid TOTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-site-dark p-6">
      {!preToken ? (
        <form onSubmit={login} className="grid gap-4">
          <input name="email" type="email" autoComplete="email" required placeholder="Email" className="input" />
          <input name="password" type="password" autoComplete="current-password" required placeholder="Password" className="input" />
          <button disabled={loading} className="rounded-md bg-gold px-5 py-3 font-bold text-site-black">{loading ? 'Signing in...' : 'Login'}</button>
        </form>
      ) : (
        <form onSubmit={verify} className="grid gap-4">
          <input name="code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required placeholder="6-digit code" className="input text-center text-2xl tracking-[0.4em]" />
          <p className="text-sm text-white/60">Enter the current code from your authenticator app. This code changes every 30 seconds.</p>
          <button disabled={loading} className="rounded-md bg-gold px-5 py-3 font-bold text-site-black">{loading ? 'Verifying...' : 'Verify'}</button>
        </form>
      )}
      {message && <p className="mt-4 rounded-md border border-orange/60 bg-orange/10 px-4 py-3 text-sm text-orange-light">{message}</p>}
      <p className="mt-5 text-xs text-white/50">Forgot password? Contact a super admin. Public registration is disabled.</p>
    </div>
  );
}

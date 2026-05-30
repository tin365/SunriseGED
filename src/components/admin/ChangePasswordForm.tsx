import { useState } from 'react';

export default function ChangePasswordForm() {
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const form = event.currentTarget;
    const fd = new FormData(form);
    const currentPassword = String(fd.get('currentPassword') || '');
    const newPassword = String(fd.get('newPassword') || '');
    const confirm = String(fd.get('confirm') || '');

    if (newPassword.length < 12) {
      setOk(false);
      setMessage('New password must be at least 12 characters.');
      return;
    }
    if (newPassword !== confirm) {
      setOk(false);
      setMessage('New passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data: any = await res.json().catch(() => ({}));
      setOk(res.ok);
      setMessage(res.ok ? 'Password updated successfully.' : data.error || 'Could not update password.');
      if (res.ok) form.reset();
    } catch {
      setOk(false);
      setMessage('Could not update password.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card p-6 sm:p-7">
      <h2 className="font-display text-xl font-semibold text-ink">Change password</h2>
      <p className="mt-1 text-sm text-ink-muted">Use at least 12 characters. You'll stay signed in.</p>
      <form onSubmit={submit} className="mt-5 grid max-w-md gap-4">
        <label>
          <span className="field-label">Current password</span>
          <input name="currentPassword" type="password" autoComplete="current-password" required className="input" />
        </label>
        <label>
          <span className="field-label">New password</span>
          <input name="newPassword" type="password" autoComplete="new-password" required minLength={12} className="input" />
        </label>
        <label>
          <span className="field-label">Confirm new password</span>
          <input name="confirm" type="password" autoComplete="new-password" required minLength={12} className="input" />
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <button disabled={saving} className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-70">
            {saving ? 'Updating…' : 'Update password'}
          </button>
          {message && <p className={`text-sm font-medium ${ok ? 'text-emerald-700' : 'text-ember-deep'}`}>{message}</p>}
        </div>
      </form>
    </section>
  );
}

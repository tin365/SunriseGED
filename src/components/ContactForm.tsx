import { useState } from 'react';

type Dict = Record<string, any>;

export default function ContactForm({ dict, locale }: { dict: Dict; locale: 'en' | 'my' | 'th' }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState(false);
  const t = dict.contact;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const res = await fetch('/api/email/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, language: locale })
      });
      if (!res.ok) throw new Error('send failed');
      setOk(true);
      setMessage(t.successMsg);
      event.currentTarget.reset();
    } catch {
      setOk(false);
      setMessage(t.errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-card border border-line bg-surface p-6 shadow-warm sm:p-9">
      <h2 className="font-display text-3xl font-semibold text-ink">{t.sendMessage}</h2>
      <div className="mt-7 grid gap-5">
        <Input label={t.name} name="name" required />
        <Input label={t.email} name="email" type="email" />
        <Input label={t.phone} name="phone" type="tel" />
        <label>
          <span className="field-label">{t.message}</span>
          <textarea name="message" required rows={6} className="input resize-y" />
        </label>
      </div>
      {message && (
        <p
          className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
            ok ? 'border-sun/40 bg-sun/10 text-sun-deep' : 'border-ember/40 bg-ember/10 text-ember-deep'
          }`}
        >
          {message}
        </p>
      )}
      <button disabled={loading} className="btn btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-70">
        {loading ? t.sending : t.send}
      </button>
    </form>
  );
}

function Input({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label>
      <span className="field-label">
        {label}
        {required ? ' *' : ''}
      </span>
      <input name={name} type={type} required={required} className="input" />
    </label>
  );
}

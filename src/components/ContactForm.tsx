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
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-site-dark p-5 sm:p-8">
      <h2 className="font-heading text-2xl font-bold text-gold">{t.sendMessage}</h2>
      <div className="mt-6 grid gap-4">
        <Input label={t.name} name="name" required />
        <Input label={t.email} name="email" type="email" />
        <Input label={t.phone} name="phone" type="tel" />
        <label><span className="mb-2 block text-sm font-semibold text-gold">{t.message}</span><textarea name="message" required rows={6} className="w-full rounded-md border border-white/10 bg-site-black px-3 py-3 text-white outline-none focus:border-gold" /></label>
      </div>
      {message && <p className={`mt-4 rounded-md border px-4 py-3 text-sm ${ok ? 'border-gold/50 text-gold' : 'border-orange/50 text-orange-light'}`}>{message}</p>}
      <button disabled={loading} className="mt-6 w-full rounded-md bg-gold px-5 py-3 font-bold text-site-black hover:bg-gold-dark disabled:opacity-70">{loading ? t.sending : t.send}</button>
    </form>
  );
}

function Input({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return <label><span className="mb-2 block text-sm font-semibold text-gold">{label}</span><input name={name} type={type} required={required} className="w-full rounded-md border border-white/10 bg-site-black px-3 py-3 text-white outline-none focus:border-gold" /></label>;
}

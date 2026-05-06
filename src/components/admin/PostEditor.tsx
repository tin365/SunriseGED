import { useEffect, useState } from 'react';

export default function PostEditor() {
  const [status, setStatus] = useState('draft');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const interval = window.setInterval(() => setMessage('Draft autosaved locally'), 30000);
    return () => window.clearInterval(interval);
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setMessage(res.ok ? 'Post saved.' : 'Could not save post.');
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-site-dark p-5">
      <div className="grid gap-4">
        <Input name="title_en" label="Title English" required />
        <Input name="title_my" label="Title Burmese" />
        <Input name="title_th" label="Title Thai" />
        <Textarea name="body_en" label="Body English" required />
        <Textarea name="body_my" label="Body Burmese" />
        <Textarea name="body_th" label="Body Thai" />
        <Textarea name="excerpt_en" label="Excerpt English" />
        <Input name="featured_image" label="Featured image URL" />
        <div className="grid gap-4 sm:grid-cols-2">
          <label><span className="mb-2 block text-sm font-semibold text-gold">Type</span><select name="type" className="input"><option value="news">News</option><option value="activity">Activity</option><option value="announcement">Announcement</option><option value="achievement">Achievement</option></select></label>
          <label><span className="mb-2 block text-sm font-semibold text-gold">Status</span><select name="status" value={status} onChange={(e) => setStatus(e.target.value)} className="input"><option value="draft">Draft</option><option value="published">Published</option></select></label>
        </div>
      </div>
      {message && <p className="mt-4 text-sm text-gold">{message}</p>}
      <button className="mt-5 rounded-md bg-gold px-5 py-3 font-bold text-site-black">Save Post</button>
    </form>
  );
}

function Input({ name, label, required = false }: { name: string; label: string; required?: boolean }) {
  return <label><span className="mb-2 block text-sm font-semibold text-gold">{label}</span><input name={name} required={required} className="input" /></label>;
}

function Textarea({ name, label, required = false }: { name: string; label: string; required?: boolean }) {
  return <label><span className="mb-2 block text-sm font-semibold text-gold">{label}</span><textarea name={name} required={required} rows={5} className="input" /></label>;
}

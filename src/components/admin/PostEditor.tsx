import { useState } from 'react';

export default function PostEditor() {
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setSaving(true);
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setOk(res.ok);
      setMessage(res.ok ? 'Post saved successfully.' : 'Could not save post.');
      if (res.ok) form.reset();
    } catch {
      setOk(false);
      setMessage('Could not save post.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6">
      <section className="card p-6 sm:p-7">
        <h2 className="font-display text-xl font-semibold text-ink">Titles</h2>
        <p className="mt-1 text-sm text-ink-muted">English is required; Burmese and Thai are optional.</p>
        <div className="mt-5 grid gap-4">
          <Field name="title_en" label="Title — English" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="title_my" label="Title — Burmese" />
            <Field name="title_th" label="Title — Thai" />
          </div>
        </div>
      </section>

      <section className="card p-6 sm:p-7">
        <h2 className="font-display text-xl font-semibold text-ink">Content</h2>
        <div className="mt-5 grid gap-4">
          <Area name="body_en" label="Body — English" required />
          <Area name="body_my" label="Body — Burmese" />
          <Area name="body_th" label="Body — Thai" />
          <Area name="excerpt_en" label="Excerpt — English" rows={3} />
          <Field name="featured_image" label="Featured image URL" />
        </div>
      </section>

      <section className="card p-6 sm:p-7">
        <h2 className="font-display text-xl font-semibold text-ink">Publishing</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="field-label">Type</span>
            <select name="type" className="input cursor-pointer">
              <option value="news">News</option>
              <option value="activity">Activity</option>
              <option value="announcement">Announcement</option>
              <option value="achievement">Achievement</option>
            </select>
          </label>
          <label>
            <span className="field-label">Status</span>
            <select name="status" className="input cursor-pointer">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button disabled={saving} className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-70">
          {saving ? 'Saving…' : 'Save post'}
        </button>
        {message && (
          <p className={`text-sm font-medium ${ok ? 'text-emerald-700' : 'text-ember-deep'}`}>{message}</p>
        )}
      </div>
    </form>
  );
}

function Field({ name, label, required = false }: { name: string; label: string; required?: boolean }) {
  return (
    <label>
      <span className="field-label">{label}{required ? ' *' : ''}</span>
      <input name={name} required={required} className="input" />
    </label>
  );
}

function Area({ name, label, required = false, rows = 5 }: { name: string; label: string; required?: boolean; rows?: number }) {
  return (
    <label>
      <span className="field-label">{label}{required ? ' *' : ''}</span>
      <textarea name={name} required={required} rows={rows} className="input resize-y" />
    </label>
  );
}

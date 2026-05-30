import { useState } from 'react';

export default function MediaUploader() {
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState(false);

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const res = await fetch('/api/media/upload', { method: 'POST', body: new FormData(form) });
    setOk(res.ok);
    setMessage(res.ok ? 'File uploaded.' : 'Upload failed.');
    if (res.ok) form.reset();
  }

  async function addYoutube(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    const res = await fetch('/api/media/youtube', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setOk(res.ok);
    setMessage(res.ok ? 'YouTube item added.' : 'Could not add YouTube item.');
    if (res.ok) form.reset();
  }

  return (
    <div className="space-y-5">
      {message && (
        <p className={`rounded-xl border px-4 py-3 text-sm font-medium ${ok ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700' : 'border-ember/40 bg-ember/10 text-ember-deep'}`}>{message}</p>
      )}
      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={upload} className="card p-6 sm:p-7">
          <h2 className="font-display text-xl font-semibold text-ink">Upload a file</h2>
          <p className="mt-1 text-sm text-ink-muted">Photos and documents are stored in R2.</p>
          <div className="mt-5 grid gap-4">
            <label>
              <span className="field-label">Title</span>
              <input name="title" placeholder="e.g. Classroom learning" required className="input" />
            </label>
            <label>
              <span className="field-label">Type</span>
              <select name="type" className="input cursor-pointer">
                <option value="photo">Photo</option>
                <option value="document">Document</option>
              </select>
            </label>
            <label>
              <span className="field-label">File</span>
              <input name="file" type="file" accept="image/jpeg,image/png,application/pdf,video/mp4" required className="block w-full rounded-xl border border-dashed border-line-strong bg-paper/50 p-5 text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-paper hover:file:bg-espresso-light" />
            </label>
          </div>
          <button className="btn btn-primary mt-5">Upload</button>
        </form>

        <form onSubmit={addYoutube} className="card p-6 sm:p-7">
          <h2 className="font-display text-xl font-semibold text-ink">Add a YouTube video</h2>
          <p className="mt-1 text-sm text-ink-muted">Paste a public YouTube link — no API key needed.</p>
          <div className="mt-5 grid gap-4">
            <label>
              <span className="field-label">Title</span>
              <input name="title_en" placeholder="Video title" required className="input" />
            </label>
            <label>
              <span className="field-label">YouTube URL</span>
              <input name="url" type="url" placeholder="https://www.youtube.com/watch?v=…" required className="input" />
            </label>
          </div>
          <button className="btn btn-dark mt-5">Add video</button>
        </form>
      </div>
    </div>
  );
}

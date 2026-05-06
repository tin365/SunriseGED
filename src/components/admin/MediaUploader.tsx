import { useState } from 'react';

export default function MediaUploader() {
  const [message, setMessage] = useState('');

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = await fetch('/api/media/upload', { method: 'POST', body: new FormData(event.currentTarget) });
    setMessage(res.ok ? 'File uploaded.' : 'Upload failed.');
  }

  async function addYoutube(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const res = await fetch('/api/media/youtube', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setMessage(res.ok ? 'YouTube item added.' : 'Could not add YouTube item.');
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <form onSubmit={upload} className="rounded-2xl border border-white/10 bg-site-dark p-5">
        <h2 className="font-heading text-2xl font-bold text-gold">Upload Media</h2>
        <input name="title" placeholder="Title" required className="input mt-5" />
        <select name="type" className="input mt-3"><option value="photo">Photo</option><option value="document">Document</option></select>
        <input name="file" type="file" accept="image/jpeg,image/png,application/pdf,video/mp4" required className="mt-3 block w-full rounded-md border border-dashed border-white/20 p-6" />
        <button className="mt-4 rounded-md bg-gold px-5 py-3 font-bold text-site-black">Upload</button>
      </form>
      <form onSubmit={addYoutube} className="rounded-2xl border border-white/10 bg-site-dark p-5">
        <h2 className="font-heading text-2xl font-bold text-gold">Add YouTube</h2>
        <input name="title_en" placeholder="Title" required className="input mt-5" />
        <input name="url" placeholder="YouTube URL" required className="input mt-3" />
        <button className="mt-4 rounded-md bg-gold px-5 py-3 font-bold text-site-black">Add Video</button>
      </form>
      {message && <p className="lg:col-span-2 text-gold">{message}</p>}
    </div>
  );
}

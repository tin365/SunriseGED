import { useEffect, useState } from 'react';

export default function PrintBridge() {
  const [status, setStatus] = useState('offline');
  useEffect(() => {
    fetch('http://localhost:7337/status')
      .then((r) => r.json())
      .then((data: any) => setStatus(data.status || 'offline'))
      .catch(() => setStatus('offline'));
  }, []);
  const online = status === 'online';
  return (
    <section className="card p-6 sm:p-7">
      <h2 className="font-display text-xl font-semibold text-ink">Printer / Scanner bridge</h2>
      <p className="mt-1 text-sm text-ink-muted">Runs locally on the admin computer at <code className="rounded bg-ink/5 px-1 py-0.5 text-[0.8em]">localhost:7337</code>.</p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold capitalize"
        style={{ borderColor: online ? 'rgba(16,185,129,.35)' : 'rgba(214,86,42,.35)', background: online ? 'rgba(16,185,129,.1)' : 'rgba(214,86,42,.1)', color: online ? '#047857' : '#b8431a' }}>
        <span className="h-2 w-2 rounded-full" style={{ background: online ? '#10b981' : '#d6562a' }}></span>
        {status}
      </div>
    </section>
  );
}

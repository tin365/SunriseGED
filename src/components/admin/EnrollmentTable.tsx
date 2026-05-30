import { useEffect, useState } from 'react';

type Enrollment = { id: string; full_name: string; submitted_at: string; status: string; reason?: string; notes?: string };

const STATUSES = ['pending', 'approved', 'rejected', 'waitlist'];

function badgeClass(s: string) {
  const map: Record<string, string> = {
    pending: 'bg-sun/15 text-sun-deep border-sun/30',
    approved: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
    rejected: 'bg-red-500/15 text-red-700 border-red-500/30',
    waitlist: 'bg-blue-500/15 text-blue-700 border-blue-500/30'
  };
  return map[s] || 'bg-ink/10 text-ink-soft border-line-strong';
}

export default function EnrollmentTable() {
  const [items, setItems] = useState<Enrollment[]>([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (search) params.set('search', search);
    fetch(`/api/enroll?${params}`)
      .then((r) => r.json())
      .then((data: any) => setItems(data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [status, search]);

  async function update(id: string, next: string) {
    setItems((rows) => rows.map((row) => (row.id === id ? { ...row, status: next } : row)));
    await fetch(`/api/enroll/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) });
  }

  function exportCsv() {
    const csv = ['Name,Submitted,Status', ...items.map((row) => `"${row.full_name}","${row.submitted_at}","${row.status}"`)].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sunrise-enrollments.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line p-4 sm:p-5">
        <div className="relative grow sm:max-w-xs">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name" className="input pl-9" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-auto cursor-pointer">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
        </select>
        <span className="hidden text-sm text-ink-muted sm:inline">{loading ? '…' : `${items.length} result${items.length === 1 ? '' : 's'}`}</span>
        <button onClick={exportCsv} className="btn btn-ghost ml-auto !px-4 !py-2 text-sm">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /></svg>
          Export CSV
        </button>
      </div>

      {/* Body */}
      {loading ? (
        <p className="p-10 text-center text-sm text-ink-muted">Loading applications…</p>
      ) : items.length === 0 ? (
        <div className="p-12 text-center">
          <p className="font-display text-lg font-semibold text-ink">No applications found</p>
          <p className="mt-1 text-sm text-ink-muted">New enrollment submissions will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-5 py-3 font-semibold">Applicant</th>
                <th className="px-5 py-3 font-semibold">Submitted</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Set status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-b border-line/70 transition-colors last:border-0 hover:bg-paper/60">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-ink">{row.full_name}</p>
                    {row.reason && <p className="mt-0.5 line-clamp-1 max-w-xs text-xs text-ink-muted">{row.reason}</p>}
                  </td>
                  <td className="px-5 py-4 text-ink-soft">{row.submitted_at}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${badgeClass(row.status)}`}>{row.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <select value={STATUSES.includes(row.status) ? row.status : ''} onChange={(e) => update(row.id, e.target.value)} className="input w-auto cursor-pointer !py-1.5 text-sm">
                      {!STATUSES.includes(row.status) && <option value="">{row.status}</option>}
                      {STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

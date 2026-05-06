import { useEffect, useState } from 'react';

type Enrollment = { id: string; full_name: string; submitted_at: string; status: string; reason?: string; notes?: string };

export default function EnrollmentTable() {
  const [items, setItems] = useState<Enrollment[]>([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (search) params.set('search', search);
    fetch(`/api/enroll?${params}`).then((r) => r.json()).then((data: any) => setItems(data.items || [])).catch(() => setItems([]));
  }, [status, search]);

  async function update(id: string, next: string) {
    await fetch(`/api/enroll/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) });
    setItems((rows) => rows.map((row) => row.id === id ? { ...row, status: next } : row));
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
    <div className="rounded-2xl border border-white/10 bg-site-dark p-5">
      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name" className="input max-w-xs" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input max-w-xs"><option value="">All status</option><option>pending</option><option>approved</option><option>rejected</option><option>waitlist</option></select>
        <button onClick={exportCsv} className="rounded-md border border-gold px-4 py-2 font-bold text-gold">Export CSV</button>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-gold"><tr><th className="py-3">Name</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{items.map((row) => <tr key={row.id} className="border-t border-white/10"><td className="py-3 font-semibold">{row.full_name}</td><td>{row.submitted_at}</td><td><span className="rounded-full border border-white/15 px-3 py-1">{row.status}</span></td><td className="flex gap-2 py-2">{['approved', 'rejected', 'waitlist'].map((next) => <button key={next} onClick={() => update(row.id, next)} className="rounded-md bg-white/10 px-3 py-1 hover:bg-gold hover:text-site-black">{next}</button>)}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

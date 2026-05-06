import { useEffect, useState } from 'react';

export default function PrintBridge() {
  const [status, setStatus] = useState('offline');
  useEffect(() => {
    fetch('http://localhost:7337/status').then((r) => r.json()).then((data: any) => setStatus(data.status || 'offline')).catch(() => setStatus('offline'));
  }, []);
  return <div className="rounded-2xl border border-white/10 bg-site-dark p-5"><h2 className="font-heading text-2xl font-bold text-gold">Printer / Scanner Bridge</h2><p className="mt-3 text-white/75">Local bridge status: <span className={status === 'online' ? 'text-gold' : 'text-orange'}>{status}</span></p></div>;
}

import { useState, type ReactNode } from 'react';
import Sidebar from '../components/admin/Sidebar';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function AdminLayout({
  title = 'Admin',
  description,
  children
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  useDocumentMeta(`${title} | Sunrise Admin`, undefined, true);

  return (
    <div className="min-h-screen bg-paper-deep font-sans text-ink antialiased">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="lg:pl-[17rem]">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-paper/85 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line-strong text-ink transition hover:bg-ink/5 lg:hidden"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <div className="min-w-0">
            <p className="text-[0.7rem] font-bold uppercase tracking-eyebrow text-ember-deep">Sunrise Admin</p>
            <h1 className="truncate font-display text-xl font-semibold leading-none text-ink">{title}</h1>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="ml-auto hidden items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-sm font-semibold text-ink-soft transition hover:border-ink hover:text-ink sm:inline-flex"
          >
            View site
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7M9 7h8v8" /></svg>
          </a>
        </header>

        <main className="px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
          {description && <p className="mb-6 max-w-2xl leading-relaxed text-ink-soft">{description}</p>}
          {children}
        </main>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function NotFound() {
  useDocumentMeta('Page not found | Sunrise GED');
  return (
    <section className="grid min-h-[70vh] place-items-center px-4 pt-32 text-center">
      <div>
        <p className="eyebrow is-centered justify-center">404</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4rem)] font-semibold tracking-tight text-ink">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">The page you're looking for doesn't exist or may have moved.</p>
        <Link to="/" className="btn btn-primary mt-8">
          Back to home
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </Link>
      </div>
    </section>
  );
}

import { useLocation, useNavigate } from 'react-router-dom';
import { pathFor, type Locale } from '../lib/i18n';

const languages: { code: Locale; name: string }[] = [
  { code: 'en', name: 'EN' },
  { code: 'my', name: 'မြန်မာ' },
  { code: 'th', name: 'ไทย' }
];

export default function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
      </svg>
      <select
        className="cursor-pointer appearance-none rounded-full border border-line-strong bg-surface/70 py-2 pl-8 pr-7 text-sm font-semibold text-ink-soft outline-none transition hover:border-ink/40 focus:border-sun"
        aria-label={label}
        value={pathFor(locale, location.pathname)}
        onChange={(event) => navigate(event.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={pathFor(lang.code, location.pathname)}>
            {lang.name}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

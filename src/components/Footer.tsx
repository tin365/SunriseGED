import { Link } from 'react-router-dom';
import { useLocale } from '../lib/locale';

export default function Footer() {
  const { dict, prefix } = useLocale();
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-espresso text-paper">
      {/* rising-sun motif */}
      <div
        className="pointer-events-none absolute -top-px left-1/2 h-[420px] w-[820px] max-w-[150vw] -translate-x-1/2 rounded-[50%] opacity-[0.14]"
        style={{ background: 'radial-gradient(50% 100% at 50% 0%, #F2A100, transparent 70%)' }}
      />
      <div className="horizon opacity-30" />

      <div className="shell relative grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div data-reveal>
          <div className="flex items-center gap-3">
            <img src="/Sunrise_logo.jpg" alt="" className="h-12 w-12 rounded-full ring-1 ring-white/20" loading="lazy" />
            <span className="font-display text-2xl font-semibold">Sunrise</span>
          </div>
          <p className="mt-4 max-w-xs leading-relaxed text-paper/65">
            {dict.footer.tagline} — {dict.hero.subtitle}
          </p>
          <a
            href="https://facebook.com/sunrisetraumahealingeducation"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-paper/80 transition hover:border-sun hover:text-sun"
            aria-label="Facebook"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 22v-8h2.7l.4-3.1H13V8.9c0-.9.25-1.5 1.5-1.5H16V4.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H7.2V14h2.6v8H13Z" />
            </svg>
          </a>
        </div>

        <div data-reveal style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
          <p className="text-xs font-bold uppercase tracking-eyebrow text-sun">{dict.nav.programs}</p>
          <ul className="mt-5 space-y-3 text-sm text-paper/70">
            <li><Link className="transition hover:text-paper" to={`${prefix}/programs`}>{dict.programs.ged}</Link></li>
            <li><Link className="transition hover:text-paper" to={`${prefix}/programs`}>{dict.programs.trauma}</Link></li>
            <li><Link className="transition hover:text-paper" to={`${prefix}/programs`}>{dict.programs.counseling}</Link></li>
            <li><Link className="transition hover:text-paper" to={`${prefix}/programs`}>{dict.programs.community}</Link></li>
          </ul>
        </div>

        <div data-reveal style={{ '--reveal-delay': '160ms' } as React.CSSProperties}>
          <p className="text-xs font-bold uppercase tracking-eyebrow text-sun">{dict.nav.about}</p>
          <ul className="mt-5 space-y-3 text-sm text-paper/70">
            <li><Link className="transition hover:text-paper" to={`${prefix}/about`}>{dict.about.title}</Link></li>
            <li><Link className="transition hover:text-paper" to={`${prefix}/media`}>{dict.media.title}</Link></li>
            <li><Link className="transition hover:text-paper" to={`${prefix}/enroll`}>{dict.hero.enrollCTA}</Link></li>
            <li><Link className="transition hover:text-paper" to={`${prefix}/contact`}>{dict.contact.title}</Link></li>
          </ul>
        </div>

        <div data-reveal style={{ '--reveal-delay': '240ms' } as React.CSSProperties}>
          <p className="text-xs font-bold uppercase tracking-eyebrow text-sun">{dict.contact.title}</p>
          <p className="mt-5 text-sm leading-relaxed text-paper/70">{dict.contact.addressValue}</p>
          <Link to={`${prefix}/contact`} className="link-underline mt-4 inline-flex text-sm font-semibold text-sun">
            {dict.contact.chatWithUs}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </div>

      <div className="horizon opacity-20" />
      <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-paper/45 sm:flex-row">
        <p>© {year} Sunrise Trauma Healing Education. {dict.footer.rights}</p>
        <p className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-dawn" /> Mae Sot, Tak Province, Thailand
        </p>
      </div>
    </footer>
  );
}

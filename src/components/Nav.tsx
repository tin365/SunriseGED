import { useEffect, useState, type CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocale } from '../lib/locale';

export default function Nav() {
  const { locale, dict, localize } = useLocale();
  const location = useLocation();
  const current = location.pathname.replace(/^\/(my|th)/, '') || '/';
  const isHome = current === '/';

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links: [string, string][] = [
    ['/', dict.nav.home],
    ['/about', dict.nav.about],
    ['/programs', dict.nav.programs],
    ['/media', dict.nav.media],
    ['/contact', dict.nav.contact]
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname]);

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const solid = scrolled || open;
  const overDark = isHome && !solid;

  return (
    <header
      id="site-nav"
      className={[
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500',
        solid ? 'border-line bg-paper/80 shadow-warm backdrop-blur-xl' : 'border-transparent',
        overDark ? 'nav-over-dark' : ''
      ].join(' ')}
    >
      <nav className="shell flex items-center justify-between gap-3 py-3 sm:py-3.5" aria-label="Primary navigation">
        <Link to={localize('/')} className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="relative grid h-10 w-10 shrink-0 place-items-center sm:h-11 sm:w-11">
            <span className="absolute inset-0 rounded-full bg-dawn opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-60" />
            <img src="/Sunrise_logo.jpg" alt="" className="relative h-10 w-10 rounded-full ring-1 ring-line-strong sm:h-11 sm:w-11" loading="eager" />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="nav-brand font-display text-[1.25rem] font-semibold tracking-tight text-ink sm:text-[1.35rem]">Sunrise</span>
            <span className="nav-sub mt-0.5 hidden text-[0.6rem] font-bold uppercase tracking-eyebrow text-ink-muted min-[380px]:block">Trauma Healing · GED</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map(([href, label]) => (
            <Link
              key={href}
              to={localize(href)}
              className={[
                'nav-link link-underline text-[0.92rem] font-medium transition-colors duration-300',
                current === href ? 'is-active text-ember' : 'text-ink-soft hover:text-ink'
              ].join(' ')}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher locale={locale} label={dict.common.switchLanguage} />
          <Link to={localize('/enroll')} className="btn btn-primary !px-5 !py-2.5 text-sm">
            {dict.hero.enrollCTA}
          </Link>
        </div>

        <button
          id="menu-button"
          className={[
            'nav-burger grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:bg-ink/5 lg:hidden',
            open ? 'is-open' : ''
          ].join(' ')}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <svg className="icon-open" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <svg className="icon-close" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={['mobile-menu border-t border-transparent bg-paper/95 backdrop-blur-xl lg:hidden', open ? 'is-open' : ''].join(' ')}
      >
        <div className="shell grid gap-1 py-5">
          {links.map(([href, label], i) => (
            <Link
              key={href}
              to={localize(href)}
              style={{ '--i': i } as CSSProperties}
              className={[
                'm-link rounded-xl px-4 py-3.5 text-base font-medium transition-colors',
                current === href ? 'bg-sun/10 text-ember' : 'text-ink-soft hover:bg-ink/5 active:bg-ink/5'
              ].join(' ')}
            >
              {label}
            </Link>
          ))}
          <div className="m-link mt-3 flex items-center justify-between gap-3 border-t border-line pt-4" style={{ '--i': links.length } as CSSProperties}>
            <LanguageSwitcher locale={locale} label={dict.common.switchLanguage} />
            <Link to={localize('/enroll')} className="btn btn-primary !px-5 !py-2.5 text-sm">
              {dict.hero.enrollCTA}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

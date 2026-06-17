import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Reveals `[data-reveal]` elements on scroll and animates `[data-count]`
 * counters — ported from the old BaseLayout inline script. Re-runs on every
 * route change so freshly rendered content gets observed. Honors
 * prefers-reduced-motion.
 */
export function useScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const countEls = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));

    if (reduce || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      countEls.forEach((el) => (el.textContent = el.getAttribute('data-count') ?? ''));
      return;
    }

    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => revealIO.observe(el));

    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseFloat(el.getAttribute('data-count') ?? '0');
          const suffix = el.getAttribute('data-suffix') ?? '';
          const start = performance.now();
          const dur = 1500;
          const tick = (now: number) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          countIO.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    countEls.forEach((el) => countIO.observe(el));

    return () => {
      revealIO.disconnect();
      countIO.disconnect();
    };
  }, [pathname]);
}

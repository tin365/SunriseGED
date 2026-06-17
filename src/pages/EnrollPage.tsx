import EnrollmentForm from '../components/EnrollmentForm';
import { useLocale } from '../lib/locale';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { type CSSProperties } from 'react';

const steps = [
  { n: '01', text: 'Application review within 3–5 business days.' },
  { n: '02', text: 'Family contact and a short interview.' },
  { n: '03', text: 'Placement guidance and orientation.' }
];
const faqs = [
  { q: 'Is there a fee?', a: 'Sunrise prioritizes access for refugee families. Contact the team for current support details.' },
  { q: 'Who can apply?', a: 'Myanmar youth in the Mae Sot area who need GED preparation and support.' },
  { q: 'What is the schedule?', a: 'Class schedules are shared during admissions based on the current cohort.' }
];

export default function EnrollPage() {
  const { locale, dict } = useLocale();
  useDocumentMeta(`${dict.enroll.title} | Sunrise GED`, dict.enroll.subtitle);

  return (
    <>
      <section className="relative overflow-hidden bg-paper pb-10 pt-36" style={{ background: 'linear-gradient(180deg, #FCE8CD 0%, #FBF6EE 70%)' }}>
        <div className="bloom pointer-events-none absolute -top-20 left-1/2 h-[36rem] w-[60rem] max-w-[140vw] -translate-x-1/2 opacity-60" />
        <div className="shell relative">
          <p className="eyebrow" data-reveal="">Admissions</p>
          <h1 className="font-display mt-5 text-[clamp(2.6rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-tight text-ink" data-reveal="" style={{ '--reveal-delay': '100ms' } as CSSProperties}>{dict.enroll.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft" data-reveal="" style={{ '--reveal-delay': '200ms' } as CSSProperties}>{dict.enroll.subtitle}</p>
        </div>
      </section>

      <section className="section bg-paper pt-12">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
          <div data-reveal="left">
            <EnrollmentForm dict={dict} locale={locale} />
          </div>
          <aside className="space-y-6" data-reveal="right">
            <div className="card p-7">
              <h2 className="font-display text-2xl font-semibold text-ink">What happens next</h2>
              <ol className="mt-5 space-y-4">
                {steps.map((s) => (
                  <li className="flex gap-4" key={s.n}>
                    <span className="font-display text-2xl font-semibold text-sun-deep">{s.n}</span>
                    <span className="pt-1 text-sm leading-relaxed text-ink-soft">{s.text}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="card p-7">
              <h2 className="font-display text-2xl font-semibold text-ink">Questions</h2>
              <div className="mt-4 divide-y divide-line">
                {faqs.map((f) => (
                  <details className="group py-3" key={f.q}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-ink">
                      {f.q}
                      <svg className="shrink-0 text-ink-muted transition-transform duration-300 group-open:rotate-45" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

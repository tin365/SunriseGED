import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../lib/locale';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const eligibility = [
  'Students are generally Myanmar youth living in or near Mae Sot.',
  'Applicants should be ready to attend regular classes and participate respectfully in community life.',
  'Families or guardians should provide contact information for admissions follow-up.'
];

export default function ProgramsPage() {
  const { dict, prefix } = useLocale();
  useDocumentMeta(`${dict.programs.title} | Sunrise GED`, dict.programs.gedDesc);

  const programs = [
    { title: dict.programs.ged, desc: dict.programs.gedDesc, more: 'GED classes cover language arts, mathematics, science, and social studies with study habits, practice tests, and academic mentoring.', icon: 'M22 10 12 5 2 10l10 5 10-5Z M6 12v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V12' },
    { title: dict.programs.trauma, desc: dict.programs.traumaDesc, more: 'Students join carefully facilitated group sessions that build emotional vocabulary, grounding skills, peer trust, and hope after displacement.', icon: 'M12 21s-7-4.6-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6.4-7 11-7 11z' },
    { title: dict.programs.counseling, desc: dict.programs.counselingDesc, more: 'Counseling is private, respectful, and coordinated with school support when a student needs extra care for family, stress, grief, or decision-making.', icon: 'M21 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-5.3A8 8 0 1 1 21 11.5Z' },
    { title: 'Sports & Activities', desc: dict.programs.communityDesc, more: 'Activities create normal teenage joy: sports, arts, field trips, cultural days, leadership practice, and service opportunities.', icon: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7 0a3 3 0 1 0 0-6M3 20a6 6 0 0 1 12 0M15 14.5a6 6 0 0 1 6 5.5' }
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-paper pb-12 pt-36" style={{ background: 'linear-gradient(180deg, #FCE8CD 0%, #FBF6EE 70%)' }}>
        <div className="bloom pointer-events-none absolute -top-20 left-1/2 h-[40rem] w-[60rem] max-w-[140vw] -translate-x-1/2 opacity-60" />
        <div className="shell relative">
          <p className="eyebrow" data-reveal="">{dict.programs.title}</p>
          <h1 className="font-display mt-5 max-w-3xl text-[clamp(2.6rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-tight text-ink" data-reveal="" style={{ '--reveal-delay': '100ms' } as CSSProperties}>Learning and healing, by design</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft" data-reveal="" style={{ '--reveal-delay': '200ms' } as CSSProperties}>Academic preparation and healing support are designed together so students can learn with stability and confidence.</p>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="shell grid gap-6">
          {programs.map((p, i) => (
            <article className="card card-hover group grid gap-7 p-8 md:grid-cols-[auto_1fr] md:p-10" data-reveal="" style={{ '--reveal-delay': `${i * 80}ms` } as CSSProperties} key={p.title}>
              <div className="flex items-start gap-5">
                <span className="font-display text-5xl font-semibold text-line-strong transition-colors duration-500 group-hover:text-sun">{String(i + 1).padStart(2, '0')}</span>
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sun/12 text-ember transition-colors duration-500 group-hover:bg-dawn group-hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={p.icon} /></svg>
                </span>
              </div>
              <div>
                <h2 className="font-display text-3xl font-semibold text-ink">{p.title}</h2>
                <p className="mt-4 leading-relaxed text-ink-soft">{p.desc}</p>
                <p className="mt-3 leading-relaxed text-ink-muted">{p.more}</p>
                <p className="mt-5 text-sm leading-relaxed text-ink-soft"><strong className="font-semibold text-ember">Who it is for:</strong> Myanmar refugee teens and young adults in the Mae Sot area who need a structured, supportive learning path.</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section bg-paper-deep">
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div data-reveal="left">
            <p className="eyebrow">Admissions</p>
            <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight text-ink">Eligibility</h2>
          </div>
          <ul className="grid gap-4" data-reveal="right">
            {eligibility.map((item, i) => (
              <li className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-5 shadow-warm" style={{ '--reveal-delay': `${i * 90}ms` } as CSSProperties} key={item}>
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-dawn text-white">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m5 12 5 5 9-11" /></svg>
                </span>
                <span className="leading-relaxed text-ink-soft">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-tight bg-paper">
        <div className="shell">
          <div className="relative overflow-hidden rounded-[28px] bg-espresso px-8 py-14 text-center text-paper" data-reveal="scale">
            <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-[40rem] max-w-[120vw] -translate-x-1/2 opacity-30" style={{ background: 'radial-gradient(50% 100% at 50% 0%, #F2A100, transparent 70%)' }} />
            <h2 className="font-display relative text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight">Start with an application</h2>
            <Link to={`${prefix}/enroll`} className="btn btn-primary relative mt-7">
              {dict.hero.enrollCTA}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

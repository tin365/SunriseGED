import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../lib/locale';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const values = [
  { name: 'Compassion', icon: 'M12 21s-7-4.6-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6.4-7 11-7 11z' },
  { name: 'Safety', icon: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z' },
  { name: 'Empowerment', icon: 'M13 2 4 14h6l-1 8 9-12h-6l1-8Z' },
  { name: 'Community', icon: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7 0a3 3 0 1 0 0-6M3 20a6 6 0 0 1 12 0M15 14.5a6 6 0 0 1 6 5.5' }
];
const team = ['Program Director', 'GED Teacher', 'Counselor', 'Administrator'];

export default function AboutPage() {
  const { dict, prefix } = useLocale();
  useDocumentMeta(`${dict.about.title} | Sunrise GED`, dict.about.missionText);

  return (
    <>
      <section className="relative overflow-hidden bg-paper pb-12 pt-36" style={{ background: 'linear-gradient(180deg, #FCE8CD 0%, #FBF6EE 70%)' }}>
        <div className="bloom pointer-events-none absolute -top-20 left-1/2 h-[40rem] w-[60rem] max-w-[140vw] -translate-x-1/2 opacity-60" />
        <div className="shell relative">
          <p className="eyebrow" data-reveal="">Mae Sot · Myanmar Border</p>
          <h1 className="font-display mt-5 max-w-3xl text-[clamp(2.6rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-tight text-ink" data-reveal="" style={{ '--reveal-delay': '100ms' } as CSSProperties}>{dict.about.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft" data-reveal="" style={{ '--reveal-delay': '200ms' } as CSSProperties}>{dict.about.missionText}</p>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="shell grid gap-8 lg:grid-cols-2">
          <article className="card p-9" data-reveal="left">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sun/12 text-ember"><svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="3.2" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></svg></span>
            <h2 className="font-display mt-5 text-3xl font-semibold text-ink">{dict.about.mission}</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">Sunrise exists so displaced young people can continue learning in a stable, caring environment. GED preparation opens doors to higher education and work, while counseling and group healing help students recover dignity, trust, and confidence.</p>
          </article>
          <article className="card p-9" data-reveal="right">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ember/12 text-ember"><svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg></span>
            <h2 className="font-display mt-5 text-3xl font-semibold text-ink">Vision</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">We envision a generation of Myanmar refugee youth who are educated, emotionally supported, and equipped to serve their families and communities with courage and skill.</p>
          </article>
        </div>
      </section>

      <section className="section bg-paper-deep">
        <div className="shell max-w-prose">
          <p className="eyebrow" data-reveal="">Our Story</p>
          <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight tracking-tight text-ink" data-reveal="" style={{ '--reveal-delay': '80ms' } as CSSProperties}>A new beginning, every morning</h2>
          <div className="prose-warm mt-7 text-lg" data-reveal="" style={{ '--reveal-delay': '160ms' } as CSSProperties}>
            <p>Mae Sot is a place of crossing and waiting for many families from Myanmar. Students arrive with interrupted education, responsibilities at home, and experiences that no teenager should have to carry alone.</p>
            <p>Sunrise Trauma Healing Education was formed to respond to both needs at once: rigorous education and careful healing. The school combines GED instruction, counseling, mentoring, and charitable support within a community that respects each student's language, culture, and story.</p>
            <p>With about 100 students and a team of teachers and administrators, Sunrise works practically: daily classes, individual guidance, group activities, family communication, and connections with volunteers and donors who share the mission.</p>
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="shell">
          <p className="eyebrow" data-reveal="">{dict.about.values}</p>
          <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight text-ink" data-reveal="" style={{ '--reveal-delay': '80ms' } as CSSProperties}>What we practice daily</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <article className="card card-hover group p-7" data-reveal="" style={{ '--reveal-delay': `${i * 90}ms` } as CSSProperties} key={v.name}>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sun/12 text-ember transition-colors duration-500 group-hover:bg-dawn group-hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={v.icon} /></svg>
                </span>
                <h3 className="font-display mt-5 text-xl font-semibold text-ink">{v.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">A daily practice in classrooms, counseling rooms, and community life.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-paper-deep">
        <div className="shell">
          <p className="eyebrow" data-reveal="">{dict.about.team}</p>
          <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight text-ink" data-reveal="" style={{ '--reveal-delay': '80ms' } as CSSProperties}>The people behind Sunrise</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((role, i) => (
              <article className="card card-hover overflow-hidden" data-reveal="" style={{ '--reveal-delay': `${i * 90}ms` } as CSSProperties} key={role}>
                <div className="aspect-square bg-gradient-to-br from-sun-soft via-paper-deep to-paper" />
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-ink">Team Member {i + 1}</h3>
                  <p className="mt-1 text-sm font-semibold text-ember">{role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight bg-paper">
        <div className="shell">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] border border-line bg-surface px-8 py-10 shadow-warm md:flex-row md:items-center" data-reveal="">
            <p className="font-display text-2xl font-semibold text-ink md:text-3xl">Partners and donors make this work possible.</p>
            <Link to={`${prefix}/contact`} className="btn btn-dark shrink-0">Contact Sunrise</Link>
          </div>
        </div>
      </section>
    </>
  );
}

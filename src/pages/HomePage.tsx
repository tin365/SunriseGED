import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import VideoCard from '../components/VideoCard';
import { useLocale } from '../lib/locale';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

type Stat = { n: number; suffix: string; label_en: string; label_my: string; label_th: string };
type Media = { type: string; title_en: string; title_my: string; title_th: string; thumbnail_url: string; url: string };

export default function HomePage() {
  const { locale, dict, prefix } = useLocale();
  useDocumentMeta('Home | Sunrise GED', dict.hero.subtitle);

  const samplePosts: Record<string, string>[] = [
    { id: 'post_003', type: 'news', title_en: 'GED Preparation Classes Open for Applications', title_my: 'GED ပြင်ဆင်ရေး အတန်းများအတွက် လျှောက်လွှာ ဖွင့်ထားပါသည်', title_th: 'เปิดรับสมัครชั้นเรียนเตรียม GED', excerpt_en: 'Apply early for the next student cohort.', excerpt_my: 'လာမည့်အုပ်စုအတွက် အစောပိုင်း လျှောက်ထားပါ။', excerpt_th: 'สมัครล่วงหน้าสำหรับนักเรียนรุ่นถัดไป' },
    { id: 'post_002', type: 'activity', title_en: 'Community Sports Day Builds Confidence', title_my: 'အသိုင်းအဝိုင်း အားကစားနေ့က ယုံကြည်မှု တည်ဆောက်ပေးသည်', title_th: 'วันกีฬาชุมชนช่วยสร้างความมั่นใจ', excerpt_en: 'Team activities support healing and belonging.', excerpt_my: 'အဖွဲ့လိုက် လှုပ်ရှားမှုများက ကုသမှုနှင့် ပါဝင်မှုခံစားချက်ကို ထောက်ပံ့သည်။', excerpt_th: 'กิจกรรมเป็นทีมสนับสนุนการเยียวยาและความรู้สึกเป็นส่วนหนึ่ง' },
    { id: 'post_001', type: 'announcement', title_en: 'Welcome to Sunrise GED', title_my: 'Sunrise GED မှ ကြိုဆိုပါသည်', title_th: 'ยินดีต้อนรับสู่ Sunrise GED', excerpt_en: 'A new beginning for students in Mae Sot.', excerpt_my: 'မေဆော့ရှိ ကျောင်းသားများအတွက် အစသစ်တစ်ခု။', excerpt_th: 'จุดเริ่มต้นใหม่สำหรับนักเรียนในแม่สอด' }
  ];
  const media: Media[] = [
    { type: 'photo', title_en: 'Learning together', title_my: 'အတူတကွ လေ့လာခြင်း', title_th: 'เรียนรู้ร่วมกัน', thumbnail_url: '/sample/classroom.svg', url: '/media' },
    { type: 'photo', title_en: 'Community activities', title_my: 'အသိုင်းအဝိုင်း လှုပ်ရှားမှုများ', title_th: 'กิจกรรมชุมชน', thumbnail_url: '/sample/activity.svg', url: '/media' },
    { type: 'youtube', title_en: 'Sunrise introduction', title_my: 'Sunrise မိတ်ဆက်', title_th: 'แนะนำ Sunrise', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { type: 'document', title_en: 'Enrollment guide', title_my: 'လျှောက်ထားမှုလမ်းညွှန်', title_th: 'คู่มือการสมัคร', thumbnail_url: '/sample/document.svg', url: '/documents/enrollment-info.pdf' }
  ];
  const programs = [
    { title: dict.programs.ged, desc: dict.programs.gedDesc, icon: 'M22 10 12 5 2 10l10 5 10-5Z M6 12v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V12' },
    { title: dict.programs.trauma, desc: dict.programs.traumaDesc, icon: 'M12 21s-7-4.6-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6.4-7 11-7 11z' },
    { title: dict.programs.counseling, desc: dict.programs.counselingDesc, icon: 'M21 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-5.3A8 8 0 1 1 21 11.5Z' },
    { title: dict.programs.community, desc: dict.programs.communityDesc, icon: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7 0a3 3 0 1 0 0-6M3 20a6 6 0 0 1 12 0M15 14.5a6 6 0 0 1 6 5.5' }
  ];
  const marquee = ['Compassion', 'Safety', 'Education', 'Healing', 'Belonging', 'Dignity', 'Community', 'Hope'];
  const stats: Stat[] = [
    { n: 100, suffix: '+', label_en: 'Students supported', label_my: 'ကျောင်းသား', label_th: 'นักเรียนที่ได้รับการสนับสนุน' },
    { n: 4, suffix: '', label_en: 'Core programs', label_my: 'အဓိက အစီအစဉ်', label_th: 'โปรแกรมหลัก' },
    { n: 3, suffix: '', label_en: 'Languages taught', label_my: 'ဘာသာစကား', label_th: 'ภาษาที่ใช้สอน' }
  ];
  const statLabel = (s: Stat) => ({ en: s.label_en, my: s.label_my, th: s.label_th })[locale];
  const mediaTitle = (m: Media) => ({ en: m.title_en, my: m.title_my, th: m.title_th })[locale];

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden sm:min-h-[92vh]">
        <img
          src="/sunrise_background.jpg"
          alt="Sunrise students and staff together in Mae Sot"
          className="hero-zoom absolute inset-0 -z-20 h-full w-full object-cover [object-position:center_46%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(15,10,6,0.66) 0%, rgba(15,10,6,0.50) 42%, rgba(15,10,6,0.86) 100%)' }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-44" style={{ background: 'linear-gradient(180deg, rgba(214,86,42,0.30), transparent)' }} />

        <div className="shell relative w-full pb-28 pt-32 text-center sm:pb-32 sm:pt-36">
          <div className="animate-rise relative mx-auto w-fit">
            <div className="relative animate-float">
              <div
                className="animate-breathe pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[165%] w-[165%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(242,161,0,0.6), rgba(250,200,95,0.22) 45%, transparent 70%)', filter: 'blur(8px)' }}
              />
              <img src="/Sunrise_logo.jpg" alt="Sunrise — The Trauma Healing Program" className="relative h-[clamp(5.5rem,11vw,8.5rem)] w-[clamp(5.5rem,11vw,8.5rem)] rounded-full shadow-lift ring-1 ring-white/15" loading="eager" />
            </div>
          </div>
          <p className="eyebrow is-centered mt-7 text-sun" data-reveal="">{dict.contact.addressValue.split(',')[0]} · Myanmar Border</p>
          <h1 data-reveal="" style={{ '--reveal-delay': '120ms', textShadow: '0 2px 28px rgba(0,0,0,0.4)' } as CSSProperties} className="mx-auto mt-5 max-w-4xl font-display text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[1.05] tracking-tight text-white">
            {dict.hero.tagline.split(' ').slice(0, -1).join(' ')} <span className="italic text-dawn">{dict.hero.tagline.split(' ').slice(-1)}</span>
          </h1>
          <p data-reveal="" style={{ '--reveal-delay': '240ms' } as CSSProperties} className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-paper/90">{dict.hero.subtitle}</p>
          <div data-reveal="" style={{ '--reveal-delay': '360ms' } as CSSProperties} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to={`${prefix}/enroll`} className="btn btn-primary">
              {dict.hero.enrollCTA}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <Link to={`${prefix}/about`} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/45 px-7 py-3 font-semibold text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/10">{dict.hero.learnMore}</Link>
          </div>
        </div>

        <a href="#about" className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold uppercase tracking-eyebrow text-white/75" aria-label="Scroll down">
          <span className="grid h-9 w-9 animate-float place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
          </span>
        </a>
      </section>

      {/* ============ VALUE MARQUEE ============ */}
      <div className="marquee overflow-hidden border-y border-line bg-paper-deep py-4">
        <div className="marquee-track items-center gap-0 text-ink-muted">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div className="flex items-center gap-0" aria-hidden="true" key={idx}>
              {marquee.map((word) => (
                <span className="flex items-center" key={word}>
                  <span className="px-7 font-display text-xl italic">{word}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-sun/70" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============ ABOUT ============ */}
      <section id="about" className="section bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div data-reveal="left">
            <p className="eyebrow">{dict.about.mission}</p>
            <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight tracking-tight text-ink">{dict.about.title}</h2>
            <div className="prose-warm mt-6 text-lg">
              <p>{dict.about.missionText}</p>
              <p>Serving around 100 students with a team of teachers, counselors, administrators, and volunteers near the Myanmar border.</p>
            </div>
            <Link to={`${prefix}/about`} className="link-underline mt-8 inline-flex font-semibold text-ember">
              Our Story
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
          <div data-reveal="right" className="relative">
            <div className="absolute -right-4 -top-4 -z-10 h-full w-full rounded-card bg-dawn opacity-10" />
            <div className="overflow-hidden rounded-card border border-line shadow-warm">
              <img src="/sample/classroom.svg" alt="Students learning at Sunrise" className="aspect-[4/3] w-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-6 left-6 rounded-2xl border border-line bg-surface px-5 py-4 shadow-lift">
              <p className="font-display text-3xl font-semibold text-ink"><span data-count="100" data-suffix="+">100+</span></p>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{statLabel(stats[0])}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ IMPACT ============ */}
      <section className="relative overflow-hidden bg-espresso py-20 text-paper">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[60rem] max-w-[140vw] -translate-x-1/2 rounded-[50%] opacity-20" style={{ background: 'radial-gradient(50% 100% at 50% 0%, #F2A100, transparent 70%)' }} />
        <div className="shell relative grid gap-10 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div className="text-center" data-reveal="" style={{ '--reveal-delay': `${i * 120}ms` } as CSSProperties} key={s.label_en}>
              <p className="font-display text-[clamp(3rem,7vw,4.5rem)] font-semibold leading-none text-dawn">
                <span data-count={s.n} data-suffix={s.suffix}>{s.n}{s.suffix}</span>
              </p>
              <p className="mt-3 text-sm font-medium uppercase tracking-eyebrow text-paper/65">{statLabel(s)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ PROGRAMS ============ */}
      <section className="section bg-paper">
        <div className="shell">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end" data-reveal="">
            <div>
              <p className="eyebrow">{dict.programs.title}</p>
              <h2 className="font-display mt-5 max-w-xl text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight tracking-tight text-ink">What We Offer</h2>
            </div>
            <Link to={`${prefix}/programs`} className="link-underline shrink-0 font-semibold text-ember">
              All programs
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {programs.map((p, i) => (
              <article className="card card-hover group flex gap-5 p-7" data-reveal="" style={{ '--reveal-delay': `${i * 90}ms` } as CSSProperties} key={p.title}>
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sun/12 text-ember transition-colors duration-500 group-hover:bg-dawn group-hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={p.icon} /></svg>
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RECENT ACTIVITIES ============ */}
      <section className="section-tight bg-paper-deep">
        <div className="shell">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end" data-reveal="">
            <div>
              <p className="eyebrow">Latest</p>
              <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight text-ink">Recent Activities</h2>
            </div>
            <Link to={`${prefix}/media`} className="link-underline shrink-0 font-semibold text-ember">
              {dict.media.viewAll}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {samplePosts.map((post, i) => (
              <div data-reveal="" style={{ '--reveal-delay': `${i * 100}ms` } as CSSProperties} key={post.id}>
                <NewsCard post={post} locale={locale} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      <section className="section bg-paper">
        <div className="shell">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end" data-reveal="">
            <div>
              <p className="eyebrow">Gallery</p>
              <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight text-ink">Life at Sunrise</h2>
            </div>
            <Link to={`${prefix}/media`} className="btn btn-ghost shrink-0 !py-2.5 text-sm">Visit the gallery</Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {media.map((item, i) => (
              <div data-reveal="scale" style={{ '--reveal-delay': `${i * 90}ms` } as CSSProperties} key={item.title_en}>
                {item.type === 'youtube' ? (
                  <VideoCard item={item} locale={locale} />
                ) : (
                  <a href={item.url} className="card card-hover group block overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img src={item.thumbnail_url} alt={item.title_en} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    </div>
                    <p className="p-4 font-display text-base font-semibold text-ink">{mediaTitle(item)}</p>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section-tight bg-paper">
        <div className="shell">
          <div className="relative overflow-hidden rounded-[28px] bg-espresso px-8 py-14 text-paper sm:px-14" data-reveal="scale">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #F2A100, transparent 65%)' }} />
            <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight">Ready to begin?</h2>
                <p className="mt-4 max-w-xl text-paper/70">Apply online, or reach Sunrise through Messenger or Line if you need help with the form. A new day starts here.</p>
              </div>
              <Link to={`${prefix}/enroll`} className="btn btn-primary shrink-0">
                {dict.hero.enrollCTA}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MAP ============ */}
      <section className="section-tight bg-paper pt-0">
        <div className="shell" data-reveal="">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr] lg:items-center">
            <div>
              <p className="eyebrow">{dict.about.location}</p>
              <h2 className="font-display mt-4 text-3xl font-semibold text-ink">Find us in Mae Sot</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">{dict.contact.addressValue}</p>
              <Link to={`${prefix}/contact`} className="link-underline mt-5 inline-flex font-semibold text-ember">
                {dict.contact.title}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </div>
            <iframe title="Mae Sot map" src="https://maps.google.com/maps?q=Mae+Sot,Thailand&output=embed" className="h-80 w-full rounded-card border border-line shadow-warm" loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
}

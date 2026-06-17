import { type CSSProperties } from 'react';
import ContactForm from '../components/ContactForm';
import { useLocale } from '../lib/locale';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function ContactPage() {
  const { locale, dict } = useLocale();
  useDocumentMeta(`${dict.contact.title} | Sunrise GED`, 'Contact Sunrise GED in Mae Sot, Thailand.');

  return (
    <>
      <section className="relative overflow-hidden bg-paper pb-10 pt-36" style={{ background: 'linear-gradient(180deg, #FCE8CD 0%, #FBF6EE 70%)' }}>
        <div className="bloom pointer-events-none absolute -top-20 left-1/2 h-[36rem] w-[60rem] max-w-[140vw] -translate-x-1/2 opacity-60" />
        <div className="shell relative">
          <p className="eyebrow" data-reveal="">Get in touch</p>
          <h1 className="font-display mt-5 text-[clamp(2.6rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-tight text-ink" data-reveal="" style={{ '--reveal-delay': '100ms' } as CSSProperties}>{dict.contact.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft" data-reveal="" style={{ '--reveal-delay': '200ms' } as CSSProperties}>We reply within 2–3 business days. For quick questions, message us on Messenger or Line.</p>
        </div>
      </section>

      <section className="section bg-paper pt-12">
        <div className="shell grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-6" data-reveal="left">
            <div className="card p-7">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sun/12 text-ember"><svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg></span>
              <h2 className="font-display mt-5 text-2xl font-semibold text-ink">{dict.contact.address}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{dict.contact.addressValue}</p>
              <p className="mt-2 text-sm text-ink-muted">Business hours: Monday–Friday, 9:00–17:00</p>
            </div>
            <iframe title="Mae Sot map" src="https://maps.google.com/maps?q=Mae+Sot,Thailand&output=embed" className="h-72 w-full rounded-card border border-line shadow-warm" loading="lazy" />
            <div className="card p-7">
              <h2 className="font-display text-2xl font-semibold text-ink">{dict.contact.chatWithUs}</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="https://m.me/sunrisetraumahealingeducation" className="inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">{dict.contact.messenger}</a>
                <a href="https://line.me/R/ti/p/@YOUR_LINE_OFFICIAL_ID" className="inline-flex items-center gap-2 rounded-full bg-[#06C755] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">{dict.contact.line}</a>
                <a href="https://facebook.com/sunrisetraumahealingeducation" className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-semibold text-ink-soft transition hover:border-ink hover:text-ink">Facebook</a>
              </div>
            </div>
          </div>
          <div data-reveal="right">
            <ContactForm dict={dict} locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}

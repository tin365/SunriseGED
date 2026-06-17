import { useState, type CSSProperties } from 'react';
import VideoCard from '../components/VideoCard';
import { useLocale } from '../lib/locale';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

type Item = { type: string; title_en: string; title_my: string; title_th: string; thumbnail_url: string; url: string };

const items: Item[] = [
  { type: 'photo', title_en: 'Classroom learning circle', title_my: 'စာသင်ခန်း လေ့လာရေးဝိုင်း', title_th: 'วงเรียนรู้ในห้องเรียน', thumbnail_url: '/sample/classroom.svg', url: '/sample/classroom.svg' },
  { type: 'photo', title_en: 'Student activity day', title_my: 'ကျောင်းသား လှုပ်ရှားမှုနေ့', title_th: 'วันกิจกรรมนักเรียน', thumbnail_url: '/sample/activity.svg', url: '/sample/activity.svg' },
  { type: 'youtube', title_en: 'Sunrise community introduction', title_my: 'Sunrise အသိုင်းအဝိုင်း မိတ်ဆက်', title_th: 'แนะนำชุมชน Sunrise', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { type: 'document', title_en: 'Enrollment information sheet', title_my: 'ကျောင်းဝင်ခွင့် အချက်အလက်စာရွက်', title_th: 'เอกสารข้อมูลการสมัคร', thumbnail_url: '/sample/document.svg', url: '/documents/enrollment-info.pdf' }
];

const categoryOf = (item: Item) => (item.type === 'youtube' ? 'videos' : item.type === 'photo' ? 'photos' : 'documents');

export default function MediaPage() {
  const { locale, dict } = useLocale();
  useDocumentMeta(`${dict.media.title} | Sunrise GED`, 'Photos, videos, and documents from Sunrise GED.');
  const [filter, setFilter] = useState('all');

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'photos', label: dict.media.photos },
    { key: 'videos', label: dict.media.videos },
    { key: 'documents', label: dict.media.documents }
  ];
  const title = (m: Item) => ({ en: m.title_en, my: m.title_my, th: m.title_th })[locale];

  return (
    <>
      <section className="relative overflow-hidden bg-paper pb-10 pt-36" style={{ background: 'linear-gradient(180deg, #FCE8CD 0%, #FBF6EE 70%)' }}>
        <div className="bloom pointer-events-none absolute -top-20 left-1/2 h-[36rem] w-[60rem] max-w-[140vw] -translate-x-1/2 opacity-60" />
        <div className="shell relative">
          <p className="eyebrow" data-reveal="">Gallery</p>
          <h1 className="font-display mt-5 text-[clamp(2.6rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-tight text-ink" data-reveal="" style={{ '--reveal-delay': '100ms' } as CSSProperties}>{dict.media.title}</h1>
        </div>
      </section>

      <section className="section bg-paper pt-12">
        <div className="shell">
          <div className="flex flex-wrap gap-2.5" data-reveal="">
            {tabs.map((tab) => {
              const active = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={[
                    'rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-300',
                    active ? 'border-transparent bg-ink text-paper' : 'border-line-strong text-ink-soft hover:border-ink hover:text-ink'
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => {
              const category = categoryOf(item);
              const hidden = filter !== 'all' && category !== filter;
              return (
                <div key={item.title_en} className={hidden ? 'hidden' : ''} data-reveal="scale" style={{ '--reveal-delay': `${i * 80}ms` } as CSSProperties}>
                  {item.type === 'youtube' ? (
                    <VideoCard item={item} locale={locale} />
                  ) : (
                    <a href={item.url} className="card card-hover group block overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img src={item.thumbnail_url} alt={item.title_en} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      </div>
                      <div className="flex items-center justify-between p-5">
                        <p className="font-display text-lg font-semibold text-ink">{title(item)}</p>
                        <span className="text-xs font-semibold uppercase tracking-wide text-ember">{item.type === 'document' ? 'Download' : 'Open'}</span>
                      </div>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

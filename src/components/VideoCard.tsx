import type { Locale } from '../lib/i18n';

type MediaItem = Record<string, string | undefined>;

export default function VideoCard({ item, locale = 'en' }: { item: MediaItem; locale?: Locale }) {
  const title = item[`title_${locale}`] || item.title_en;
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="card card-hover group relative block overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.thumbnail_url || '/og-image.jpg'}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-paper/95 text-ember shadow-lift transition-transform duration-500 ease-dawn group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </span>
      </div>
      <p className="absolute inset-x-0 bottom-0 p-4 font-display text-base font-semibold text-paper">{title}</p>
    </a>
  );
}

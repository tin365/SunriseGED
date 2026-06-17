import { Link } from 'react-router-dom';
import type { Locale } from '../lib/i18n';

type Post = Record<string, string | undefined>;

export default function NewsCard({ post, locale = 'en' }: { post: Post; locale?: Locale }) {
  const title = post[`title_${locale}`] || post.title_en;
  const excerpt = post[`excerpt_${locale}`] || post.excerpt_en || '';
  const image = post.featured_image || '';
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-sun-soft via-paper-deep to-paper transition-transform duration-700 group-hover:scale-105" />
        )}
        <span className="absolute left-4 top-4 inline-flex rounded-full bg-paper/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-eyebrow text-ember backdrop-blur">
          {post.type}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold leading-snug text-ink">{title}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-[0.92rem] leading-relaxed text-ink-soft">{excerpt}</p>
        <Link to={`${prefix}/media`} className="link-underline mt-5 self-start text-sm font-semibold text-ember">
          Read More
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </Link>
      </div>
    </article>
  );
}

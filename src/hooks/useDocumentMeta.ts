import { useEffect } from 'react';

/**
 * Sets the document <title>, meta description, and (optionally) a noindex
 * robots tag for the current route. Replaces Astro's per-page <head> handling.
 * Pass the full title string (e.g. "About | Sunrise GED").
 */
export function useDocumentMeta(title: string, description?: string, noindex = false) {
  useEffect(() => {
    document.title = title;
    if (description !== undefined) setMeta('name', 'description', description);
    setRobots(noindex);
    return () => setRobots(false);
  }, [title, description, noindex]);
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setRobots(noindex: boolean) {
  const existing = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (noindex) {
    if (existing) existing.setAttribute('content', 'noindex, nofollow');
    else setMeta('name', 'robots', 'noindex, nofollow');
  } else if (existing) {
    existing.remove();
  }
}

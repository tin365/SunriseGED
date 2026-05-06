import { createId } from './jwt';

export function mediaKey(filename: string) {
  const now = new Date();
  const safe = filename.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return `media/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${createId()}/${safe || 'file'}`;
}

export function publicMediaUrl(base: string | undefined, key: string) {
  const cleanBase = (base || 'https://sunrisegeded.org').replace(/\/$/, '');
  return `${cleanBase}/${key}`;
}

export function extractYoutubeId(url: string) {
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

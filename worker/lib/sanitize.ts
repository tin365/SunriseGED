export function stripTags(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
  if (Array.isArray(value)) return value.map(stripTags);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, stripTags(val)]));
  }
  return value;
}

export function cleanString(value: unknown): string {
  return String(stripTags(value ?? ''));
}

export function safeJson(value: unknown): string {
  return JSON.stringify(stripTags(value));
}

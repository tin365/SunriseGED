CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  totp_secret TEXT,
  totp_enabled INTEGER DEFAULT 0,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK(role IN ('super_admin', 'editor', 'viewer')),
  name TEXT NOT NULL,
  failed_login_count INTEGER DEFAULT 0,
  locked_until TEXT,
  must_change_password INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  last_login TEXT,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS enrollments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  full_name TEXT NOT NULL,
  burmese_name TEXT,
  date_of_birth TEXT NOT NULL,
  gender TEXT NOT NULL,
  nationality TEXT DEFAULT 'Myanmar',
  phone TEXT,
  email TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  address TEXT,
  previous_education TEXT,
  english_level TEXT,
  heard_from TEXT,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'waitlist')),
  notes TEXT,
  submitted_at TEXT DEFAULT (datetime('now')),
  reviewed_at TEXT,
  reviewed_by TEXT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title_en TEXT NOT NULL,
  title_my TEXT,
  title_th TEXT,
  body_en TEXT NOT NULL,
  body_my TEXT,
  body_th TEXT,
  excerpt_en TEXT,
  excerpt_my TEXT,
  excerpt_th TEXT,
  type TEXT DEFAULT 'news' CHECK(type IN ('news', 'activity', 'announcement', 'achievement')),
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
  featured_image TEXT,
  author_id TEXT REFERENCES users(id),
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  type TEXT NOT NULL CHECK(type IN ('photo', 'document', 'youtube')),
  title_en TEXT NOT NULL,
  title_my TEXT,
  title_th TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  youtube_id TEXT,
  r2_key TEXT,
  file_size INTEGER,
  uploaded_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details TEXT,
  ip TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT REFERENCES users(id),
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER DEFAULT 1,
  window_start TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status, published_at);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status, submitted_at);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type, created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id, created_at);

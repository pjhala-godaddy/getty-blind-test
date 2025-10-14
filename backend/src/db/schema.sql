-- This or That A/B Testing Database Schema (SQLite)

-- Test Sessions Table
CREATE TABLE IF NOT EXISTS test_sessions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  created_by TEXT NOT NULL
);

-- Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  session_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  content_style TEXT,
  writing_style TEXT,
  image_url_a TEXT NOT NULL,
  image_url_b TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES test_sessions(id) ON DELETE CASCADE,
  UNIQUE(session_id, order_index)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  business_id TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  selected_option TEXT NOT NULL CHECK (selected_option IN ('A', 'B')),
  comment_a TEXT,
  comment_b TEXT,
  time_spent_ms INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  UNIQUE(business_id, reviewer_name)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_businesses_session_id ON businesses(session_id);
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_name ON reviews(reviewer_name);

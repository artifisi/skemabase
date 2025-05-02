-- Migration: 20250502T161152_add_email.js
ALTER TABLE user ADD COLUMN email TEXT;

-- Migration: 20250502T161152_initial.js
CREATE TABLE user (
  id SERIAL PRIMARY KEY,
  id TEXT,
  name TEXT
);
CREATE TABLE post (
  id SERIAL PRIMARY KEY,
  id TEXT,
  title TEXT
);
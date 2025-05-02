-- Migration: 20250502T161152_initial.js
DROP TABLE user;
DROP TABLE post;

-- Migration: 20250502T161152_add_email.js
ALTER TABLE user DROP COLUMN email;
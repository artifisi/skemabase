CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  published_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'draft',
  user_id INTEGER NOT NULL REFERENCES users(id)
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT,
  created_at TIMESTAMP,
  post_id INTEGER NOT NULL REFERENCES posts(id),
  user_id INTEGER NOT NULL REFERENCES users(id)
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE
);

CREATE TABLE posts_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id),
  tag_id INTEGER NOT NULL REFERENCES tags(id),
  PRIMARY KEY(post_id, tag_id)
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50)
);

CREATE TABLE roles_users (
  role_id INTEGER NOT NULL REFERENCES roles(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  PRIMARY KEY(role_id, user_id)
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  change TEXT,
  changed_at TIMESTAMP DEFAULT now(),
  user_id INTEGER NOT NULL REFERENCES users(id)
);

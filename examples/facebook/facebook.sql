CREATE TABLE user (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  joined_at TIMESTAMP DEFAULT now()
);

CREATE TABLE profile (
  id SERIAL PRIMARY KEY,
  bio TEXT,
  avatar_url TEXT,
  user_id INTEGER REFERENCES user(id) UNIQUE
);

CREATE TABLE group (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE post (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  posted_at TIMESTAMP DEFAULT now(),
  user_id INTEGER REFERENCES user(id)
);

CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  body TEXT NOT NULL,
  commented_at TIMESTAMP DEFAULT now(),
  user_id INTEGER REFERENCES user(id),
  post_id INTEGER REFERENCES post(id)
);

CREATE TABLE like (
  id SERIAL PRIMARY KEY,
  liked_at TIMESTAMP DEFAULT now(),
  user_id INTEGER REFERENCES user(id),
  post_id INTEGER REFERENCES post(id)
);

CREATE TABLE group_user (
  group_id INTEGER REFERENCES group(id),
  user_id INTEGER REFERENCES user(id),
  PRIMARY KEY (group_id, user_id)
);
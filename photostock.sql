CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  avatar_url VARCHAR(255) NOT NULL UNIQUE,
  role_id INTEGER NOT NULL REFERENCES roles(id) DEFAULT 1
);

CREATE TABLE tokens (
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
  token VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(100) NOT NULL,
  url_webp_preview VARCHAR(255) NOT NULL UNIQUE,
  url_webp_full VARCHAR(255) NOT NULL UNIQUE,
  url_full VARCHAR(255) NOT NULL UNIQUE,
  url_medium VARCHAR(255) NOT NULL UNIQUE,
  url_small VARCHAR(255) NOT NULL UNIQUE,
  size_full VARCHAR(20) NOT NULL,
  size_medium VARCHAR(20) NOT NULL,
  size_small VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE image_categories (
  image_id INTEGER NOT NULL REFERENCES images(id),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  PRIMARY KEY (image_id, category_id)
);

CREATE TABLE image_tags (
  image_id INTEGER NOT NULL REFERENCES images(id),
  tag_id INTEGER NOT NULL REFERENCES tags(id),
  PRIMARY KEY (image_id, tag_id)
);

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  image_id INTEGER NOT NULL REFERENCES images(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

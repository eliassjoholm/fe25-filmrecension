-- Creates the FilmRecension database from scratch.
-- Running it again removes the old database and all of its data.
DROP DATABASE IF EXISTS filmrecension_db;
CREATE DATABASE filmrecension_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE filmrecension_db;

-- Accounts. Only the bcrypt hash is stored, never the real password.
CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT,
  email         VARCHAR(255) NOT NULL,
  password_hash CHAR(60)     NOT NULL,  -- a bcrypt hash is always 60 characters
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT uq_users_email UNIQUE (email)
);

-- Movies are sample data only; there is no admin route for them.
CREATE TABLE movies (
  id           INT UNSIGNED AUTO_INCREMENT,
  title        VARCHAR(200)      NOT NULL,
  director     VARCHAR(120)      NOT NULL,
  genre        VARCHAR(60)       NOT NULL,
  release_year SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (id)
);

-- Decision: a user can review a movie only once (uq_reviews_user_movie).
-- To change their opinion they edit the review instead of writing a new one.
CREATE TABLE reviews (
  id         INT UNSIGNED     AUTO_INCREMENT,
  user_id    INT UNSIGNED     NOT NULL,
  movie_id   INT UNSIGNED     NOT NULL,
  rating     TINYINT UNSIGNED NOT NULL,
  comment    VARCHAR(1000)    NOT NULL,
  created_at DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT chk_reviews_rating    CHECK (rating BETWEEN 1 AND 10),
  CONSTRAINT uq_reviews_user_movie UNIQUE (user_id, movie_id),
  CONSTRAINT fk_reviews_user  FOREIGN KEY (user_id)  REFERENCES users (id)  ON DELETE CASCADE,
  CONSTRAINT fk_reviews_movie FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
);

-- Decision: the same movie can be saved only once per user (uq_watchlist_user_movie).
CREATE TABLE watchlist (
  id       INT UNSIGNED AUTO_INCREMENT,
  user_id  INT UNSIGNED NOT NULL,
  movie_id INT UNSIGNED NOT NULL,
  added_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT uq_watchlist_user_movie UNIQUE (user_id, movie_id),
  CONSTRAINT fk_watchlist_user  FOREIGN KEY (user_id)  REFERENCES users (id)  ON DELETE CASCADE,
  CONSTRAINT fk_watchlist_movie FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
);

-- Sample movies. Users are created through POST /api/auth/register
-- so that their passwords get hashed by the API.
INSERT INTO movies (title, director, genre, release_year) VALUES
  ('Interstellar',  'Christopher Nolan',              'Sci-Fi',    2014),
  ('The Godfather', 'Francis Ford Coppola',           'Crime',     1972),
  ('Get Out',       'Jordan Peele',                   'Horror',    2017),
  ('Toy Story',     'John Lasseter',                  'Animation', 1995),
  ('Pulp Fiction',  'Quentin Tarantino',              'Crime',     1994),
  ('The Matrix',    'Lana Wachowski, Lilly Wachowski', 'Sci-Fi',   1999);

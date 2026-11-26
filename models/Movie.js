const { query } = require('../db');

// Every movie together with its average rating and number of reviews.
// LEFT JOIN keeps movies that don't have any reviews yet.
const SELECT_WITH_STATS = `
  SELECT m.id, m.title, m.director, m.genre, m.release_year,
         ROUND(AVG(r.rating), 1) AS average_rating,
         COUNT(r.id)             AS review_count
  FROM movies m
  LEFT JOIN reviews r ON r.movie_id = m.id`;

class Movie {
  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.director = row.director;
    this.genre = row.genre;
    this.year = row.release_year;
    this.averageRating = row.average_rating === null ? null : Number(row.average_rating);
    this.reviewCount = Number(row.review_count);
  }

  // search = part of the title, genre = exact genre (upper/lower case doesn't matter).
  // Only fixed SQL pieces are joined together; the user's text always goes in params.
  static async findAll({ search, genre } = {}) {
    const conditions = [];
    const params = [];
    if (search) {
      conditions.push('m.title LIKE ?');
      params.push(`%${search}%`);
    }
    if (genre) {
      conditions.push('m.genre = ?');
      params.push(genre);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = await query(
      `${SELECT_WITH_STATS} ${where} GROUP BY m.id ORDER BY m.release_year DESC, m.title`,
      params
    );
    return rows.map((row) => new Movie(row));
  }

  static async findById(id) {
    const rows = await query(`${SELECT_WITH_STATS} WHERE m.id = ? GROUP BY m.id`, [id]);
    return rows.length ? new Movie(rows[0]) : null;
  }

  // Cheaper check used before saving reviews and watchlist rows
  static async exists(id) {
    const rows = await query('SELECT 1 FROM movies WHERE id = ?', [id]);
    return rows.length > 0;
  }
}

module.exports = Movie;

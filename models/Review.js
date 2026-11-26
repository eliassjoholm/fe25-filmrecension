const { query } = require('../db');

const COLUMNS = 'id, movie_id, user_id, rating, comment, created_at, updated_at';

class Review {
  constructor(row) {
    this.id = row.id;
    this.movieId = row.movie_id;
    this.userId = row.user_id;
    this.rating = row.rating;
    this.comment = row.comment;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }

  static async forMovie(movieId) {
    const rows = await query(
      `SELECT ${COLUMNS} FROM reviews WHERE movie_id = ? ORDER BY updated_at DESC`,
      [movieId]
    );
    return rows.map((row) => new Review(row));
  }

  static async findById(id) {
    const rows = await query(`SELECT ${COLUMNS} FROM reviews WHERE id = ?`, [id]);
    return rows.length ? new Review(rows[0]) : null;
  }

  // Used to stop a second review of the same movie by the same user
  static async findByUserAndMovie(userId, movieId) {
    const rows = await query(
      `SELECT ${COLUMNS} FROM reviews WHERE user_id = ? AND movie_id = ?`,
      [userId, movieId]
    );
    return rows.length ? new Review(rows[0]) : null;
  }

  static async create({ userId, movieId, rating, comment }) {
    const result = await query(
      'INSERT INTO reviews (user_id, movie_id, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, movieId, rating, comment]
    );
    return Review.findById(result.insertId);
  }

  // Instance methods work on this one review
  belongsTo(userId) {
    return this.userId === userId;
  }

  async update({ rating, comment }) {
    await query('UPDATE reviews SET rating = ?, comment = ? WHERE id = ?', [rating, comment, this.id]);
    const fresh = await Review.findById(this.id); // reload to get the new updated_at
    Object.assign(this, fresh);
  }

  async delete() {
    await query('DELETE FROM reviews WHERE id = ?', [this.id]);
  }
}

module.exports = Review;

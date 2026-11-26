const { query } = require('../db');

// A Watchlist object always belongs to ONE user. Every query below
// filters on this.userId, so it can never read or change another user's list.
class Watchlist {
  constructor(userId) {
    this.userId = userId;
  }

  async items() {
    const rows = await query(
      `SELECT m.id, m.title, m.director, m.genre, m.release_year, w.added_at
       FROM watchlist w
       INNER JOIN movies m ON m.id = w.movie_id
       WHERE w.user_id = ?
       ORDER BY w.added_at DESC, w.id DESC`,
      [this.userId]
    );
    return rows.map((row) => ({
      movieId: row.id,
      title: row.title,
      director: row.director,
      genre: row.genre,
      year: row.release_year,
      addedAt: row.added_at,
    }));
  }

  async contains(movieId) {
    const rows = await query(
      'SELECT 1 FROM watchlist WHERE user_id = ? AND movie_id = ?',
      [this.userId, movieId]
    );
    return rows.length > 0;
  }

  async add(movieId) {
    await query('INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)', [this.userId, movieId]);
  }

  // true if a row was removed, false if the movie wasn't on the list
  async remove(movieId) {
    const result = await query(
      'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?',
      [this.userId, movieId]
    );
    return result.affectedRows === 1;
  }
}

module.exports = Watchlist;

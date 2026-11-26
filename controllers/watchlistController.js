const Movie = require('../models/Movie');
const Watchlist = require('../models/Watchlist');
const HttpError = require('../utils/HttpError');

// GET /api/watchlist
async function getWatchlist(req, res) {
  const list = new Watchlist(req.userId);
  res.json(await list.items());
}

// POST /api/watchlist/:movieId
async function addMovie(req, res) {
  const { movieId } = req.ids;
  if (!(await Movie.exists(movieId))) {
    throw new HttpError(404, 'Movie not found');
  }
  const list = new Watchlist(req.userId);
  // Rule: a movie can only be on your watchlist once
  if (await list.contains(movieId)) {
    throw new HttpError(409, 'This movie is already on your watchlist');
  }
  await list.add(movieId);
  res.status(201).json({ message: 'Added to your watchlist', movieId });
}

// DELETE /api/watchlist/:movieId
async function removeMovie(req, res) {
  const { movieId } = req.ids;
  const removed = await new Watchlist(req.userId).remove(movieId);
  if (!removed) {
    throw new HttpError(404, 'This movie is not on your watchlist');
  }
  res.json({ message: 'Removed from your watchlist', movieId });
}

module.exports = { getWatchlist, addMovie, removeMovie };

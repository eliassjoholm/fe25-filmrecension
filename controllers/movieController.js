const Movie = require('../models/Movie');
const HttpError = require('../utils/HttpError');

// GET /api/movies?search=&genre=
async function listMovies(req, res) {
  const search = req.query.search?.trim();
  const genre = req.query.genre?.trim();
  const movies = await Movie.findAll({ search, genre });
  res.json(movies);
}

// GET /api/movies/:movieId
async function getMovie(req, res) {
  const movie = await Movie.findById(req.ids.movieId);
  if (!movie) {
    throw new HttpError(404, 'Movie not found');
  }
  res.json(movie);
}

module.exports = { listMovies, getMovie };

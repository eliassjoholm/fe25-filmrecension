const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { checkId, checkMovieQuery } = require('../middleware/validators');
const movies = require('../controllers/movieController');

const router = express.Router();

// Public routes: no login needed
router.get('/', checkMovieQuery, asyncHandler(movies.listMovies));
router.get('/:movieId', checkId('movieId', 'Movie'), asyncHandler(movies.getMovie));

module.exports = router;

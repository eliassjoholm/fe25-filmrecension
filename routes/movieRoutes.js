const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middleware/authenticate');
const { checkId, checkMovieQuery, checkReview } = require('../middleware/validators');
const movies = require('../controllers/movieController');
const reviews = require('../controllers/reviewController');

const router = express.Router();
const movieId = checkId('movieId', 'Movie');

// Public routes: no login needed
router.get('/', checkMovieQuery, asyncHandler(movies.listMovies));
router.get('/:movieId', movieId, asyncHandler(movies.getMovie));
router.get('/:movieId/reviews', movieId, asyncHandler(reviews.listForMovie));

// Writing a review needs a login
router.post('/:movieId/reviews', authenticate, movieId, checkReview, asyncHandler(reviews.createReview));

module.exports = router;

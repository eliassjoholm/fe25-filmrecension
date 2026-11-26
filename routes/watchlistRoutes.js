const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { checkId } = require('../middleware/validators');
const watchlist = require('../controllers/watchlistController');

// Login is checked in server.js, where this router is mounted
const router = express.Router();
const movieId = checkId('movieId', 'Movie');

router.get('/', asyncHandler(watchlist.getWatchlist));
router.post('/:movieId', movieId, asyncHandler(watchlist.addMovie));
router.delete('/:movieId', movieId, asyncHandler(watchlist.removeMovie));

module.exports = router;

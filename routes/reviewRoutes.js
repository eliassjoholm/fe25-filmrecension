const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middleware/authenticate');
const { checkId, checkReview } = require('../middleware/validators');
const reviews = require('../controllers/reviewController');

// Mounted on /api/reviews. Both routes are owner-only, so both need a login.
const router = express.Router();
const reviewId = checkId('reviewId', 'Review');

router.put('/:reviewId', authenticate, reviewId, checkReview, asyncHandler(reviews.updateReview));
router.delete('/:reviewId', authenticate, reviewId, asyncHandler(reviews.deleteReview));

module.exports = router;

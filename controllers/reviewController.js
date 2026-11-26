const Movie = require('../models/Movie');
const Review = require('../models/Review');
const HttpError = require('../utils/HttpError');

// GET /api/movies/:movieId/reviews
async function listForMovie(req, res) {
  const { movieId } = req.ids;
  if (!(await Movie.exists(movieId))) {
    throw new HttpError(404, 'Movie not found');
  }
  res.json(await Review.forMovie(movieId));
}

// POST /api/movies/:movieId/reviews
async function createReview(req, res) {
  const { movieId } = req.ids;
  if (!(await Movie.exists(movieId))) {
    throw new HttpError(404, 'Movie not found');
  }
  if (await Review.findByUserAndMovie(req.userId, movieId)) {
    throw new HttpError(409, 'You already reviewed this movie. Use PUT /api/reviews/:id to change it.');
  }
  // userId comes from the verified token (req.userId), never from the body
  const review = await Review.create({ userId: req.userId, movieId, ...req.body });
  res.status(201).json(review);
}

// Shared by edit and delete: the review must exist and belong to the logged-in user
async function findOwnReview(req) {
  const review = await Review.findById(req.ids.reviewId);
  if (!review) {
    throw new HttpError(404, 'Review not found');
  }
  if (!review.belongsTo(req.userId)) {
    // 403: we know who you are, but this review is someone else's
    throw new HttpError(403, 'This review belongs to another user');
  }
  return review;
}

// PUT /api/reviews/:reviewId
async function updateReview(req, res) {
  const review = await findOwnReview(req);
  await review.update(req.body);
  res.json(review);
}

// DELETE /api/reviews/:reviewId
async function deleteReview(req, res) {
  const review = await findOwnReview(req);
  await review.delete();
  res.json({ message: 'Review deleted', id: review.id });
}

module.exports = { listForMovie, createReview, updateReview, deleteReview };

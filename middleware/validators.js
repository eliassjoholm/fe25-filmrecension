const HttpError = require('../utils/HttpError');

// Checks that a URL parameter is a positive whole number, e.g. /movies/3.
// The number is saved on req.ids so the controller doesn't parse it again.
function checkId(param, label) {
  return (req, res, next) => {
    const value = Number(req.params[param]);
    if (!Number.isInteger(value) || value < 1) {
      return next(new HttpError(400, `${label} id must be a positive whole number`));
    }
    req.ids = { ...req.ids, [param]: value };
    next();
  };
}

// ?search= and ?genre= are optional, but must be one short piece of text
function checkMovieQuery(req, res, next) {
  for (const key of ['search', 'genre']) {
    const value = req.query[key];
    if (value === undefined) continue;
    if (typeof value !== 'string' || value.trim().length > 100) {
      return next(new HttpError(400, `${key} must be a text of at most 100 characters`));
    }
  }
  next();
}

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Emails are stored trimmed and in lower case, so "Anna@Test.com " = "anna@test.com"
function cleanEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function checkRegister(req, res, next) {
  const email = cleanEmail(req.body.email);
  const { password } = req.body;
  if (!EMAIL_FORMAT.test(email)) {
    return next(new HttpError(400, 'Please enter a valid email address'));
  }
  // bcrypt only reads the first 72 bytes, so longer passwords are refused
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) {
    return next(new HttpError(400, 'Password must be between 8 and 72 characters'));
  }
  req.body = { email, password };
  next();
}

function checkLogin(req, res, next) {
  const email = cleanEmail(req.body.email);
  const { password } = req.body;
  if (!email || typeof password !== 'string' || !password) {
    return next(new HttpError(400, 'Email and password are both required'));
  }
  req.body = { email, password };
  next();
}

// Used for both creating and editing a review (PUT always sends the whole review)
function checkReview(req, res, next) {
  const { rating, comment } = req.body;
  if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
    return next(new HttpError(400, 'Rating must be a whole number between 1 and 10'));
  }
  const text = typeof comment === 'string' ? comment.trim() : '';
  if (!text) {
    return next(new HttpError(400, 'Comment cannot be empty'));
  }
  if (text.length > 1000) {
    return next(new HttpError(400, 'Comment is too long (max 1000 characters)'));
  }
  req.body = { rating, comment: text };
  next();
}

module.exports = { checkId, checkMovieQuery, checkRegister, checkLogin, checkReview };

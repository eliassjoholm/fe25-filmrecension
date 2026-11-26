const jwt = require('jsonwebtoken');
const HttpError = require('../utils/HttpError');

// Protects a route. Reads "Authorization: Bearer <token>", checks the
// signature with JWT_SECRET and saves the user's id on req.userId.
// The id comes from inside the signed token, so the client can't change it.
function authenticate(req, res, next) {
  const header = req.get('Authorization') || '';
  if (!header.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Please log in: Bearer token missing'));
  }
  const token = header.slice('Bearer '.length).trim();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.userId = Number(payload.sub);
    next();
  } catch {
    next(new HttpError(401, 'Your token is invalid or has expired'));
  }
}

module.exports = authenticate;

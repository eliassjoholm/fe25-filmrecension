const User = require('../models/User');
const HttpError = require('../utils/HttpError');

// POST /api/auth/register
async function register(req, res) {
  const { email, password } = req.body;
  if (await User.emailTaken(email)) {
    throw new HttpError(409, 'That email is already registered');
  }
  const user = await User.register(email, password);
  res.status(201).json(user);
}

// POST /api/auth/login
async function login(req, res) {
  const user = await User.checkPassword(req.body.email, req.body.password);
  if (!user) {
    // Same answer for an unknown email and a wrong password,
    // so nobody can use login to find out which emails exist
    throw new HttpError(401, 'Wrong email or password');
  }
  res.json({ token: user.createToken(), user });
}

// GET /api/auth/me – who does this token belong to?
async function me(req, res) {
  const user = await User.findById(req.userId);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }
  res.json(user);
}

module.exports = { register, login, me };

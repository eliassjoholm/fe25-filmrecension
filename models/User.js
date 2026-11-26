const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../db');

const HASH_ROUNDS = 12; // more rounds = slower to hash = harder to brute-force

class User {
  // The password hash is never copied onto the object,
  // so it can't end up in a JSON response by mistake.
  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.memberSince = row.created_at;
  }

  static async emailTaken(email) {
    const rows = await query('SELECT id FROM users WHERE email = ?', [email]);
    return rows.length > 0;
  }

  static async register(email, password) {
    const hash = await bcrypt.hash(password, HASH_ROUNDS);
    const result = await query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, hash]
    );
    return User.findById(result.insertId);
  }

  static async findById(id) {
    const rows = await query('SELECT id, email, created_at FROM users WHERE id = ?', [id]);
    return rows.length ? new User(rows[0]) : null;
  }

  // Returns the user if the password matches the stored hash, otherwise null
  static async checkPassword(email, password) {
    const rows = await query(
      'SELECT id, email, password_hash, created_at FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) return null;
    const correct = await bcrypt.compare(password, rows[0].password_hash);
    return correct ? new User(rows[0]) : null;
  }

  // A signed token that says "this is user <id>".
  // "sub" (subject) is the standard JWT field for who the token belongs to.
  createToken() {
    return jwt.sign({}, process.env.JWT_SECRET, {
      subject: String(this.id),
      expiresIn: process.env.JWT_EXPIRES_IN || '2h',
      algorithm: 'HS256',
    });
  }
}

module.exports = User;

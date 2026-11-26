const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middleware/authenticate');
const { checkRegister, checkLogin } = require('../middleware/validators');
const auth = require('../controllers/authController');

const router = express.Router();

router.post('/register', checkRegister, asyncHandler(auth.register));
router.post('/login', checkLogin, asyncHandler(auth.login));
router.get('/me', authenticate, asyncHandler(auth.me));

module.exports = router;

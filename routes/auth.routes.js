const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');


const router = express.Router();

router.post('/register', [
  body('username', 'Please provide a username').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], validate, register);

router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], validate, login);
router.get('/me', protect, getMe);

module.exports = router;

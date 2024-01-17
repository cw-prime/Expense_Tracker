const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');
const Token = require('../models/Token');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

router.post('/register', [
  body('username', 'Username is required').not().isEmpty(),
  body('email', 'Please enter a valid email').isEmail(),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = new User({
      username,
      email,
      password
    });
    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', [
  body('email', 'Email is required').isEmail(),
  body('password', 'Password is required').exists()
], (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (!user) res.status(401).json({ msg: 'No User Exists' });
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.status(200).json({ msg: 'Login successful', user: req.user });
            });
        }
    })(req, res, next);
});

router.get('/login-success', (req, res) => {
  res.json({ msg: 'Login successful', user: req.user });
});

router.get('/logout', (req, res, next) => {
  req.logout(function(err) { if (err) { return next(err); } res.json( { message: 'Logged out' } ); });
  res.status(200).json({ msg: 'Logged out successfully' });
});

router.post('/forgot-password', [
  body('email').isEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ errors: [{ msg: 'User does not exist' }] });
  }
  let token = new Token({
    user: user._id,
    token: crypto.randomBytes(32).toString('hex')
  });
  await token.save();
  const resetLink = `${req.protocol}://${req.get('host')}/api/users/reset-password/${token.token}`;
  // Nodemailer logic goes here
  res.status(200).json({ msg: 'Password reset link sent to email', link: resetLink });
});

router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { password } = req.body;
  const { token } = req.params;
  const passwordResetToken = await Token.findOne({ token });
  if (!passwordResetToken) {
    return res.status(400).json({ errors: [{ msg: 'Invalid or expired password reset token' }] });
  }
  const user = await User.findById(passwordResetToken.user);
  if (!user) {
    return res.status(400).json({ errors: [{ msg: 'User does not exist' }] });
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();
  await passwordResetToken.remove();
  res.status(200).json({ msg: 'Password reset successfully' });
});

module.exports = router;

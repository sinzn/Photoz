const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/register', (_, res) => res.render('register'));
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hash });
  res.redirect('/login');
});

router.get('/login', (_, res) => res.render('login'));
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid credentials');
  }
});

router.get('/reset', (_, res) => res.render('reset'));
router.post('/reset', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate({ email }, { password: hash });
  res.send('Password reset successful. <a href="/login">Login</a>');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

mongoose.connect(process.env.MONGO_URI);

app.set('view engine', 'ejs');

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');

app.use('/', authRoutes);
app.use('/', (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  next();
}, fileRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});

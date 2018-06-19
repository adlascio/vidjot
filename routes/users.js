const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Load User Model
require('../models/User');
const User = mongoose.model('users');

// User Login Route
router.get('/login', (request, response) => {
  response.render('users/login');
});

// User Register Route
router.get('/register', (request, response) => {
  response.render('users/register');
});

//Login form POST
router.post('/login', (request, response, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(request, response, next);
});

// Register form POST
router.post('/register', (request, response) => {
  let errors = [];

  if (request.body.password !== request.body.password2) {
    errors.push({ text: 'Passwords do not match.' });
  }

  if (request.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters.' });
  }

  if (errors.length > 0) {
    response.render('users/register', {
      errors: errors,
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      password2: request.body.password2
    });
  } else {
    User.findOne({ email: request.body.email })
      .then(user => {
        if (user) {
          request.flash('error_msg', 'Email already registered.');
          response.redirect('/users/register');
        } else {
          const newUser = new User({
            name: request.body.name,
            email: request.body.email,
            password: request.body.password
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  request.flash('success_msg', 'You are now registered and can log in.');
                  response.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });

            });
          });
        }
      });
  }
});

// Logout User
router.get('/logout', (request, response) => {
  request.logout();
  request.flash('success_msg', 'You are logged out.');
  response.redirect('users/login');
});

module.exports = router;
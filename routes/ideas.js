const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Idea Index Page
router.get('/', ensureAuthenticated, (request, response) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(ideas => {
      response.render('ideas/index', {
        ideas: ideas
      });
    });
});

//Add Idea Route
router.get('/add', ensureAuthenticated, (request, response) => {
  response.render('ideas/add');
});

//Edit Idea Route
router.get('/edit/:id', ensureAuthenticated, (request, response) => {
  Idea.findOne({
    _id: request.params.id
  })
    .then(idea => {
      response.render('ideas/edit', {
        idea: idea
      });
    });
});

//Process Form
router.post('/', ensureAuthenticated, (request, response) => {
  let errors = [];
  const title = request.body.title;
  const details = request.body.details;

  if (!title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!details) {
    errors.push({ text: 'Please add some details' });
  }

  if (errors.length > 0) {
    response.render('ideas/add', {
      errors: errors,
      title: title,
      details: details
    });
  } else {
    const newUser = {
      title: title,
      details: details,
      user: request.user.id
    };
    new Idea(newUser)
      .save()
      .then(idea => {
        request.flash('success_msg', 'Video idea added');
        response.redirect('/ideas');
      });
  }
});

//Edit form process
router.put('/:id', ensureAuthenticated, (request, response) => {
  Idea.findOne({
    _id: request.params.id
  })
    .then(idea => {
      idea.title = request.body.title;
      idea.details = request.body.details;

      idea.save()
        .then(idea => {
          request.flash('success_msg', 'Video idea updated');
          response.redirect('/ideas');
        });
    });
});

//Delete Idea
router.delete('/:id', ensureAuthenticated, (request, response) => {
  Idea.remove({ _id: request.params.id })
    .then(() => {
      request.flash('success_msg', 'Video idea removed');
      response.redirect('/ideas');
    });
});

module.exports = router;
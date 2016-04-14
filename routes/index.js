var express = require('express');
var router = express.Router();

module.exports = function(passport) {

  /* GET login page. */
  router.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/ccdanalyzer')
    }
    res.render('index', {message: req.flash('message')});
  });

  /* Handle login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/ccdanalyzer',
    failureRedirect: '/',
    failureFlash: true
  }));

  /* GET Registration Page */
  //router.get('/signup', function(req, res) {
  //  res.render('register', {message: req.flash('message')});
  //});

  /* Handle Registration POST */
  //router.post('/signup', passport.authenticate('signup', {
  //  successRedirect: '/home',
  //  failureRedirect: '/signup',
  //  failureFlash: true
  //}));

  /* Logout */
  router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
}

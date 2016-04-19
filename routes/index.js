var express = require('express');
var router = express.Router();

module.exports = function(passport) {

  /* GET login page. */
  router.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      res.render('myapps', {access: req.user.access});
    } else {
      res.render('login', {message: req.flash('message')});
    }
  });

  /* Handle login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
  }));

  /* GET Registration Page */
  router.get('/signup', function(req, res) {
    res.render('register', {message: req.flash('message')});
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/myapps',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  /* Logout */
  router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
}

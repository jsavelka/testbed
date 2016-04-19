var express = require('express');
var https = require('https');
var StringDecoder = require('string_decoder').StringDecoder;

var utils = require('../utils');

var router = express.Router();

router.get('/',
    utils.isAuthenticated,
    utils.isAuthorized,
    function(req, res) {
  res.status(200)
     .render('usslinterpret', {results: [], urls: [], query: ''});
});

router.post('/',
    utils.isAuthenticated,
    utils.isAuthorized,
    function(req, res) {

  var options = {
    method: 'GET',
    host: 'www.courtlistener.com',
    path: '/api/rest/v3/search/?q="' + req.body.query.replace(/ /g, '+') + '"',
    Authorization: 'Token c8195c3d4348cf69554e87e559a9e95ed5e54d83',
    accept: 'application/json'
  }

  https.request(options, function(response) {
    var json = '';
    var decoder = new StringDecoder('utf8');
    response.on('data', function(data) {
      json += decoder.write(data);
    });
    response.on('end', function() {
      var results = JSON.parse(json).results;
      var listing = [];
      var urls = [];
      for (var i=0; i<results.length; i++) {
        listing.push(results[i].caseName);
        urls.push('https://www.courtlistener.com' + results[i].absolute_url);
      }
      res.status(200)
         .render('usslinterpret', {results: listing, urls: urls, query: req.body.query});
    });
  }).end();


});

function processResult(result) {
  var processedResult = {
    title: result.caseName,
    url: 'https://www.courtlistener.com' + result.absolute_url,
    sentences: []
  }

  var options = {
    method: 'GET',
    host: 'www.courtlistener.com',
    path: processedResult.url,
    Authorization: 'Token c8195c3d4348cf69554e87e559a9e95ed5e54d83',
    accept: 'application/json'
  }

  https.request(options, function(response) {
    var json = '';
    var decoder = new StringDecoder('utf8');
    response.on('data', function(data) {
      json += decoder.write(data);
    });
    response.on('end', function() {
      console.log(json);
    });
  }).end();


}

module.exports = router;

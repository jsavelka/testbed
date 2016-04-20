var express = require('express');
var https = require('https');
var request = require('request');
var StringDecoder = require('string_decoder').StringDecoder;
var openNLP = require('opennlp');

var utils = require('../utils');

var router = express.Router();
var sentenceDetector = new openNLP().sentenceDetector;

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
      var decisions = [];
      var numPending = results.length;
      results.forEach(function(result) {
        decisions.push({
          title: result.caseName,
          url: 'https://www.courtlistener.com' + result.absolute_url,
          sentences: []
        });
        numPending--;
        if (numPending === 0) {
          generateSentences(decisions, req, res);
        }
      })
    });
  }).end();
});

function generateSentences(decisions, req, res) {
  var numPending = decisions.length;
  var regexpQuery = new RegExp(req.body.query);
  decisions.forEach(function(decision) {
    request(decision.url).pipe(request.put("http://localhost:9998/tika", function(error, resp, body) {
      sentenceDetector.sentDetect(body, function(err, sentences) {
        decision.sentences = sentences.filter(function(value) {
          if (value.match(regexpQuery) !== null) {
            return true;
          } else {
            return false;}
        });
        numPending--;
        if (numPending === 0) {
          res.status(200)
             .render('usslinterpret', {decisions: decisions, query: req.body.query});
        }
      });
    }));

  });
}

module.exports = router;

var express = require('express');
var multer = require('multer');
var fs = require('fs');
var request = require('request');

var utils = require('../utils');

var router = express.Router();
var storage = multer.diskStorage({
  dest: 'uploads/',
  limits: {fileSize: 5*1024*1024},
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage});

router.get('/',
    utils.isAuthenticated,
    utils.isAuthorized,
    function(req, res, next) {
  res.status(200)
     .render('ccdanalyzer', {analyzedText: ''});
});

router.post('/',
  utils.isAuthenticated,
  utils.isAuthorized,
  upload.single('file1'),
  function(req, res) {
    var stream = fs.createReadStream(req.file.path);
    stream.on('open', function() {
      stream.pipe(request.put("http://localhost:9998/tika", function(err, response, body) {
        try {
          body = body.replace(/((EC|NCN|NCSN|NCU|ND|NODN,NON|NTDN|NTN|EAN|OPJN|CPJN|TCNU|TCU|TVNO|TZN|ZP|\d+)\s*[a-zA-Z]{1,4}\s*\d+\/\d+)/g, '<font style="background-color: yellow">$1</font>');
          body = body.replace(/(((Pl)|I|II|III|IV)\.\s* ÚS(-st\.){0,1}\s*\d+\/\d+)/g, '<font style="background-color: yellow">$1</font>');
          res.status(200)
            .render('ccdanalyzer', {analyzedText: body});
        } catch(err) {
          res.render('ccdanalyzer', {analyzedText: 'Sorry, the file cannot be transformed to a plain text. If possible, please, save the file in different format (e.g., MS Word docx) and try again.'});
        } finally {
          fs.unlink(req.file.path);
        };
    }));
  });
  }
);

module.exports = router;

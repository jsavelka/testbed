var express = require('express');
var multer = require('multer');
var tika = require('tika');
var fs = require('fs');

var router = express.Router();
var upload = multer({ dest: 'uploads/', limits: {fileSize: 5*1024*1024} });

  var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('../');
  }

/* GET users listing. */
router.get('/', isAuthenticated, function(req, res, next) {
  res.status(200)
     .render('uploads', {analyzedText: ''});
//    .send('<form method="POST" enctype="multipart/form-data">'
//      + '<input type="file" name="file1"/><input type="submit"/>'
//      + '</form>')
//    .end();
});

router.post('/', isAuthenticated, upload.single('file1'), function(req, res) {
  tika.text(req.file.path, {}, function(err, text) {

    text = text.replace(/((EC|NCN|NCSN|NCU|ND|NODN,NON|NTDN|NTN|EAN|OPJN|CPJN|TCNU|TCU|TVNO|TZN|ZP|\d+)\s*[a-zA-Z]{1,4}\s*\d+\/\d+)/g, '<font style="background-color: yellow">$1</font>');
    text = text.replace(/(((Pl)|I|II|III|IV)\.\s* ÚS(-st\.){0,1}\s*\d+\/\d+)/g, '<font style="background-color: yellow">$1</font>')

    res.status(200)
      .render('uploads', {analyzedText: text});
    fs.unlink(req.file.path);
  });
})

module.exports = router;

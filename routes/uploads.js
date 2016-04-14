var express = require('express');
var multer = require('multer');
var tika = require('tika');

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
    .send('<form method="POST" enctype="multipart/form-data">'
      + '<input type="file" name="file1"/><input type="submit"/>'
      + '</form>')
    .end();
});

router.post('/', isAuthenticated, upload.single('file1'), function(req, res) {
  tika.text(req.file.path, {}, function(err, text) {
    res.status(200)
      .send(text);
  });
})

module.exports = router;

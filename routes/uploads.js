var express = require('express');
var multer = require('multer');

var router = express.Router();
var upload = multer({ dest: 'uploads/' });

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200)
    .send('<form method="POST" enctype="multipart/form-data">'
      + '<input type="file" name="file1"/><input type="submit"/>'
      + '</form>')
    .end();
});

router.post('/', upload.single('file1'), function(req, res) {
  res.status(200)
    .send('OK!');
})

module.exports = router;

module.exports = {

  isAuthenticated : function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('../');
  },

  isAuthorized : function(req, res, next) {
    var destination = req.connection.parser.incoming._parsedOriginalUrl.path
        .match(/[a-zA-Z]+$/)[0];
    var access = req.user.access;
    if (access.indexOf(destination) > -1) {
      return next();
    }
    console.log('not authorized');
  }

}

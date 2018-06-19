module.exports = {
  ensureAuthenticated: function(request, response, next) {
    if(request.isAuthenticated()){
      return next();
    }
    request.flash('error_msg', 'Not authorized');
    response.redirect('/users/login');
  }
};
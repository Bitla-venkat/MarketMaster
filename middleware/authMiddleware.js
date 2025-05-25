

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login/login.html'); // or send 401 for API
}

module.exports = ensureAuthenticated;
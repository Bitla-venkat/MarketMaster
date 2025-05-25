const express = require('express');
const passport = require('passport');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Local auth routes
router.post('/login', loginUser);
router.post('/signup', registerUser);

// Start Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handle callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login/login.html' }),
  (req, res) => {
    // Redirect after successful login
    res.redirect('/dashboard'); // or wherever you want
  }
);

// Logout route (optional)
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;

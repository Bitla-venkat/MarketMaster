const express = require('express');
const passport = require('passport');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Local auth routes
router.post('/login', loginUser);
router.post('/signup', registerUser);

// Start Google OAuth
router.get('/google',
  passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/gmail.send'
    ],
    accessType: 'offline',   // Request refresh token
    prompt: 'consent'        // Force re-consent to always get refresh token
  })
);

// Handle callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login/login.html' }),
  (req, res) => {
    // Redirect after successful login
    console.log("User refresh token:", req.user.refreshToken);

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

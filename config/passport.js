const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true // 👈 add this to receive req
},
async (req, accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
        console.log('🔐 Access Token:', accessToken);
    console.log('🔁 Refresh Token:', refreshToken);

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        accessToken,
        refreshToken
      });
    } else {
      // Update tokens if needed
      user.accessToken = accessToken;
      if (refreshToken) user.refreshToken = refreshToken;
      await user.save();
      
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));



// Serialize only the user ID into the session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize the user from session using the stored ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

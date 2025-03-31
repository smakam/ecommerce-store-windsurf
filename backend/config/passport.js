const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports = (passport) => {
  // Serialize user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // JWT Strategy
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  };

  console.log('JWT Strategy initialized with secret:', process.env.JWT_SECRET ? 'JWT_SECRET is set' : 'JWT_SECRET is NOT set');
  console.log('JWT Strategy options:', { ...opts, secretOrKey: process.env.JWT_SECRET ? '[SECRET HIDDEN]' : 'NOT SET' });

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      console.log('JWT Strategy verifying token with payload:', {
        id: jwt_payload.id,
        iat: jwt_payload.iat,
        exp: jwt_payload.exp
      });
      
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          console.log('JWT Strategy found user:', user.email);
          return done(null, user);
        }
        console.log('JWT Strategy could not find user with ID:', jwt_payload.id);
        return done(null, false);
      } catch (err) {
        console.error('JWT Strategy error:', err);
        return done(err, false);
      }
    })
  );

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // If user exists but was registered with email/password
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // Create new user
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            role: 'user',
            isVerified: true
          });

          await user.save();
          return done(null, user);
        } catch (err) {
          console.error(err);
          return done(err, false);
        }
      }
    )
  );
};

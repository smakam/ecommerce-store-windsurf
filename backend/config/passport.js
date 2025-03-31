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
  console.log('Initializing Google OAuth Strategy with:', {
    clientID: process.env.GOOGLE_CLIENT_ID ? 'Set (starts with: ' + process.env.GOOGLE_CLIENT_ID.substring(0, 10) + '...)' : 'NOT SET',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set (length: ' + process.env.GOOGLE_CLIENT_SECRET.length + ')' : 'NOT SET',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'NOT SET'
  });
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('Google OAuth callback received profile:', {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails ? profile.emails.map(e => e.value) : 'No emails found'
        });
        
        try {
          // Check if user already exists
          console.log('Looking for user with email:', profile.emails[0].value);
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            console.log('Existing user found:', user.email);
            // If user exists but was registered with email/password
            if (!user.googleId) {
              console.log('Updating existing user with Google ID');
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // Create new user
          console.log('Creating new user from Google profile');
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            role: 'user',
            isVerified: true
          });

          await user.save();
          console.log('New user created:', user.email);
          return done(null, user);
        } catch (err) {
          console.error('Error in Google strategy:', err);
          return done(err, false);
        }
      }
    )
  );
};

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const { google } = require('../config/oauth');

passport.use(
  new GoogleStrategy(
    {
      clientID: google.clientID,
      clientSecret: google.clientSecret,
      callbackURL: google.callbackURL,
      passReqToCallback: true,
      scope: google.scope,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { google_id: profile.id } });

        if (!user) {
          user = await User.findOne({ where: { email: profile.emails[0].value } });
          
          if (user) {   // This is when user signs up locally first, then login using google
            // Merge local account with Google
            user.google_id = profile.id;
            user.provider = 'google';
            await user.save();
          } else {
            // New user
            user = await User.create({
              username: profile.displayName,
              email: profile.emails[0].value,
              provider: 'google',
              google_id: profile.id,
              profile_picture: profile.photos[0]?.value,
            });
          }
        }

        // Save refresh token for future API calls
        user.refresh_token = refreshToken;
        await user.save();

        return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
  )
);
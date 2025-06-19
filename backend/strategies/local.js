const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',  // Expect 'email' in request body
        passwordField: 'password',
        passReqToCallback: false,
      },
      async (email, password, done) => {
        try {
          // 1. Find user by email
          const user = await User.findOne({ where: { email } });
          if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
          }

          // 2. Check password (only for local users)
          if (user.provider !== 'local') {
            return done(null, false, { 
              message: 'Please sign in with Google.', 
            });
          }

          // 3. Compare hashed password
          const isValidPassword = await bcrypt.compare(
            password,
            user.encrypted_password
          );
          if (!isValidPassword) {
            return done(null, false, { message: 'Incorrect email or password.' });
          }

          // 4. Success! Return user
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
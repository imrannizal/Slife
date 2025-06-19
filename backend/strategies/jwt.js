const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models');
const { JWT_SECRET } = process.env;

// Options for JWT strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // How to extract token
  secretOrKey: JWT_SECRET, // Your secret key (from .env)
};

// Define the strategy
passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      // 1. Find user in DB (optional)
      const user = await User.findByPk(jwtPayload.id);
      
      // 2. If user exists, allow access
      if (user) return done(null, user);
      
      // 3. Else, block access
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);
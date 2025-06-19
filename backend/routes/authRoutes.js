const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// Local email/password login
router.post('/login', authController.localLogin);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login', // Redirect on failure
    session: false 
  }),
  authController.handleGoogleCallback
);

// Token management
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', 
  passport.authenticate('jwt', { session: false }),
  authController.logout
);

// Protected user profile endpoint
router.get('/me',
  passport.authenticate('jwt', { session: false }),
  authController.getCurrentUser
);

module.exports = router;
const { User } = require('../models');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../utils/jwtUtils');
const bcrypt = require('bcrypt');

module.exports = {
  /**
   * Local email/password login
   */
  localLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // 2. Verify password (only for local users)
      if (user.provider !== 'local') {
        return res.status(401).json({ 
          error: 'Please use your Google login' 
        });
      }

      const isValid = await bcrypt.compare(password, user.encrypted_password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // 3. Generate tokens
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      // 4. Store refresh token in DB
      await user.update({ refresh_token: refreshToken });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          provider: user.provider
        },
        accessToken,
        refreshToken
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  },

  /**
   * Handles Google OAuth callback
   */
  handleGoogleCallback: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Google authentication failed' });
      }

      const user = req.user;

      // Generate tokens
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      // Store refresh token in DB
      await user.update({ refresh_token: refreshToken });

      // Redirect or return tokens
      res.json({
        user: {
          id: user.id,
          email: user.email,
          provider: user.provider
        },
        accessToken,
        refreshToken
      });

    } catch (error) {
      console.error('Google callback error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
      }

      // 1. Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // 2. Find user and verify stored refresh token matches
      const user = await User.findByPk(decoded.id);
      if (!user || user.refresh_token !== refreshToken) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // 3. Generate new access token
      const newAccessToken = generateAccessToken(user.id);

      res.json({ accessToken: newAccessToken });

    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({ 
        error: error.message || 'Token refresh failed' 
      });
    }
  },

  /**
   * Logout - invalidates refresh token
   */
  logout: async (req, res) => {
    try {
      const userId = req.user.id;

      // Clear refresh token from DB
      await User.update(
        { refresh_token: null },
        { where: { id: userId } }
      );

      res.json({ message: 'Logged out successfully' });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  },

  /**
   * Get current user info
   */
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'email', 'provider']
      });
      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }
};
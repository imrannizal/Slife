const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

// Token expiration times
const ACCESS_TOKEN_EXPIRES_IN = '15m';  // Short-lived for security
const REFRESH_TOKEN_EXPIRES_IN = '7d';  // Long-lived for persistent sessions

module.exports = {
  /**
   * Generates an access token (short-lived)
   */
  generateAccessToken: (userId) => {
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured');
    return jwt.sign(
      { id: userId }, 
      JWT_SECRET, 
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );
  },

  /**
   * Generates a refresh token (long-lived)
   */
  generateRefreshToken: (userId) => {
    if (!JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not configured');
    return jwt.sign(
      { id: userId },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );
  },

  /**
   * Verifies an access token
   */
  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // Distinguish between different error types
      if (err.name === 'TokenExpiredError') {
        throw new Error('Access token expired');
      }
      throw new Error('Invalid access token');
    }
  },

  /**
   * Verifies a refresh token
   */
  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  },

  /**
   * Extracts payload without verification (for debugging)
   */
  decodeToken: (token) => {
    return jwt.decode(token);
  }
};
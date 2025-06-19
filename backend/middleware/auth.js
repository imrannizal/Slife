const { verifyToken } = require('../utils/jwtUtils');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    // 1. Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid authorization format' });
    }
    const token = authHeader.split(' ')[1];

    // 2. Verify token and decode
    const decoded = verifyToken(token);
    if (!decoded?.id) {
      return res.status(401).json({ error: 'Malformed token payload' });
    }

    // 3. Optional: Verify user exists in DB
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // 4. Attach user to request
    req.user = { 
      id: user.id,
      email: user.email, 
      provider: user.provider 
    }; // Full user object if needed

    next();
  } catch (err) {
    // Handle specific JWT errors
    const errorMessage = err.name === 'TokenExpiredError' 
      ? 'Token expired' 
      : 'Invalid token';
    return res.status(401).json({ error: errorMessage });
  }
};
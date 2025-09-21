import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const isValid = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      if (!res.headersSent) {
        res.status(401).json({ message: 'Token is not valid' });
      }
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { isValid };

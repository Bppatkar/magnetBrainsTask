import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const isValid = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select(-password);
    next();
    try {
    } catch (error) {
      res.status(401).json({ message: 'Not authorized ,token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not Authorized as an admin' });
  }
};

export { isValid, admin };

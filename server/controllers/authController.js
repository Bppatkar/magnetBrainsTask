import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// Helper function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      if (!res.headersSent) {
        return res.status(400).json({ message: 'User already exists' });
      }
    }

    const user = await User.create({ username, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error('Register error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
});

const getUserProfile = async (req, res) => {
  // `req.user` is populated by the `isValid` middleware
  const user = {
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
  };
  res.json(user);
};

export { registerUser, loginUser, getUserProfile };

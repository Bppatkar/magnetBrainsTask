import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

const getUsers = asyncHandler(async (req, res) => {
  try {
    // console.log('Getting users for user:', req.user);
    const users = await User.find({}).select('-password');
    // console.log('Found users:', users.length);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, role, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.isActive = isActive !== undefined ? isActive : user.isActive;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    await User.deleteOne({ _id: req.params.id });

    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { getUsers, getUserById, updateUser, deleteUser };

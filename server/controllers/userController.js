import User from '../models/User.js';

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('username email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

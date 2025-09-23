import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { isValid, checkAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ ANY authenticated user can get users list
router.get('/', isValid, getUsers);

// ✅ ANY authenticated user can get user by ID
router.get('/:id', isValid, getUserById);

// ✅ ONLY admin can update/delete users
router.put('/:id', isValid, checkAdmin, updateUser);
router.delete('/:id', isValid, checkAdmin, deleteUser);

export default router;

import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { isValid, checkAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(isValid, checkAdmin);

router.route('/').get(getUsers);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

export default router;

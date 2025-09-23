import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPriority,
} from '../controllers/taskController.js';
import { isValid } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(isValid, createTask).get(isValid, getTasks);

router.patch('/:id/status', isValid, updateTaskStatus);
router.patch('/:id/priority', isValid, updateTaskPriority);

router
  .route('/:id')
  .get(isValid, getTaskById)
  .put(isValid, updateTask)
  .delete(isValid, deleteTask);

export default router;



import Task from '../models/Task.js';
import asyncHandler from 'express-async-handler';

const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    if (!title || !description || !dueDate) {
      res.status(400);
      throw new Error('Please add all required fields');
    }
    // If no assignedTo is provided, assign to the creator
    const assignedUserId = assignedTo || req.user._id;

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo: assignedUserId,
      createdBy: req.user._id,
    });

    // Populate the created task
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        message: error.message || 'Failed to fetch tasks',
      });
    }
  }
});

const getTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }],
    })
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        message: error.message || 'Failed to fetch tasks',
      });
    }
  }
});

const getTaskById = asyncHandler(async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    if (!task) {
      if (!res.headersSent) {
        return res.status(404).json({ message: 'Task not found' });
      }
    }
    // Check if the user is authorized to view this task
    if (
      task.assignedTo.toString() !== req.user._id.toString() &&
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to view this task');
    }

    if (!res.headersSent) {
      res.json(task);
    }
  } catch (error) {
    console.error('Get task by ID error:', error);

    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
});

const updateTask = asyncHandler(async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only the creator can update their task
    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(401).json({
        message:
          'You can only update tasks you created || Not authorized to update this task',
      });
    }

    // Update fields
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        message: error.message || 'Internal server error',
      });
    }
  }
});

const deleteTask = asyncHandler(async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      if (!res.headersSent) {
        return res.status(404).json({ message: 'Task not found' });
      }
    }

    // Only the creator can delete their task, or an admin
    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(401);
      throw new Error('Not authorized to delete this task');
    }

    await Task.deleteOne({ _id: req.params.id });

    if (!res.headersSent) {
      res.json({ message: 'Task deleted successfully' });
    }
  } catch (error) {
    console.error('Delete task error:', error);

    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400);
      throw new Error('Status field is required');
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (
      task.assignedTo.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        message:
          'You can only update tasks you created || Not authorized to update status for this task',
      });
    }

    task.status = status;
    await task.save();
    res.json({ message: 'Task status updated successfully' });
  } catch (error) {
    console.error('Update task status error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        message: error.message || 'Internal server error',
      });
    }
  }
});

const updateTaskPriority = asyncHandler(async (req, res) => {
  try {
    const { priority } = req.body;
    if (!priority) {
      res.status(400);
      throw new Error('Priority field is required');
    }
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(401).json({
        message:
          'You can only update tasks you created || Not authorized to update priority for this task',
      });
    }

    task.priority = priority;
    await task.save();

    res.json({ message: 'Task priority updated successfully' });
  } catch (error) {
    console.error('Update task priority error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        message: error.message || 'Internal server error',
      });
    }
  }
});
export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPriority,
};

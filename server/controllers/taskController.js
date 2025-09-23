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
    // If user is admin, get ALL tasks
    let query = {};
    if (req.user.role !== 'admin') {
      query = {
        $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }],
      };
    }

    const tasks = await Task.find(query)
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
    // Check if the user is authorized to view this task
    // Admin can view ANY task, regardless of assignment
    const isAdmin = req.user.role === 'admin';
    const isAssignedUser =
      task.assignedTo._id.toString() === req.user._id.toString();
    const isCreator = task.createdBy._id.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignedUser && !isCreator) {
      return res
        .status(403)
        .json({ message: 'Not authorized to view this task' });
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
      res.status(403).json({
        message:
          'You can only update tasks you created || Not authorized to update this task',
      });
    }

    // Extract only the fields we want to allow updating
    const { title, description, dueDate, priority, assignedTo } = req.body;

    // Build update object with only provided fields
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (priority !== undefined) updates.priority = priority;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;

    // Check if any fields were provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message:
          'Please provide at least one field to update: title, description, dueDate, priority, assignedTo',
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    res.json({ message: 'Task updated successfully', task: updatedTask });
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

    // Allow admin OR assigned user to update status
    const isAdmin = req.user.role === 'admin';
    const isAssignedUser =
      task.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignedUser) {
      return res.status(403).json({
        message: 'Not authorized to update status for this task',
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
    // Allow admin OR creator to update priority
    const isAdmin = req.user.role === 'admin';
    const isCreator = task.createdBy.toString() === req.user._id.toString();

    if (!isAdmin && !isCreator) {
      return res.status(403).json({
        message: 'Not authorized to update priority for this task',
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

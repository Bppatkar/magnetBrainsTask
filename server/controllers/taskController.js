import Task from '../models/Task.js';

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo: req.user._id,
      createdBy: req.user._id,
    });

    const savedTask = await task.save();

    // Populate the created task
    const populatedTask = await Task.findById(savedTask._id)
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
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
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
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    if (!task) {
      if (!res.headersSent) {
        return res.status(404).json({ message: 'Task not found' });
      }
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
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only the creator can update their task
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: 'You can only update tasks you created' });
    }

    // Update fields
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        task[key] = req.body[key];
      }
    });
    const updatedTask = await task.save();

    // Populate and return
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    res.json(populatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        message: error.message || 'Internal server error',
      });
    }
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      if (!res.headersSent) {
        return res.status(404).json({ message: 'Task not found' });
      }
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      if (!res.headersSent) {
        return res
          .status(401)
          .json({ message: 'You can only delete tasks you created' });
      }
    }

    await Task.findByIdAndDelete(req.params.id);

    if (!res.headersSent) {
      res.json({ message: 'Task deleted successfully' });
    }
  } catch (error) {
    console.error('Delete task error:', error);

    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: 'You can only update tasks you created' });
    }

    task.status = status;
    const updatedTask = await task.save();

    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    res.json(populatedTask);
  } catch (error) {
    console.error('Update task status error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        message: error.message || 'Internal server error',
      });
    }
  }
};

const updateTaskPriority = async (req, res) => {
  try {
    const { priority } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: 'You can only update tasks you created' });
    }

    task.priority = priority;
    const updatedTask = await task.save();

    // Populate and return
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    res.json(populatedTask);
  } catch (error) {
    console.error('Update task priority error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        message: error.message || 'Internal server error',
      });
    }
  }
};
export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPriority,
};

import Task from '../models/Task.js';

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo: assignedTo || req.user._id, // Use current user if no assignedTo provided
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
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }],
    })
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 }); // Most recent first

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to this task
    const hasAccess =
      task.assignedTo._id.toString() === req.user._id.toString() ||
      task.createdBy._id.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res
        .status(401)
        .json({ message: 'Not authorized to view this task' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    const canUpdate =
      task.assignedTo.toString() === req.user._id.toString() ||
      task.createdBy.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!canUpdate) {
      return res
        .status(401)
        .json({ message: 'Not authorized to update this task' });
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
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only creator or admin can delete
    const canDelete =
      task.createdBy.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!canDelete) {
      return res
        .status(401)
        .json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    const canUpdate =
      task.assignedTo.toString() === req.user._id.toString() ||
      task.createdBy.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!canUpdate) {
      return res
        .status(401)
        .json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    const updatedTask = await task.save();

    // Populate and return
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    res.json(populatedTask);
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateTaskPriority = async (req, res) => {
  try {
    const { priority } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    const canUpdate =
      task.assignedTo.toString() === req.user._id.toString() ||
      task.createdBy.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!canUpdate) {
      return res
        .status(401)
        .json({ message: 'Not authorized to update this task' });
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
    res.status(500).json({ message: error.message });
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

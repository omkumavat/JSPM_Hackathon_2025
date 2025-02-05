// controllers/taskController.js
import Task from '../Models/Task.js';
import Admin from '../Models/Admin.js';
import Queue from '../Models/Queue.js';
import Worker from '../Models/Worker.js';

// controllers/adminController.js
// import Admin from '../models/Admin.js';

export const createAdmin = async (req, res) => {
  try {
    // Hardcoded admin data
    const adminData = {
      username: 'admin',
      email: 'abc@gmail.com',
      password: '123',
      taskQueue: [],
      workers: []
    };


    const admin = new Admin(adminData);
    await admin.save();

    res.status(201).json({
      message: 'Admin created successfully',
      admin
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createTaskForAdmin = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const { task_name, description, tags, execution_time = 1, priority } = req.body;

    // Step 1: Create and save the new Task document
    const taskData = { task_name, description, execution_time, tags, priority };
    const newTask = new Task(taskData);
    await newTask.save();

    // Step 2: Find the Admin by ID
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Step 3: Create a new Queue document for this task (initially "not_assigned")
    const newQueueItem = new Queue({
      task: newTask._id,
      status: "not_assigned",
      createdAt: new Date(),
    });
    await newQueueItem.save();

    // Push the new Queue document's ID into the admin's taskQueue array
    admin.taskQueue.push(newQueueItem._id);
    await admin.save();

    // Step 4: Fetch all pending tasks
    const pendingQueueItems = await Queue.find({ status: "not_assigned" }).populate("task");

    // Parallel updates for better efficiency
    const updatePromises = pendingQueueItems.map(async (queueItem) => {
      const taskToAssign = queueItem.task;
      if (!taskToAssign) return null; // Skip if task is missing

      // Find available workers with (currentLoad + execution_time) < 10
      const availableWorkers = await Worker.find({
        status: "available", // Fetch only available workers
        $expr: {
          $lt: [{ $add: ["$currentLoad", taskToAssign.execution_time] }, 10]
        }
      }).sort({ currentLoad: 1 });


      if (availableWorkers.length > 0) {
        const chosenWorker = availableWorkers[0];

        // Assign task to worker
        if (!chosenWorker.currentTask) {
          chosenWorker.currentTask = taskToAssign._id;
        } else {
          chosenWorker.pendingTask.push(taskToAssign._id);
        }

        // Increase worker load safely
        chosenWorker.currentLoad += taskToAssign.execution_time;

        // Save worker and update task & queue status in parallel
        return Promise.all([
          chosenWorker.save(),
          Task.findByIdAndUpdate(taskToAssign._id, {
            status: "in-progress",
            assigned_worker: chosenWorker._id
          }),
          Queue.findByIdAndUpdate(queueItem._id, { status: "assigned" }),
        ]);
      }

      return null; // If no worker was assigned
    });

    // Execute all update promises, filtering out `null` values
    await Promise.all(updatePromises.filter(Boolean));

    return res.status(201).json({
      message: "Task created successfully and scheduling attempted for pending tasks",
      task: newTask,
      queueItem: newQueueItem,
    });
  } catch (error) {
    console.error("Error in createTaskForAdmin:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


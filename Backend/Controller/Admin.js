// controllers/taskController.js
import mongoose from "mongoose";
import Task from '../Models/Task.js';
import Admin from '../Models/Admin.js';
import Queue from '../Models/Queue.js';
import Worker from '../Models/Worker.js';
import cron from 'node-cron';
import jwt from 'jsonwebtoken';

// controllers/adminController.js
// import Admin from '../models/Admin.js';

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
     
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Please provide email and password" });
      }
  
     
      let admin = await Admin.findOne({ email });
      if (!admin) {
        return res
          .status(401)
          .json({ success: false, message: "Admin does not exist" });
      }
  
      
     
      const payload = {
        email: admin.email,
        id: admin._id,
        username: admin.username,
      };
  
      // Sign the JWT
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h", // Adjust as needed
      });
  
      // Remove password before sending admin data to the client
      admin = admin.toObject();
      delete admin.password; // or admin.password = undefined;
  
      // Attach the token to a cookie (optional)
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        httpOnly: true,
        // secure: true, // Uncomment in production (HTTPS)
        // sameSite: 'none', // Adjust based on your front-end domain
      };
  
      // Send response with the cookie and JSON data
      res.cookie("token", token, options).status(200).json({
          success: true,
          message: "Admin logged in successfully",
          token,
          admin, // Return the admin data (minus password)
        });
    } catch (error) {
      console.error("Admin login error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

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
  const session = await mongoose.startSession();
  session.startTransaction(); // Start a transaction

  try {
    const adminId = req.params.adminId;
    const { task_name, description, tags, execution_time = 1, priority } = req.body;

    // Step 1: Create and save the new Task document
    const taskData = { task_name, description, execution_time, tags, priority };
    const newTask = new Task(taskData);
    await newTask.save({ session });

    // Step 2: Find the Admin by ID (inside the transaction)
    const admin = await Admin.findById(adminId).session(session);
    if (!admin) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Admin not found" });
    }

    // Step 3: Create a new Queue document for this task (initially "not_assigned")
    const newQueueItem = new Queue({
      task: newTask._id,
      status: "not_assigned",
      createdAt: new Date(),
    });
    await newQueueItem.save({ session });

    // Push the new Queue document's ID into the admin's taskQueue array
    admin.taskQueue.push(newQueueItem._id);
    await admin.save({ session });

    // Step 4: Fetch all pending tasks inside the transaction
    const pendingQueueItems = await Queue.find({ status: "not_assigned" }).populate("task").session(session);

    for (const queueItem of pendingQueueItems) {
      const taskToAssign = queueItem.task;
      if (!taskToAssign) continue; // Skip if task is missing

      // Step 5: Find the first available worker **inside the transaction**
      const chosenWorker = await Worker.findOne({
        status: "available",
        $expr: { $lt: [{ $add: ["$currentLoad", taskToAssign.execution_time] }, 50] }
      })
        .sort({ currentLoad: 1 }) // Prefer the worker with the least load
        .session(session); // Ensure the query runs inside the transaction

      if (!chosenWorker) continue; // No available worker, skip this task

      let taskUpdate = { status: "in-progress", assigned_worker: chosenWorker._id };
      let queueUpdate = {}; // To store queue update conditionally

      // Assign task to worker
      if (!chosenWorker.currentTask) {
        chosenWorker.currentTask = taskToAssign._id;
        taskUpdate.updatedAt = Date.now();  // Update timestamp only if assigned to `currentTask`
        queueUpdate.status = "assigned";   // Update queue status only if assigned
      } else {
        chosenWorker.pendingTask.push(taskToAssign._id);
        queueUpdate.status = "assigned";   // Update queue status if task goes to pendingTask
      }

      // Increase worker load safely
      chosenWorker.currentLoad += taskToAssign.execution_time;

      // Save worker, update task & queue status in the same transaction
      await chosenWorker.save({ session });
      await Task.findByIdAndUpdate(taskToAssign._id, taskUpdate, { session });
      if (queueUpdate.status) {
        await Queue.findByIdAndUpdate(queueItem._id, queueUpdate, { session });
      }
    }

    // Commit transaction after a successful update
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Task created successfully and scheduling attempted for pending tasks",
      task: newTask,
      queueItem: newQueueItem,
    });
  } catch (error) {
    console.error("Error in createTaskForAdmin:", error);
    await session.abortTransaction(); // Rollback in case of error
    session.endSession();
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



export const fetchForEverySecond = async () => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start a transaction

  try {
    // Step 1: Fetch all pending tasks from the queue
    const pendingQueueItems = await Queue.find({ status: "not_assigned" }).populate("task");

    for (const queueItem of pendingQueueItems) {
      const taskToAssign = queueItem.task;
      if (!taskToAssign) continue; // Skip if task is missing

      // Step 2: Find the first available worker **inside the transaction**
      const chosenWorker = await Worker.findOne({
        status: "available",
        $expr: { $lt: [{ $add: ["$currentLoad", taskToAssign.execution_time] }, 50] }
      })
        .sort({ currentLoad: 1 })
        .session(session); // Ensure the query runs inside the transaction

      if (!chosenWorker) continue; // No available worker, skip this task

      let taskUpdate = { status: "in-progress", assigned_worker: chosenWorker._id };
      let queueUpdate = {}; // To store queue update conditionally

      // Assign task to worker
      if (!chosenWorker.currentTask) {
        chosenWorker.currentTask = taskToAssign._id;
        taskUpdate.updatedAt = Date.now();
        queueUpdate.status = "assigned";
      } else {
        chosenWorker.pendingTask.push(taskToAssign._id);
        queueUpdate.status = "assigned";
      }

      // Increase worker load safely
      chosenWorker.currentLoad += taskToAssign.execution_time;

      // Save worker, update task & queue status in the same transaction
      await chosenWorker.save({ session });
      await Task.findByIdAndUpdate(taskToAssign._id, taskUpdate, { session });
      if (queueUpdate.status) {
        await Queue.findByIdAndUpdate(queueItem._id, queueUpdate, { session });
      }

      // Commit transaction after a successful update
      await session.commitTransaction();
      session.endSession();
    }
  } catch (error) {
    console.error("Error in fetchForEverySecond:", error);
    await session.abortTransaction(); // Rollback in case of error
    session.endSession();
  }
};


// Run every second
cron.schedule('*/5 * * * * *', async () => {
  await fetchForEverySecond();
});

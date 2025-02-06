import bcrypt from 'bcryptjs';
import Worker from '../Models/Worker.js';
import jwt from 'jsonwebtoken';
import Admin from '../Models/Admin.js';
import Queue from '../Models/Queue.js';
import Task from '../Models/Task.js';
import cron from 'node-cron';
import mongoose from "mongoose";


export const signUpWorker = async (req, res) => {
    try {
        // Get data from the request body
        const { name, email, password } = req.body;

        // Check if worker already exists
        const existingWorker = await Worker.findOne({ email });

        if (existingWorker) {
            return res.status(400).json({
                success: false,
                message: "Worker with this email already exists",
            });
        }

        // Hash the password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            });
        }

        // Create a new worker
        const newWorker = new Worker({
            name,
            email,
            password: hashedPassword,
            status: 'available',
            currentTask: null,
            lastNotifiedAt: null,
            completedTask: []
        });

        // Save the new worker to the database
        await newWorker.save();

        // Now find the admin and push the worker's ID into the workers array
        const admin = await Admin.findOne({ email: 'abc@gmail.com' }); // Replace with your admin's email or other criteria

        if (admin) {
            admin.workers.push(newWorker._id);  // Add the worker's ID to the workers array of the admin
            await admin.save();  // Save the updated admin document
        } else {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Worker created successfully and added to admin's workers list",
            data: newWorker
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Worker cannot be registered. Please try again later.",
        });
    }
};

export const loginWorker = async (req, res) => {
    try {
        //console.log(req.body);
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            });
        }

        // Check if worker exists
        let worker = await Worker.findOne({ email });
        if (!worker) {
            return res.status(401).json({
                success: false,
                message: "Worker does not exist",
            });
        }

        // Verify password & generate a JWT token
        const payload = {
            email: worker.email,
            id: worker._id,
            status: worker.status, // Worker status could be useful in the payload
        };

        if (await bcrypt.compare(password, worker.password)) {
            // Password matches
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h", // You can change the expiration time as needed
            });

            worker = worker.toObject();
            worker.token = token;
            worker.password = undefined; // Do not send password in response

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie expiration
                httpOnly: true, // Cookie is only accessible via HTTP (not JavaScript)
            };

            // Send token in a cookie
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                worker,
                message: "Worker logged in successfully",
            });
        } else {
            return res.status(403).json({
                success: false,
                message: "Password does not match",
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again later",
        });
    }
};

export const setWorkerStatusOffline = async (req, res) => {
    try {
        const { workerId } = req.params;

        // Find the worker by ID
        const worker = await Worker.findById(workerId);
        if (!worker) {
            return res.status(404).json({
                success: false,
                message: 'Worker not found',
            });
        }

        // Collect all tasks (current + pending)
        const tasksToUpdate = [];

        if (worker.currentTask) {
            tasksToUpdate.push(worker.currentTask);
        }

        if (worker.pendingTask.length > 0) {
            tasksToUpdate.push(...worker.pendingTask);
        }

        // Update queue items: set status to "not_assigned" and reset createdAt timestamp
        await Queue.updateMany(
            { task: { $in: tasksToUpdate } },
            {
                $set: {
                    status: 'not_assigned',
                    createdAt: Date.now()
                }
            }
        );

        // Update tasks: set assign_worker to null & status to "pending"
        await Task.updateMany(
            { _id: { $in: tasksToUpdate } },
            {
                $set: {
                    assigned_worker: null,
                    status: 'pending'
                }
            }
        );

        worker.currentTask = null;
        worker.pendingTask = [];
        worker.currentLoad = 0;
        worker.status = 'offline';

        await worker.save();

        return res.status(200).json({
            success: true,
            message: 'Worker status updated to offline, tasks set to not_assigned & pending',
        });

    } catch (err) {
        console.error("Error updating worker status:", err);
        return res.status(500).json({
            success: false,
            message: 'Error updating worker status',
            error: err.message,
        });
    }
};

export const getAllWorkers = async (req, res) => {
    try {

        const workers = await Worker.find({});
        res.status(200).json(workers);

    } catch (error) {

      
        console.error("Error fetching workers:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });

    }
};


// controllers/taskAndWorkerController.js
export const checkAndCompleteAndReassign = async () => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const now = Date.now();
  
      // 1. Find and update tasks that have exceeded their execution time
      const tasks = await Task.find({ status: "in-progress", execution_time: { $ne: null } }).session(session);
  
      for (let task of tasks) {
        const executionTimeMs = task.execution_time * 1000;
        const finishTime = task.updatedAt.getTime() + executionTimeMs;
  
        if (finishTime < now) {
          task.status = "completed";
          task.completedAt = new Date();
          await task.save({ session });
        }
      }
  
      // 2. Fetch all workers
      const workers = await Worker.find({}).session(session);
  
      for (let worker of workers) {
        let needToSave = false;
  
        // Check if the worker's current task is completed
        if (worker.currentTask) {
          const currentTask = await Task.findById(worker.currentTask).session(session);
          if (currentTask && currentTask.status === "completed") {
            worker.completedTask.push(worker.currentTask);
            worker.currentLoad -= currentTask.execution_time;
            worker.currentTask = null;
            needToSave = true;
          }
        }
  
        // Assign a new task if no current task and pendingTask is available
        if (!worker.currentTask && worker.pendingTask && worker.pendingTask.length > 0) {
          const nextTaskId = worker.pendingTask.shift();
          const nextTask = await Task.findById(nextTaskId).session(session);
  
          if (nextTask) {
            nextTask.updatedAt = new Date();
            worker.currentTask = nextTask._id;
            await nextTask.save({ session }); // Save updatedAt timestamp for the task
            needToSave = true;
          }
        }
  
        if (needToSave) {
          await worker.save({ session });
        }
      }
  
      // Commit the transaction if everything succeeds
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      // Rollback all changes in case of failure
      await session.abortTransaction();
      session.endSession();
      console.error("Error in checkAndCompleteAndReassign:", error);
    }
  };


cron.schedule('*/1 * * * * *', () => {
// //console.log('Running scheduled task check and worker reassignment...');
checkAndCompleteAndReassign();
});


export const getWorkerWithTasks = async (req, res) => {
  try {
    const { workerId } = req.params;
    //console.log(workerId)

    const worker = await Worker.findById(workerId)
      .populate('currentTask')  // Populate current task
      .populate('pendingTask')   // Populate all pending tasks
      .populate('completedTask'); // Populate all completed tasks

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.status(200).json(worker);
  } catch (error) {
    console.error('Error fetching worker data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const setWorkerStatusAvailable = async (req, res) => {
  try {
    const { workerId } = req.params; // Get workerId from params

    // Find the worker by ID and update their status to 'available'
    const worker = await Worker.findByIdAndUpdate(
      workerId,
      { status: 'available' },
      { new: true } // Return the updated worker document
    );

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    // Return the updated worker details
    res.status(200).json({ message: 'Worker status updated to available', success:true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { setWorkerStatusAvailable };

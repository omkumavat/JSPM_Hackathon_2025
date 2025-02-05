// controllers/taskController.js
import Task from '../Models/Task.js';
import Admin from '../Models/Admin.js';
import Queue from '../Models/Queue.js';

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
    // Get the admin ID from the route parameters
    const adminId = req.params.adminId;
  
    // Extract individual properties from req.body
    const task_name = req.body.task_name;
    const description = req.body.description;
    const tags = req.body.tags; 
    const priority = req.body.priority;
  
    try {
      // Build the task data object
      const taskData = {
        task_name,
        description,
        tags,
        priority
      };
  
      // Create and save the new Task document
      const newTask = new Task(taskData);
      await newTask.save();
  
      console.log(adminId, "admin id");
  
      // Find the Admin by ID
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
  
      // Create a new Queue document for this task
      const newQueueItem = new Queue({
        task: newTask._id,
        status: 'not_assigned', // initial status
        createdAt: new Date(),  // will be set by default as well
      });
      await newQueueItem.save();
  
      // Push the new Queue document's ObjectId into the admin's taskQueue array
      admin.taskQueue.push(newQueueItem._id);
      await admin.save();
  
      return res.status(201).json({
        message: "Task created and added to the admin's queue",
        task: newTask,
        queueItem: newQueueItem
      });
    } catch (error) {
      console.error("Error creating task or updating admin queue:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };

  
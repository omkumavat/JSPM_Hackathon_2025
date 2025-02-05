// controllers/taskController.js
import Task from '../Models/Task.js';
import Admin from '../Models/Admin.js';

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
  // Get the admin ID from the URL parameters
  const adminId = req.params.adminId;

  const task_name = req.body.task_name;
  const description = req.body.description;
  const tags = req.body.tags; 
  const priority = req.body.priority; 
//   const assigned_worker = req.body.assigned_worker;


  try {
  
    const taskData = {
      task_name,
      description,
      tags,
      priority
    //   assigned_worker,
    };

    const newTask = new Task(taskData);
    await newTask.save();

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const queueItem = {
      task: newTask._id,        
      status: 'not_assigned',   
      createdAt: new Date(),  
    };


    admin.taskQueue.push(queueItem);
    await admin.save();

    return res.status(201).json({
      message: "Task created and added to the admin's queue",
      task: newTask,
    });


  } catch (error) {
    console.error("Error creating task or updating admin queue:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};





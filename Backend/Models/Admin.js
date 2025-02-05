import mongoose from 'mongoose';
import Queue from './Queue.js'; // Import the queue sub-schema
import Worker from './Worker.js'; // Import the queue sub-schema

const { Schema } = mongoose;

const Admin = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
},
// In production, store hashed passwords!
email: {
    type: String,
    unique: true,
    trim: true
  },
password: {
    type: String,
    required: true
},
  // The admin's task queue: an array of QueueItemSchema objects.
  taskQueue: [Queue],

  workers : [Worker],
  // Optionally, you can add an assignment history field to track task assignments.
  // assignmentHistory: [{
  //   task: { type: Schema.Types.ObjectId, ref: 'Task' },
  //   assignedAt: { type: Date, default: Date.now },
  //   assignedTo: { type: Schema.Types.ObjectId, ref: 'Worker' }
  // }]
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

export default mongoose.model('Admin', Admin);

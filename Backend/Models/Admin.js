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
  taskQueue: [Queue],

  workers : [Worker],
}, { timestamps: true });

export default mongoose.model('Admin', Admin);

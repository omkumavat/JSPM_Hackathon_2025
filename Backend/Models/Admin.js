import mongoose from 'mongoose';
// import Queue from './Queue.js'; // Import the queue sub-schema

const { Schema } = mongoose;

const AdminSchema = new Schema({
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
  // The admin's task queue: an array of Queue sub-documents.
  taskQueue: [{
    type: Schema.Types.ObjectId,
    ref: 'Queue'
  }],
  // Reference to workers as ObjectId references instead of embedding the full Worker model.
  workers: [{
    type: Schema.Types.ObjectId,
    ref: 'Worker'
  }]
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

export default mongoose.model('Admin', AdminSchema);

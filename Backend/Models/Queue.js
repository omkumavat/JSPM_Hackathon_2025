import mongoose from 'mongoose';
const { Schema } = mongoose;

const Queue = new Schema({
  // Reference to the Task document
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  // Status indicating if the task is assigned or not
  status: {
    type: String,
    enum: ['assigned', 'not_assigned'],
    default: 'not_assigned'
  },
  // Timestamp for when the task was added to the queue (helps with prioritization)
  createdAt: {
    type: Date,
    default: Date.now
  }
}); // Disable _id for each sub-document if you don't need individual IDs

export default Queue;

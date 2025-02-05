import mongoose from 'mongoose'

const Worker = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
      type: String,
      unique: true,
      trim: true
},
  password: {
    type: String,
    required: true
},
  // 
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available',
    required: true
  },
 
  currentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  lastNotifiedAt: {
    type: Date
  },
  completedTask : [ {type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null} ]
}, {
  timestamps: true 
});


module.exports = mongoose.model('Worker', Worker);

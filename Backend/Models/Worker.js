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
  status: {    type: String,
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
  completedTask : [ {type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null} ],
  pendingTask : [ {type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null} ]
}, {
  timestamps: true 
});


// module.exports = mongoose.model('Worker', Worker);
export default mongoose.model("Worker", Worker);

export const getAllWorkers = async (req, res) => {
  try {
  
    const workers = await Worker.find({});
  
    res.status(200).json(workers);
  } catch (error) {
  
    console.error("Error fetching workers:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


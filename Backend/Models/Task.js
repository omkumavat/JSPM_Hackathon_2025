import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    task_name: { type: String, required: true }, // Name of the task
    description: { type: String }, // Optional description of the task
    data: { type: Object, required: true }, // Payload required for processing the task
    status: { 
        type: String, 
        enum: ["pending", "in-progress", "completed", "failed", "canceled"], 
        default: "pending" 
    }, 
    priority: { type: Number, default: 3, min: 1, max: 5 }, // 1 = High, 5 = Low priority
    attempts: { type: Number, default: 0 }, // Number of times task has been retried
    max_attempts: { type: Number, default: 3 }, // Maximum retries before marking as failed
    assigned_worker:  { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
    result: { type: Object, default: null }, // Stores result of execution (if any)
    error_message: { type: String, default: null }, // Stores error message in case of failure
    createdAt: { type: Date, default: Date.now }, // Task creation timestamp
    updatedAt: { type: Date, default: Date.now }  // Task last update timestamp
});

// Auto-update `updatedAt` field before saving
taskSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Task", taskSchema);

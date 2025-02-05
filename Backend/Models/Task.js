import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    task_name: { type: String, required: true },
    description: { type: String },
    data: { type: Object, required: true },
    status: { 
        type: String, 
        enum: ["pending", "in-progress", "completed", "failed", "canceled"], 
        default: "pending" 
    },
    completedAt: { type: Date, default: null },
    tags: [{ type: String }],
    execution_time: { type: Number, default: null },
    priority: { type: Number, default: 3, min: 1, max: 5 },
    attempts: { type: Number, default: 0 },
    max_attempts: { type: Number, default: 3 },
    assigned_worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
    result: { type: Object, default: null },
    error_message: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
    
});

taskSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model("Task", taskSchema);

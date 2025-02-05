import Task from '../Models/Task.js';
import Queue from '../Models/Queue.js';
import Worker from '../Models/Worker.js';
import Admin from '../Models/Admin.js';
export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        console.log(`Deleting Task: ${taskId}`);

        // Step 1: Find and delete the task
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // Step 2: Find all queues that reference the deleted task
        const deletedQueues = await Queue.find({ task: taskId });

        // Step 3: Delete the queues that reference the task
        await Queue.deleteMany({ task: taskId });

        // Step 4: Remove the queue references from Admin's taskQueue
        const queueIds = deletedQueues.map(queue => queue._id);
        await Admin.updateMany(
            { taskQueue: { $in: queueIds } },  // Find Admins where taskQueue contains deleted queue IDs
            { $pull: { taskQueue: { $in: queueIds } } } // Remove them from taskQueue
        );

        // Step 5: Remove task from completedTask list of workers
        await Worker.updateMany(
            { completedTask: taskId },
            { $pull: { completedTask: taskId } }
        );

        // Step 6: If any worker has this task as their currentTask, reset it to null
        await Worker.updateOne(
            { currentTask: taskId },
            { $set: { currentTask: null } }
        );

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully, and references removed from queues, workers, and admin taskQueue"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete task. Please try again later."
        });
    }
};

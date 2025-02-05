import Task from '../models/Task';
import Queue from '../models/Queue';
import Worker from '../models/Worker';

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // Step 2: Remove the task reference from the Queue collection
        await Queue.deleteMany({ task: taskId });

        await Worker.updateMany(
            { completedTask: taskId },
            { $pull: { completedTask: taskId } }
        );

        await Worker.updateOne(
            { currentTask: taskId },
            { $set: { currentTask: null } }
        );

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully, and references removed from queue and workers"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete task. Please try again later."
        });
    }
};

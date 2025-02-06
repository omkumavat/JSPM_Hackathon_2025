import React from 'react';
import axios from 'axios'; // Importing axios

const TaskDeleteOption = ({ task, onDelete }) => {
  // Handle delete function
  const handleDelete = async (taskId) => {
    try {
      // Send DELETE request to your API endpoint
      const response = await axios.delete(`/api/tasks/${taskId}`);
      if (response.status === 200) {
        //console.log('Task deleted successfully');
        onDelete(taskId); // Call parent component's onDelete to remove the task from state
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={() => handleDelete(task.id)} // Trigger handleDelete when clicked
        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
      >
        <span className="mr-2">Delete</span>
      </button>
    </div>
  );
};

export default TaskDeleteOption;

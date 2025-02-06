import React, { useState } from "react";
import { Clock, CheckCircle2, XCircle, MoreVertical } from "lucide-react";
import TaskDeleteOption from "./TaskDeleteOption";

const TaskCard = ({ task, onDelete }) => {
  // State to toggle the visibility of TaskDeleteOption
  const [showDeleteOption, setShowDeleteOption] = useState(false);

  // Function to toggle the delete option
  const handleToggleDeleteOption = () => {
    setShowDeleteOption(!showDeleteOption); // Toggle the visibility state
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden ">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="px-3 py-1  bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            {task.task_name}
          </span>
          <button
            onClick={handleToggleDeleteOption} // Toggle delete option visibility
            className="text-gray-400 hover:text-gray-600 transition-colors relative"
          >
            <MoreVertical size={20} className="relative " />
          </button>
        </div>

        {/* Time and Status */}
        <div className="flex items-center text-gray-600 mb-3">
          <Clock size={18} className="mr-2" />
          {
            task.createdAt &&  (
              <span>{task.createdAt.split("T")[0]}</span>
            )
          }
        </div>

        {/* Status */}
        <div className="flex items-center mb-4">
          {task.status === "completed" ? (
            <div className="flex items-center text-green-600">
              <CheckCircle2 size={18} className="mr-2" />
              <span>Completed</span>
            </div>
          ) : (
            <div className="flex items-center text-amber-600">
              <XCircle size={18} className="mr-2" />
              <span>Pending</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 mb-4">
          <div
            className={`h-full ${
              task.status === "completed" ? "bg-green-500" : "bg-amber-500"
            }`}
            style={{ width: task.status === "completed" ? "100%" : "60%" }}
          />
        </div>

        {/* Conditionally render the delete option */}
        <div className="">
          {showDeleteOption && (
            <TaskDeleteOption task={task} onDelete={onDelete} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

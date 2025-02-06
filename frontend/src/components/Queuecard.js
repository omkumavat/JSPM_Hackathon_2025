import React, { useEffect } from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

const QueueItemCard = ({ queueItem }) => {
  // For debugging
  useEffect(() => {
    console.log("Queue item:", queueItem);
  }, [queueItem]);

  // Extract queue-level data
  const { status: queueStatus, createdAt: queueCreated } = queueItem || {};

  // Extract task-level data
  const {
    task_name,
    status: taskStatus,
    createdAt,
    completedAt
  } = queueItem?.task || {};

  // Dynamically set label and color classes based on `taskStatus`
  let statusLabel;
  let textColor;
  let barColor;
  let barWidth;

  switch (taskStatus) {
    case "completed":
      statusLabel = "Completed";
      textColor = "text-green-600";
      barColor = "bg-green-500";
      barWidth = "100%";
      break;
    case "in-progress":
      statusLabel = "In Progress";
      textColor = "text-orange-600";
      barColor = "bg-orange-500";
      barWidth = "70%";
      break;
    case "pending":
    default:
      statusLabel = "Pending";
      textColor = "text-red-600";
      barColor = "bg-red-500";
      barWidth = "40%";
      break;
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden">
      <div className="p-6">
        {/* Top Bar: Display the Task Name */}
        <div className="flex justify-between items-center mb-4">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            {task_name || "No Task Name"}
          </span>
        </div>

        {/* Time (createdAt or completedAt) */}
        <div className="flex items-center text-gray-600 mb-3">
          <Clock size={18} className="mr-2" />
          <span>{(completedAt || createdAt || "").split("T")[0]}</span>
        </div>

        {/* Status Label & Icon */}
        <div className={`flex items-center mb-4 ${textColor}`}>
          {taskStatus === "completed" ? (
            <CheckCircle2 size={18} className="mr-2" />
          ) : (
            <XCircle size={18} className="mr-2" />
          )}
          <span>{statusLabel}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 mb-4">
          <div className={`h-full ${barColor}`} style={{ width: barWidth }} />
        </div>

        {/* Display the queue-level status */}
        <p className="text-gray-500 text-sm">
          <strong>Queue Status:</strong> {queueStatus}
        </p>
      </div>
    </div>
  );
};

export default QueueItemCard;

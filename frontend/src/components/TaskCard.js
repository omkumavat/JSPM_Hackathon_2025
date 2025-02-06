import React, { useEffect } from "react";
import { Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

const TaskCard = ({ task, filter }) => {
  useEffect(() => {
    //console.log("Task data:", task);
    //console.log("Current filter:", filter);
  }, [task, filter]);

  // Decide which date to display based on the filter
  const getDateForFilter = () => {
    if (!task) return null;
    switch (filter) {
      case "pending":
        return task.createdAt;
      case "ongoing":
        return task.updatedAt;
      case "completed":
        return task.completedAt;
      default:
        return null;
    }
  };

  // Format a timestamp into "6 Feb 12:20:20"
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const dateObj = new Date(timestamp);

    const day = dateObj.getDate(); // 1-31
    const month = dateObj.toLocaleString("default", { month: "short" }); // e.g. "Feb"
    const hour = String(dateObj.getHours()).padStart(2, "0");   // "00" - "23"
    const minute = String(dateObj.getMinutes()).padStart(2, "0"); // "00" - "59"
    const second = String(dateObj.getSeconds()).padStart(2, "0"); // "00" - "59"

    // e.g., "6 Feb 12:20:20"
    return `${day} ${month} ${hour}:${minute}:${second}`;
  };

  const displayedDate = formatTimestamp(getDateForFilter());

  // Decide styles based on the actual task.status
  const getStatusStyles = () => {
    switch (task?.status) {
      case "completed":
        return {
          label: "Completed",
          icon: CheckCircle2,
          iconColor: "text-green-600",
          progressColor: "bg-green-500",
          progressWidth: "100%"
        };
      case "in-progress":
        return {
          label: "Ongoing",
          icon: RefreshCw,     // or any icon you prefer for 'ongoing'
          iconColor: "text-blue-600",
          progressColor: "bg-blue-500",
          progressWidth: "60%" // adjust as needed
        };
      default: // "pending" or anything else
        return {
          label: "Pending",
          icon: XCircle,
          iconColor: "text-amber-600",
          progressColor: "bg-amber-500",
          progressWidth: "30%" // adjust as needed
        };
    }
  };

  const {
    label,
    icon: StatusIcon,
    iconColor,
    progressColor,
    progressWidth
  } = getStatusStyles();

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden">
      <div className="p-6">
        {/* Task Name */}
        <div className="flex justify-between items-center mb-4">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            {task.task_name}
          </span>
        </div>

        {/* Time based on filter */}
        <div className="flex items-center text-gray-600 mb-3">
          <Clock size={18} className="mr-2" />
          <span>{displayedDate}</span>
        </div>

        {/* Status Display */}
        <div className={`flex items-center mb-4 ${iconColor}`}>
          <StatusIcon size={18} className="mr-2" />
          <span>{label}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 mb-4">
          <div
            className={`h-full ${progressColor}`}
            style={{ width: progressWidth }}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

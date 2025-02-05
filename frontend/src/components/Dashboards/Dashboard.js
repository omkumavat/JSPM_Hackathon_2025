import React, { useState } from "react";
import {
  Users,
  History,
  AlertTriangle,
  Lightbulb,
  Menu,
  X,
  PlusCircle,
} from "lucide-react";
import TaskForm from "../TaskForm";
import TaskCard from "../TaskCard";
import WorkerCard from "../WorkerCard";
const workers = [
  { id: 1, name: "Worker-01", status: "active" },
  { id: 2, name: "Worker-02", status: "active" },
  { id: 3, name: "Worker-03", status: "warning" },
  { id: 4, name: "Worker-04", status: "inactive" },
];

const tasks = [
  { id: 1, task: "Data Processing", time: "2m 30s", status: "completed" },
  { id: 2, task: "Batch Analysis", time: "5m 45s", status: "completed" },
  { id: 3, task: "ML Training", time: "15m 20s", status: "failed" },
];

const alerts = [
  { id: 1, type: "warning", message: "High memory usage on Worker-03" },
  { id: 2, type: "error", message: "Failed task retry on Worker-04" },
];

const Dashboard = () => {
  const [selectedWorker, setSelectedWorker] = useState(workers[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("workers");
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      tasks.push({
        id: tasks.length + 1,
        task: newTask,
        time: "N/A",
        status: "pending",
      });
      setNewTask("");
    }
  };

  return (
    <div className="flex h-screen font-poppins">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-6">
            <Users className="text-blue-600" />
            <h2 className="text-xl font-semibold">Navigation</h2>
          </div>

          {/* Sidebar Navigation Buttons */}
          <div className="flex flex-col gap-y-3">
            <button
              onClick={() => setSelectedView("workers")}
              className={`w-full p-4 rounded-lg text-center transition-colors duration-200 ${
                selectedView === "workers"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-100 text-gray-700"
              }`}
            >
              All Workers
            </button>

            <button
              onClick={() => setSelectedView("tasks")}
              className={`w-full p-4 rounded-lg text-center transition-colors duration-200 ${
                selectedView === "tasks"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-100 text-gray-700"
              }`}
            >
              All Tasks
            </button>

            <button
              onClick={() => setSelectedView("addTask")}
              className={`w-full p-4 rounded-lg transition-colors duration-200 text-center ${
                selectedView === "addTask"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-100 text-gray-700"
              }`}
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Content based on selected view */}
        

        {selectedView === "workers" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Workers</h2>
            <div className="flex flex-wrap gap-6">
              {" "}
              {/* Use flex and flex-wrap for horizontal arrangement */}
              {workers.map((worker) => (
                <div
                  key={worker.id}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"
                >
                  <WorkerCard worker={worker} />
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === "addTask" && <TaskForm />}
      </div>
    </div>
  );
};

export default Dashboard;

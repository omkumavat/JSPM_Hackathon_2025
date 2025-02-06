import React, { useState } from "react";
import { Users, Menu, X } from "lucide-react";
import TaskForm from "../TaskForm";
import TaskCard from "../TaskCard";
import AllWorker from "../AllWorker"; // ✅ Import AllWorker

const Dashboard = () => {
  const [selectedView, setSelectedView] = useState("workers");
  const [addTaskForm, setAddTaskForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen font-poppins">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Navigation */}
      <div
        className={`fixed lg:static inset-y-0 z-0 left-0 w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4">
          <div className="flex justify-center items-center text-center space-x-2 mb-6">
            <Users className="text-blue-600" />
            <h2 className="text-xl font-semibold">Navigation</h2>
          </div>
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
              onClick={() => setAddTaskForm(true)}
              className="w-full p-4 rounded-lg transition-colors duration-200 text-center hover:bg-blue-100 text-gray-700"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 ml-12 lg:ml-7">Dashboard</h1>


        {/* Render Selected View */}
        <div>{addTaskForm && <TaskForm setAddTaskForm={setAddTaskForm} />}</div>

        {/* ✅ Renders AllWorker */}
        {selectedView === "workers" && <AllWorker />}

        {selectedView === "tasks" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
            <div className="flex flex-wrap gap-6">{/* Task List */}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

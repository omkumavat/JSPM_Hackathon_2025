import React, { useState, useEffect } from "react";
import { Users, Menu, X } from "lucide-react";
import { useAuth } from "../../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import TaskForm from "../TaskForm";
import TaskCard from "../TaskCard";
import AllWorker from "../AllWorker";
import axios from "axios";
import Queuecard from "../Queuecard";

const Dashboard = () => {
  const [selectedView, setSelectedView] = useState("workers");
  const [addTaskForm, setAddTaskForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
    const [task, setTask] = useState([]);
  const navigate = useNavigate();

  // Redirect to login if admin is not logged in

  const fetchWorker = async () => {
    if (currentUser) {
      try {
        // const workerId = currentUser.worker._id;
        const response = await axios.get(`http://localhost:4000/server/queue/getAllQueueItems`);
        //console.log(response , "dsaf");

        setTask(response.data || []);
      } catch (error) {
        console.error("Error fetching worker:", error);
      }
    }
  };

  useEffect(() => {
    fetchWorker();
    const intervalId = setInterval(() => {
      fetchWorker();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);



  //console.log("priting curent user", currentUser);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Logout function for admin
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to login page
      window.location.reload(); // Refresh page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex h-screen font-poppins">
      {/* Sidebar Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Navigation */}
      <div
        className={`fixed lg:static inset-y-0 z-0 left-0 w-64 bg-gray-100 border-r border-gray-200 overflow-y-auto transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4">
          <div className="flex justify-center items-center shadow-xl rounded-md p-1 text-center space-x-2 mb-6">
            <Users className="text-blue-600" />
            <h2 className="text-xl font-semibold">Admin Panel</h2>
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
            <button
              onClick={handleLogout}
              className="w-full p-4 mt-6 bg-red-600 text-white rounded-lg transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Render Selected View */}
        <div>{addTaskForm && <TaskForm setAddTaskForm={setAddTaskForm} />}</div>
        {selectedView === "workers" && <AllWorker />}
        {selectedView === "tasks" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {task.length > 0 ? (
                task.map((item) => <Queuecard key={item._id} queueItem={item} />)
              ) : (
                <p>No queue items found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

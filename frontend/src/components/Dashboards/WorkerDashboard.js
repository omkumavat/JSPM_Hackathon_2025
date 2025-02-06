import React, { useState, useEffect } from 'react';
import TaskCard from '../TaskCard';
import { useAuth } from '../../Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WorkerDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [ongoingTask, setOngoingTask] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [status, setStatus] = useState('available'); // Track worker status

    useEffect(() => {
      if (!currentUser) {
        navigate("/login");
      }
    }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await logout();
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fetchWorker = async () => {
    if (currentUser) {
      try {
        const workerId = currentUser.worker._id;
        const response = await axios.get(`http://localhost:4000/server/worker/get-worker-full/${workerId}`);

        setPendingTasks(response.data.pendingTask || []);
        setCompletedTasks(response.data.completedTask || []);
        setOngoingTask(response.data.currentTask ? [response.data.currentTask] : []);
        setStatus(response.data.status); // Update status based on worker data
        filterTasks('pending');
      } catch (error) {
        console.error("Error fetching worker:", error);
      }
    }
  };

  const handleStatusToggle = async () => {
    if (currentUser) {
      try {
        const workerId = currentUser.worker._id;
        const newStatus = status === 'available' ? 'offline' : 'available'; // Toggle status
        const response = await axios.get(`http://localhost:4000/server/worker/set-${newStatus}/${workerId}`);

        if (response.data.success) {
          setStatus(newStatus); // Update the local status
          toast.success(`Machine is now ${newStatus}`);
        } else {
          toast.error(`Failed to set machine ${newStatus}`);
        }
      } catch (error) {
        toast.error(`Error setting ${status}`);
      }
    }
  };

  const filterTasks = (status) => {
    if (status === 'pending') {
      setFilteredTasks(pendingTasks);
    } else if (status === 'ongoing') {
      setFilteredTasks(ongoingTask);
    } else if (status === 'completed') {
      setFilteredTasks(completedTasks);
    }
  };

  useEffect(() => {
    fetchWorker();
    const intervalId = setInterval(() => {
      fetchWorker();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [currentUser]);

  useEffect(() => {
    filterTasks(filter);
  }, [filter, pendingTasks, completedTasks, ongoingTask]);

  return (
    <div className="flex h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-64 bg-slate-300 text-black p-4 shadow-md rounded-md">
        <div>
          <p className="text-2xl font-poppins text-center font-bold shadow-2xl rounded-md mb-4">Dashboard</p>
        </div>
        <div className="shadow-lg p-2 rounded-md">
          <h3 className="text-2xl font-semibold">Tasks</h3>
          <button
            onClick={() => setFilter('pending')}
            className={`w-full py-2 mb-2 text-left px-4 rounded-lg border-2 ${filter === 'pending' ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-black border-gray-300'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('ongoing')}
            className={`w-full py-2 mb-2 text-left px-4 rounded-lg border-2 ${filter === 'ongoing' ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-black border-gray-300'}`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`w-full py-2 mb-2 text-left px-4 rounded-lg border-2 ${filter === 'completed' ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-black border-gray-300'}`}
          >
            Completed
          </button>

          {/* Toggle between Online/Offline button */}
          <button
            onClick={handleStatusToggle}
            className={`bg-${status === 'available' ? 'red-700' : 'green-700'} p-2 font-bold font-poppins rounded-md text-center text-white`}
          >
            {status === 'available' ? 'Set Offline' : 'Set Available'}
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2 mb-2 mt-5 text-left px-4 rounded-lg border-2"
          >
            LogOut
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 bg-gray-100">
        <h3 className="text-3xl font-semibold">{filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks</h3>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.isArray(filteredTasks) && filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <TaskCard key={index} task={task} />
            ))
          ) : (
            <p>No tasks to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;

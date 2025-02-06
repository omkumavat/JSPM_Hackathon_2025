import React, { useState } from 'react'
import TaskCard from '../TaskCard'
import { useAuth } from '../../Context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'


const WorkerDashboard = () => {
  const {currentUser,logout}=useAuth()

  // Sample data for tasks
  const tasks = [
    { id: 1, status: 'pending', name: 'Task 1' },
    { id: 2, status: 'completed', name: 'Task 2' },
    { id: 3, status: 'pending', name: 'Task 3' },
    { id: 4, status: 'completed', name: 'Task 4' },
  ]

  const navigate=useNavigate()
  // State to track the filter (pending or completed)
  const [filter, setFilter] = useState('pending')

  // Filter tasks based on the selected status
  const filteredTasks = tasks.filter(task => task.status === filter)

  const handlelogout=async()=>{
    try {
      // toast.success("LogOut Successfuly..")
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a delay
      await logout();
      navigate('/login');
      // setIsLoggedIn(false);
      window.location.reload();
    } catch (error) {
      // toast.error("Failed to LogOut, try again later..")
      console.error("Error during logout:", error);
    } finally {
      // setLoading(false);
    }
  }

  useEffect(() => {
    console.log(currentUser)
  }, []); 

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-64 bg-slate-300 text-black p-4 shadow-md rounded-md ">
        <div>
          <p className='text-2xl font-poppins text-center font-bold shadow-2xl  rounded-md mb-4'>Dashboard</p>
        </div>
        <div className='shadow-lg  p-2 rounded-md'>

          <h3 className="text-2xl font-semibold">Tasks</h3>
          <button
            onClick={() => setFilter('pending')}
            className={`w-full py-2 mb-2 text-left px-4 rounded-lg border-2 ${filter === 'pending' ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-black border-gray-300'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`w-full py-2 mb-2 text-left px-4 rounded-lg border-2 ${filter === 'completed' ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-black border-gray-300'}`}
          >
            Completed
          </button>
          <div>
            <p className='bg-red-700 p-2 font-bold fomt-poppins rounded-md  text-center text-white '>Go Offline</p>
          </div>
          <button
            onClick={() => handlelogout}
            className={`w-full py-2 mb-2 mt-5 text-left px-4 rounded-lg border-2`}
          >
            LogOut
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="flex-1 p-6 bg-gray-100">
        <h3 className="text-3xl font-semibold">{filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks</h3>
        
        {/* Flexbox container to arrange the task cards */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default WorkerDashboard

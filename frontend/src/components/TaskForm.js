import React, { useState } from "react";
import { ClipboardList } from "lucide-react";
import { ImCross } from "react-icons/im";
import axios from "axios";


const  TaskForm = ({ setAddTaskForm }) => {
  const [formData, setFormData] = useState({
    task_name: "",
    description: "",
    tags: "",
    execution_time: "",
    priority: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert comma-separated tags to an array if needed
      const tagsArray = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [];

      // Prepare the task data to send
      const taskData = {
        task_name: formData.task_name,
        description: formData.description,
        tags: tagsArray,
        execution_time: parseInt(formData.execution_time, 10) || 0,
        priority: formData.priority,
      };

      const url =
        "http://localhost:4000/server/admin/createTaskForAdmin/67a3c301a6f630ed0d44b712";

      const response = await axios.post(url, taskData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Server Response:", response.data);

      // Reset form after successful submission
      setFormData({
        task_name: "",
        description: "",
        tags: "",
        execution_time: "",
        priority: 1,
      });
      alert("Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      if (error.response) {
        alert(error.response.data.message || "Failed to create task");
      } else {
        alert("Something went wrong");
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority" ? parseInt(value) || 1 : value,
    }));
  };

  return (
    <div className="relative">
      <div className=" px-4 sm:px-6 lg:px-8 relative z-50">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8">
          <div onClick={() => setAddTaskForm(false)} className="bg-red-600 cursor-pointer text-white rounded-full p-2 w-fit absolute xl:right-[30%]   lg:right-[26%] md:right-[25%]  sm:right-[15%]">
            <ImCross />
          </div>
          <div className="flex items-center justify-center mb-6">
            <ClipboardList className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="text-center text-3xl font-semibold text-gray-900 mb-6">
            Create New Task
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="taskName"
                className="block text-sm font-medium text-gray-700"
              >
                Task Name
              </label>
              <input
                type="text"
                id="task_name"
                name="task_name"
                required
                value={formData.task_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-3"
                placeholder="Enter task name"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-3"
                placeholder="Enter task description"
              />
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700"
              >
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-3"
                placeholder="Enter tags, separated by commas"
              />
            </div>

            <div>
              <label
                htmlFor="execution_time"
                className="block text-sm font-medium text-gray-700"
              >
                Execution Time
              </label>
              <input
                type="number"
                id="execution_time"
                name="execution_time"
                value={formData.execution_time}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-3"
              />
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700"
              >
                Priority (1-5)
              </label>
              <input
                type="number"
                id="priority"
                name="priority"
                required
                min="1"
                max="5"
                value={formData.priority}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-3"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 text-white font-medium text-lg rounded-md shadow-md transition duration-300 ease-in-out"
            >
              Create Task
            </button>
          </form>
        </div>
      </div>
      <div className="bg-black w-screen h-screen fixed top-0 left-0 z-30 opacity-60"></div>
    </div>
  );
};

export default TaskForm;

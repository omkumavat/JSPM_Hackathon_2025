import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Server,
  XCircle,
  CheckCircle,
  Circle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import image1 from "./Images/image1.png";
import image2 from "./Images/image2.jpg";
import giphy1 from "./Images/giphy1.gif";
const Home = () => {
  const navigate = useNavigate();
  const [failedNode, setFailedNode] = useState(2);
  const [scheduledTask, setScheduledTask] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFailedNode((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScheduledTask((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  const fullText =
    "A robust platform for building and managing distributed applications with fault tolerance, task scheduling, and high availability.";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Adjust speed here

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-black">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <motion.h1
            className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Distributed Systems Platform
          </motion.h1>
          <motion.p
            className="text-xl text-gray-500 max-w-2xl mx-auto relative font-mono"
            animate={{ opacity: [1, 0.8, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="relative">
              {displayedText}
              <span className="animate-blink">|</span> {/* Blinking cursor */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 animate-sparkle" />
            </span>
          </motion.p>

          {/* Login & Signup Buttons */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg shadow hover:bg-teal-600 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
        {/* Fault Tolerance & Task Scheduling Container */}
        <div className="mb-24 flex flex-col md:flex-row justify-center items-center gap-12">
          {/* Fault Tolerance Section - Left */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-violet-100 p-8 rounded-lg shadow-lg w-full max-w-2xl min-h-[350px] flex flex-col items-center"
          >
            <h2 className="text-3xl font-semibold mb-6 text-violet-600">
              Fault Tolerance
            </h2>
            <p className="text-xl font-poppins font-medium text-gray-700 text-center mb-6">
              "Fault tolerance ensures a system continues functioning correctly
              even when some components fail."
            </p>

            {/* Server Nodes Grid */}
            <div className="grid grid-cols-4 gap-8 justify-center items-center">
              {[0, 1, 2, 3].map((node) => (
                <div key={node} className="relative flex flex-col items-center">
                  <Server
                    size={60}
                    className={`transition-transform duration-500 ${
                      node === failedNode
                        ? "text-red-500 scale-90"
                        : "text-blue-500 scale-105"
                    }`}
                  />
                  <div
                    className={`absolute -bottom-3 px-3 py-1 text-xs font-semibold rounded-full ${
                      node === failedNode
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {node === failedNode ? "Failed" : "Active"}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Task Scheduling Section - Right */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-teal-100 p-8 rounded-lg shadow-lg w-full max-w-2xl min-h-[350px] flex flex-col items-center"
          >
            <h2 className="text-3xl font-semibold mb-6 text-teal-600">
              Task Scheduling
            </h2>
            <p className="text-xl font-poppins font-medium text-gray-700 text-center mb-6">
              "Efficient task scheduling ensures workload distribution for
              optimal performance and resource utilization."
            </p>

            {/* Task Scheduling Grid */}
            <div className="grid grid-cols-4 gap-8 justify-center items-center">
              {[0, 1, 2, 3].map((task) => (
                <div key={task} className="relative flex flex-col items-center">
                  <Circle
                    size={60}
                    className={`transition-transform duration-500 ${
                      task === scheduledTask
                        ? "text-teal-500 scale-110 shadow-lg shadow-teal-500"
                        : "text-gray-400 scale-100"
                    }`}
                  />
                  <div
                    className={`absolute -bottom-3 px-3 py-1 text-xs font-semibold rounded-full ${
                      task === scheduledTask
                        ? "bg-teal-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {task === scheduledTask ? "Running" : "Pending"}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        );
        <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl shadow-lg">
          {/* IMAGE - Takes 50% Width */}
          <div className="w-1/2 p-10 rounded-lg overflow-hidden shadow-md">
            <img
              src={giphy1}
              alt="System Insights"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Description - Takes 50% Width */}
          <div className="w-1/2 ">
            <p className=" bg-blue-300 text-white text-3xl md:text-base  font-semibold p-3 rounded-lg shadow-md leading-relaxed">
              **Data visualization** in the distributed system dashboard
              includes **task details**, showing task progress, success rates,
              and execution times. **Worker tasks charts** display active,
              completed, and failed tasks per worker. **Worker load graphs**
              provide insights into CPU, memory, and network usage across nodes.
              The **admin dashboard visualizations** summarize system health,
              user activity, and performance trends, enabling quick
              decision-making.
            </p>
          </div>
        </div>
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-blue-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              High Availability🖥️🔄🖥️
            </h3>
            <p className="text-gray-800">
              Ensure your system stays operational with automatic failover and
              redundancy mechanisms.
            </p>
          </div>

          <div className="bg-teal-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-teal-600">
              Load Balancing🔀
            </h3>
            <p className="text-gray-800">
              Distribute workload efficiently across multiple nodes for optimal
              performance.
            </p>
          </div>

          <div className="bg-purple-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">
              Real-time Monitoring📈📊
            </h3>
            <p className="text-gray-800">
              Monitor system health, performance metrics, and resource
              utilization in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

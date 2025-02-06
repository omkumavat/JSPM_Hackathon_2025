import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import WorkerCard from "./WorkerCard";

const AllWorker = () => {
  const [workers, setWorkers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [workerLoad, setWorkerLoad] = useState([]);

  // Fetch workers & tasks
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(
          "https://jspm-hackathon-2025.vercel.app/server/worker/getAllWorkers"
        );
        setWorkers(response.data);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://jspm-hackathon-2025.vercel.app/server/task/getAllTasks"
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchWorkers();
    fetchTasks();

    const workerInterval = setInterval(fetchWorkers, 5000);
    const taskInterval = setInterval(fetchTasks, 5000);

    return () => {
      clearInterval(workerInterval);
      clearInterval(taskInterval);
    };
  }, []);

  // Calculate worker task count
  // Calculate worker load using worker.currentLoad
  useEffect(() => {
    setWorkerLoad(
      workers.map((worker) => ({
        workerId: worker.id,
        workerName: worker.name,
        currentLoad: worker.currentLoad || 0, // Ensure it doesn't break if undefined
      }))
    );
  }, [workers]);

  // Task distribution for Pie Chart
  const taskDistribution = workers
    .map((worker) => ({
      id: worker.id,
      value: tasks.filter((task) => task.workerId === worker.id).length,
      label: worker.name,
    }))
    .filter((data) => data.value > 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Worker List and Pie Chart - Stack on small screens */}
      <div className="flex flex-col lg:flex-row gap-8 mb-16">
        {/* Task Distribution Pie Chart */}
        <div className="lg:w-2/5 flex justify-center">
          {workers.length > 0 && (
            <div className="bg-white rounded-lg shadow-md w-fit h-fit flex flex-col items-center justify-center">
              <p className="text-center font-poppins bg-fuchsia-600 w-fit rounded-md text-white mt-2 p-1">
                Machine Wise Load
              </p>
              <PieChart
                series={[
                  {
                    data: taskDistribution,
                    innerRadius: 10,
                    outerRadius: 90,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    startAngle: -45,
                    endAngle: 315,
                    cx: 150,
                    cy: 150,
                    textStyle: { fontSize: 6 },
                  },
                ]}
                width={500}
                height={350}
              />
            </div>
          )}
        </div>

        {/* Worker List */}
        <div className="lg:w-3/5 max-h-[400px] overflow-y-auto border border-gray-300 bg-white rounded-lg p-2">
          <div className="font-bold font-poppins text-center bg-orange-400 text-white w-auto rounded-md p-1">
            Current Status
          </div>
          <div className="flex flex-col gap-3">
            {workers.length > 0 ? (
              workers.map((worker) => (
                <div key={worker.id} className="p-2 border-b last:border-b-0">
                  <WorkerCard worker={worker} />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No workers available</p>
            )}
          </div>
        </div>
      </div>

      {/* Worker Load Bar Chart - Ensure it stacks properly */}
      {workers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8 lg:mt-0">
          <h3 className="text-xl font-semibold mb-6 text-center">
            Current Workload of Workers
          </h3>
          <div className="flex justify-center overflow-x-auto">
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: workerLoad.map((worker) => worker.workerName),
                },
              ]}
              series={[
                {
                  data: workerLoad.map((worker) => worker.currentLoad),
                  color: "#4F46E5",
                },
              ]}
              width={800}
              height={400}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWorker;

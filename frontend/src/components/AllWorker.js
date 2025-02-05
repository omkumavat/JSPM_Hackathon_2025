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
          "http://localhost:4000/server/worker/getAllWorkers"
        );
        setWorkers(response.data);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/server/task/getAllTasks"
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

      {/* Worker List and Pie Chart in one flex div */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Task Distribution Pie Chart */}
        {workers.length > 0 && (
          <div className="lg:w-2/5">
            {/* <h3 className="text-xl font-semibold mb-4">Task Distribution</h3> */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <PieChart
                series={[
                  {
                    data: taskDistribution,
                    innerRadius: 40,
                    outerRadius: 130,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    startAngle: -45,
                    endAngle: 225,
                    cx: 200,
                    cy: 200,
                    textStyle : {fontSize : 6},
                  },
                ]}
                width={500}
                height={500}
              />
            </div>
          </div>
        )}

        {/* Worker List */}
        <div className="lg:w-3/5 h-full overflow-y-auto border border-gray-300 rounded-lg p-2">
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

      {/* Worker Load Bar Chart in separate division below */}
      {workers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-6">
            Current Workload of Workers
          </h3>
          <div className="flex justify-center">
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

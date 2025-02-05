import Home from "./components/Home";
import Tasks from "./components/TaskCard";
import Dashboard from "./components/Dashboards/Dashboard";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import WorkerDashboard from "./components/Dashboards/WorkerDashboard";
import WorkerCard from "./components/WorkerCard";

function App() {
  // Static example of a worker
  const exampleWorker = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    status: 'available',
    currentTask: { name: 'Task 1' },
    lastNotifiedAt: '2025-02-05T10:00:00Z',
    completedTask: [
      { name: 'Completed Task 1' },
      { name: 'Completed Task 2' }
    ]
  };
  
  return (
    <div className="app-container">
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/dashboard" element={<WorkerDashboard />} />
          <Route path="/adashboard" element={<Dashboard />} />
          <Route path="/workercard" element={<WorkerCard worker={exampleWorker} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

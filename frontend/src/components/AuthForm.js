import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import axios from "axios";



export default function AuthForm() {
  const {login,currentUser}=useAuth();
  const [mode, setMode] = useState("login");
  const [userType, setUserType] = useState("worker");
  const[isLogin , setIsLogin] = useState(false);
  const[isAdmin , setIsAdmin] = useState(false);
  const[isWorker , setIsWorker] = useState(false); 
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userType === "admin") {
      // Admin Login Validation

      const response = await fetch("https://jspm-hackathon-2025.vercel.app/server/admin/login", {
        method: "POST",
        headers: {  
          "Content-Type": "application/json",
        },
        body: JSON.stringify( { email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (response.ok && formData.password == "123") {
        setIsAdmin(true);
        login(data);
        localStorage.setItem("Users", JSON.stringify(data));
        //console.log(currentUser);
        navigate("/adashboard");
        alert(
          mode === "login"
            ? "Admin login successful!"
            : "Admin signup successful!"
        );
        setIsLogin(true);
      } else {
        alert(data.message || "Authentication failed");
      }

      return;
    }

    // Determine the correct API endpoint for Worker
    const endpoint =
      mode === "login"
        ? "https://jspm-hackathon-2025.vercel.app/server/worker/login-worker"
        : "https://jspm-hackathon-2025.vercel.app/server/worker/signup-worker";

    try {
      const requestBody =
        mode === "signup"
          ? formData
          : { email: formData.email, password: formData.password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setIsWorker(true);
        login(data);
        localStorage.setItem("Users", JSON.stringify(data));
        //console.log(currentUser);
        navigate("/dashboard");
        alert(
          mode === "login"
            ? "Worker login successful!"
            : "Worker signup successful!"
        );
        setIsLogin(true);
      } else {
        alert(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-indigo-100 animate-pulse blur-2xl opacity-50"></div>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {mode === "signup" && (
            <div className="relative">
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Full Name"
              />
            </div>
          )}

          <div className="relative">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email address"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Password"
            />
          </div>

          {mode === "login" && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Dropdown for User Type */}
          <div className="relative">
            <label htmlFor="userType" className="sr-only">
              User Type
            </label>
            <select
              id="userType"
              name="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="worker">Worker</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <span className="absolute right-4 inset-y-0 flex items-center">
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

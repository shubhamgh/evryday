// /src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username.trim()) {
      setError("Username cannot be empty!");
      return;
    }
    setError(""); // Clear error if input is valid
    localStorage.setItem("username", username);
    navigate("/dashboard"); // Redirect to dashboard
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <img src="/bachodi.png" alt="image" className="mx-auto mb-6 w-16" />

        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 px-4 py-2 border rounded-md w-full focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

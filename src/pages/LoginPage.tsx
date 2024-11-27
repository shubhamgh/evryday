// /src/pages/LoginPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase-config";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user) {
        localStorage.setItem("username", user.displayName || "User");
        navigate("/dashboard"); // Redirect after login
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

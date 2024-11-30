// /src/components/Header.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";
import { BsMoon, BsSun } from "react-icons/bs";

const Header: React.FC = () => {
  const { profilePic, displayName } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <header className="bg-blue-500 text-white px-4 py-3 shadow-md flex justify-between items-center dark:bg-gray-800">
      {/* App Title */}
      <h1 className="text-lg font-bold">
        <Link to="/dashboard">My App</Link>
      </h1>

      {/* Icons and Dropdown */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle with Dice Effect */}
        <motion.div
          className="relative w-10 h-10"
          onClick={() => setDarkMode((prev) => !prev)}
          style={{ perspective: 1000 }} // Perspective for 3D effect
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-xl cursor-pointer"
            animate={{ rotateY: darkMode ? 180 : 0 }} // Rotate the container
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              transformStyle: "preserve-3d", // Preserve 3D space for children
            }}
          >
            {/* Front Face (Moon) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-xl"
              style={{
                backfaceVisibility: "hidden", // Prevent the back face from showing
                transform: "rotateY(0deg)", // Static position for front face
              }}
            >
              <BsMoon />
            </motion.div>

            {/* Back Face (Sun) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-xl"
              style={{
                backfaceVisibility: "hidden", // Prevent front face from showing
                transform: "rotateY(180deg)", // Static position for back face
              }}
            >
              <BsSun />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="focus:outline-none"
          >
            <img
              src={profilePic || "/default-profile.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg py-2 w-48 dark:bg-gray-700 dark:text-white">
              <p className="px-4 py-2 border-b text-sm">Hi, {displayName}</p>
              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => setDropdownOpen(false)}
              >
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

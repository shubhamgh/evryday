import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";
import { BsMoon, BsSun } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";

const Header: React.FC = () => {
  const { profilePic, displayName } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false); // State for copy feedback

  const userUid = auth.currentUser?.uid || "N/A"; // Fallback if UID is unavailable

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

  const handleCopyUid = () => {
    if (userUid !== "N/A") {
      navigator.clipboard.writeText(userUid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    }
  };

  return (
    <header className="bg-blue-500 text-white px-4 py-3 shadow-md flex justify-between items-center dark:bg-gray-800">
      {/* App Title */}
      <h1 className="text-lg font-bold">
        <Link to="/dashboard">Evryday</Link>
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
            <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg py-2 w-48 dark:bg-gray-700 dark:text-white z-50">
              <p className="px-4 py-2 border-b text-sm">Hi, {displayName}</p>

              {/* UID Display */}
              <div
                onClick={handleCopyUid}
                className="px-4 py-2 text-sm cursor-pointer flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <span className="truncate" title={userUid}>
                  UID: {userUid}
                </span>
                {copied ? (
                  <span className="text-green-500 text-xs">✔</span>
                ) : (
                  <FiCopy className="text-blue-500 text-sm" />
                )}
              </div>

              {/* Home Link */}
              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => setDropdownOpen(false)}
              >
                Home
              </Link>

              {/* Logout Button */}
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

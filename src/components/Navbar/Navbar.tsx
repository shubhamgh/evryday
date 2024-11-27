// /src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC<{ isAuthenticated: boolean; onLogout: () => void }> = ({
  isAuthenticated,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-500 text-white py-4">
      <div className="container mx-auto flex justify-between">
        <h1
          className="text-lg font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          My App
        </h1>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link to="/contacts" className="hover:underline">
                Contacts
              </Link>
              <button
                onClick={onLogout}
                className="hover:underline bg-red-500 px-2 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

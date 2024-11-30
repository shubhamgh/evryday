// /src/pages/Dashboard.tsx
import React from "react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const features = [
    { name: "To-Do", path: "/todo", color: "bg-blue-400 dark:bg-blue-600" },
    {
      name: "Contacts",
      path: "/contacts",
      color: "bg-green-400 dark:bg-green-600",
    },
    {
      name: "Calendar",
      path: "/calendar",
      color: "bg-purple-400 dark:bg-purple-600",
    },
    {
      name: "Watch Later",
      path: "/watchlater",
      color: "bg-yellow-400 dark:bg-yellow-600",
    },
    { name: "Alerts", path: "/alerts", color: "bg-red-400 dark:bg-red-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.name}
            to={feature.path}
            className={`rounded-lg shadow-md text-white text-center py-8 ${feature.color} hover:shadow-lg hover:scale-105 transition`}
          >
            {feature.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

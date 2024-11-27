// /src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{
  isAuthenticated: boolean;
  children: JSX.Element;
}> = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;

// /src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ToDoPage from "./pages/ToDoPage";
import Contacts from "./pages/Contacts";
import ProtectedRoute from "./components/ProtectedRoute";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import Layout from "./components/Layout";
import EditList from "./components/EditList";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state to avoid flickers

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false); // Loading complete
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <span className="animate-pulse text-lg font-semibold text-gray-600">
          Loading the Evryday Experience...
        </span>
      </div>
    );
  }

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/edit-list/:listId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout>
                  <EditList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/todo"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout>
                  <ToDoPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout>
                  <Contacts />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;

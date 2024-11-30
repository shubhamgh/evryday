// /src/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

// Define the context structure
interface UserContextType {
  isAuthenticated: boolean;
  profilePic: string | null;
  displayName: string;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setProfilePic: React.Dispatch<React.SetStateAction<string | null>>;
  setDisplayName: React.Dispatch<React.SetStateAction<string>>;
}

// Default context values
const UserContext = createContext<UserContextType>({
  isAuthenticated: false,
  profilePic: null,
  displayName: "User",
  setIsAuthenticated: () => {},
  setProfilePic: () => {},
  setDisplayName: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setProfilePic(user.photoURL);
        setDisplayName(user.displayName || "User");
      } else {
        setIsAuthenticated(false);
        setProfilePic(null);
        setDisplayName("User");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        profilePic,
        displayName,
        setIsAuthenticated,
        setProfilePic,
        setDisplayName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easier use of context
export const useUser = () => useContext(UserContext);

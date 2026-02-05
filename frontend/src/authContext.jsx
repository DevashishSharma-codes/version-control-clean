import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(null);
  const [loading, setLoading] = useState(true); // 1. Add loading state, default to true

  useEffect(() => {
    try {
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      if (userId) {
        setCurrentUser({ _id: userId }); // Store as an object to match Profile page logic
      }
      if (username) {
        setCurrentUsername(username);
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
    } finally {
      setLoading(false); // 2. Set loading to false after the check is complete
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setCurrentUser(null);
    setCurrentUsername(null);
  };

  const value = {
    currentUser,
    setCurrentUser,
    currentUsername,
    setCurrentUsername,

    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* 3. Do not render children until the loading check is finished */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
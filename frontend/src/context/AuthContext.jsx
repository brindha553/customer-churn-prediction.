import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const DEFAULT_USER = {
  name: "Alex Morgan",
  email: "alex.morgan@churnpredict.ai",
  role: "Senior Retention Analyst",
  organization: "Enterprise Telecom AI Labs",
  memberSince: "August 2025"
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("churnpredict_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("churnpredict_auth") === "true";
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("churnpredict_theme") || "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
    }
    localStorage.setItem("churnpredict_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const login = (email, password) => {
    const user = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
      name: email ? email.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase()) : DEFAULT_USER.name
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("churnpredict_user", JSON.stringify(user));
    localStorage.setItem("churnpredict_auth", "true");
    return true;
  };

  const register = (fullName, email, password) => {
    const user = {
      ...DEFAULT_USER,
      name: fullName,
      email: email
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("churnpredict_user", JSON.stringify(user));
    localStorage.setItem("churnpredict_auth", "true");
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("churnpredict_auth", "false");
  };

  const updateProfile = (updatedData) => {
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    localStorage.setItem("churnpredict_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        theme,
        toggleTheme,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

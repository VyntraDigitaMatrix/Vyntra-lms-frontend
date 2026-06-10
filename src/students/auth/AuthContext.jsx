import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { studentAuth } from "./api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Load profile if token exists on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("student_accessToken");
      if (token) {
        try {
          const res = await studentAuth.getProfile();
          if (res.data && res.data.data) {
            setStudent(res.data.data);
            setIsAuthenticated(true);
          } else {
            clearAuth();
          }
        } catch (err) {
          console.error("Failed to load student profile:", err);
          clearAuth();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("student_accessToken");
    localStorage.removeItem("student_refreshToken");
    setStudent(null);
    setIsAuthenticated(false);
  };

  const login = async (email, password) => {
    try {
      const res = await studentAuth.login({ email, password });
      if (res.data && res.data.data) {
        const { accessToken, refreshToken } = res.data.data;
        localStorage.setItem("student_accessToken", accessToken);
        localStorage.setItem("student_refreshToken", refreshToken);

        // Fetch current profile
        const profileRes = await studentAuth.getProfile();
        if (profileRes.data && profileRes.data.data) {
          setStudent(profileRes.data.data);
          setIsAuthenticated(true);
          navigate("/student/dashboard");
          return { success: true };
        }
      }
      return { success: false, message: "Login response did not contain token information" };
    } catch (err) {
      console.error("Login error:", err);
      const message = err.response?.data?.message || "Invalid credentials";
      return { success: false, message };
    }
  };

  const register = async (requestData) => {
    try {
      const res = await studentAuth.register(requestData);
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Registration error:", err);
      const message = err.response?.data?.message || "Registration failed";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await studentAuth.logout();
    } catch (err) {
      console.error("Logout error on server:", err);
    } finally {
      clearAuth();
      navigate("/UserLogin");
    }
  };

  const handleOAuthSuccess = async (accessToken, refreshToken) => {
    localStorage.setItem("student_accessToken", accessToken);
    localStorage.setItem("student_refreshToken", refreshToken);
    try {
      const profileRes = await studentAuth.getProfile();
      if (profileRes.data && profileRes.data.data) {
        setStudent(profileRes.data.data);
        setIsAuthenticated(true);
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.error("OAuth profile fetch failed:", err);
      clearAuth();
    }
  };

  const googleLogin = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    window.location.href = `${apiBaseUrl}/oauth2/authorization/google`;
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        googleLogin,
        handleOAuthSuccess,
        setStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

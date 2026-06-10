import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { instructorAuth } from "./api";

const InstructorAuthContext = createContext(null);

export const InstructorAuthProvider = ({ children }) => {
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Load profile if token exists on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("instructor_accessToken");
      if (token) {
        try {
          const res = await instructorAuth.getProfile();
          if (res.data && res.data.data) {
            setInstructor(res.data.data);
            setIsAuthenticated(true);
          } else {
            clearAuth();
          }
        } catch (err) {
          console.error("Failed to load instructor profile:", err);
          clearAuth();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("instructor_accessToken");
    localStorage.removeItem("instructor_refreshToken");
    setInstructor(null);
    setIsAuthenticated(false);
  };

  const login = async (email, password) => {
    try {
      const res = await instructorAuth.login({ email, password });
      if (res.data && res.data.data) {
        return { success: true, sessionId: res.data.data.sessionId };
      }
      return { success: false, message: "Login failed to return session details" };
    } catch (err) {
      console.error("Instructor login error:", err);
      const message = err.response?.data?.message || "Invalid credentials";
      return { success: false, message };
    }
  };

  const verifyOtp = async (sessionId, otp) => {
    try {
      const res = await instructorAuth.verifyOtp({ sessionId, otp });
      if (res.data && res.data.data) {
        const { accessToken, refreshToken } = res.data.data;
        localStorage.setItem("instructor_accessToken", accessToken);
        localStorage.setItem("instructor_refreshToken", refreshToken);

        // Fetch current profile
        const profileRes = await instructorAuth.getProfile();
        if (profileRes.data && profileRes.data.data) {
          setInstructor(profileRes.data.data);
          setIsAuthenticated(true);
          navigate("/instructor/dashboard");
          return { success: true };
        }
      }
      return { success: false, message: "Verification failed to return token details" };
    } catch (err) {
      console.error("Instructor OTP verification error:", err);
      const message = err.response?.data?.message || "Invalid OTP";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await instructorAuth.logout();
    } catch (err) {
      console.error("Instructor logout error on server:", err);
    } finally {
      clearAuth();
      navigate("/InstructorLogin");
    }
  };

  return (
    <InstructorAuthContext.Provider
      value={{
        instructor,
        loading,
        isAuthenticated,
        login,
        verifyOtp,
        logout,
        setInstructor,
      }}
    >
      {children}
    </InstructorAuthContext.Provider>
  );
};

export const useInstructorAuth = () => {
  const context = useContext(InstructorAuthContext);
  if (!context) {
    throw new Error("useInstructorAuth must be used within an InstructorAuthProvider");
  }
  return context;
};

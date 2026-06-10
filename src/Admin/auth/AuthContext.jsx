import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { adminAuth } from "./api";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Load profile if token exists on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_accessToken");
      if (token) {
        try {
          const res = await adminAuth.getProfile();
          if (res.data && res.data.data) {
            setAdmin(res.data.data);
            setIsAuthenticated(true);
          } else {
            clearAuth();
          }
        } catch (err) {
          console.error("Failed to load admin profile:", err);
          clearAuth();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("admin_accessToken");
    localStorage.removeItem("admin_refreshToken");
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const login = async (email, password) => {
    try {
      const res = await adminAuth.login({ email, password });
      if (res.data && res.data.data) {
        return { success: true, sessionId: res.data.data.sessionId };
      }
      return { success: false, message: "Login failed to return session details" };
    } catch (err) {
      console.error("Admin login error:", err);
      const message = err.response?.data?.message || "Invalid credentials";
      return { success: false, message };
    }
  };

  const verifyOtp = async (sessionId, otp) => {
    try {
      const res = await adminAuth.verifyOtp({ sessionId, otp });
      if (res.data && res.data.data) {
        const { accessToken, refreshToken } = res.data.data;
        localStorage.setItem("admin_accessToken", accessToken);
        localStorage.setItem("admin_refreshToken", refreshToken);

        // Fetch current profile
        const profileRes = await adminAuth.getProfile();
        if (profileRes.data && profileRes.data.data) {
          setAdmin(profileRes.data.data);
          setIsAuthenticated(true);
          navigate("/admin/dashboard");
          return { success: true };
        }
      }
      return { success: false, message: "Verification failed to return token details" };
    } catch (err) {
      console.error("Admin OTP verification error:", err);
      const message = err.response?.data?.message || "Invalid OTP";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await adminAuth.logout();
    } catch (err) {
      console.error("Admin logout error on server:", err);
    } finally {
      clearAuth();
      navigate("/AdminLogin");
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated,
        login,
        verifyOtp,
        logout,
        setAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

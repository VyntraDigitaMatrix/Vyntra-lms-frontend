import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useInstructorAuth } from "./AuthContext";

const InstructorPrivateRoute = () => {
  const { isAuthenticated, loading } = useInstructorAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f7fb]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/InstructorLogin" replace />;
};

export default InstructorPrivateRoute;

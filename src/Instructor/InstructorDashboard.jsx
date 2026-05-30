import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const InstructorDashboard = () => {
  const navigate = useNavigate();

  const session = JSON.parse(
    sessionStorage.getItem("instructorSession")
  );

  if (!session?.isLoggedIn) {
    return <Navigate to="/instructor/login" />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem("instructorSession");
    navigate("/instructor/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Instructor Dashboard
      </h1>

      <p className="mb-4">
        Welcome {session.email}
      </p>
    </div>
  );
};

export default InstructorDashboard;
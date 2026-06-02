import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const InstructorDashboard = () => {
  const navigate = useNavigate();

  const session = JSON.parse(
    sessionStorage.getItem("instructorSession") || "{}"
  );

  // Commented out to make dashboard visible without login during development
  // if (!session?.isLoggedIn) {
  //   return <Navigate to="/InstructorLogin" />;
  // }

  const handleLogout = () => {
    sessionStorage.removeItem("instructorSession");
    navigate("/InstructorLogin");
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
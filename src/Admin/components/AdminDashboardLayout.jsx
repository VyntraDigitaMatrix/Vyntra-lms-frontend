import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminDashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="h-screen bg-white overflow-hidden">
      <div className="flex h-full">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />

          <main className="flex-1 overflow-y-auto scrollbar-hide bg-gray-50 p-2">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
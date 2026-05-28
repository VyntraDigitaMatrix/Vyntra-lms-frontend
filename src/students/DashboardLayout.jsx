import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ContactSupport from "./ContactSupport";const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
  <div className="h-screen bg-white overflow-hidden">
    <div className="flex h-full">
      <Sidebar
  isCollapsed={isSidebarCollapsed}
  toggleSidebar={toggleSidebar}
/>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

       <main className="flex-1 overflow-y-auto scrollbar-hide bg-white p-2">
          {children}
        </main>
      </div>
    </div>
     <ContactSupport />
  </div>
);
  
};

export default DashboardLayout;
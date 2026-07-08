import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import LogoName from "../assets/LOGO BG.jpg.jpeg";
import LogoPlain from "../assets/Vyntra One Plain BG Image.png";
import {
  FaHome,
  FaClipboardList,
  FaCalendarAlt,
  FaVideo,
  FaComments,
  FaFolder,
  FaStickyNote,
  FaDownload,
  FaUsers,
  FaBook,
  FaCog,
  FaChevronDown,
  FaKey,
  FaBookOpen,
  FaCertificate,
  FaBriefcase,
  FaReadme,
} from "react-icons/fa";
import { MdQuiz } from "react-icons/md";

function Sidebar({ isCollapsed, toggleSidebar }) {
  const [openSettings, setOpenSettings] = useState(false);
  const [openClasses, setOpenClasses] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const topMenuItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/student/dashboard" },
    { icon: <FaBook />, label: "My Courses", path: "/student/courses" },
    { icon: <FaBookOpen />, label: "All Courses", path: "/student/all-courses" },
  ];

  const menuItems = [
    { icon: <FaClipboardList />, label: "Assignments", path: "/student/assignments" },
    { icon: <FaCalendarAlt />, label: "Schedule", path: "/student/schedule" },
    { icon: <FaReadme />, label: "Resume", path: "/student/resume" },
    { icon: <MdQuiz />, label: "Quizzes", path: "/student/quiz" },
    { icon: <FaComments />, label: "Discussions", path: "/student/discussions" },
    { icon: <FaFolder />, label: "Resources", path: "/student/resources" },
    { icon: <FaStickyNote />, label: "Notes", path: "/student/notes" },
    { icon: <FaCertificate />, label: "Certificates", path: "/student/certificates" },
    { icon: <FaBriefcase />, label: "Job Notifications", path: "/student/job-notifications" },
  ];

  const collapsed = isMobile ? false : isCollapsed;

  const SidebarContent = () => (
    <nav className="flex-1 flex flex-col gap-1 mt-2 overflow-y-auto overflow-x-hidden pb-6"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
      {topMenuItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          onClick={() => isMobile && setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center ${collapsed ? "justify-center py-3 mx-2" : "gap-3 px-4 py-3 mx-2"
            } rounded-xl cursor-pointer transition text-sm font-medium ${isActive
              ? "bg-[#043573] text-white"
              : "text-gray-600 hover:bg-slate-100 hover:text-blue-900"
            }`
          }
        >
          <span className="text-[14px]">{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
        </NavLink>
      ))}

      {/* Live Classes dropdown */}
      <button
        type="button"
        onClick={() => setOpenClasses(!openClasses)}
        className={`flex items-center ${collapsed ? "justify-center py-3 mx-2" : "justify-between px-4 py-3 mx-2"
          } rounded-xl cursor-pointer transition text-sm font-medium text-gray-600 hover:bg-slate-100 hover:text-blue-900`}
      >
        <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
          <FaUsers className="text-[14px]" />
          {!collapsed && <span>Live Classes</span>}
        </div>
        {!collapsed && (
          <FaChevronDown
            size={12}
            className={`transition-transform duration-300 ${openClasses ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {openClasses && !collapsed && (
        <div className="ml-8 mr-4 flex flex-col gap-1">
          <NavLink
            to="/student/classes"
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition ${isActive
                ? "bg-[#043573] text-white"
                : "text-gray-500 hover:bg-blue-900 hover:text-white"
              }`
            }
          >
            <FaUsers size={13} />
            <span>Live Classes</span>
          </NavLink>
          <NavLink
            to="/student/recordings"
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition ${isActive
                ? "bg-[#043573] text-white"
                : "text-gray-500 hover:bg-blue-900 hover:text-white"
              }`
            }
          >
            <FaVideo size={13} />
            <span>Recordings</span>
          </NavLink>
        </div>
      )}

      {menuItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          onClick={() => isMobile && setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center ${collapsed ? "justify-center py-3 mx-2" : "gap-3 px-4 py-3 mx-2"
            } rounded-xl cursor-pointer transition text-sm font-medium ${isActive
              ? "bg-[#043573] text-white"
              : "text-gray-600 hover:bg-slate-100 hover:text-blue-900"
            }`
          }
        >
          <span className="text-[14px]">{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
        </NavLink>
      ))}

      {/* Settings dropdown */}
      <button
        type="button"
        onClick={() => setOpenSettings(!openSettings)}
        className={`flex items-center ${collapsed ? "justify-center py-3 mx-2" : "justify-between px-4 py-3 mx-2"
          } rounded-xl cursor-pointer transition text-sm font-medium text-gray-600 hover:bg-slate-100 hover:text-blue-800`}
      >
        <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
          <FaCog className="text-[14px]" />
          {!collapsed && <span>Settings</span>}
        </div>
        {!collapsed && (
          <FaChevronDown
            size={12}
            className={`transition-transform duration-300 ${openSettings ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {openSettings && !collapsed && (
        <div className="ml-8 mr-4 flex flex-col gap-1">
          <NavLink
            to="/student/change-password"
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition ${isActive
                ? "bg-[#043573] text-white"
                : "text-gray-500 hover:bg-blue-900 hover:text-white"
              }`
            }
          >
            <FaKey size={13} />
            <span>Change Password</span>
          </NavLink>
        </div>
      )}
    </nav>
  );

  /* ── MOBILE ── */
  if (isMobile) {
    return (
      <>
        {/* Hamburger / toggle button fixed to top-left */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-[100] w-8 h-8 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-600 transition "
          aria-label="Toggle sidebar"
        >
          {mobileOpen ? "‹" : "›"}
        </button>

        {/* Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-[60] bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Drawer */}
        <aside
          className={`fixed top-0 left-0 h-full z-[70] bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 w-[210px] ${mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* Logo */}
          <div className="flex items-center mt-7 mb-6 justify-center gap-2">
            <div className="w-5 h-5 border-4 border-blue-600 rounded-md"></div>
            <h1 className="text-[20px] font-bold tracking-[4px] text-[#111]">VYNTRA</h1>
          </div>

          <SidebarContent />
        </aside>
      </>
    );
  }

  /* ── DESKTOP ── */
  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 relative flex flex-col ${isCollapsed ? "w-[80px]" : "w-[210px]"
        }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute top-6 -right-4 w-8 h-8 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center text-gray-400 hover:text-blue-800 hover:border-blue-800 transition z-50"
      >
        {isCollapsed ? "›" : "‹"}
      </button>

      {/* Logo */}
      <div className={`flex items-center justify-center gap-2 border-b border-gray-100 ${isCollapsed ? "py-3" : "py-2"}`}>
        <img
          src={LogoPlain}
          alt="Vyntra Icon"
          className="h-13 w-auto object-contain -ml-5"
        />
      </div>

      <SidebarContent />
    </aside>
  );
}

export default Sidebar;
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
import { MdQuiz, MdFactCheck } from "react-icons/md";

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
    { icon: <MdQuiz />, label: "Quizzes", path: "/student/quiz" },
    { icon: <FaComments />, label: "Discussions", path: "/student/discussions" },
    { icon: <FaFolder />, label: "Resources", path: "/student/resources" },
    { icon: <FaStickyNote />, label: "Notes", path: "/student/notes" },
    { icon: <FaCertificate />, label: "Certificates", path: "/student/certificates" },
    { icon: <FaBriefcase />, label: "Job Notifications", path: "/student/job-notifications" },
    { icon: <FaReadme />, label: "Resume", path: "/student/resume" },
  ];

  const collapsed = isMobile ? false : isCollapsed;

  const SidebarContent = () => (
    <nav
      className="flex-1 flex flex-col gap-1 mt-3 px-2 overflow-y-auto overflow-x-hidden pb-6 scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {topMenuItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          onClick={() => isMobile && setMobileOpen(false)}
          className={({ isActive }) =>
            `group relative flex items-center ${
              collapsed ? "justify-center py-3 px-2" : "gap-3.5 px-3.5 py-2.5"
            } rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium ${
              isActive
                ? "bg-[#043573] text-white shadow-md shadow-[#043573]/25 font-semibold"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-[#043573]"
            }`
          }
        >
          <span className="text-[15px] shrink-0 transition-transform duration-200 group-hover:scale-110">
            {item.icon}
          </span>
          {!collapsed && <span className="truncate">{item.label}</span>}
        </NavLink>
      ))}

      {/* Live Classes dropdown */}
      <button
        type="button"
        onClick={() => setOpenClasses(!openClasses)}
        className={`group flex items-center ${
          collapsed ? "justify-center py-3 px-2" : "justify-between px-3.5 py-2.5"
        } rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium text-slate-600 hover:bg-slate-100/80 hover:text-[#043573]`}
      >
        <div className={`flex items-center ${collapsed ? "" : "gap-3.5"}`}>
          <FaUsers className="text-[15px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
          {!collapsed && <span className="truncate">Live Classes</span>}
        </div>
        {!collapsed && (
          <FaChevronDown
            size={11}
            className={`transition-transform duration-300 ${openClasses ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {openClasses && !collapsed && (
        <div className="ml-5 pl-3 border-l-2 border-slate-200 my-1 flex flex-col gap-1">
          <NavLink
            to="/student/classes"
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#043573] text-white font-semibold"
                  : "text-slate-500 hover:bg-slate-100 hover:text-[#043573]"
              }`
            }
          >
            <FaUsers size={12} />
            <span>Live Classes</span>
          </NavLink>
          <NavLink
            to="/student/recordings"
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#043573] text-white font-semibold"
                  : "text-slate-500 hover:bg-slate-100 hover:text-[#043573]"
              }`
            }
          >
            <FaVideo size={12} />
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
            `group relative flex items-center ${
              collapsed ? "justify-center py-3 px-2" : "gap-3.5 px-3.5 py-2.5"
            } rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium ${
              isActive
                ? "bg-[#043573] text-white shadow-md shadow-[#043573]/25 font-semibold"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-[#043573]"
            }`
          }
        >
          <span className="text-[15px] shrink-0 transition-transform duration-200 group-hover:scale-110">
            {item.icon}
          </span>
          {!collapsed && <span className="truncate">{item.label}</span>}
        </NavLink>
      ))}

      {/* Settings dropdown */}
      <button
        type="button"
        onClick={() => setOpenSettings(!openSettings)}
        className={`group flex items-center ${
          collapsed ? "justify-center py-3 px-2" : "justify-between px-3.5 py-2.5"
        } rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium text-slate-600 hover:bg-slate-100/80 hover:text-[#043573]`}
      >
        <div className={`flex items-center ${collapsed ? "" : "gap-3.5"}`}>
          <FaCog className="text-[15px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
          {!collapsed && <span className="truncate">Settings</span>}
        </div>
        {!collapsed && (
          <FaChevronDown
            size={11}
            className={`transition-transform duration-300 ${openSettings ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {openSettings && !collapsed && (
        <div className="ml-5 pl-3 border-l-2 border-slate-200 my-1 flex flex-col gap-1">
          <NavLink
            to="/student/change-password"
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#043573] text-white font-semibold"
                  : "text-slate-500 hover:bg-slate-100 hover:text-[#043573]"
              }`
            }
          >
            <FaKey size={12} />
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
        {/* Hamburger / toggle button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-[100] w-9 h-9 bg-white border border-slate-200 rounded-xl shadow-md flex items-center justify-center text-slate-600 hover:text-[#043573] hover:border-[#043573] transition-all"
          aria-label="Toggle sidebar"
        >
          {mobileOpen ? "‹" : "›"}
        </button>

        {/* Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Drawer */}
        <aside
          className={`fixed top-0 left-0 h-full z-[70] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 w-[220px] shadow-2xl ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center mt-6 mb-4 justify-center gap-2 px-4 pb-3 border-b border-slate-100">
            <img src={LogoPlain} alt="Vyntra" className="h-10 w-auto object-contain" />
          </div>

          <SidebarContent />
        </aside>
      </>
    );
  }

  /* ── DESKTOP ── */
  return (
    <aside
      className={`h-screen bg-white border-r border-slate-200/80 transition-all duration-300 relative flex flex-col shrink-0 z-20 ${
        isCollapsed ? "w-[76px]" : "w-[220px]"
      }`}
    >
      {/* Collapse toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-5 -right-3.5 w-7 h-7 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-[#043573] hover:border-[#043573] hover:scale-110 transition-all z-50 cursor-pointer"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <span className="text-sm font-bold leading-none">{isCollapsed ? "›" : "‹"}</span>
      </button>

      {/* Logo Container */}
      <div
        className={`flex items-center justify-center border-b border-slate-100 transition-all ${
          isCollapsed ? "py-4 px-2" : "py-3 px-4"
        }`}
      >
        <img
          src={LogoPlain}
          alt="Vyntra Icon"
          className={`h-11 w-auto object-contain transition-all ${isCollapsed ? "scale-90" : ""}`}
        />
      </div>

      <SidebarContent />
    </aside>
  );
}

export default Sidebar;
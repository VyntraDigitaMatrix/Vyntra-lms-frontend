import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import LogoPlain from "../assets/Vyntra One Plain BG Image.png";
import {
  FaHome,
  FaUsers,
  FaClipboardList,
  FaCalendarAlt,
  FaVideo,
  FaComments,
  FaFolder,
  FaCog,
  FaChevronDown,
  FaKey,
  FaChalkboardTeacher,
  FaChartBar,
  FaCreditCard,
  FaLaptop,
  FaCertificate,
} from "react-icons/fa";
import { MdQuiz } from "react-icons/md";

function Sidebar({ isCollapsed, toggleSidebar }) {
  const [openSettings, setOpenSettings] = useState(false);
  const [openLive, setOpenLive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const topMenuItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/instructor/dashboard" },
    { icon: <FaChalkboardTeacher />, label: "My Courses", path: "/instructor/courses" },
    { icon: <FaUsers />, label: "Students", path: "/instructor/students" },
  ];

  const menuItems = [
    { icon: <FaClipboardList />, label: "Assignments", path: "/instructor/assignments" },
    { icon: <MdQuiz />, label: "Quiz", path: "/instructor/quiz" },
    { icon: <FaCertificate />, label: "Certificates", path: "/instructor/certificates" },
    { icon: <FaComments />, label: "Discussions", path: "/instructor/discussions" },
    { icon: <FaFolder />, label: "Resources", path: "/instructor/resources" },
    { icon: <FaCreditCard />, label: "Plans", path: "/instructor/plans" },
    { icon: <FaChartBar />, label: "Reports", path: "/instructor/reports" },
  ];

  const collapsed = isMobile ? false : isCollapsed;

  const linkClass = ({ isActive }) =>
    `group relative flex items-center ${
      collapsed ? "justify-center py-3 px-2" : "gap-3.5 px-3.5 py-2.5"
    } rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium ${
      isActive
        ? "bg-[#7c3aed] text-white shadow-md shadow-[#7c3aed]/25 font-semibold"
        : "text-slate-600 hover:bg-slate-100/80 hover:text-[#7c3aed]"
    }`;

  const subLinkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
      isActive
        ? "bg-[#7c3aed] text-white font-semibold"
        : "text-slate-500 hover:bg-slate-100 hover:text-[#7c3aed]"
    }`;

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
          className={linkClass}
        >
          <span className="text-[15px] shrink-0 transition-transform duration-200 group-hover:scale-110">
            {item.icon}
          </span>
          {!collapsed && <span className="truncate">{item.label}</span>}
        </NavLink>
      ))}

      {/* Live Sessions dropdown */}
      <button
        type="button"
        onClick={() => setOpenLive(!openLive)}
        className={`group flex items-center ${
          collapsed ? "justify-center py-3 px-2" : "justify-between px-3.5 py-2.5"
        } rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium text-slate-600 hover:bg-slate-100/80 hover:text-[#7c3aed]`}
      >
        <div className={`flex items-center ${collapsed ? "" : "gap-3.5"}`}>
          <FaVideo className="text-[15px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
          {!collapsed && <span className="truncate">Live Sessions</span>}
        </div>
        {!collapsed && (
          <FaChevronDown
            size={11}
            className={`transition-transform duration-300 ${openLive ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {openLive && !collapsed && (
        <div className="ml-5 pl-3 border-l-2 border-slate-200 my-1 flex flex-col gap-1">
          <NavLink to="/instructor/zoom-meetings" onClick={() => isMobile && setMobileOpen(false)} className={subLinkClass}>
            <FaLaptop size={12} />
            <span>Zoom Meetings</span>
          </NavLink>
          <NavLink to="/instructor/recordings" onClick={() => isMobile && setMobileOpen(false)} className={subLinkClass}>
            <FaVideo size={12} />
            <span>Recordings</span>
          </NavLink>
          <NavLink to="/instructor/schedule" onClick={() => isMobile && setMobileOpen(false)} className={subLinkClass}>
            <FaCalendarAlt size={12} />
            <span>Schedule</span>
          </NavLink>
        </div>
      )}

      {menuItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          onClick={() => isMobile && setMobileOpen(false)}
          className={linkClass}
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
        } rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium text-slate-600 hover:bg-slate-100/80 hover:text-[#7c3aed]`}
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
          <NavLink to="/instructor/change-password" onClick={() => isMobile && setMobileOpen(false)} className={subLinkClass}>
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
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-[100] w-9 h-9 bg-white border border-slate-200 rounded-xl shadow-md flex items-center justify-center text-slate-600 hover:text-[#7c3aed] hover:border-[#7c3aed] transition-all"
          aria-label="Toggle sidebar"
        >
          {mobileOpen ? "‹" : "›"}
        </button>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={`fixed top-0 left-0 h-full z-[70] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 w-[220px] shadow-2xl ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col items-center mt-6 mb-3 gap-2 px-4 pb-3 border-b border-slate-100">
            <img src={LogoPlain} alt="Vyntra" className="h-10 w-auto object-contain" />
            <span className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-widest bg-violet-50 px-2.5 py-1 rounded-full">
              Instructor
            </span>
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
      <button
        onClick={toggleSidebar}
        className="absolute top-5 -right-3.5 w-7 h-7 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-[#7c3aed] hover:border-[#7c3aed] hover:scale-110 transition-all z-50 cursor-pointer"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <span className="text-sm font-bold leading-none">{isCollapsed ? "›" : "‹"}</span>
      </button>

      <div
        className={`flex flex-col items-center justify-center border-b border-slate-100 transition-all gap-1.5 ${
          isCollapsed ? "py-4 px-2" : "py-3 px-4"
        }`}
      >
        <img
          src={LogoPlain}
          alt="Vyntra Icon"
          className={`h-11 w-auto object-contain transition-all ${isCollapsed ? "scale-90" : ""}`}
        />
        {!collapsed && (
          <span className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-widest bg-violet-50 px-2.5 py-1 rounded-full">
            Instructor
          </span>
        )}
      </div>

      <SidebarContent />
    </aside>
  );
}

export default Sidebar;

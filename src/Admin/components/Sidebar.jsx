import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaPeopleGroup } from "react-icons/fa6";
import {
  FaHome,
  FaClipboardList,
  FaCalendarAlt,
  FaVideo,
  FaComments,
  FaFolder,
  FaStickyNote,
  FaUsers,
  FaBook,
  FaChevronDown,
  FaUserSecret,
  FaCertificate,
  FaTags,
  FaBriefcase,
  FaChevronLeft,
  FaChevronRight,
  FaHashtag,
} from "react-icons/fa";
import vyntraMark from "../../assets/vyntra-mark.png";

const navItemBase =
  "flex items-center rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium";

const activeClasses = "bg-brand-orange text-navy-900 shadow-[0_4px_14px_rgba(245,166,35,0.35)] font-semibold";
const inactiveClasses = "text-navy-100/70 hover:bg-white/10 hover:text-white";
const subActiveClasses = "bg-white/10 text-brand-orange font-semibold border-l-2 border-brand-orange";
const subInactiveClasses = "text-navy-100/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent";

function Sidebar({ isCollapsed, toggleSidebar }) {
  const [openStudents, setOpenStudents] = useState(false);
  const [openInstructors, setOpenInstructors] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);
  const [openClasses, setOpenClasses] = useState(false);
  const [openAssignments, setOpenAssignments] = useState(false);

  useEffect(() => {
    if (isCollapsed) {
      setOpenStudents(false);
      setOpenInstructors(false);
      setOpenCourses(false);
      setOpenClasses(false);
      setOpenAssignments(false);
    }
  }, [isCollapsed]);

  const menuItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <FaCalendarAlt />, label: "Schedule", path: "/admin/schedule" },
    { icon: <FaVideo />, label: "Recordings", path: "/admin/recordings" },
    { icon: <FaComments />, label: "Discussions", path: "/admin/discussions" },
    { icon: <FaHashtag />, label: "Community", path: "/admin/community" },
    { icon: <FaFolder />, label: "Resources", path: "/admin/resources" },
    { icon: <FaStickyNote />, label: "Notes", path: "/admin/notes" },
    { icon: <FaCertificate />, label: "Certificates", path: "/admin/certificates" },
    { icon: <FaTags />, label: "Pricing Plans", path: "/admin/plans" },
    { icon: <FaBriefcase />, label: "Job Notification", path: "/admin/jobs" },
  ];

  const dropdownConfigs = [
    {
      key: "students",
      label: "Students",
      icon: <FaPeopleGroup className="text-[14px]" />,
      isOpen: openStudents,
      toggle: () => setOpenStudents((v) => !v),
      links: [{ to: "/admin/all-students", icon: <FaUsers size={13} />, label: "All Students" }],
    },
    {
      key: "instructors",
      label: "Instructors",
      icon: <FaUserSecret className="text-[14px]" />,
      isOpen: openInstructors,
      toggle: () => setOpenInstructors((v) => !v),
      links: [{ to: "/admin/all-instructors", icon: <FaUserSecret size={13} />, label: "All Instructors" }],
    },
    {
      key: "courses",
      label: "Courses",
      icon: <FaBook className="text-[14px]" />,
      isOpen: openCourses,
      toggle: () => setOpenCourses((v) => !v),
      links: [{ to: "/admin/all-courses", icon: <FaBook size={13} />, label: "All Courses" }],
    },
    {
      key: "classes",
      label: "Classes",
      icon: <FaBook className="text-[14px]" />,
      isOpen: openClasses,
      toggle: () => setOpenClasses((v) => !v),
      links: [{ to: "/admin/all-classes", icon: <FaBook size={13} />, label: "All Classes" }],
    },
    {
      key: "assignments",
      label: "Assignments",
      icon: <FaClipboardList className="text-[14px]" />,
      isOpen: openAssignments,
      toggle: () => setOpenAssignments((v) => !v),
      links: [{ to: "/admin/all-assignments", icon: <FaClipboardList size={13} />, label: "All Assignments" }],
    },
  ];

  return (
    <aside
      className={`h-screen bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 border-r border-white/5 transition-all duration-300 relative flex flex-col ${
        isCollapsed ? "w-[80px]" : "w-[260px]"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-7 -right-3.5 w-7 h-7 bg-brand-orange text-navy-900 rounded-full shadow-lg flex items-center justify-center hover:bg-brand-orange-dark hover:text-white transition z-50 cursor-pointer border-none"
      >
        {isCollapsed ? <FaChevronRight size={11} /> : <FaChevronLeft size={11} />}
      </button>

      {/* Brand header */}
      <div
        className={`flex items-center border-b border-white/10 ${
          isCollapsed ? "justify-center py-6" : "gap-3 px-6 py-6"
        }`}
      >
        <img src={vyntraMark} alt="Vyntra" className={isCollapsed ? "w-9 h-9" : "w-9 h-9 flex-shrink-0"} />
        {!isCollapsed && (
          <div className="leading-tight">
            <h1 className="text-[17px] font-bold tracking-[2px] text-white">
              VYNTRA<span className="text-brand-orange">ONE</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[2px] text-navy-100/50 mt-0.5">Admin Panel</p>
          </div>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-1 mt-3 px-2 overflow-y-auto overflow-x-hidden scrollbar-hide pb-6">
        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${navItemBase} ${isCollapsed ? "justify-center py-3.5" : "gap-3 px-4 py-3.5"} ${
              isActive ? activeClasses : inactiveClasses
            }`
          }
        >
          <FaHome className="text-[14px]" />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        {dropdownConfigs.map((cfg) => (
          <React.Fragment key={cfg.key}>
            <button
              type="button"
              onClick={cfg.toggle}
              className={`${navItemBase} ${
                isCollapsed ? "justify-center py-3.5" : "justify-between px-4 py-3.5"
              } ${inactiveClasses} border-none bg-transparent w-full`}
            >
              <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
                {cfg.icon}
                {!isCollapsed && <span>{cfg.label}</span>}
              </div>
              {!isCollapsed && (
                <FaChevronDown
                  size={11}
                  className={`transition-transform duration-300 ${cfg.isOpen ? "rotate-180 text-brand-orange" : ""}`}
                />
              )}
            </button>

            {cfg.isOpen && !isCollapsed && (
              <div className="ml-6 mr-2 flex flex-col gap-1 mb-1">
                {cfg.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg text-sm transition ${
                        isActive ? subActiveClasses : subInactiveClasses
                      }`
                    }
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}

        <div className={`h-px bg-white/10 my-2 ${isCollapsed ? "mx-2" : "mx-3"}`} />

        {/* Remaining menu items */}
        {menuItems.slice(1).map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `${navItemBase} ${isCollapsed ? "justify-center py-3.5" : "gap-3 px-4 py-3.5"} ${
                isActive ? activeClasses : inactiveClasses
              }`
            }
          >
            <span className="text-[14px]">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

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
  FaDownload,
  FaUsers,
  FaBook,
  FaChevronDown,
  FaUserSecret,
  FaCertificate,
  FaTags,
  FaBriefcase,
} from "react-icons/fa";

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
    { icon: <FaFolder />, label: "Resources", path: "/admin/resources" },
    { icon: <FaStickyNote />, label: "Notes", path: "/admin/notes" },
    { icon: <FaCertificate />, label: "Certificates", path: "/admin/certificates" },
    { icon: <FaTags />, label: "Pricing Plans", path: "/admin/plans" },
    { icon: <FaBriefcase />, label: "Job Notification", path: "/admin/jobs" },
  ];

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 relative flex flex-col ${
        isCollapsed ? "w-[80px]" : "w-[250px]"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-6 -right-4 w-8 h-8 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center text-gray-400 hover:text-[#2BB2A9] hover:border-[#2BB2A9] transition z-50"
      >
        {isCollapsed ? "›" : "‹"}
      </button>

      <div
        className={`flex items-center mt-7 mb-6 ${
          isCollapsed ? "justify-center" : "justify-center gap-2"
        }`}
      >
        <div className="w-5 h-5 border-4 border-[#2BB2A9] rounded-md"></div>

        {!isCollapsed && (
          <h1 className="text-[20px] font-bold tracking-[4px] text-[#111]">
            VYNTRA
          </h1>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-1 mt-2 overflow-y-auto overflow-x-hidden scrollbar-hide pb-6">
        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center ${
              isCollapsed ? "justify-center py-4 mx-2" : "gap-3 px-5 py-4 mx-2"
            } rounded-xl cursor-pointer transition text-sm font-medium ${
              isActive
                ? "bg-[#2BB2A9] text-white"
                : "text-gray-600 hover:bg-[#e6f4f3] hover:text-[#2BB2A9]"
            }`
          }
        >
          <FaHome className="text-[14px]" />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        {/* Students Dropdown */}
        <button
          type="button"
          onClick={() => setOpenStudents(!openStudents)}
          className={`flex items-center ${
            isCollapsed
              ? "justify-center py-4 mx-2"
              : "justify-between px-5 py-4 mx-2"
          } rounded-xl cursor-pointer transition text-sm font-medium text-gray-600 hover:bg-[#e6f4f3] hover:text-[#2BB2A9]`}
        >
          <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
            <FaPeopleGroup className="text-[14px]" />
            {!isCollapsed && <span>Students</span>}
          </div>

          {!isCollapsed && (
            <FaChevronDown
              size={12}
              className={`transition-transform duration-300 ${
                openStudents ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {openStudents && !isCollapsed && (
          <div className="ml-8 mr-4 flex flex-col gap-1">
            <NavLink
              to="/admin/all-students"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-[#2BB2A9] text-white"
                    : "text-gray-500 hover:bg-[#e6f4f3] hover:text-[#2BB2A9]"
                }`
              }
            >
              <FaUsers size={13} />
              <span>All Students</span>
            </NavLink>
          </div>
        )}
        
        {/* Instructors Dropdown */}
        <button
          type="button"
          onClick={() => setOpenInstructors(!openInstructors)}
          className={`flex items-center ${
            isCollapsed
              ? "justify-center py-4 mx-2"
              : "justify-between px-5 py-4 mx-2"
          } rounded-xl cursor-pointer transition text-sm font-medium text-gray-600 hover:bg-[#e6f4f3] hover:text-[#2BB2A9]`}
        >
          <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
            <FaUserSecret className="text-[14px]" />
            {!isCollapsed && <span>Instructors</span>}
          </div>

          {!isCollapsed && (
            <FaChevronDown
              size={12}
              className={`transition-transform duration-300 ${
                openInstructors ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {openInstructors && !isCollapsed && (
          <div className="ml-8 mr-4 flex flex-col gap-1">
            <NavLink
              to="/admin/all-instructors"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-[#2BB2A9] text-white"
                    : "text-gray-500 hover:bg-[#e6f4f3] hover:text-[#2BB2A9]"
                }`
              }
            >
              <FaUserSecret size={13} />
              <span>All Instructors</span>
            </NavLink>
          </div>
        )}
        
        {/* Courses Dropdown */}
        <button
          type="button"
          onClick={() => setOpenCourses(!openCourses)}
          className={`flex items-center ${
            isCollapsed
              ? "justify-center py-4 mx-2"
              : "justify-between px-5 py-4 mx-2"
          } rounded-xl cursor-pointer transition text-sm font-medium text-gray-600 hover:bg-[#e6f4f3] hover:text-[#2BB2A9]`}
        >
          <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
            <FaBook className="text-[14px]" />
            {!isCollapsed && <span>Courses</span>}
          </div>

          {!isCollapsed && (
            <FaChevronDown
              size={12}
              className={`transition-transform duration-300 ${
                openCourses ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {openCourses && !isCollapsed && (
          <div className="ml-8 mr-4 flex flex-col gap-1">
            <NavLink
              to="/admin/all-courses"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-[#2BB2A9] text-white"
                    : "text-gray-500 hover:bg-[#e6f4f3] hover:text-[#2BB2A9]"
                }`
              }
            >
              <FaBook size={13} />
              <span>All Courses</span>
            </NavLink>
          </div>
        )}
          
        {/* Classes Dropdown */}
        <button
          type="button"
          onClick={() => setOpenClasses(!openClasses)}
          className={`flex items-center ${
            isCollapsed
              ? "justify-center py-4 mx-2"
              : "justify-between px-5 py-4 mx-2"
          } rounded-xl cursor-pointer transition text-sm font-medium text-gray-600 hover:bg-[#e6f4f3] hover:text-[#2BB2A9]`}
        >
          <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
            <FaBook className="text-[14px]" />
            {!isCollapsed && <span>Classes</span>}
          </div>

          {!isCollapsed && (
            <FaChevronDown
              size={12}
              className={`transition-transform duration-300 ${
                openClasses ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {openClasses && !isCollapsed && (
          <div className="ml-8 mr-4 flex flex-col gap-1">
            <NavLink
              to="/admin/all-classes"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-[#2BB2A9] text-white"
                    : "text-gray-500 hover:bg-[#e6f4f3] hover:text-[#2BB2A9]"
                }`
              }
            >
              <FaBook size={13} />
              <span>All Classes</span>
            </NavLink>
          </div>
        )}
        
        {/* Assignments Dropdown */}
        <button
          type="button"
          onClick={() => setOpenAssignments(!openAssignments)}
          className={`flex items-center ${
            isCollapsed
              ? "justify-center py-4 mx-2"
              : "justify-between px-5 py-4 mx-2"
          } rounded-xl cursor-pointer transition text-sm font-medium text-gray-600 hover:bg-[#e6f4f3] hover:text-[#2BB2A9]`}
        >
          <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
            <FaClipboardList className="text-[14px]" />
            {!isCollapsed && <span>Assignments</span>}
          </div>

          {!isCollapsed && (
            <FaChevronDown
              size={12}
              className={`transition-transform duration-300 ${
                openAssignments ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {openAssignments && !isCollapsed && (
          <div className="ml-8 mr-4 flex flex-col gap-1">
            <NavLink
              to="/admin/all-assignments"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-[#2BB2A9] text-white"
                    : "text-gray-500 hover:bg-[#e6f4f3] hover:text-[#2BB2A9]"
                }`
              }
            >
              <FaClipboardList size={13} />
              <span>All Assignments</span>
            </NavLink>
          </div>
        )}
        
        {/* Remaining menu items */}
        {menuItems.slice(1).map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed
                  ? "justify-center py-4 mx-2"
                  : "gap-3 px-5 py-4 mx-2"
              } rounded-xl cursor-pointer transition text-sm font-medium ${
                isActive
                  ? "bg-[#2BB2A9] text-white"
                  : "text-gray-600 hover:bg-[#e6f4f3] hover:text-[#2BB2A9]"
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
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaUsers,
  FaClipboardList,
  FaCalendarAlt,
  FaVideo,
  FaComments,
  FaFolder,
  FaStickyNote,
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

  const menuItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/instructor/dashboard" },
    { icon: <FaChalkboardTeacher />, label: "My Courses", path: "/instructor/courses" },
    { icon: <FaCreditCard />, label: "Plans", path: "/instructor/plans" },
    { icon: <FaUsers />, label: "Live Classes", path: "/instructor/live-classes" },
    { icon: <FaCreditCard />, label: "Plans", path: "/instructor/plans" },
    { icon: <FaUsers />, label: "Students", path: "/instructor/students" },
    { icon: <FaClipboardList />, label: "Assignments", path: "/instructor/assignments" },
    { icon: <MdQuiz />, label: "Quiz", path: "/instructor/quiz" },
    { icon: <FaCertificate />, label: "Certificates", path: "/instructor/certificates" },
    { icon: <MdQuiz />, label: "Quiz", path: "/instructor/quiz" },
    { icon: <FaFolder />, label: "Resources", path: "/instructor/resources" },
    { icon: <FaCalendarAlt />, label: "Schedule", path: "/instructor/schedule" },
    { icon: <FaLaptop />, label: "Zoom Meetings", path: "/instructor/zoom-meetings" },
    { icon: <FaVideo />, label: "Recordings", path: "/instructor/recordings" },
    { icon: <FaComments />, label: "Discussions", path: "/instructor/discussions" },
    { icon: <FaCertificate />, label: "Certificates", path: "/instructor/certificates" },
    { icon: <FaChartBar />, label: "Reports", path: "/instructor/reports" },
  ];

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 relative flex flex-col ${isCollapsed ? "w-[80px]" : "w-[250px]"
        }`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-6 -right-4 w-8 h-8 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center text-gray-400 hover:text-[#7c3aed] hover:border-[#7c3aed] transition z-50"
      >
        {isCollapsed ? "›" : "‹"}
      </button>

      <div
        className={`flex items-center mt-7 mb-6 ${isCollapsed ? "justify-center" : "justify-center gap-2"
          }`}
      >
        <div className="w-5 h-5 border-4 border-[#7c3aed] rounded-md"></div>
        {!isCollapsed && (
          <h1 className="text-[20px] font-bold tracking-[4px] text-[#111]">
            VYNTRA
          </h1>
        )}
      </div>

      {!isCollapsed && (
        <div className="mx-4 mb-4 px-3 py-1 bg-purple-50 rounded-lg text-center">
          <span className="text-xs font-semibold text-[#7c3aed] uppercase tracking-widest">Instructor</span>
        </div>
      )}

      <nav className="flex-1 flex flex-col gap-1 mt-2 overflow-y-auto overflow-x-hidden scrollbar-hide pb-6">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${isCollapsed
                ? "justify-center py-4 mx-2"
                : "gap-3 px-5 py-4 mx-2"
              } rounded-xl cursor-pointer transition text-sm font-medium ${isActive
                ? "bg-[#7c3aed] text-white"
                : "text-gray-600 hover:bg-purple-50 hover:text-[#7c3aed]"
              }`
            }
          >
            <span className="text-[14px]">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {/* Settings Parent */}
        <button
          type="button"
          onClick={() => setOpenSettings(!openSettings)}
          className={`flex items-center ${isCollapsed ? "justify-center py-4" : "justify-between px-5 py-4 mx-2"
            } rounded-xl cursor-pointer transition text-sm font-medium text-gray-600 hover:bg-purple-50 hover:text-[#7c3aed]`}
        >
          <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
            <span className="text-[14px]">
              <FaCog />
            </span>
            {!isCollapsed && <span>Settings</span>}
          </div>
          {!isCollapsed && (
            <FaChevronDown
              size={12}
              className={`transition-transform duration-300 ${openSettings ? "rotate-180" : ""
                }`}
            />
          )}
        </button>

        {/* Settings Child */}
        {openSettings && !isCollapsed && (
          <div className="ml-8 mr-4 flex flex-col gap-1">
            <NavLink
              to="/instructor/change-password"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${isActive
                  ? "bg-[#7c3aed] text-white"
                  : "text-gray-500 hover:bg-purple-50 hover:text-[#7c3aed]"
                }`
              }
            >
              <FaKey size={13} />
              <span>Change Password</span>
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
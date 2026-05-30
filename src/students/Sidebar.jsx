import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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
  FaReadme,
} from "react-icons/fa";

function Sidebar({ isCollapsed, toggleSidebar }) {
  const [openSettings, setOpenSettings] = useState(false);
  const [openClasses, setOpenClasses] = useState(false);

  const menuItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/student/dashboard" },
    { icon: <FaBook />, label: "My Courses", path: "/student/courses" },
    {
      icon: <FaBookOpen />,
      label: "All Courses",
      path: "/student/all-courses",
    },
    {
      icon: <FaClipboardList />,
      label: "Assignments",
      path: "/student/assignments",
    },
    { icon: <FaCalendarAlt />, label: "Schedule", path: "/student/schedule" },
    { icon: <FaReadme />, label: "Resume", path: "/student/resume" },
    {
      icon: <FaComments />,
      label: "Discussions",
      path: "/student/discussions",
    },
    { icon: <FaFolder />, label: "Resources", path: "/student/resources" },
    { icon: <FaStickyNote />, label: "Notes", path: "/student/notes" },
    { icon: <FaDownload />, label: "Downloads", path: "/student/downloads" },
  ];

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 relative flex flex-col ${
        isCollapsed ? "w-[80px]" : "w-[210px]"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-6 -right-4 w-8 h-8 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-600 transition z-50"
      >
        {isCollapsed ? "›" : "‹"}
      </button>

      <div
        className={`flex items-center mt-7 mb-6 ${
          isCollapsed ? "justify-center" : "justify-center gap-2"
        }`}
      >
        <div className="w-5 h-5 border-4 border-blue-600 rounded-md"></div>

        {!isCollapsed && (
          <h1 className="text-[20px] font-bold tracking-[4px] text-[#111]">
            VYNTRA
          </h1>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-1 mt-2 overflow-y-auto overflow-x-hidden scrollbar-hide pb-6">
        {menuItems.slice(0, 3).map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed
                  ? "justify-center py-3 mx-2"
                  : "gap-3 px-4 py-3 mx-2"
              } rounded-xl cursor-pointer transition text-sm font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-slate-100 hover:text-blue-600"
              }`
            }
          >
            <span className="text-[14px]">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {/* Live Classes Parent */}
        <button
          type="button"
          onClick={() => setOpenClasses(!openClasses)}
          className={`flex items-center ${
            isCollapsed
              ? "justify-center py-3 mx-2"
              : "justify-between px-4 py-3 mx-2"
          } rounded-xl cursor-pointer transition text-sm font-medium text-gray-600 hover:bg-slate-100 hover:text-blue-600`}
        >
          <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
            <span className="text-[14px]">
              <FaUsers />
            </span>

            {!isCollapsed && <span>Live Classes</span>}
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
              to="/student/classes"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:bg-blue-600 hover:text-white"
                }`
              }
            >
              <FaUsers size={13} />
              <span>Live Classes</span>
            </NavLink>

            <NavLink
              to="/student/recordings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:bg-blue-600 hover:text-white"
                }`
              }
            >
              <FaVideo size={13} />
              <span>Recordings</span>
            </NavLink>
          </div>
        )}

        {menuItems.slice(3).map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed
                  ? "justify-center py-3 mx-2"
                  : "gap-3 px-4 py-3 mx-2"
              } rounded-xl cursor-pointer transition text-sm font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-slate-100 hover:text-blue-600"
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
          className={`flex items-center ${
            isCollapsed
              ? "justify-center py-3 mx-2"
              : "justify-between px-4 py-3 mx-2"
          } rounded-xl cursor-pointer transition text-sm font-medium text-gray-600 hover:bg-slate-100 hover:text-blue-600`}
        >
          <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
            <FaCog className="text-[14px]" />
            {!isCollapsed && <span>Settings</span>}
          </div>

          {!isCollapsed && (
            <FaChevronDown
              size={12}
              className={`transition-transform duration-300 ${
                openSettings ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {openSettings && !isCollapsed && (
          <div className="ml-8 mr-4 flex flex-col gap-1">
            <NavLink
              to="/student/change-password"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:bg-blue-600 hover:text-white"
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

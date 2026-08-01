import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInstructorAuth } from "./auth/AuthContext";
import {
  FaBell,
  FaChevronDown,
  FaUser,
  FaBook,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";

const Navbar = () => {
  const { instructor, logout } = useInstructorAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const profileItems = [
    { icon: <FaUser />, label: "Profile" },
    { icon: <FaBook />, label: "My Courses" },
    { icon: <FaChalkboardTeacher />, label: "My Classes" },
    { icon: <FaBell />, label: "Notifications" },
    { icon: <FaCog />, label: "Settings" },
    { icon: <FaQuestionCircle />, label: "Help & Support" },
    { icon: <FaSignOutAlt />, label: "Logout" },
  ];

  const handleItemClick = async (label) => {
    if (label === "Settings") navigate("/instructor/settings");
    else if (label === "My Courses") navigate("/instructor/courses");
    else if (label === "Profile") navigate("/instructor/profile");
    else if (label === "My Classes") navigate("/instructor/students");
    else if (label === "Notifications") navigate("/instructor/notifications");
    else if (label === "Help & Support") navigate("/instructor/contact-support");
    else if (label === "Logout") {
      await logout();
    }
    setShowProfileMenu(false);
  };

  return (
    <nav className="relative w-full h-[68px] bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-6 z-30">
      {/* Left branding / title placeholder */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Instructor Portal</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications button */}
        <button
          onClick={() => navigate("/instructor/notifications")}
          className="w-10 h-10 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-slate-300 text-slate-600 transition-all duration-200 shadow-2xs relative"
          title="Notifications"
        >
          <FaBell className="text-slate-600 text-sm" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-violet-600 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-slate-50 transition-all duration-200 group focus:outline-none"
          >
            {instructor?.profileImage ? (
              <img
                src={instructor.profileImage}
                alt="Instructor Profile"
                className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-sm group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-indigo-500 flex items-center justify-center text-sm font-bold text-white shadow-sm group-hover:scale-105 transition-transform">
                {instructor?.fullName?.charAt(0).toUpperCase() || "I"}
              </div>
            )}

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {instructor?.fullName || "Instructor"}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Instructor</span>
            </div>

            <FaChevronDown
              className={`text-[10px] text-slate-500 transition-transform duration-300 ${
                showProfileMenu ? "rotate-180 text-[#7c3aed]" : ""
              }`}
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-13 w-[230px] bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 mb-1">
                <p className="text-xs font-semibold text-slate-900">{instructor?.fullName || "Instructor"}</p>
                <p className="text-[11px] text-slate-500 truncate">{instructor?.email || "instructor@vyntra.com"}</p>
              </div>

              <div className="py-1">
                {profileItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleItemClick(item.label)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium cursor-pointer transition-all duration-150 ${
                      item.label === "Logout"
                        ? "text-red-600 hover:bg-red-50"
                        : "text-slate-700 hover:bg-slate-100/80 hover:text-[#7c3aed]"
                    }`}
                  >
                    <span className={item.label === "Logout" ? "text-red-500" : "text-[#7c3aed]"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

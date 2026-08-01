import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import {
  FaBell,
  FaChevronDown,
  FaUser,
  FaBook,
  FaCertificate,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaCalendarAlt,
} from "react-icons/fa";

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const { student, logout } = useAuth();
  const navigate = useNavigate();

  const profileItems = [
    { icon: <FaUser />, label: "Profile" },
    { icon: <FaBook />, label: "My Courses" },
    { icon: <FaCertificate />, label: "Certificates" },
    { icon: <FaBell />, label: "Notifications" },
    { icon: <FaCog />, label: "Settings" },
    { icon: <FaQuestionCircle />, label: "Help & Support" },
    { icon: <FaSignOutAlt />, label: "Logout" },
  ];

  return (
    <nav className="relative w-full h-[68px] bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-6 z-30">
      {/* Left branding / title placeholder */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Student Portal</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Calendar Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCalendarMenu(!showCalendarMenu);
              setShowProfileMenu(false);
            }}
            className="w-10 h-10 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-slate-300 text-slate-600 transition-all duration-200 shadow-2xs"
            title="Schedule & Attendance"
          >
            <FaCalendarAlt className="text-slate-600 text-sm" />
          </button>
          
          {showCalendarMenu && (
            <div className="absolute right-0 top-12 w-[190px] bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div
                onClick={() => {
                  navigate("/student/schedule");
                  setShowCalendarMenu(false);
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-100/80 hover:text-[#043573] cursor-pointer transition text-sm font-medium"
              >
                <FaCalendarAlt className="text-[#043573]" />
                <span>Schedule</span>
              </div>
              <div
                onClick={() => {
                  navigate("/student/attendance");
                  setShowCalendarMenu(false);
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-100/80 hover:text-[#043573] cursor-pointer transition text-sm font-medium"
              >
                <FaBook className="text-[#043573]" />
                <span>Attendance</span>
              </div>
            </div>
          )}
        </div>

        {/* Notifications button */}
        <button 
          onClick={() => navigate("/student/notifications")}
          className="w-10 h-10 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-slate-300 text-slate-600 transition-all duration-200 shadow-2xs relative"
          title="Notifications"
        >
          <FaBell className="text-slate-600 text-sm" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowCalendarMenu(false);
            }}
            className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-slate-50 transition-all duration-200 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#043573] to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-sm group-hover:scale-105 transition-transform">
              {student && student.fullName
                ? student.fullName.charAt(0).toUpperCase()
                : "S"}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {student && student.fullName ? student.fullName : "Student"}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Learner</span>
            </div>

            <FaChevronDown
              className={`text-[10px] text-slate-500 transition-transform duration-300 ${
                showProfileMenu ? "rotate-180 text-[#043573]" : ""
              }`}
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-13 w-[230px] bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 mb-1">
                <p className="text-xs font-semibold text-slate-900">{student?.fullName || "Student"}</p>
                <p className="text-[11px] text-slate-500 truncate">{student?.email || "student@vyntra.com"}</p>
              </div>

              <div className="py-1">
                {profileItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (item.label === "Settings") {
                        navigate("/student/settings");
                      } else if (item.label === "My Courses") {
                        navigate("/student/courses");
                      } else if (item.label === "Profile") {
                        navigate("/student/profile");
                      } else if (item.label === "Certificates") {
                        navigate("/student/certificates");
                      } else if (item.label === "Notifications") {
                        navigate("/student/notifications");
                      } else if (item.label === "Help & Support") {
                        navigate("/student/contact-support");
                      } else if (item.label === "Logout") {
                        logout();
                      }

                      setShowProfileMenu(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium cursor-pointer transition-all duration-150 ${
                      item.label === "Logout"
                        ? "text-red-600 hover:bg-red-50"
                        : "text-slate-700 hover:bg-slate-100/80 hover:text-[#043573]"
                    }`}
                  >
                    <span className={item.label === "Logout" ? "text-red-500" : "text-[#043573]"}>
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
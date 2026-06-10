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
    <nav className="relative w-full h-[70px] bg-white border-b border-gray-200 flex items-center justify-end px-6">
      <div className="flex items-center gap-5">
        <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center">
          <FaBell className="text-gray-600 text-sm" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 cursor-pointer"
          >
            {instructor?.profileImage ? (
              <img 
                src={instructor.profileImage} 
                alt="Instructor Profile" 
                className="w-8 h-8 rounded-full object-cover border border-[#7c3aed]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-[#7c3aed]">
                {instructor?.fullName?.charAt(0) || "I"}
              </div>
            )}
            <span className="text-sm font-semibold text-gray-700">
              {instructor?.fullName || "Instructor"}
            </span>
            <FaChevronDown
              className={`text-xs text-gray-600 transition ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-[240px] bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
              {profileItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleItemClick(item.label)}
                  className="flex items-center gap-3 px-5 py-3 text-[#250c42] hover:bg-purple-50 hover:text-[#7c3aed] cursor-pointer transition text-[15px] font-medium"
                >
                  <span className="text-[#7c3aed]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

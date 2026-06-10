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
} from "react-icons/fa";

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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
<<<<<<< Updated upstream
  const navigate = useNavigate();
=======

>>>>>>> Stashed changes
  return (
    <nav className="relative w-full h-[70px] bg-white border-b border-gray-200 flex items-center justify-end px-6">
      {/* Right */}
      <div className="flex items-center gap-5">
        <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition">
          <FaBell className="text-gray-600 text-sm" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
              {student && student.fullName
                ? student.fullName.charAt(0).toUpperCase()
                : "S"}
            </div>

            <span className="text-sm font-semibold text-gray-700">
              {student && student.fullName ? student.fullName : "Student"}
            </span>

            <FaChevronDown
<<<<<<< Updated upstream
              className={`text-xs text-gray-600 transition ${showProfileMenu ? "rotate-180" : ""
                }`}
=======
              className={`text-xs text-gray-600 transition duration-300 ${
                showProfileMenu ? "rotate-180" : ""
              }`}
>>>>>>> Stashed changes
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-[240px] bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
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
<<<<<<< Updated upstream
                      navigate("/students/contact-support");
=======
                      navigate("/student/contact-support");
                    } else if (item.label === "Logout") {
                      logout();
>>>>>>> Stashed changes
                    }

                    setShowProfileMenu(false);
                  }}
                  className="flex items-center gap-3 px-5 py-3 text-[#250c42] hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition text-[15px] font-medium"
                >
                  <span className="text-blue-600">{item.icon}</span>
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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../auth/AuthContext";
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
  const { admin, logout } = useAdminAuth();
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
            <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center text-sm font-bold text-green-700">
              {admin && admin.fullName
                ? admin.fullName.charAt(0).toUpperCase()
                : "A"}
            </div>

            <span className="text-sm font-semibold text-gray-700">
              {admin && admin.fullName ? admin.fullName : "Admin"}
            </span>

            <FaChevronDown
              className={`text-xs text-gray-600 transition duration-300 ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-[240px] bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
              {profileItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (item.label === "Settings") {
                      navigate("/admin/settings");
                    } else if (item.label === "My Courses") {
                      navigate("/admin/courses");
                    } else if (item.label === "Profile") {
                      navigate("/admin/profile");
                    } else if (item.label === "Certificates") {
                      navigate("/admin/certificates");
                    } else if (item.label === "Notifications") {
                      navigate("/admin/notifications");
                    } else if (item.label === "Help & Support") {
                      navigate("/admin/contact-support");
                    } else if (item.label === "Logout") {
                      logout();
                    }

                    setShowProfileMenu(false);
                  }}
                  className="flex items-center gap-3 px-5 py-3 text-[#250c42] hover:bg-[#fff1ec] hover:text-[#ff5a1f] cursor-pointer transition text-[15px] font-medium"
                >
                  <span className="text-[#ff5a1f]">{item.icon}</span>
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
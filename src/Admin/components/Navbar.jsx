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
  FaCalendarAlt,
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
    <nav className="relative w-full h-[70px] bg-white border-b border-navy-100 flex items-center justify-between px-6">
      {/* Left greeting */}
      <div className="hidden sm:block">
        <p className="text-sm text-gray-400">
          Welcome back,{" "}
          <span className="font-semibold text-navy-800">
            {admin && admin.fullName ? admin.fullName.split(" ")[0] : "Admin"}
          </span>
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/attendance")}
          className="w-9 h-9 rounded-full border border-navy-100 flex items-center justify-center cursor-pointer hover:bg-navy-50 hover:border-navy-600 transition text-navy-700"
          title="Attendance"
        >
          <FaCalendarAlt className="text-sm" />
        </button>

        <button className="relative w-9 h-9 rounded-full border border-navy-100 flex items-center justify-center cursor-pointer hover:bg-navy-50 hover:border-navy-600 transition text-navy-700">
          <FaBell className="text-sm" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-orange border border-white"></span>
        </button>

        <div className="w-px h-8 bg-navy-100" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-brand-orange/30">
              {admin && admin.fullName
                ? admin.fullName.charAt(0).toUpperCase()
                : "A"}
            </div>

            <span className="hidden md:block text-sm font-semibold text-navy-800">
              {admin && admin.fullName ? admin.fullName : "Admin"}
            </span>

            <FaChevronDown
              className={`hidden md:block text-xs text-navy-500 transition duration-300 ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-[240px] bg-white border border-navy-100 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
              <div className="px-5 py-3 border-b border-navy-100 bg-navy-50">
                <p className="text-sm font-semibold text-navy-900">
                  {admin && admin.fullName ? admin.fullName : "Admin"}
                </p>
                <p className="text-xs text-navy-500 truncate">{admin?.email || "admin@vyntraone.com"}</p>
              </div>
              {profileItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (item.label === "Settings") {
                      navigate("/admin/settings");
                    } else if (item.label === "My Courses") {
                      navigate("/admin/all-courses");
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
                  className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition text-[14px] font-medium ${
                    item.label === "Logout"
                      ? "text-red-500 hover:bg-red-50"
                      : "text-navy-800 hover:bg-brand-orange-50 hover:text-brand-orange-dark"
                  }`}
                >
                  <span className={item.label === "Logout" ? "text-red-500" : "text-brand-orange"}>{item.icon}</span>
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

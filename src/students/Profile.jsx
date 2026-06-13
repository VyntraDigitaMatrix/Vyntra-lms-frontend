import React, { useState } from "react";
import Me from "../assets/Me.jpg";
import { useAuth } from "./auth/AuthContext";
import {
  FaUser,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
  FaSave,
  FaTimes,
  FaShieldAlt,
  FaChevronRight,
} from "react-icons/fa";

const AdminProfile = () => {
  const { student, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const userName = "Harika";

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-5">
      <div className="max-w-6xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">

        {/* Header Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600 to-blue-700 relative">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-3 sm:top-5 right-3 sm:right-5 bg-white/95 backdrop-blur-sm text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold hover:bg-white shadow-md transition-all"
          >
            {isEditing ? <FaTimes size={12} className="sm:text-sm" /> : <FaEdit size={12} className="sm:text-sm" />}
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-16">
            <div className="relative mx-auto sm:mx-0">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-3xl sm:text-4xl font-bold">
                    {userName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {isEditing && (
                <>
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-1 right-1 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 cursor-pointer shadow-md"
                  >
                    <FaCamera size={12} />
                  </label>

                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </>
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 sm:mt-20">
                {student && student.fullName ? student.fullName : "Student"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">LMS Administrator</p>
              <span className="inline-block mt-2 bg-blue-500 text-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
                Active Account
              </span>
            </div>
          </div>

          {!isEditing ? (
            /* Profile View - Responsive */
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-2 bg-gray-50 rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-5 flex items-center gap-2">
                  <FaUser className="text-blue-500 text-sm sm:text-base" />
                  Profile Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                  <InfoItem icon={<FaEnvelope className="text-blue-500" />} label="Email" value="admin@lms.com" />
                  <InfoItem icon={<FaPhone className="text-blue-500" />} label="Mobile" value="+91 98765 43210" />
                  <InfoItem icon={<FaMapMarkerAlt className="text-blue-500" />} label="Location" value="Bangalore, India" />
                  <InfoItem icon={<FaShieldAlt className="text-blue-500" />} label="Role" value="Super Admin" />
                </div>

                <div className="mt-4 sm:mt-6">
                  <h4 className="font-semibold text-gray-700 text-sm sm:text-base mb-2">About</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-5 sm:leading-6">
                    Manages courses, instructors, students, payments, certificates,
                    assignments, and overall LMS platform activities.
                  </p>
                </div>
              </div>

              {/* Right Column - Account Status */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-5">
                  Account Status
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <StatusItem label="Profile Completion" value="85%" />
                  <StatusItem label="Courses Managed" value="24" />
                  <StatusItem label="Students Managed" value="1200+" />
                  <StatusItem label="Last Login" value="Today" />
                </div>
              </div>
            </div>
          ) : (
            /* Edit Profile Form - Responsive */
            <div className="mt-6 sm:mt-8 bg-gray-50 rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <FaEdit className="text-blue-500 text-sm sm:text-base" />
                Edit Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <FormInput label="Full Name" defaultValue="Shankar Admin" />
                <FormInput label="Username" defaultValue="shankar_admin" />
                <FormInput label="Email Address" defaultValue="admin@lms.com" />
                <FormInput label="Mobile Number" defaultValue="+91 98765 43210" />
                <FormInput label="Role" defaultValue="Super Admin" />
                <FormInput label="Location" defaultValue="Bangalore, India" />
              </div>

              <div className="mt-4 sm:mt-5">
                <label className="text-xs sm:text-sm font-semibold text-gray-600">
                  About
                </label>
                <textarea
                  rows={4}
                  defaultValue="Manages LMS courses, students, instructors, payments and reports."
                  className="w-full mt-1.5 sm:mt-2 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-5 sm:mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="order-2 sm:order-1 px-4 sm:px-5 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="order-1 sm:order-2 px-4 sm:px-5 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-blue-600 transition"
                >
                  <FaSave size={12} />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Info Item Component
const InfoItem = ({ icon, label, value }) => (
  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="text-blue-600 text-base sm:text-lg shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-xs sm:text-sm font-semibold text-gray-700 truncate">{value}</p>
      </div>
    </div>
  </div>
);

// Status Item Component
const StatusItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2.5 sm:py-3 border-b border-gray-100 last:border-0">
    <span className="text-xs sm:text-sm text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800 text-xs sm:text-sm">{value}</span>
  </div>
);

// Form Input Component
const FormInput = ({ label, defaultValue }) => (
  <div>
    <label className="text-xs sm:text-sm font-semibold text-gray-600">{label}</label>
    <input
      type="text"
      defaultValue={defaultValue}
      className="w-full mt-1.5 sm:mt-2 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
    />
  </div>
);

export default AdminProfile;
import React, { useState } from "react";
import Me from "../assets/Me.jpg";
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
} from "react-icons/fa";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f7f7] p-5">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        
        {/* Header */}
        <div className="h-40 bg-[#ff4b0b] relative">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-5 right-5 bg-white text-[#ff4b0b] px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-purple-50"
          >
            {isEditing ? <FaTimes /> : <FaEdit />}
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Top */}
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
            <div className="relative">
              <img
                src={Me}
                alt="Admin"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-2 right-2 bg-[#ff4b0b] text-white p-3 rounded-full hover:bg-purple-700">
                  <FaCamera />
                </button>
              )}
            </div>

            <div className="text-center md:text-left mt-3">
              <h2 className="text-2xl font-bold text-gray-800">
                Shankar Admin
              </h2>
              <p className="text-gray-500">LMS Administrator</p>
              <span className="inline-block mt-2 bg-[#ff4b0b] text-white px-3 py-1 rounded-full text-sm">
                Active Account
              </span>
            </div>
          </div>

          {!isEditing ? (
            /* Profile View */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="lg:col-span-2 bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <FaUser className="text-[#ff4b0b]" />
                  Profile Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Info icon={<FaEnvelope className="text-[#ff4b0b]"/>} style={{ color: "#ff4b0b" }} label="Email" value="admin@lms.com" />
                  <Info icon={<FaPhone className="text-[#ff4b0b]"/>} style={{ color: "#ff4b0b" }} label="Mobile" value="+91 98765 43210" />
                  <Info icon={<FaMapMarkerAlt className="text-[#ff4b0b]"/>} style={{ color: "#ff4b0b" }} label="Location" value="Bangalore, India" />
                  <Info icon={<FaShieldAlt className="text-[#ff4b0b]"/>} style={{ color: "#ff4b0b" }} label="Role" value="Super Admin" />
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-700 mb-2">About</h4>
                  <p className="text-gray-600 text-sm leading-6">
                    Manages courses, instructors, students, payments, certificates,
                    assignments, and overall LMS platform activities.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-5">
                  Account Status
                </h3>

                <Status label="Profile Completion" value="85%" />
                <Status label="Courses Managed" value="24" />
                <Status label="Students Managed" value="1200+" />
                <Status label="Last Login" value="Today" />
              </div>
            </div>
          ) : (
            /* Edit Profile Form */
            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaEdit className="text-[#ff4b0b]" />
                Edit Profile
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Full Name" defaultValue="Shankar Admin" />
                <Input label="Username" defaultValue="shankar_admin" />
                <Input label="Email Address" defaultValue="admin@lms.com" />
                <Input label="Mobile Number" defaultValue="+91 98765 43210" />
                <Input label="Role" defaultValue="Super Admin" />
                <Input label="Location" defaultValue="Bangalore, India" />
              </div>

              <div className="mt-5">
                <label className="text-sm font-semibold text-gray-600">
                  About
                </label>
                <textarea
                  rows="4"
                  defaultValue="Manages LMS courses, students, instructors, payments and reports."
                className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-gray-300 resize-none"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 bg-[#ff4b0b] text-white rounded-lg flex items-center gap-2 hover:bg-none"
                >
                  <FaSave />
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

const Info = ({ icon, label, value }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="text-purple-600 text-lg">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  </div>
);

const Status = ({ label, value }) => (
  <div className="flex justify-between border-b py-3 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

const Input = ({ label, defaultValue }) => (
  <div>
    <label className="text-sm font-semibold text-gray-600">{label}</label>
    <input
      type="text"
      defaultValue={defaultValue}
      className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-gray-300"
    />
  </div>
);

export default AdminProfile;
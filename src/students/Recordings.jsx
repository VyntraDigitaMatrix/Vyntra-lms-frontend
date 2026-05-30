import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaCalendarAlt,
  FaDownload,
  FaPlay,
  FaVideo,
  FaClock,
  FaEye,
  FaHeadset,
  FaFilter,
} from "react-icons/fa";

const Recordings = () => {
 const recordings = [
  {
    module: "Module 1",
    title: "Introduction to Digital Marketing",
    date: "20 May 2024",
    time: "07:00 PM - 08:15 PM",
    duration: "01:15:30",
    video: "/videos/recording1.mp4",
  },
  {
    module: "Module 2",
    title: "Understanding the Customer Journey",
    date: "22 May 2024",
    time: "07:00 PM - 08:02 PM",
    duration: "01:02:45",
    video: "/videos/recording2.mp4",
  },
];
const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-5">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
  <Link
    to="/student/dashboard"
    className="hover:text-blue-600 transition font-medium"
  >
    Dashboard
  </Link>

  <span>›</span>

  <Link
    to="/student/classes"
    className="hover:text-blue-600 transition font-medium"
  >
    Live Classes
  </Link>

  <span>›</span>

  <span className="text-blue-600 font-semibold">Recordings</span>
</div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Left */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Live Class Recordings
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Watch recorded sessions anytime to revise and enhance your learning.
          </p>

          {/* Course Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex items-center gap-5">
         <div className="relative w-[210px] h-[95px] rounded-xl overflow-hidden">  
              <img
                src=""
                alt="Digital Marketing"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">
                  Digital Marketing Fundamentals
                </h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-semibold">
                  Ongoing
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-2">
                Instructor: <b>Rohit Sharma</b>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                28 Live Classes Conducted
              </p>

              <div className="flex items-center gap-3 mt-3">
                <span className="text-sm text-gray-600 font-medium">
                  Course Progress
                </span>
                <div className="w-[220px] h-2 bg-gray-200 rounded-full">
                  <div className="w-[65%] h-full bg-blue-600 rounded-full"></div>
                </div>
                <span className="text-sm text-green-600 font-bold">65%</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-4">
  <button
    onClick={() => setActiveTab("all")}
    className={`pb-3 text-sm font-semibold border-b-2 transition ${
      activeTab === "all"
        ? "text-blue-600 border-blue-600"
        : "text-gray-500 border-transparent"
    }`}
  >
    All Recordings
  </button>

  <button
    onClick={() => setActiveTab("module")}
    className={`pb-3 text-sm font-semibold border-b-2 transition ${
      activeTab === "module"
        ? "text-blue-600 border-blue-600"
        : "text-gray-500 border-transparent"
    }`}
  >
    By Module
  </button>

  <button
    onClick={() => setActiveTab("date")}
    className={`pb-3 text-sm font-semibold border-b-2 transition ${
      activeTab === "date"
        ? "text-blue-600 border-blue-600"
        : "text-gray-500 border-transparent"
    }`}
  >
    By Date
  </button>
</div>

          {/* Recording List */}
          <div className="space-y-3">
  {(activeTab === "all"
    ? recordings
    : activeTab === "module"
    ? [...recordings].sort((a, b) =>
        a.module.localeCompare(b.module)
      )
    : [...recordings].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      )
  ).map((item, index) => (
    <div
      key={index}
      className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-4 shadow-sm"
    >
      <div className="relative w-[130px] h-[65px] rounded-lg overflow-hidden bg-black">
        <video
          src={item.video}
          className="w-full h-full object-cover"
          muted
          preload="metadata"
        />

        <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white">
          <FaPlay />
        </div>

        <span className="absolute bottom-1 right-1 bg-black text-white text-[10px] px-2 py-0.5 rounded">
          {item.duration}
        </span>
      </div>

      <div className="flex-1">
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
          {item.module}
        </span>

        <h3 className="font-bold text-gray-900 mt-1">
          {item.title}
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          {item.date}
          <span className="mx-2">•</span>
          {item.time}
        </p>
      </div>

      <button className="text-blue-600 text-sm font-semibold flex items-center gap-2">
        <FaDownload size={13} /> Download
      </button>

      <button className="px-5 py-2 border border-blue-500 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100">
        Watch Now
      </button>
    </div>
  ))}
</div>
        </div>

        {/* Right */}
        <div className="space-y-3 mt-20">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 ">
            <h2 className="font-bold text-gray-900 mb-3">Filter Recordings</h2>

            <label className="text-xs font-bold text-gray-600">Module</label>
            <select className="w-full mt-1 mb-2 h-11 border border-gray-200 rounded-lg px-3 text-sm outline-none">
              <option>All Modules</option>
              <option>Module 1</option>
              <option>Module 2</option>
              <option>Module 3</option>
            </select>

            <label className="text-xs font-bold text-gray-600">Search</label>
            <div className="w-full mt-1 mb-2 h-11 border border-gray-200 rounded-lg px-3 flex items-center gap-2">
              <input
                placeholder="Search by title..."
                className="flex-1 outline-none text-sm"
              />
              <FaSearch className="text-gray-400" />
            </div>

            <label className="text-xs font-bold text-gray-600">From Date</label>
            <div className="w-full mt-1 mb-2 h-11 border border-gray-200 rounded-lg px-3 flex items-center justify-between text-sm text-gray-500">
              Select date <FaCalendarAlt />
            </div>

            <label className="text-xs font-bold text-gray-600">To Date</label>
            <div className="w-full mt-1 mb-2 h-11 border border-gray-200 rounded-lg px-3 flex items-center justify-between text-sm text-gray-500">
              Select date <FaCalendarAlt />
            </div>

            <button className="w-full h-11 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700">
              <FaFilter size={12} /> Apply Filters
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-5">Recording Overview</h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="flex items-center gap-3 text-gray-600">
                  <FaVideo className="text-blue-500" /> Total Recordings
                </span>
                <b className="text-blue-600">28</b>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-3 text-gray-600">
                  <FaClock className="text-green-500" /> Total Watch Time
                </span>
                <b className="text-green-600">18h 45m</b>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-3 text-gray-600">
                  <FaDownload className="text-orange-500" /> Downloaded
                </span>
                <b className="text-orange-500">12</b>
              </div>

              <div>
                <span className="flex items-center gap-3 text-gray-600">
                  <FaEye className="text-purple-500" /> Last Watched
                </span>
                <p className="font-semibold text-gray-800 mt-1 ml-7">
                  Social Media Marketing Overview
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-2">Need Help?</h2>
            <p className="text-sm text-gray-500 mb-4">
              If you have any issues accessing the recordings, our support team is here to help.
            </p>
            <button className="px-4 py-2 border border-blue-500 text-blue-600 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-100">
              <FaHeadset /> Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recordings;
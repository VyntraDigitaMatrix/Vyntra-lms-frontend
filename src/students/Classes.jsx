import React, { useState } from "react";
import { Link } from "react-router-dom";
import S1 from "../assets/s1.jpg";
import S2 from "../assets/s2.jpg";
import S3 from "../assets/s3.jpg";
import S4 from "../assets/s4.jpg";
import { useNavigate } from "react-router-dom";
import {
  FaVideo,
  FaCalendarAlt,
  FaClock,
  FaComments,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

const Classes = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("upcoming");

  const classes = [
    {
      img: S1,
      date: "20",
      day: "MON",
      title: "Introduction to Digital Marketing",
      subject: "Digital Marketing Fundamentals",
      time: "07:00 PM - 08:00 PM",
      teacher: "Rohit Sharma",
      color: "bg-purple-600",
    },
    {
      img: S2,
      date: "22",
      day: "WED",
      title: "Keyword Research Techniques",
      subject: "Search Engine Optimization (SEO)",
      time: "07:00 PM - 08:30 PM",
      teacher: "Rohit Sharma",
      color: "bg-green-600",
    },
    {
      img: S3,
      date: "24",
      day: "FRI",
      title: "Google Ads Campaign Structure",
      subject: "Google Ads & PPC",
      time: "06:00 PM - 07:30 PM",
      teacher: "Anjali Verma",
      color: "bg-orange-500",
    },
    {
      img: S4,
      date: "27",
      day: "MON",
      title: "Email Marketing Best Practices",
      subject: "Email Marketing",
      time: "07:00 PM - 08:00 PM",
      teacher: "Anjali Verma",
      color: "bg-pink-600",
    },
  ];

  const [addedToCalendar, setAddedToCalendar] = useState(new Set());

  const getCalendarUrl = (item) => {
    // Map your date/time to a real datetime — adjust year/month as needed
    const dateMap = { "20": "20250520", "22": "20250522", "24": "20250524", "27": "20250527" };
    const timeMap = {
      "07:00 PM - 08:00 PM": { start: "T133000Z", end: "T143000Z" },
      "07:00 PM - 08:30 PM": { start: "T133000Z", end: "T150000Z" },
      "06:00 PM - 07:30 PM": { start: "T123000Z", end: "T140000Z" },
    };
    const d = dateMap[item.date] || "20250520";
    const t = timeMap[item.time] || { start: "T133000Z", end: "T143000Z" };
    const title = encodeURIComponent(`${item.title} – Live Class`);
    const details = encodeURIComponent(`Live session with ${item.teacher}\n${item.subject}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${d}${t.start}/${d}${t.end}`;
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-5">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
          <Link to="/student/dashboard" className="hover:text-blue-600 transition font-medium">
            Dashboard
          </Link>
          <span className="text-gray-400">›</span>
          <span className="text-blue-600 font-semibold">Live Classes</span>
        </div>

        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Live Classes</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Join live sessions, interact with instructors and clear your doubts in real-time.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 sm:gap-6">
          {/* Left Section - Classes List */}
          <div>
            {/* Tabs */}
            <div className="flex gap-4 sm:gap-8 border-b border-gray-200 mb-4">
              <button
                onClick={() => setTab("upcoming")}
                className={`pb-2 sm:pb-3 text-xs sm:text-sm font-semibold ${tab === "upcoming"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                  }`}
              >
                Upcoming Classes
              </button>
              <button
                onClick={() => setTab("previous")}
                className={`pb-2 sm:pb-3 text-xs sm:text-sm font-semibold ${tab === "previous"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                  }`}
              >
                Previous Classes
              </button>
            </div>

            {/* Classes Cards - Responsive */}
            <div className="space-y-3 sm:space-y-4">
              {classes.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4"
                >
                  {/* Mobile: Stacked layout, Desktop: Flex row */}
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    {/* Left - Image and Date combined on mobile */}
                    <div className="flex items-center gap-3 md:gap-4">
                      {/* Image with LIVE badge */}
                      <div className="relative w-[100px] sm:w-[120px] md:w-[140px] h-[56px] sm:h-[62px] rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full">
                          LIVE
                        </span>
                      </div>

                      {/* Date Box */}
                      <div className="w-[50px] sm:w-[60px] h-[56px] sm:h-[68px] rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[9px] sm:text-xs font-bold text-gray-500">MAY</span>
                        <span className="text-lg sm:text-2xl font-bold text-gray-900">{item.date}</span>
                        <span className="text-[9px] sm:text-xs font-bold text-gray-500">{item.day}</span>
                      </div>
                    </div>

                    {/* Course Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs font-semibold text-gray-500 mb-0.5 sm:mb-1">
                        {item.time}
                      </p>
                      <h3 className="font-semibold text-sm sm:text-[15px] text-gray-900 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[11px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                        {item.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${item.color} flex items-center justify-center text-white text-[10px] sm:text-xs font-bold flex-shrink-0`}>
                          {item.teacher.charAt(0)}
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-600">
                          {item.teacher}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-[150px] space-y-1.5">
                      {/* Join Live Class */}
                      <button
                        onClick={() => window.open("https://meet.google.com", "_blank")}
                        className="w-full h-10 bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                      >
                        <FaVideo /> Join Live Class
                      </button>

                      {/* Add to Calendar */}
                      <button
                        onClick={() => {
                          window.open(getCalendarUrl(item), "_blank");
                          setAddedToCalendar((prev) => new Set([...prev, item.title]));
                        }}
                        className={`w-[150px] h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition border ${addedToCalendar.has(item.title)
                            ? "bg-green-50 text-green-600 border-green-300 cursor-default"
                            : "bg-white text-blue-600 border-blue-500 hover:bg-blue-50"
                          }`}
                      >
                        <FaCalendarAlt />
                        {addedToCalendar.has(item.title) ? "Added to Calendar" : "Add to Calendar"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Responsive */}
          <div className="space-y-4">
            {/* Live Class Rules */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4">
                Live Class Rules
              </h2>
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-600 font-medium">
                <div className="flex gap-2 sm:gap-3 items-start">
                  <FaClock className="text-blue-500 mt-0.5 text-xs sm:text-sm flex-shrink-0" />
                  <p>Join the class 5 minutes before start time.</p>
                </div>
                <div className="flex gap-2 sm:gap-3 items-start">
                  <FaVideo className="text-blue-500 mt-0.5 text-xs sm:text-sm flex-shrink-0" />
                  <p>Keep your microphone muted.</p>
                </div>
                <div className="flex gap-2 sm:gap-3 items-start">
                  <FaComments className="text-blue-500 mt-0.5 text-xs sm:text-sm flex-shrink-0" />
                  <p>Use chat to ask your questions.</p>
                </div>
                <div className="flex gap-2 sm:gap-3 items-start">
                  <FaUsers className="text-blue-500 mt-0.5 text-xs sm:text-sm flex-shrink-0" />
                  <p>Be respectful and follow the guidelines.</p>
                </div>
              </div>
            </div>

            {/* Time Zone */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                Time Zone
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                All timings are in <br />
                <b>India Standard Time (IST)</b>
              </p>
            </div>

            {/* Can't Attend Live - Responsive */}
            <div className="bg-blue-50 rounded-xl p-4 sm:p-5 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaCheckCircle className="text-blue-600 text-xl sm:text-2xl" />
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-blue-700 text-sm sm:text-base mb-1 sm:mb-2">
                    Can't Attend Live?
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    You can watch the recorded session later from My Learning section.
                  </p>
                  <button 
                  onClick={() => navigate("/student/recordings")}
                  className="px-4 sm:px-5 py-1.5 sm:py-2 border border-blue-500 text-blue-600 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-100 transition-colors">
                    Go to My Learning
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;
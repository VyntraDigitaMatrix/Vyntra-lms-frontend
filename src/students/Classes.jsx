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
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <Link to="/student/dashboard" className="hover:text-[#043573] transition">Dashboard</Link>
            <span>&gt;</span>
            <span className="text-slate-700 font-semibold">Live Classes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Live Classes</h1>
          <p className="text-xs text-slate-500 mt-1">
            Join live interactive sessions with expert instructors and clear your doubts in real-time.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200/70 pb-1">
          <button
            onClick={() => setTab("upcoming")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === "upcoming"
                ? "bg-[#043573] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100/70"
            }`}
          >
            Upcoming Classes
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === "completed"
                ? "bg-[#043573] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100/70"
            }`}
          >
            Completed Sessions
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 sm:gap-6">
          {/* Left Section - Classes List */}
          <div>
            {/* Classes Cards - Responsive */}
            <div className="space-y-3 sm:space-y-4">
              {classes.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/70 shadow-xs p-4 sm:p-5 hover:shadow-md transition-all"
                >
                  {/* Mobile: Stacked layout, Desktop: Flex row */}
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    {/* Left - Image and Date combined on mobile */}
                    <div className="flex items-center gap-3 md:gap-4">
                      {/* Image with LIVE badge */}
                      <div className="relative w-[100px] sm:w-[120px] md:w-[140px] h-[56px] sm:h-[62px] rounded-xl overflow-hidden shrink-0">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1.5 right-1.5 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                          LIVE
                        </span>
                      </div>

                      {/* Date Box */}
                      <div className="w-[54px] sm:w-[64px] h-[56px] sm:h-[68px] rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[9px] font-extrabold text-slate-400">MAY</span>
                        <span className="text-lg sm:text-2xl font-black text-slate-900 leading-none my-0.5">{item.date}</span>
                        <span className="text-[9px] font-bold text-slate-500">{item.day}</span>
                      </div>
                    </div>

                    {/* Course Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-[#043573] mb-0.5 flex items-center gap-1">
                        <FaClock className="text-[10px]" /> {item.time}
                      </p>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        {item.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`w-5 h-5 rounded-full ${item.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                          {item.teacher.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-slate-700">
                          {item.teacher}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full md:w-[150px] space-y-2 shrink-0">
                      {/* Join Live Class */}
                      <button
                        onClick={() => window.open("https://meet.google.com", "_blank")}
                        className="w-full h-9 bg-[#043573] hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                      >
                        <FaVideo /> Join Live Class
                      </button>

                      {/* Add to Calendar */}
                      <button
                        onClick={() => {
                          window.open(getCalendarUrl(item), "_blank");
                          setAddedToCalendar((prev) => new Set([...prev, item.title]));
                        }}
                        className={`w-full h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border cursor-pointer ${
                          addedToCalendar.has(item.title)
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <FaCalendarAlt />
                        {addedToCalendar.has(item.title) ? "Added ✓" : "Add to Calendar"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Live Class Rules */}
            <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs p-5">
              <h2 className="font-bold text-slate-900 text-sm mb-3">
                Live Class Rules
              </h2>
              <div className="space-y-3 text-xs text-slate-600 font-medium">
                <div className="flex gap-2.5 items-start">
                  <FaClock className="text-[#043573] mt-0.5 text-xs shrink-0" />
                  <p>Join the class 5 minutes before start time.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <FaVideo className="text-[#043573] mt-0.5 text-xs shrink-0" />
                  <p>Keep your microphone muted during presentation.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <FaComments className="text-[#043573] mt-0.5 text-xs shrink-0" />
                  <p>Use live chat to post your questions.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <FaUsers className="text-[#043573] mt-0.5 text-xs shrink-0" />
                  <p>Be respectful and adhere to community guidelines.</p>
                </div>
              </div>
            </div>

            {/* Time Zone */}
            <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs p-5">
              <h2 className="font-bold text-slate-900 text-sm mb-1">
                Time Zone
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                All session timings are displayed in <strong className="text-slate-800">India Standard Time (IST)</strong>.
              </p>
            </div>

            {/* Can't Attend Live */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#043573] flex items-center justify-center shrink-0 font-bold">
                  <FaCheckCircle className="text-base" />
                </div>
                <div>
                  <h3 className="font-bold text-[#043573] text-sm mb-1">
                    Can't Attend Live?
                  </h3>
                  <p className="text-xs text-slate-600 mb-3">
                    Watch full recorded class sessions anytime from the My Learning section.
                  </p>
                  <button 
                    onClick={() => navigate("/student/recordings")}
                    className="px-4 py-2 bg-[#043573] text-white rounded-xl text-xs font-bold hover:bg-blue-900 transition-all cursor-pointer shadow-2xs"
                  >
                    Go to Recordings
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
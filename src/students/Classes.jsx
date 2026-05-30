import React, { useState } from "react";
import { Link } from "react-router-dom";
import S1 from "../assets/s1.jpg";
import S2 from "../assets/s2.jpg";
import S3 from "../assets/s3.jpg";
import S4 from "../assets/s4.jpg";
import {
  FaVideo,
  FaCalendarAlt,
  FaClock,
  FaComments,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

const Classes = () => {
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

  <span className="text-blue-600 font-semibold">
    Live Classes
  </span>
</div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Live Classes</h1>
        <p className="text-sm text-gray-500 mt-1">
          Join live sessions, interact with instructors and clear your doubts in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-4">
        <div>
          <div className="flex gap-8 border-b border-gray-200 mb-4">
            <button
              onClick={() => setTab("upcoming")}
              className={`pb-3 text-sm font-semibold ${
                tab === "upcoming"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              Upcoming Classes
            </button>

            <button
              onClick={() => setTab("previous")}
              className={`pb-3 text-sm font-semibold ${
                tab === "previous"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              Previous Classes
            </button>
          </div>

          <div className="space-y-3">
            {classes.map((item, index) => (
              <div
                key={index}
                 className="bg-white rounded-xl border border-gray-200 shadow-sm p-2.5 flex items-center gap-3 max-w-[900px]"
              >
                <div className="relative w-[140px] h-[62px] rounded-lg overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                </div>

                <div className="w-[60px] h-[68px] rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-gray-500">MAY</span>
                  <span className="text-2xl font-bold text-gray-900">{item.date}</span>
                  <span className="text-xs font-bold text-gray-500">{item.day}</span>
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 mb-1">{item.time}</p>
                  <h3 className="font-semibold text-[15px] text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.subject}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-6 rounded-full bg-orange-200"></div>
                    <span className="text-xs font-semibold text-gray-600">
                      {item.teacher}
                    </span>
                  </div>
                </div>

                <div className="w-[150px] space-y-1.5">
                  <button className="w-full h-8 bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700">
                    <FaVideo /> Join Live Class
                  </button>
                  <button className="w-full h-8 bg-white text-blue-600 border border-blue-500 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-50">
                    <FaCalendarAlt /> Add to Calendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 mt-13">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4">Live Class Rules</h2>
            <div className="space-y-4 text-sm text-gray-600 font-medium">
              <p className="flex gap-3"><FaClock className="text-blue-500" /> Join the class 5 minutes before start time.</p>
              <p className="flex gap-3"><FaVideo className="text-blue-500" /> Keep your microphone muted.</p>
              <p className="flex gap-3"><FaComments className="text-blue-500" /> Use chat to ask your questions.</p>
              <p className="flex gap-3"><FaUsers className="text-blue-500" /> Be respectful and follow the guidelines.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-2">Time Zone</h2>
            <p className="text-sm text-gray-600 font-medium">
              All timings are in <br />
              <b>India Standard Time (IST)</b>
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10  rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h2 className="font-bold text-blue-700 mb-2">Can't Attend Live?</h2>
                <p className="text-sm text-gray-600 mb-4">
                  You can watch the recorded session later from My Learning section.
                </p>
                <button className="px-5 py-2 border border-blue-500 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100">
                  Go to My Learning
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;
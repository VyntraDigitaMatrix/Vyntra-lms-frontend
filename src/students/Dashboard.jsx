import React from "react";
import { useNavigate } from "react-router-dom";
import S1 from "../assets/s1.jpg";
import S2 from "../assets/s2.jpg";
import S3 from "../assets/s3.jpg";
import S4 from "../assets/s4.jpg";
import S5 from "../assets/s5.jpg";
import {
  FaBookOpen, FaPlayCircle, FaTrophy, FaClock, FaArrowRight,
  FaEllipsisV, FaMedal, FaChevronDown, FaTv, FaCheckCircle,
  FaClipboardCheck, FaFileUpload,
} from "react-icons/fa";
import { useAuth } from "./auth/AuthContext";

const Dashboard = () => {
  const { student, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = React.useState("This Week");
  const [showDays, setShowDays] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const courses = [
    { title: "Digital Marketing Fundamentals", progress: "65%", image: S3 },
    { title: "Search Engine Optimization (SEO)", progress: "40%", image: S2 },
    { title: "Social Media Marketing", progress: "25%", image: S4 },
    { title: "Email Marketing Mastery", progress: "10%", image: S5 },
  ];

  return (
    <div className="bg-[#f6f7fb] min-h-screen p-3 sm:p-4 md:p-5">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg transition-all">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-4 sm:mb-5">
        <h1 className="text-lg sm:text-xl font-bold text-[#111827]">Welcome back, {student && student.fullName ? student.fullName : "Student"}!</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          Let's continue your learning journey.
        </p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4">
        {/* Left Section */}
        <div className="w-full lg:col-span-9 space-y-3 sm:space-y-4">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {/* Courses Enrolled */}
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-base sm:text-xl shrink-0">
                  <FaBookOpen />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">6</h2>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 leading-tight">Courses Enrolled</p>
                  <button
                    onClick={() => navigate("/student/courses")}
                    className="text-blue-600 font-semibold flex items-center gap-1 text-[10px] sm:text-xs mt-1.5"
                  >
                    View All <FaArrowRight size={8} />
                  </button>
                </div>
              </div>
            </div>

            {/* Lessons Completed */}
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-base sm:text-xl shrink-0">
                  <FaTv />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">28</h2>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 leading-tight">Lessons Completed</p>
                  <button
                    onClick={() => navigate("/student/courses")}
                    className="text-blue-600 font-semibold text-[10px] sm:text-xs mt-1.5"
                  >
                    View all
                  </button>
                </div>
              </div>
            </div>

            {/* Certificates Earned */}
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-base sm:text-xl shrink-0">
                  <FaTrophy />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">4</h2>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 leading-tight">Certificates Earned</p>
                  <button
                    onClick={() => navigate("/student/certificates")}
                    className="text-blue-600 font-semibold text-[10px] sm:text-xs mt-1.5"
                  >
                    View all
                  </button>
                </div>
              </div>
            </div>

            {/* Total Learning Hours */}
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-500 text-base sm:text-xl shrink-0">
                  <FaClock />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 whitespace-normal break-words">32h 45m</h2>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 leading-tight">Total Learning Hours</p>
                  <button
                    onClick={() => showToast("Learning history coming soon!")}
                    className="text-blue-600 font-semibold text-[10px] sm:text-xs mt-1.5"
                  >
                    View all
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Learning */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <h2 className="text-base sm:text-lg font-bold">Continue Learning</h2>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-blue-600 font-semibold flex items-center gap-2 text-xs sm:text-sm w-fit"
              >
                View All Courses <FaArrowRight size={10} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-5 mt-4 sm:mt-5">
              <img
                src={S1}
                alt="Digital Marketing"
                className="w-full md:w-[200px] lg:w-[260px] h-[160px] md:h-[160px] rounded-xl object-cover"
              />
              <div className="flex flex-col justify-between flex-1 w-full">
                <h1 className="text-sm sm:text-base font-bold text-[#111827]">
                  Digital Marketing Fundamentals
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Module 1: Introduction to Digital Marketing
                </p>
                <div className="mt-3">
                  <div className="w-full h-2.5 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mt-2">
                    <span className="text-xs sm:text-sm text-gray-500">
                      Last lesson: 1.3 Key Components of Digital Marketing
                    </span>
                    <span className="font-semibold text-blue-600 text-xs sm:text-sm">65% Complete</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/student/continue-learning/1")}
                  className="mt-3 w-full sm:w-fit bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          </div>

          {/* My Courses */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4">
              <h2 className="text-lg sm:text-xl font-bold">My Courses</h2>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-blue-600 font-semibold flex items-center gap-2 text-xs sm:text-sm w-fit"
              >
                View All Courses <FaArrowRight size={10} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {courses.map((course, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/student/continue-learning/${index + 1}`)}
                  className="w-full border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition duration-300 bg-white cursor-pointer"
                >
                  <img src={course.image} alt={course.title} className="w-full h-[120px] sm:h-[100px] object-cover" />
                  <div className="p-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-xs sm:text-sm leading-5 flex-1">{course.title}</h3>
                      <FaEllipsisV className="text-gray-400 text-[10px] sm:text-xs mt-1 cursor-pointer shrink-0" />
                    </div>
                    <div className="mt-3">
                      <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: course.progress }}></div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-400 text-[10px] sm:text-[11px]">Last accessed: Today</span>
                        <span className="font-semibold text-blue-600 text-[10px] sm:text-[11px]">{course.progress}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-bold">Recent Activity</h2>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-blue-600 font-semibold flex items-center gap-2 text-xs sm:text-sm w-fit"
              >
                View All Activity <FaArrowRight size={10} />
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3 mt-3">
              {[
                {
                  icon: <FaCheckCircle className="text-green-500 text-base sm:text-lg" />,
                  text: "You completed lesson 1.3 Key Components of Digital Marketing",
                  time: "Today, 10:30 AM",
                  path: "/student/continue-learning/1",
                },
                {
                  icon: <FaClipboardCheck className="text-yellow-500 text-base sm:text-lg" />,
                  text: "You scored 80% in quiz Digital Marketing Basics",
                  time: "Today, 09:15 AM",
                  path: "/student/courses",
                },
                {
                  icon: <FaFileUpload className="text-blue-500 text-base sm:text-lg" />,
                  text: "You submitted assignment SEO Keywords Research",
                  time: "Yesterday, 06:45 PM",
                  path: "/student/courses",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-100 rounded-xl p-3 sm:p-4 hover:shadow-md hover:border-blue-100 transition cursor-pointer"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs sm:text-sm leading-5 sm:leading-6">{item.text}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">Digital Marketing Fundamentals</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:col-span-3 space-y-3 sm:space-y-4">

          {/* Learning Progress */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <p className="text-sm sm:text-base font-semibold">Learning Progress</p>
              <div className="relative">
                <button
                  onClick={() => setShowDays(!showDays)}
                  className="text-xs sm:text-sm text-gray-500 flex items-center gap-1"
                >
                  {selectedDays} <FaChevronDown size={10} />
                </button>
                {showDays && (
                  <div className="absolute right-0 mt-2 w-28 sm:w-32 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                    {["This Week", "20 Days"].map((day) => (
                      <button
                        key={day}
                        onClick={() => { setSelectedDays(day); setShowDays(false); }}
                        className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center mt-3 sm:mt-4">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="50%" cy="50%" r="45%" fill="none" stroke="#3b82f6" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 45}px`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - 0.65)}px`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-xl sm:text-2xl font-bold">65%</span>
                    <p className="text-gray-400 text-[10px] sm:text-xs">Progress</p>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 text-center">
                You're doing great! Keep it up.
              </p>
            </div>

            <div className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm">
              {[
                { color: "bg-green-500", label: "Completed Lessons", value: 28, path: "/student/courses" },
                { color: "bg-yellow-400", label: "In Progress", value: 14, path: "/student/courses" },
                { color: "bg-red-500", label: "Not Started", value: 12, path: "/student/courses" },
              ].map((item) => (
                <div
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-lg px-1 py-0.5 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 ${item.color} rounded-full`}></span>
                    <span>{item.label}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-700">Total Lessons</span>
                <span className="font-bold text-blue-600">54</span>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <p className="text-sm sm:text-base font-semibold">Upcoming Deadlines</p>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-blue-600 font-semibold text-xs sm:text-sm"
              >
                View All
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
              {[
                { title: "Quiz: Digital Marketing Basics", due: "Due in 2 days", urgent: true },
                { title: "Assignment: SEO Keywords", due: "Due in 5 days", urgent: false },
                { title: "Quiz: Social Media Marketing", due: "Due in 6 days", urgent: false },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/student/courses")}
                  className="cursor-pointer hover:bg-gray-50 rounded-lg p-1 -mx-1 transition"
                >
                  <h3 className="font-semibold text-xs sm:text-sm">{item.title}</h3>
                  <p className={`text-xs sm:text-sm mt-0.5 ${item.urgent ? "text-red-400 font-semibold" : "text-gray-400"}`}>
                    {item.due}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <h1 className="text-sm sm:text-base font-semibold">Recent Achievements</h1>
              <button
                onClick={() => showToast("Achievements page coming soon!")}
                className="text-blue-600 font-semibold text-xs sm:text-sm"
              >
                View All
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
              {[
                { bg: "bg-yellow-300", color: "text-yellow-600", title: "Quick Learner", desc: "Completed 5 lessons" },
                { bg: "bg-blue-300", color: "text-blue-600", title: "Consistent Learner", desc: "Studied 7 days in a row" },
                { bg: "bg-orange-300", color: "text-orange-600", title: "Rising Star", desc: "Scored 90% in a quiz" },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => showToast(`🏅 ${item.title}: ${item.desc}`)}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1 -mx-1 transition"
                >
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full ${item.bg} flex items-center justify-center ${item.color} shrink-0`}>
                    <FaMedal size={14} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm">{item.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
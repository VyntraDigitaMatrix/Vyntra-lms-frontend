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
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-slate-50/60 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-2xl transition-all flex items-center gap-2">
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#043573] to-blue-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {student && student.fullName ? student.fullName : "Student"}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 max-w-xl font-normal">
            You're making great progress! Continue where you left off or explore new learning modules.
          </p>
        </div>
        <button
          onClick={() => navigate("/student/courses")}
          className="relative z-10 shrink-0 bg-white hover:bg-blue-50 text-[#043573] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all hover:scale-105"
        >
          My Learning Center
        </button>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        {/* Left Section */}
        <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Courses Enrolled */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/70 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#043573] flex items-center justify-center text-lg shrink-0 font-bold">
                  <FaBookOpen />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">6</h2>
                  <p className="text-[11px] font-medium text-slate-500 truncate">Enrolled Courses</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-[#043573] hover:text-blue-700 font-semibold flex items-center gap-1.5 text-xs mt-3 group"
              >
                <span>View All</span>
                <FaArrowRight size={9} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Lessons Completed */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/70 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0 font-bold">
                  <FaTv />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">28</h2>
                  <p className="text-[11px] font-medium text-slate-500 truncate">Lessons Completed</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-[#043573] hover:text-blue-700 font-semibold flex items-center gap-1.5 text-xs mt-3 group"
              >
                <span>View All</span>
                <FaArrowRight size={9} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Certificates Earned */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/70 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0 font-bold">
                  <FaTrophy />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">4</h2>
                  <p className="text-[11px] font-medium text-slate-500 truncate">Certificates</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/student/certificates")}
                className="text-[#043573] hover:text-blue-700 font-semibold flex items-center gap-1.5 text-xs mt-3 group"
              >
                <span>View All</span>
                <FaArrowRight size={9} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Total Learning Hours */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/70 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-lg shrink-0 font-bold">
                  <FaClock />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">32h 45m</h2>
                  <p className="text-[11px] font-medium text-slate-500 truncate">Learning Hours</p>
                </div>
              </div>
              <button
                onClick={() => showToast("Learning history coming soon!")}
                className="text-[#043573] hover:text-blue-700 font-semibold flex items-center gap-1.5 text-xs mt-3 group"
              >
                <span>History</span>
                <FaArrowRight size={9} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Continue Learning Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Continue Learning</h2>
                <p className="text-xs text-slate-500">Pick up right where you left off</p>
              </div>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-[#043573] font-bold flex items-center gap-1.5 text-xs hover:underline w-fit"
              >
                View All Courses <FaArrowRight size={9} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-stretch gap-5 p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
              <img
                src={S1}
                alt="Digital Marketing"
                className="w-full md:w-[220px] lg:w-[260px] h-[150px] rounded-xl object-cover shadow-xs shrink-0"
              />
              <div className="flex flex-col justify-between flex-1 w-full space-y-3">
                <div>
                  <span className="inline-block px-2.5 py-1 bg-blue-100 text-[#043573] text-[10px] font-bold rounded-lg mb-2">In Progress</span>
                  <h3 className="text-base font-bold text-slate-900">
                    Digital Marketing Fundamentals
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Module 1: Introduction to Digital Marketing
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium truncate max-w-[200px]">
                      Last lesson: 1.3 Key Components
                    </span>
                    <span className="font-bold text-[#043573]">65% Complete</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-[#043573] rounded-full transition-all duration-500"></div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/student/continue-learning/1")}
                  className="w-full sm:w-fit bg-[#043573] hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Resume Lesson
                </button>
              </div>
            </div>
          </div>

          {/* My Courses */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">My Enrolled Courses</h2>
                <p className="text-xs text-slate-500">Your active learning paths</p>
              </div>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-[#043573] font-bold flex items-center gap-1.5 text-xs hover:underline w-fit"
              >
                View All Courses <FaArrowRight size={9} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {courses.map((course, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/student/continue-learning/${index + 1}`)}
                  className="group border border-slate-200/70 rounded-2xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-300 bg-white cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative overflow-hidden h-[110px]">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-3.5 space-y-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug">{course.title}</h4>
                    </div>
                  </div>
                  <div className="p-3.5 pt-0 mt-auto">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#043573] rounded-full" style={{ width: course.progress }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-[10px] font-medium text-slate-400">
                      <span>Today</span>
                      <span className="font-bold text-[#043573]">{course.progress}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Recent Activity</h2>
                <p className="text-xs text-slate-500">Your recent actions and milestones</p>
              </div>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-[#043573] font-bold flex items-center gap-1.5 text-xs hover:underline w-fit"
              >
                View History <FaArrowRight size={9} />
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: <FaCheckCircle className="text-emerald-500 text-base" />,
                  text: "You completed lesson 1.3 Key Components of Digital Marketing",
                  time: "Today, 10:30 AM",
                  path: "/student/continue-learning/1",
                },
                {
                  icon: <FaClipboardCheck className="text-amber-500 text-base" />,
                  text: "You scored 80% in quiz Digital Marketing Basics",
                  time: "Today, 09:15 AM",
                  path: "/student/courses",
                },
                {
                  icon: <FaFileUpload className="text-blue-500 text-base" />,
                  text: "You submitted assignment SEO Keywords Research",
                  time: "Yesterday, 06:45 PM",
                  path: "/student/courses",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="flex items-center justify-between gap-4 border border-slate-100 rounded-xl p-3.5 hover:bg-slate-50/70 hover:border-slate-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100/80 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-slate-800">{item.text}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">Digital Marketing Fundamentals</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:col-span-4 xl:col-span-3 space-y-6">

          {/* Learning Progress Ring */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/70">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Learning Overview</h3>
              <div className="relative">
                <button
                  onClick={() => setShowDays(!showDays)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1"
                >
                  <span>{selectedDays}</span> <FaChevronDown size={8} />
                </button>
                {showDays && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                    {["This Week", "20 Days"].map((day) => (
                      <button
                        key={day}
                        onClick={() => { setSelectedDays(day); setShowDays(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 hover:text-[#043573] font-medium"
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center my-4">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <circle
                    cx="50%" cy="50%" r="42%" fill="none" stroke="#043573" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 42}px`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - 0.65)}px`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-2xl font-black text-slate-900">65%</span>
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Overall</p>
                  </div>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-3 text-center">
                Keep consistent to achieve your target goals!
              </p>
            </div>

            <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
              {[
                { color: "bg-emerald-500", label: "Completed Lessons", value: 28, path: "/student/courses" },
                { color: "bg-amber-400", label: "In Progress", value: 14, path: "/student/courses" },
                { color: "bg-rose-500", label: "Not Started", value: 12, path: "/student/courses" },
              ].map((item) => (
                <div
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex justify-between items-center cursor-pointer hover:bg-slate-50 rounded-lg px-2 py-1.5 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 ${item.color} rounded-full`}></span>
                    <span className="text-slate-600 font-medium">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                <span className="font-semibold text-slate-700">Total Lessons</span>
                <span className="font-bold text-[#043573]">54</span>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/70">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-900">Upcoming Deadlines</h3>
              <button
                onClick={() => navigate("/student/assignments")}
                className="text-[#043573] font-bold text-xs hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-2.5">
              {[
                { title: "Quiz: Digital Marketing Basics", due: "Due in 2 days", urgent: true },
                { title: "Assignment: SEO Keywords", due: "Due in 5 days", urgent: false },
                { title: "Quiz: Social Media Marketing", due: "Due in 6 days", urgent: false },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/student/assignments")}
                  className="cursor-pointer hover:bg-slate-50 rounded-xl p-2.5 border border-slate-100 transition"
                >
                  <h4 className="font-semibold text-xs text-slate-800">{item.title}</h4>
                  <p className={`text-[11px] font-medium mt-1 ${item.urgent ? "text-rose-600 font-bold" : "text-slate-400"}`}>
                    {item.due}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/70">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-900">Achievements</h3>
              <button
                onClick={() => showToast("Achievements page coming soon!")}
                className="text-[#043573] font-bold text-xs hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-2.5">
              {[
                { bg: "bg-amber-100 text-amber-700", title: "Quick Learner", desc: "Completed 5 lessons" },
                { bg: "bg-blue-100 text-[#043573]", title: "Consistent Learner", desc: "Studied 7 days in a row" },
                { bg: "bg-purple-100 text-purple-700", title: "Rising Star", desc: "Scored 90% in a quiz" },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => showToast(`🏅 ${item.title}: ${item.desc}`)}
                  className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 rounded-xl p-2 border border-slate-100 transition"
                >
                  <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0 font-bold text-sm`}>
                    <FaMedal />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{item.desc}</p>
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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers, FaBookOpen, FaClipboardCheck, FaStar, FaRupeeSign,
  FaVideo, FaChartLine, FaTrophy, FaCalendarAlt, FaChevronRight,
  FaDownload, FaEye, FaCommentDots, FaUserGraduate, FaClock,
  FaCheckCircle, FaSpinner, FaArrowRight,
} from "react-icons/fa";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { useInstructorAuth } from "./auth/AuthContext";

/* ── Data ── */
const stats = [
  { title: "Total Students", value: "2,847", icon: <FaUsers />, color: "text-[#7c3aed]", bg: "bg-violet-50", trend: "+12%", trendUp: true },
  { title: "Active Courses", value: "24", icon: <FaBookOpen />, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+3", trendUp: true },
  { title: "Assignments", value: "156", icon: <FaClipboardCheck />, color: "text-amber-600", bg: "bg-amber-50", trend: "-5", trendUp: false },
  { title: "Avg. Rating", value: "4.9", icon: <FaStar />, color: "text-yellow-500", bg: "bg-yellow-50", trend: "+0.2", trendUp: true },
  { title: "Total Revenue", value: "₹45,230", icon: <FaRupeeSign />, color: "text-rose-500", bg: "bg-rose-50", trend: "+18%", trendUp: true },
  { title: "Live Classes", value: "18", icon: <FaVideo />, color: "text-sky-600", bg: "bg-sky-50", trend: "+4", trendUp: true },
];

const enrollmentData = [
  { month: "Jan", students: 120 }, { month: "Feb", students: 145 },
  { month: "Mar", students: 168 }, { month: "Apr", students: 190 },
  { month: "May", students: 215 }, { month: "Jun", students: 245 },
  { month: "Jul", students: 280 }, { month: "Aug", students: 310 },
  { month: "Sep", students: 347 },
];

const revenueData = [
  { month: "Jan", revenue: 32000 }, { month: "Feb", revenue: 34500 },
  { month: "Mar", revenue: 36800 }, { month: "Apr", revenue: 39200 },
  { month: "May", revenue: 41800 }, { month: "Jun", revenue: 43500 },
  { month: "Jul", revenue: 44800 }, { month: "Aug", revenue: 45230 },
  { month: "Sep", revenue: 46800 },
];

const coursePerformance = [
  { name: "React for Beginners", students: 1200, rating: 4.8, revenue: 25000, color: "#7c3aed" },
  { name: "Advanced Python", students: 800, rating: 4.7, revenue: 15000, color: "#10b981" },
  { name: "Data Science", students: 600, rating: 4.9, revenue: 5000, color: "#f59e0b" },
  { name: "UI/UX Design", students: 450, rating: 4.6, revenue: 8000, color: "#f43f5e" },
  { name: "Web Dev Bootcamp", students: 350, rating: 4.8, revenue: 12000, color: "#0ea5e9" },
];

const recentActivities = [
  { id: 1, user: "Emily Johnson", course: "React for Beginners", time: "2 hours ago", avatar: "https://randomuser.me/api/portraits/women/68.jpg", type: "enrolled" },
  { id: 2, user: "Michael Smith", course: "Advanced Python", time: "5 hours ago", avatar: "https://randomuser.me/api/portraits/men/45.jpg", type: "completed" },
  { id: 3, user: "Sarah Lee", course: "Data Science with Python", time: "1 day ago", avatar: "https://randomuser.me/api/portraits/women/12.jpg", type: "submitted" },
  { id: 4, user: "David Kim", course: "UI/UX Design Masterclass", time: "2 days ago", avatar: "https://randomuser.me/api/portraits/men/32.jpg", type: "reviewed" },
];

const upcomingClasses = [
  { id: 1, title: "React Q&A Session", date: "Sep 20", time: "3:00 PM", attendees: 45 },
  { id: 2, title: "Python Debugging Workshop", date: "Sep 22", time: "5:00 PM", attendees: 32 },
  { id: 3, title: "Data Science AMA", date: "Sep 25", time: "4:00 PM", attendees: 28 },
  { id: 4, title: "Portfolio Review Session", date: "Sep 28", time: "2:00 PM", attendees: 19 },
];

const pendingTasks = [
  { id: 1, task: "Grade React Project Submissions", count: 12, priority: "high", due: "Today" },
  { id: 2, task: "Review Python Assignment", count: 8, priority: "medium", due: "Tomorrow" },
  { id: 3, task: "Update Course Materials", count: 3, priority: "low", due: "Sep 25" },
  { id: 4, task: "Respond to Student Queries", count: 15, priority: "high", due: "Today" },
];

const testimonials = [
  { id: 1, text: "Excellent course! Complex topics made easy to understand.", author: "John Doe", course: "React for Beginners", rating: 5 },
  { id: 2, text: "Very practical and hands-on. Assignments really helped.", author: "Jane Smith", course: "Advanced Python", rating: 5 },
  { id: 3, text: "One of the best courses I've taken. Very knowledgeable.", author: "Mark Wilson", course: "Data Science", rating: 5 },
];

/* ── Activity icon helper ── */
const ActivityIcon = ({ type }) => {
  if (type === "enrolled") return <FaUserGraduate className="text-emerald-500 text-xs" />;
  if (type === "completed") return <FaCheckCircle className="text-[#7c3aed] text-xs" />;
  if (type === "submitted") return <FaClipboardCheck className="text-amber-500 text-xs" />;
  return <FaStar className="text-yellow-500 text-xs" />;
};

/* ── Priority badge ── */
const PriorityBadge = ({ p }) => (
  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
    p === "high" ? "bg-rose-100 text-rose-600" : p === "medium" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
  }`}>{p}</span>
);

/* ── Main Component ── */
const InstructorDashboard = () => {
  const { instructor } = useInstructorAuth();
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-slate-50/60 max-w-7xl mx-auto space-y-6">

      {/* ══ HEADER BANNER ══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-850 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden transition-all duration-300">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {instructor?.fullName || "Instructor"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-violet-100/90 mt-1.5 max-w-xl font-normal">
            Here's what's happening with your courses and students today.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => navigate("/instructor/live-classes")}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all backdrop-blur-sm shadow-sm"
          >
            <FaVideo className="text-[11px]" /> Live Class
          </button>
          <button
            onClick={() => navigate("/instructor/courses")}
            className="bg-white hover:bg-violet-50 text-[#7c3aed] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all hover:scale-105"
          >
            Add Course
          </button>
        </div>
      </div>

      {/* ══ STATS GRID ══ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {stats.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/70 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between mb-2.5 sm:mb-3">
              <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-base sm:text-lg shrink-0 font-bold ${item.bg} ${item.color}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] sm:text-xs font-bold ${item.trendUp ? "text-emerald-500" : "text-rose-500"}`}>{item.trend}</span>
            </div>
            <p className="text-slate-500 text-[10px] sm:text-[11px] font-medium truncate">{item.title}</p>
            <h3 className="text-base sm:text-xl font-black text-slate-800 mt-0.5 tracking-tight">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* ══ CHARTS ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Student Growth */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/70">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Student Growth</h2>
              <p className="text-xs text-slate-500">Monthly enrollment trends</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-[#7c3aed] flex items-center justify-center shrink-0">
              <FaChartLine className="text-sm" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tick={{ fontSize: 10 }} />
              <YAxis stroke="#94a3b8" fontSize={10} tick={{ fontSize: 10 }} width={32} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} />
              <Line type="monotone" dataKey="students" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/70">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Revenue Overview</h2>
              <p className="text-xs text-slate-500">Monthly earnings (₹)</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <FaRupeeSign className="text-sm" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tick={{ fontSize: 10 }} />
              <YAxis stroke="#94a3b8" fontSize={10} tick={{ fontSize: 10 }} width={40} />
              <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ══ ACTIVITY + TASKS ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/70">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Recent Activity</h2>
              <p className="text-xs text-slate-500">Latest student interactions</p>
            </div>
            <button className="text-[#7c3aed] font-bold flex items-center gap-1.5 text-xs hover:underline w-fit">
              View all <FaArrowRight size={9} />
            </button>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {recentActivities.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-4 p-2.5 sm:p-3 border border-transparent hover:bg-slate-50/70 hover:border-slate-200 rounded-xl transition-all cursor-pointer">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <img src={a.avatar} alt="" className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex-shrink-0 object-cover" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">{a.user}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <ActivityIcon type={a.type} />
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate max-w-[120px] sm:max-w-[200px]">{a.course}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium hidden xs:block">{a.time}</span>
                  <button className="text-slate-300 hover:text-[#7c3aed] transition">
                    <FaEye className="text-xs sm:text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/70">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <FaSpinner className="text-xs" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Pending Tasks</h2>
          </div>
          <div className="space-y-1">
            {pendingTasks.map((t) => (
              <div key={t.id} className="flex justify-between items-start p-2.5 sm:p-3 border-b border-slate-100 last:border-0">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">{t.task}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <PriorityBadge p={t.priority} />
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <FaClock className="text-[9px]" /> {t.due}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-black text-[#7c3aed] flex-shrink-0 mt-0.5">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ COURSE PERFORMANCE + UPCOMING CLASSES ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Course Performance */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/70">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Course Performance</h2>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <FaTrophy className="text-xs" />
            </div>
          </div>
          <div className="space-y-2 sm:space-y-2.5">
            {coursePerformance.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-50/70 border border-slate-100 rounded-xl hover:border-slate-200 transition-all cursor-pointer">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-slate-500 font-medium flex-wrap">
                    <span>{c.students} students</span>
                    <span className="flex items-center gap-0.5">{c.rating} <FaStar className="text-yellow-400 text-[9px]" /></span>
                    <span className="font-semibold text-slate-600">₹{c.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <button className="text-slate-300 hover:text-[#7c3aed] ml-2 flex-shrink-0 transition animate-pulse">
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/70">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Upcoming Live Classes</h2>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-[#7c3aed] flex items-center justify-center shrink-0">
              <FaCalendarAlt className="text-xs" />
            </div>
          </div>
          <div className="space-y-2 sm:space-y-2.5">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-violet-50/50 border border-violet-100/60 rounded-xl">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{cls.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] sm:text-xs flex-wrap">
                    <span className="text-slate-500 font-medium">{cls.date} · {cls.time}</span>
                    <span className="text-[#7c3aed] font-bold">{cls.attendees} attending</span>
                  </div>
                </div>
                <button className="flex-shrink-0 flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 bg-[#7c3aed] hover:bg-violet-750 text-white text-[10px] sm:text-xs rounded-lg transition-all font-semibold shadow-xs">
                  <FaVideo className="text-[9px]" />
                  <span className="hidden sm:inline">Join</span>
                  <span className="sm:hidden">Go</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ TESTIMONIALS ══ */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/70">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Student Testimonials</h2>
          <div className="w-8 h-8 rounded-xl bg-violet-50 text-[#7c3aed] flex items-center justify-center shrink-0">
            <FaCommentDots className="text-xs" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="p-3.5 sm:p-4 bg-slate-50/70 rounded-xl border border-slate-100">
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`${i < t.rating ? "text-yellow-400" : "text-slate-200"} text-xs`} />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">"{t.text}"</p>
              <div className="mt-2.5 pt-2.5 border-t border-slate-200">
                <p className="text-xs sm:text-sm font-bold text-slate-900">{t.author}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium">{t.course}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ QUICK ACTIONS ══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Create Live Class", icon: <FaVideo />, action: () => navigate("/instructor/live-classes") },
          { label: "Add Course", icon: <FaBookOpen />, action: () => navigate("/instructor/courses") },
          { label: "Create Assignment", icon: <FaClipboardCheck />, action: () => navigate("/instructor/assignments") },
          { label: "Generate Report", icon: <FaDownload />, action: () => navigate("/instructor/reports") },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className="bg-white hover:bg-slate-50 border border-slate-200/70 hover:border-[#7c3aed]/30 hover:shadow-md hover:-translate-y-0.5 text-slate-700 hover:text-[#7c3aed] rounded-2xl py-4 px-2 flex flex-col items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <span className="w-9 h-9 rounded-xl bg-violet-50 text-[#7c3aed] flex items-center justify-center text-sm sm:text-base">{btn.icon}</span>
            <span className="leading-tight text-center">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom padding for mobile */}
      <div className="h-2 sm:h-0" />
    </div>
  );
};

export default InstructorDashboard;

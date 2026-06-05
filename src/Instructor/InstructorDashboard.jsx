import React, { useState } from "react";
import {
  FaUsers, FaBookOpen, FaClipboardCheck, FaStar, FaRupeeSign,
  FaVideo, FaChartLine, FaTrophy, FaCalendarAlt, FaChevronRight,
  FaDownload, FaEye, FaCommentDots, FaUserGraduate, FaClock,
  FaCheckCircle, FaSpinner, FaBars, FaTimes,
} from "react-icons/fa";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

/* ── Data ── */
const stats = [
  { title: "Total Students", value: "2,847", icon: <FaUsers />, color: "text-indigo-600", bg: "bg-indigo-50", trend: "+12%", trendUp: true },
  { title: "Active Courses", value: "24", icon: <FaBookOpen />, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+3", trendUp: true },
  { title: "Assignments", value: "156", icon: <FaClipboardCheck />, color: "text-amber-600", bg: "bg-amber-50", trend: "-5", trendUp: false },
  { title: "Avg. Rating", value: "4.9", icon: <FaStar />, color: "text-yellow-500", bg: "bg-yellow-50", trend: "+0.2", trendUp: true },
  { title: "Total Revenue", value: "₹45,230", icon: <FaRupeeSign />, color: "text-rose-600", bg: "bg-rose-50", trend: "+18%", trendUp: true },
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
  { name: "React for Beginners", students: 1200, rating: 4.8, revenue: 25000, color: "#6366f1" },
  { name: "Advanced Python", students: 800, rating: 4.7, revenue: 15000, color: "#10b981" },
  { name: "Data Science", students: 600, rating: 4.9, revenue: 5000, color: "#f59e0b" },
  { name: "UI/UX Design", students: 450, rating: 4.6, revenue: 8000, color: "#ef4444" },
  { name: "Web Dev Bootcamp", students: 350, rating: 4.8, revenue: 12000, color: "#8b5cf6" },
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
  if (type === "completed") return <FaCheckCircle className="text-blue-500 text-xs" />;
  if (type === "submitted") return <FaClipboardCheck className="text-amber-500 text-xs" />;
  return <FaStar className="text-yellow-500 text-xs" />;
};

/* ── Priority badge ── */
const PriorityBadge = ({ p }) => (
  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
    p === "high" ? "bg-red-100 text-red-600" : p === "medium" ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"
  }`}>{p}</span>
);

/* ── Main Component ── */
const InstructorDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══ HEADER ══ */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">Instructor Dashboard</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5 hidden sm:block">Welcome back, Dr. Sarah Johnson 👋</p>
            </div>
            {/* Mobile greeting */}
            <p className="text-gray-500 text-xs sm:hidden mr-auto ml-3">Hi, Sarah 👋</p>
            {/* Quick actions desktop */}
            <div className="hidden md:flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition">
                <FaVideo className="text-[10px]" /> Live Class
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition">
                <FaBookOpen className="text-[10px]" /> Add Course
              </button>
            </div>
            {/* Mobile hamburger */}
            <button className="md:hidden p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition" onClick={() => setMenuOpen(p => !p)}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          {/* Mobile dropdown menu */}
          {menuOpen && (
            <div className="md:hidden mt-3 pb-2 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
              <button className="flex items-center justify-center gap-1.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"><FaVideo /> Live Class</button>
              <button className="flex items-center justify-center gap-1.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"><FaBookOpen /> Add Course</button>
              <button className="flex items-center justify-center gap-1.5 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold"><FaClipboardCheck /> Assignment</button>
              <button className="flex items-center justify-center gap-1.5 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold"><FaDownload /> Report</button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">

        {/* ══ STATS GRID ══ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {stats.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 hover:shadow-md transition hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-base sm:text-lg ${item.bg} ${item.color}`}>
                  {item.icon}
                </div>
                <span className={`text-xs font-semibold ${item.trendUp ? "text-emerald-500" : "text-red-500"}`}>{item.trend}</span>
              </div>
              <p className="text-gray-500 text-[10px] sm:text-xs">{item.title}</p>
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mt-0.5">{item.value}</h3>
            </div>
          ))}
        </div>

        {/* ══ CHARTS ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Student Growth */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Student Growth</h2>
                <p className="text-xs text-gray-500">Monthly enrollment trends</p>
              </div>
              <FaChartLine className="text-gray-400 text-sm" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" fontSize={10} tick={{ fontSize: 10 }} width={32} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Revenue Overview</h2>
                <p className="text-xs text-gray-500">Monthly earnings (₹)</p>
              </div>
              <FaRupeeSign className="text-gray-400 text-sm" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" fontSize={10} tick={{ fontSize: 10 }} width={40} />
                <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ══ ACTIVITY + TASKS ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-sm font-bold text-gray-900">Recent Activity</h2>
              <button className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-700">
                View all <FaChevronRight className="text-[10px]" />
              </button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {recentActivities.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-2.5 sm:p-3 hover:bg-gray-50 rounded-xl transition">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <img src={a.avatar} alt="" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 object-cover" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{a.user}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <ActivityIcon type={a.type} />
                        <p className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[120px] sm:max-w-[200px]">{a.course}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="text-[10px] sm:text-xs text-gray-400 hidden xs:block">{a.time}</span>
                    <span className="text-[10px] text-gray-400 sm:hidden">{a.time.split(" ").slice(0, 2).join(" ")}</span>
                    <button className="text-gray-300 hover:text-gray-500 transition">
                      <FaEye className="text-xs sm:text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <FaSpinner className="text-amber-500 text-sm" />
              <h2 className="text-sm font-bold text-gray-900">Pending Tasks</h2>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {pendingTasks.map((t) => (
                <div key={t.id} className="flex justify-between items-start p-2.5 sm:p-3 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 leading-tight">{t.task}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <PriorityBadge p={t.priority} />
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <FaClock className="text-[9px]" /> {t.due}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-indigo-600 flex-shrink-0 mt-0.5">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ COURSE PERFORMANCE + UPCOMING CLASSES ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* Course Performance */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-sm font-bold text-gray-900">Course Performance</h2>
              <FaTrophy className="text-amber-500 text-sm" />
            </div>
            <div className="space-y-2 sm:space-y-3">
              {coursePerformance.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{c.name}</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500 flex-wrap">
                      <span>{c.students} students</span>
                      <span className="flex items-center gap-0.5">{c.rating} <FaStar className="text-yellow-400 text-[9px]" /></span>
                      <span>₹{c.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="text-indigo-400 hover:text-indigo-600 ml-2 flex-shrink-0">
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-sm font-bold text-gray-900">Upcoming Live Classes</h2>
              <FaCalendarAlt className="text-gray-400 text-sm" />
            </div>
            <div className="space-y-2 sm:space-y-3">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{cls.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] sm:text-xs flex-wrap">
                      <span className="text-gray-500">{cls.date} · {cls.time}</span>
                      <span className="text-indigo-600 font-medium">{cls.attendees} attending</span>
                    </div>
                  </div>
                  <button className="flex-shrink-0 flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 bg-indigo-600 text-white text-[10px] sm:text-xs rounded-lg hover:bg-indigo-700 transition font-semibold">
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-sm font-bold text-gray-900">Student Testimonials</h2>
            <FaCommentDots className="text-gray-400 text-sm" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {testimonials.map((t) => (
              <div key={t.id} className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`${i < t.rating ? "text-yellow-400" : "text-gray-200"} text-xs`} />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">"{t.text}"</p>
                <div className="mt-2.5 pt-2.5 border-t border-gray-200">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">{t.author}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400">{t.course}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ QUICK ACTIONS ══ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Create Live Class", icon: <FaVideo />, bg: "bg-indigo-600 hover:bg-indigo-700" },
            { label: "Add Course", icon: <FaBookOpen />, bg: "bg-emerald-600 hover:bg-emerald-700" },
            { label: "Create Assignment", icon: <FaClipboardCheck />, bg: "bg-amber-600 hover:bg-amber-700" },
            { label: "Generate Report", icon: <FaDownload />, bg: "bg-rose-600 hover:bg-rose-700" },
          ].map((btn, i) => (
            <button key={i} className={`${btn.bg} text-white rounded-xl py-3 px-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition`}>
              <span className="text-sm sm:text-base">{btn.icon}</span>
              <span className="leading-tight text-center">{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom padding for mobile */}
        <div className="h-2 sm:h-0" />
      </div>
    </div>
  );
};

export default InstructorDashboard;
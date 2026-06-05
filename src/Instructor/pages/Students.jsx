import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaFilter,
  FaUserPlus,
  FaEnvelope,
  FaChartLine,
  FaStar,
  FaGraduationCap,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaEllipsisV,
  FaEye,
  FaTrash,
  FaBan,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaUserCheck,
  FaUserGraduate,
  FaAward
} from 'react-icons/fa';

function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showActionMenu, setShowActionMenu] = useState(null);
  const itemsPerPage = 5;

  const students = [
    {
      id: 1,
      name: "Emily Johnson",
      email: "emily.johnson@gmail.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      progress: 85,
      enrolledDate: "Jan 15, 2024",
      lastActive: "2 hours ago",
      coursesEnrolled: 3,
      completedCourses: 2,
      avgRating: 4.8,
      status: "active",
      certificates: 2,
      totalSpent: 299.97
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@gmail.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      progress: 45,
      enrolledDate: "Feb 20, 2024",
      lastActive: "1 day ago",
      coursesEnrolled: 2,
      completedCourses: 0,
      avgRating: 0,
      status: "active",
      certificates: 0,
      totalSpent: 159.98
    },
    {
      id: 3,
      name: "Sarah Williams",
      email: "sarah.williams@gmail.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      progress: 92,
      enrolledDate: "Dec 10, 2023",
      lastActive: "5 hours ago",
      coursesEnrolled: 4,
      completedCourses: 3,
      avgRating: 4.9,
      status: "active",
      certificates: 3,
      totalSpent: 399.96
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@gmail.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      progress: 30,
      enrolledDate: "Mar 5, 2024",
      lastActive: "3 days ago",
      coursesEnrolled: 1,
      completedCourses: 0,
      avgRating: 0,
      status: "inactive",
      certificates: 0,
      totalSpent: 79.99
    },
    {
      id: 5,
      name: "Lisa Anderson",
      email: "lisa.anderson@gmail.com",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      progress: 68,
      enrolledDate: "Jan 28, 2024",
      lastActive: "1 hour ago",
      coursesEnrolled: 3,
      completedCourses: 1,
      avgRating: 4.5,
      status: "active",
      certificates: 1,
      totalSpent: 249.97
    },
    {
      id: 6,
      name: "James Wilson",
      email: "james.wilson@gmail.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      progress: 100,
      enrolledDate: "Oct 15, 2023",
      lastActive: "1 week ago",
      coursesEnrolled: 2,
      completedCourses: 2,
      avgRating: 4.7,
      status: "completed",
      certificates: 2,
      totalSpent: 199.98
    }
  ];

  const stats = [
    {
      title: "Total Students", value: students.length, icon: <FaUserGraduate />,
      color: "text-violet-600", bg: "bg-violet-50", accent: "border-l-violet-500",
      trend: "+12%", trendUp: true, sub: "2 joined this month"
    },
    {
      title: "Active Students", value: students.filter(s => s.status === 'active').length,
      icon: <FaUserCheck />, color: "text-emerald-600", bg: "bg-emerald-50", accent: "border-l-emerald-500",
      trend: "+5%", trendUp: true, sub: "67% of total enrolled"
    },
    {
      title: "Avg. Progress", value: `${Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)}%`,
      icon: <FaChartLine />, color: "text-amber-600", bg: "bg-amber-50", accent: "border-l-amber-500",
      trend: "Stable", trendUp: null, sub: "across all courses"
    },
    {
      title: "Certificates Issued", value: students.reduce((acc, s) => acc + s.certificates, 0),
      icon: <FaAward />, color: "text-blue-600", bg: "bg-blue-50", accent: "border-l-blue-500",
      trend: "+3", trendUp: true, sub: "1 student fully completed"
    },
  ];

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-emerald-500";
    if (progress >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1 w-fit"><FaCheckCircle className="text-xs" /> Active</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 flex items-center gap-1 w-fit"><FaBan className="text-xs" /> Inactive</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 flex items-center gap-1 w-fit"><FaGraduationCap className="text-xs" /> Completed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || student.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-3 sm:p-5 md:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-3">
          <Link to="/instructor/dashboard" className="text-sm text-gray-400 hover:text-violet-600 transition">
            Dashboard
          </Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-sm font-semibold text-gray-800">Students</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Student Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track your student's learning journey
            </p>
          </div>
          <button className="px-5 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm font-medium self-start">
            <FaUserPlus /> Add New Student
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className={`bg-white rounded-xl border border-gray-100 border-l-4 ${stat.accent} p-4 hover:shadow-md transition`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${stat.trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {stat.trendUp ? <FaChartLine className="text-xs" /> : '—'} {stat.trend}
                </span>
              </div>
              <p className="text-xl font-semibold text-gray-800 leading-none mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500 mb-2">{stat.title}</p>
              <p className="text-xs text-gray-400 border-t border-gray-100 pt-2 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={selectedFilter}
                  onChange={(e) => {
                    setSelectedFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm appearance-none bg-white cursor-pointer"
                >
                  <option value="all">All Students</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Completed</option>
                </select>
                <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
              </div>
              <button className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-medium text-gray-600 flex items-center gap-2">
                <FaDownload className="text-sm" /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Courses</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-4 align-middle min-w-[160px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{student.name}</p>
                          <p className="text-xs text-gray-400">Joined {student.enrolledDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-300 text-xs" />
                        <span className="text-sm text-gray-600">{student.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{student.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={`${getProgressColor(student.progress)} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <FaGraduationCap className="text-violet-400 text-sm" />
                        <span className="text-sm text-gray-700">{student.completedCourses}/{student.coursesEnrolled}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <FaClock className="text-gray-300 text-sm" />
                        <span className="text-sm text-gray-500">{student.lastActive}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {student.avgRating > 0 ? (
                        <div className="flex items-center gap-1">
                          <FaStar className="text-amber-400 text-sm" />
                          <span className="text-sm font-medium text-gray-700">{student.avgRating}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No rating</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === student.id ? null : student.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <FaEllipsisV className="text-gray-400 text-sm" />
                        </button>
                        {showActionMenu === student.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden">
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                              <FaEye className="text-xs" /> View Profile
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                              <FaEnvelope className="text-xs" /> Message
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                              <FaTrash className="text-xs" /> Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredStudents.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
                >
                  <FaChevronLeft className="text-xs" /> Previous
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-8 h-8 rounded-lg text-sm transition ${currentPage === idx + 1
                        ? 'bg-violet-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
                >
                  Next <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          )}

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserGraduate className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500">No students found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-200 rounded-xl flex items-center justify-center">
                <FaEnvelope className="text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-indigo-800">Send Announcement</p>
                <p className="text-xs text-indigo-600">Notify all students</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-200 rounded-xl flex items-center justify-center">
                <FaAward className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-800">Issue Certificates</p>
                <p className="text-xs text-emerald-600">For completed courses</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center">
                <FaChartLine className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">Generate Report</p>
                <p className="text-xs text-amber-600">Student progress report</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Students;
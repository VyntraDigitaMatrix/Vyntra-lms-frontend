import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch, FaGraduationCap, FaClock, FaCheckCircle, FaSpinner,
  FaChevronLeft, FaChevronRight, FaUserGraduate, FaEnvelope,
  FaPhone, FaExclamationCircle, FaChevronDown,
} from 'react-icons/fa';
import { instructorCourseApi, instructorStudentApi } from "../auth/api";

const BRAND = "#7c3aed"; // violet, matching original accent

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const getProgressColor = (progress) => {
  if (progress >= 80) return "bg-emerald-500";
  if (progress >= 50) return "bg-amber-500";
  return "bg-rose-500";
};

const statusBadge = (status) => {
  if (!status) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">Not enrolled</span>;
  const s = status.toUpperCase();
  if (s === 'ACTIVE' || s === 'ENROLLED') {
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1 w-fit"><FaCheckCircle className="text-xs" /> {status}</span>;
  }
  if (s === 'COMPLETED') {
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 flex items-center gap-1 w-fit"><FaGraduationCap className="text-xs" /> {status}</span>;
  }
  return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">{status}</span>;
};

const initials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

function Students() {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // API is 0-indexed
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  /* ─── Load instructor's courses for the selector ─────────── */
  useEffect(() => {
    (async () => {
      setCoursesLoading(true);
      try {
        const res = await instructorCourseApi.getInstructorCourses(0, 200);
        if (res.data.success) {
          const list = res.data.data.content || [];
          setCourses(list);
          if (list.length > 0) setSelectedCourse(list[0]);
        }
      } catch (err) {
        console.error("fetchCourses:", err);
      } finally {
        setCoursesLoading(false);
      }
    })();
  }, []);

  /* ─── Load students for the selected course ──────────────── */
  const fetchStudents = useCallback(async () => {
    if (!selectedCourse?.slug) return;
    setStudentsLoading(true);
    setError("");
    try {
      const res = await instructorStudentApi.getStudentsByCourse(selectedCourse.slug, currentPage, pageSize);
      if (res.data.success) {
        setStudents(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
        setTotalElements(res.data.data.totalElements || 0);
      } else {
        setError(res.data.message || "Failed to load students.");
      }
    } catch (err) {
      console.error("fetchStudents:", err);
      setError(err.response?.data?.message || "Failed to load students.");
    } finally {
      setStudentsLoading(false);
    }
  }, [selectedCourse, currentPage]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  useEffect(() => { setCurrentPage(0); }, [selectedCourse]);

  /* ─── Client-side search within the loaded page ──────────── */
  const filteredStudents = students.filter((s) =>
    !searchTerm ||
    s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ─── Stats computed from the actual response fields ─────── */
  const avgProgress = students.length
    ? Math.round(students.reduce((acc, s) => acc + (s.progressPercentage || 0), 0) / students.length)
    : 0;
  const completedCount = students.filter((s) => s.completedAt || s.progressPercentage === 100).length;
  const enrolledCount = students.filter((s) => s.enrollmentStatus).length;

  const stats = [
    { title: "Students on this page", value: students.length, icon: <FaUserGraduate />, color: "text-violet-600", bg: "bg-violet-50", accent: "border-l-violet-500", sub: `${totalElements} total across all pages` },
    { title: "Enrolled", value: enrolledCount, icon: <FaCheckCircle />, color: "text-emerald-600", bg: "bg-emerald-50", accent: "border-l-emerald-500", sub: "with an active enrollment record" },
    { title: "Avg. Progress", value: `${avgProgress}%`, icon: <FaGraduationCap />, color: "text-amber-600", bg: "bg-amber-50", accent: "border-l-amber-500", sub: "across students on this page" },
    { title: "Completed", value: completedCount, icon: <FaGraduationCap />, color: "text-blue-600", bg: "bg-blue-50", accent: "border-l-blue-500", sub: "reached 100% or marked complete" },
  ];

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
              View enrolled students and their progress, course by course
            </p>
          </div>
        </div>

        {/* Course Selector */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Select a course</label>
          {coursesLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FaSpinner className="animate-spin" /> Loading your courses...
            </div>
          ) : courses.length === 0 ? (
            <p className="text-sm text-gray-400">No courses found for your account.</p>
          ) : (
            <div className="relative max-w-md">
              <select
                value={selectedCourse?.id || ''}
                onChange={(e) => setSelectedCourse(courses.find((c) => c.id === e.target.value))}
                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm appearance-none bg-white cursor-pointer font-medium text-gray-700"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>
          )}
        </div>

        {selectedCourse && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, idx) => (
                <div key={idx} className={`bg-white rounded-xl border border-gray-100 border-l-4 ${stat.accent} p-4 hover:shadow-md transition`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                  <p className="text-xl font-semibold text-gray-800 leading-none mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mb-2">{stat.title}</p>
                  <p className="text-xs text-gray-400 border-t border-gray-100 pt-2 mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search by name, email, or student code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              {studentsLoading ? (
                <div className="py-16 text-center text-gray-400">
                  <FaSpinner className="animate-spin text-2xl mx-auto mb-2" />
                  <p className="text-sm">Loading students...</p>
                </div>
              ) : error ? (
                <div className="py-16 text-center text-red-400">
                  <FaExclamationCircle className="text-2xl mx-auto mb-2" />
                  <p className="text-sm">{error}</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUserGraduate className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-500">No students found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search, or check another course</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredStudents.map((student) => (
                        <tr key={student.studentId} className="hover:bg-gray-50/50 transition">
                          <td className="px-4 py-4 align-middle min-w-[200px]">
                            <div className="flex items-center gap-3">
                              {student.profileImage ? (
                                <img
                                  src={student.profileImage}
                                  alt={student.fullName}
                                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs shrink-0">
                                  {initials(student.fullName)}
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{student.fullName}</p>
                                <p className="text-xs text-gray-400">{student.studentCode}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <FaEnvelope className="text-gray-300 text-xs flex-shrink-0" />
                                <span className="truncate max-w-[180px]">{student.email}</span>
                              </div>
                              {student.mobileNumber && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                  <FaPhone className="text-gray-300 text-[10px] flex-shrink-0" />
                                  {student.mobileNumber}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="w-32">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>{student.progressPercentage ?? 0}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                  className={`${getProgressColor(student.progressPercentage || 0)} h-2 rounded-full transition-all duration-500`}
                                  style={{ width: `${student.progressPercentage || 0}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {statusBadge(student.enrollmentStatus)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <FaClock className="text-gray-300 text-xs" />
                              {formatDate(student.enrolledAt)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-500">{formatDate(student.completedAt)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination — driven by real API page data */}
              {!studentsLoading && !error && totalElements > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-sm text-gray-500">
                    Page {currentPage + 1} of {totalPages} · {totalElements} students total
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                      disabled={currentPage === 0}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
                    >
                      <FaChevronLeft className="text-xs" /> Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
                      disabled={currentPage >= totalPages - 1}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
                    >
                      Next <FaChevronRight className="text-xs" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Students;
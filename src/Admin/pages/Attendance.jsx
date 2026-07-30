import React, { useState, useEffect } from "react";
import { adminAttendanceApi, adminCourseApi } from "../auth/api";
import { FaCalendarAlt, FaUserGraduate, FaBook, FaSearch, FaCheckCircle, FaTimesCircle, FaClock, FaSignOutAlt, FaFilter, FaListAlt } from "react-icons/fa";

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("course");

  // Course Attendance State
  const [courses, setCourses] = useState([]);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [courseAttendance, setCourseAttendance] = useState([]);
  const [courseSummary, setCourseSummary] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(false);

  // Student Attendance State
  const [studentCode, setStudentCode] = useState("");
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await adminCourseApi.getAllCourses(0, 100);
      if (res.data?.data?.content) {
        setCourses(res.data.data.content);
        if (res.data.data.content.length > 0) {
          setSelectedCourseSlug(res.data.data.content[0].slug);
        }
      }
    } catch (err) {
      console.error("Failed to load courses:", err);
    }
  };

  const handleFetchCourseAttendance = async (e) => {
    e?.preventDefault();
    if (!selectedCourseSlug) return;
    setLoadingCourse(true);
    setError("");
    try {
      const [summaryRes, attendanceRes] = await Promise.all([
        adminAttendanceApi.getCourseAttendanceSummary(selectedCourseSlug),
        adminAttendanceApi.getCourseAttendance(selectedCourseSlug, attendanceDate, statusFilter, 0, 100)
      ]);
      if (summaryRes.data?.data) setCourseSummary(summaryRes.data.data);
      if (attendanceRes.data?.data?.content) setCourseAttendance(attendanceRes.data.data.content);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch course attendance");
    } finally {
      setLoadingCourse(false);
    }
  };

  const handleFetchStudentAttendance = async (e) => {
    e?.preventDefault();
    if (!studentCode.trim()) return;
    setLoadingStudent(true);
    setError("");
    try {
      const res = await adminAttendanceApi.getStudentAttendance(studentCode.trim(), 0, 100);
      if (res.data?.data?.content) {
        setStudentAttendance(res.data.data.content);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch student attendance");
    } finally {
      setLoadingStudent(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PRESENT": return <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full tracking-wide">PRESENT</span>;
      case "ABSENT": return <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-full tracking-wide">ABSENT</span>;
      case "IN_PROGRESS": return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full tracking-wide">IN PROGRESS</span>;
      case "AUTO_PUNCH_OUT": return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full tracking-wide">AUTO PUNCH OUT</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-full tracking-wide">{status}</span>;
    }
  };

  const renderCourseTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <form onSubmit={handleFetchCourseAttendance} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Select Course</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaBook /></span>
            <select
              value={selectedCourseSlug}
              onChange={(e) => setSelectedCourseSlug(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB2A9] appearance-none bg-white"
            >
              {courses.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}
            </select>
          </div>
        </div>

        <div className="w-full md:w-48">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Date</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaCalendarAlt /></span>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB2A9] bg-white"
            />
          </div>
        </div>

        <div className="w-full md:w-48">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Status</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaFilter /></span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB2A9] appearance-none bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="AUTO_PUNCH_OUT">Auto Punch Out</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loadingCourse} className="w-full md:w-32 py-2 bg-[#2BB2A9] hover:bg-[#37c8bb] text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-70">
          {loadingCourse ? "Loading..." : <><FaSearch /> Search</>}
        </button>
      </form>

      {/* Summary Cards */}
      {courseSummary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2"><FaUserGraduate /></div>
            <p className="text-xl font-bold text-gray-800">{courseSummary.totalStudents}</p>
            <p className="text-[10px] text-gray-500 font-semibold uppercase">Total Students</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-2"><FaCheckCircle /></div>
            <p className="text-xl font-bold text-gray-800">{courseSummary.presentStudents}</p>
            <p className="text-[10px] text-gray-500 font-semibold uppercase">Present</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-2"><FaTimesCircle /></div>
            <p className="text-xl font-bold text-gray-800">{courseSummary.absentStudents}</p>
            <p className="text-[10px] text-gray-500 font-semibold uppercase">Absent</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2"><FaClock /></div>
            <p className="text-xl font-bold text-gray-800">{courseSummary.inProgressStudents}</p>
            <p className="text-[10px] text-gray-500 font-semibold uppercase">In Progress</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-2"><FaSignOutAlt /></div>
            <p className="text-xl font-bold text-gray-800">{courseSummary.autoPunchOutStudents}</p>
            <p className="text-[10px] text-gray-500 font-semibold uppercase">Auto Out</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-2"><FaListAlt /></div>
            <p className="text-xl font-bold text-gray-800">{courseSummary.attendancePercentage}%</p>
            <p className="text-[10px] text-gray-500 font-semibold uppercase">Avg Attendance</p>
          </div>
        </div>
      )}

      {/* Course Attendance Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700">Course Attendance Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-xs text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Punch In</th>
                <th className="px-5 py-3">Punch Out</th>
                <th className="px-5 py-3">Duration (Mins)</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courseAttendance.length > 0 ? courseAttendance.map((record, index) => (
                <tr key={index} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-800">{record.studentName || "N/A"}</p>
                    <p className="text-[10px] text-gray-500">{record.studentCode || record.studentEmail}</p>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-600">{record.attendanceDate}</td>
                  <td className="px-5 py-3 text-xs">{record.punchInTime ? new Date(record.punchInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '-'}</td>
                  <td className="px-5 py-3 text-xs">{record.punchOutTime ? new Date(record.punchOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '-'}</td>
                  <td className="px-5 py-3 font-semibold">{record.totalMinutes || 0}</td>
                  <td className="px-5 py-3">{getStatusBadge(record.status)}</td>
                  <td className="px-5 py-3 text-xs text-gray-500 max-w-[200px] truncate">{record.remarks || '-'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-gray-500 text-sm">
                    {loadingCourse ? "Loading records..." : "No attendance records found for this selection."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStudentTab = () => (
    <div className="space-y-6">
      <form onSubmit={handleFetchStudentAttendance} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-end max-w-2xl">
        <div className="flex-1 w-full">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Student Code</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaUserGraduate /></span>
            <input
              type="text"
              placeholder="e.g. STU-12345"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
            />
          </div>
        </div>
        <button type="submit" disabled={loadingStudent} className="w-full md:w-32 py-2 bg-[#2BB2A9] hover:bg-[#37c8bb] text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-70">
          {loadingStudent ? "Loading..." : <><FaSearch /> Search</>}
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700">Student Attendance History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-xs text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Punch In</th>
                <th className="px-5 py-3">Punch Out</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {studentAttendance.length > 0 ? studentAttendance.map((record, index) => (
                <tr key={index} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 font-medium text-gray-800">{record.attendanceDate}</td>
                  <td className="px-5 py-3 text-xs">
                    <span className="font-semibold text-gray-700">{record.totalMinutes || 0}</span> mins
                    {record.totalDuration && <p className="text-[10px] text-gray-400 mt-0.5">{record.totalDuration}</p>}
                  </td>
                  <td className="px-5 py-3 text-xs">{record.punchInTime ? new Date(record.punchInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '-'}</td>
                  <td className="px-5 py-3 text-xs">{record.punchOutTime ? new Date(record.punchOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '-'}</td>
                  <td className="px-5 py-3">{getStatusBadge(record.status)}</td>
                  <td className="px-5 py-3 text-xs text-gray-500 max-w-[200px] truncate">{record.remarks || '-'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-gray-500 text-sm">
                    {loadingStudent ? "Loading records..." : "No attendance records found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 min-h-screen bg-[#f7f8fc]">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Attendance Management</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage attendance records across all courses and students.</p>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-white border border-gray-200 rounded-xl w-fit shadow-sm">
          <button
            onClick={() => { setError(""); setActiveTab("course"); }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "course" ? "bg-[#2BB2A9] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
          >
            Course Attendance
          </button>
          <button
            onClick={() => { setError(""); setActiveTab("student"); }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "student" ? "bg-[#2BB2A9] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
          >
            Student Attendance
          </button>
        </div>

        {activeTab === "course" ? renderCourseTab() : renderStudentTab()}

      </div>
    </div>
  );
};

export default Attendance;

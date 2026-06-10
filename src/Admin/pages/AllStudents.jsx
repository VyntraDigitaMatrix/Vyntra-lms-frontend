import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Eye,
  Edit,
  Filter,
  Mail,
  MoreVertical,
  GraduationCap,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Users,
  ShieldCheck,
  Phone,
  Image,
  RefreshCw
} from "lucide-react";
import { adminManagement } from "../auth/api";

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sortField, setSortField] = useState("fullName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    studentCode: "",
    fullName: "",
    mobileNumber: "",
    profileImage: ""
  });
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // Stats states
  const [totalStudentsCount, setTotalStudentsCount] = useState(0);
  const [activeStudentsCount, setActiveStudentsCount] = useState(0);

  const fetchStats = async () => {
    try {
      const [totalRes, activeRes] = await Promise.all([
        adminManagement.getAllStudents(null, 0, 1),
        adminManagement.getAllStudents(true, 0, 1)
      ]);
      if (totalRes.data && totalRes.data.data) {
        setTotalStudentsCount(totalRes.data.data.totalElements);
      }
      if (activeRes.data && activeRes.data.data) {
        setActiveStudentsCount(activeRes.data.data.totalElements);
      }
    } catch (err) {
      console.error("Failed to fetch student counts", err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      const springPage = currentPage - 1;
      if (searchTerm.trim()) {
        res = await adminManagement.searchStudents(searchTerm.trim(), springPage, itemsPerPage);
      } else {
        const activeParam = selectedStatus === "active" ? true : selectedStatus === "inactive" ? false : null;
        res = await adminManagement.getAllStudents(activeParam, springPage, itemsPerPage);
      }

      if (res.data && res.data.data) {
        setStudents(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
        setTotalElements(res.data.data.totalElements || 0);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to fetch students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch when filters or page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedStatus, currentPage]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const handleViewStudent = async (studentCode) => {
    try {
      const res = await adminManagement.getStudentByCode(studentCode);
      if (res.data && res.data.data) {
        setSelectedStudent(res.data.data);
        setShowStudentModal(true);
      }
    } catch (err) {
      console.error("Error fetching student details:", err);
      alert("Failed to load student details.");
    }
  };

  const handleEditClick = (student) => {
    setEditForm({
      studentCode: student.studentCode,
      fullName: student.fullName || "",
      mobileNumber: student.mobileNumber || "",
      profileImage: student.profileImage || ""
    });
    setUpdateError("");
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError("");
    try {
      const res = await adminManagement.updateStudent(editForm.studentCode, {
        fullName: editForm.fullName,
        mobileNumber: editForm.mobileNumber,
        profileImage: editForm.profileImage
      });
      if (res.data) {
        setShowEditModal(false);
        fetchStudents();
        fetchStats();
      }
    } catch (err) {
      console.error("Error updating student:", err);
      setUpdateError(err.response?.data?.message || "Failed to update student profile.");
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStatus = async (studentCode) => {
    if (!window.confirm("Are you sure you want to toggle this student's active status?")) {
      return;
    }
    try {
      const res = await adminManagement.toggleStudentStatus(studentCode);
      if (res.data) {
        fetchStudents();
        fetchStats();
      }
    } catch (err) {
      console.error("Error toggling student status:", err);
      alert("Failed to toggle student status.");
    }
  };

  // Sort students (client side sorting on current page content)
  const sortedStudents = [...students].sort((a, b) => {
    let aVal = a[sortField] || "";
    let bVal = b[sortField] || "";
    
    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.studentCode));
    }
  };

  const handleSelectStudent = (studentCode) => {
    if (selectedStudents.includes(studentCode)) {
      setSelectedStudents(selectedStudents.filter(code => code !== studentCode));
    } else {
      setSelectedStudents([...selectedStudents, studentCode]);
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6">
        {/* Breadcrumbs */}
        <div>
          <p className="text-sm text-gray-400 mb-1 flex items-center">
            <Link to="/admin/dashboard" className="hover:text-[#2BB2A9] transition">
              Dashboard
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-none font-medium text-gray-600">All Students</span>
          </p>
        </div>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              All Students
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage and monitor all registered students</p>
          </div>
          <button 
            onClick={() => { fetchStudents(); fetchStats(); }}
            className="p-2 text-gray-600 hover:text-[#2BB2A9] transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-[#2BB2A9] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Total Students</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{totalStudentsCount}</p>
              </div>
              <div className="bg-[#e6f4f3] p-3 rounded-lg">
                <Users className="w-6 h-6 text-[#2BB2A9]" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400">Total registered in the system</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Active Students</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{activeStudentsCount}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">
              {totalStudentsCount > 0 ? Math.round((activeStudentsCount / totalStudentsCount) * 100) : 0}% Active Rate
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Inactive Students</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {totalStudentsCount - activeStudentsCount}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <div className="mt-2 text-xs text-red-500">Suspended or inactive status</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Email Verified</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {students.filter(s => s.emailVerified).length}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-purple-600">On current page</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 hover:shadow-md transition-all duration-300">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2BB2A9] focus:border-transparent transition-all duration-300 hover:border-[#2BB2A9]"
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB2A9] focus:border-transparent bg-white text-gray-700 appearance-none cursor-pointer transition-all duration-300 hover:border-[#2BB2A9]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232BB2A9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1rem'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedStudents.length > 0 && (
          <div className="bg-[#e6f4f3] rounded-lg p-3 mb-6 flex items-center justify-between animate-fadeIn">
            <span className="text-sm font-medium text-[#2BB2A9]">
              {selectedStudents.length} student(s) selected
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white text-[#2BB2A9] rounded-md hover:bg-gray-50 hover:shadow-md transition-all duration-300 text-sm">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Group
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm border border-red-100 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto scrollbar-hide hover:shadow-md transition-all duration-300">
          {loading ? (
            <div className="p-20 text-center text-gray-500">
              <div className="w-10 h-10 border-4 border-t-[#2BB2A9] border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
              <span>Fetching students from servers...</span>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left w-12">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === students.length && students.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-[#2BB2A9] focus:ring-[#2BB2A9] rounded border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Code</th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#2BB2A9] w-[25%] transition-colors duration-300 group"
                      onClick={() => handleSort('fullName')}
                    >
                      <div className="flex items-center gap-1">
                        Student Name
                        {sortField === 'fullName' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-[#2BB2A9]" /> : <ChevronDown className="w-3 h-3 text-[#2BB2A9]" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Mobile</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Verified</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedStudents.map((student) => (
                    <tr key={student.studentCode} className="hover:bg-gray-50 transition-colors duration-200 group">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.studentCode)}
                          onChange={() => handleSelectStudent(student.studentCode)}
                          className="w-4 h-4 text-[#2BB2A9] focus:ring-[#2BB2A9] rounded border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">
                        {student.studentCode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 group-hover:text-[#2BB2A9] transition-colors duration-200">
                          {student.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {student.mobileNumber || "—"}
                      </td>
                      <td className="px-6 py-4">
                        {student.emailVerified ? (
                          <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-4 h-4" /> Yes
                          </span>
                        ) : (
                          <span className="text-red-500 text-xs font-semibold flex items-center gap-1">
                            ✕ No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(student.studentCode)}
                          className={`px-2 py-1 text-xs rounded-full whitespace-nowrap inline-flex items-center ${getStatusColor(student.isActive)} transition-all duration-300 hover:scale-105 cursor-pointer`}
                          title="Click to toggle status"
                        >
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                            student.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          <span>{student.isActive ? "Active" : "Inactive"}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewStudent(student.studentCode)}
                            className="p-1 text-[#2BB2A9] hover:bg-[#e6f4f3] rounded transition-all duration-200 hover:scale-110"
                            title="View Student Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditClick(student)}
                            className="p-1 text-[#2BB2A9] hover:bg-[#e6f4f3] rounded transition-all duration-200 hover:scale-110"
                            title="Edit Profile"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {sortedStudents.length === 0 && (
                    <tr>
                      <td colSpan="8" className="p-10 text-center text-gray-400">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalElements)} of {totalElements} students
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e6f4f3] hover:text-[#2BB2A9] hover:border-[#2BB2A9] transition-all duration-300 text-gray-700"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 bg-[#2BB2A9] text-white rounded-md text-sm hover:bg-[#249b93] transition-all duration-300">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e6f4f3] hover:text-[#2BB2A9] hover:border-[#2BB2A9] transition-all duration-300 text-gray-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Global CSS Styles */}
      <style jsx global>{`
        select option:hover,
        select option:focus,
        select option:active,
        select option:checked {
          background-color: #2BB2A9 !important;
          color: white !important;
        }
        select:focus {
          outline: none;
          border-color: #2BB2A9 !important;
        }
        *:focus {
          outline: none;
        }
        input:focus, 
        select:focus, 
        button:focus {
          outline: none;
          ring-color: #2BB2A9 !important;
        }
      `}</style>

      {/* View Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowStudentModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg"
            >
              ✕
            </button>

            <div className="text-center mb-5">
              {selectedStudent.profileImage ? (
                <img 
                  src={selectedStudent.profileImage} 
                  alt={selectedStudent.fullName} 
                  className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-[#2BB2A9]"
                />
              ) : (
                <div className="w-20 h-20 mx-auto rounded-full bg-[#e6f4f3] flex items-center justify-center text-[#2BB2A9] text-2xl font-bold">
                  {selectedStudent.fullName?.charAt(0)}
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-800 mt-3">
                {selectedStudent.fullName}
              </h2>
              <p className="text-sm text-gray-500">{selectedStudent.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Student Code</p>
                <p className="font-semibold font-mono">{selectedStudent.studentCode}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Username</p>
                <p className="font-semibold">{selectedStudent.username}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Mobile Number</p>
                <p className="font-semibold">{selectedStudent.mobileNumber || "—"}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Status</p>
                <p className="font-semibold capitalize">{selectedStudent.isActive ? "Active" : "Inactive"}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Email Verified</p>
                <p className="font-semibold">{selectedStudent.emailVerified ? "Verified" : "Unverified"}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Auth Provider</p>
                <p className="font-semibold uppercase">{selectedStudent.authType}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg"
              disabled={updating}
            >
              ✕
            </button>

            <h2 className="text-lg font-bold text-gray-800 mb-4">Edit Student Profile</h2>

            {updateError && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-4">
                {updateError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Student Code</label>
                <input 
                  type="text" 
                  value={editForm.studentCode} 
                  disabled 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.fullName} 
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2BB2A9] outline-none"
                  required
                  disabled={updating}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={editForm.mobileNumber} 
                    onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })}
                    placeholder="Enter mobile number"
                    className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2BB2A9] outline-none"
                    disabled={updating}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Profile Image URL</label>
                <div className="relative">
                  <Image className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={editForm.profileImage} 
                    onChange={(e) => setEditForm({ ...editForm, profileImage: e.target.value })}
                    placeholder="Enter image URL"
                    className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2BB2A9] outline-none"
                    disabled={updating}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-[#2BB2A9] to-[#249b93] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition"
                  disabled={updating}
                >
                  {updating ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStudents;
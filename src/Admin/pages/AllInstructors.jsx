import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Mail,
  Eye,
  CheckSquare,
  Square,
  Users,
  ShieldCheck,
  Phone,
  Image,
  Lock,
  RefreshCw
} from "lucide-react";
import { adminManagement } from "../auth/api";

const InstructorsManagement = () => {
  // ---------- API State ----------
  const [instructors, setInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sortField, setSortField] = useState("fullName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewInstructor, setViewInstructor] = useState(null);

  // Form states
  const [addForm, setAddForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: ""
  });
  const [editForm, setEditForm] = useState({
    instructorCode: "",
    fullName: "",
    mobileNumber: "",
    profileImage: ""
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Stats states
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  const fetchStats = async () => {
    try {
      const [totalRes, activeRes] = await Promise.all([
        adminManagement.getAllInstructors(null, 0, 1),
        adminManagement.getAllInstructors(true, 0, 1)
      ]);
      if (totalRes.data && totalRes.data.data) {
        setTotalCount(totalRes.data.data.totalElements);
      }
      if (activeRes.data && activeRes.data.data) {
        setActiveCount(activeRes.data.data.totalElements);
      }
    } catch (err) {
      console.error("Failed to fetch instructor stats", err);
    }
  };

  const fetchInstructors = async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      const springPage = currentPage - 1;
      if (searchTerm.trim()) {
        res = await adminManagement.searchInstructors(searchTerm.trim(), springPage, itemsPerPage);
      } else {
        const activeParam = statusFilter === "active" ? true : statusFilter === "inactive" ? false : null;
        res = await adminManagement.getAllInstructors(activeParam, springPage, itemsPerPage);
      }

      if (res.data && res.data.data) {
        setInstructors(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
        setTotalElements(res.data.data.totalElements || 0);
      }
    } catch (err) {
      console.error("Error fetching instructors:", err);
      setError("Failed to fetch instructors list.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced query when filters/page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInstructors();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, currentPage, itemsPerPage]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenAddModal = () => {
    setAddForm({
      fullName: "",
      email: "",
      mobileNumber: "",
      password: ""
    });
    setFormError("");
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError("");
    try {
      const res = await adminManagement.createInstructor(addForm);
      if (res.data) {
        setShowAddModal(false);
        fetchInstructors();
        fetchStats();
      }
    } catch (err) {
      console.error("Error creating instructor:", err);
      setFormError(err.response?.data?.message || "Failed to register new instructor.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenEditModal = (instructor) => {
    setEditForm({
      instructorCode: instructor.instructorCode,
      fullName: instructor.fullName || "",
      mobileNumber: instructor.mobileNumber || "",
      profileImage: instructor.profileImage || ""
    });
    setFormError("");
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError("");
    try {
      const res = await adminManagement.updateInstructor(editForm.instructorCode, {
        fullName: editForm.fullName,
        mobileNumber: editForm.mobileNumber,
        profileImage: editForm.profileImage
      });
      if (res.data) {
        setShowEditModal(false);
        fetchInstructors();
        fetchStats();
      }
    } catch (err) {
      console.error("Error updating instructor:", err);
      setFormError(err.response?.data?.message || "Failed to update instructor profile.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = async (instructorCode) => {
    if (!window.confirm("Are you sure you want to toggle this instructor's active status?")) {
      return;
    }
    try {
      const res = await adminManagement.toggleInstructorStatus(instructorCode);
      if (res.data) {
        fetchInstructors();
        fetchStats();
      }
    } catch (err) {
      console.error("Error toggling instructor status:", err);
      alert("Failed to update status.");
    }
  };

  const handleViewInstructor = async (instructorCode) => {
    try {
      const res = await adminManagement.getInstructorByCode(instructorCode);
      if (res.data && res.data.data) {
        setViewInstructor(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching instructor details:", err);
      alert("Failed to load instructor profile details.");
    }
  };

  // Sort instructors (client side sorting on current page)
  const sortedInstructors = [...instructors].sort((a, b) => {
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

  const toggleSelectInstructor = (code) => {
    setSelectedInstructors((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const toggleSelectAll = () => {
    if (selectedInstructors.length === instructors.length && instructors.length > 0) {
      setSelectedInstructors([]);
    } else {
      setSelectedInstructors(instructors.map((i) => i.instructorCode));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto mb-4">
        <p className="text-sm text-gray-400 mb-1 flex items-center">
          <Link to="/admin/dashboard" className="hover:text-teal-600 transition">
            Dashboard
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-none font-medium text-gray-600">All Instructors</span>
        </p>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructors Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your teaching staff, track status, and register instructors</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { fetchInstructors(); fetchStats(); }}
            className="p-2 text-gray-600 hover:text-teal-600 border border-gray-200 bg-white rounded-lg transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={handleOpenAddModal} 
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition shadow-sm font-semibold text-sm"
          >
            <UserPlus size={18} />
            Add Instructor
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-xs">Total Instructors</p>
            <h3 className="text-xl font-bold text-gray-800">{totalCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-xs">Active Instructors</p>
            <h3 className="text-xl font-bold text-gray-800">{activeCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <X size={18} className="text-amber-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-xs">Inactive Instructors</p>
            <h3 className="text-xl font-bold text-gray-800">{totalCount - activeCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck size={18} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-xs">Verified (Page)</p>
            <h3 className="text-xl font-bold text-gray-800">
              {instructors.filter(i => i.emailVerified).length}
            </h3>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="max-w-7xl mx-auto bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Filter Bar & Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {/* Filters */}
        <div className="p-4 flex flex-wrap items-center gap-3 border-b border-gray-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
          <div className="relative">
            <select 
              value={statusFilter} 
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }} 
              className="appearance-none border border-gray-200 rounded-lg px-3 py-1.5 pr-7 bg-white focus:ring-1 focus:ring-teal-500 outline-none text-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedInstructors.length > 0 && (
          <div className="bg-teal-50/40 px-4 py-2 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-teal-800">{selectedInstructors.length} instructor(s) selected</span>
            </div>
            <button className="text-xs text-teal-700 bg-white border border-teal-200 px-3 py-1 rounded hover:bg-teal-50 transition">
              Group Message
            </button>
          </div>
        )}

        {/* Instructors Table */}
        <div className="overflow-x-auto scrollbar-hide">
          {loading ? (
            <div className="p-20 text-center text-gray-500">
              <div className="w-10 h-10 border-4 border-t-teal-600 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
              <span>Fetching instructors...</span>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <button 
                      onClick={toggleSelectAll} 
                      className="text-gray-400 hover:text-teal-600 transition"
                      disabled={instructors.length === 0}
                    >
                      {selectedInstructors.length === instructors.length && instructors.length > 0 ? 
                        <CheckSquare size={14} className="text-teal-600" /> : <Square size={14} />
                      }
                    </button>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">Instructor Code</th>
                  <th 
                    className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-teal-600 w-[25%]"
                    onClick={() => handleSort('fullName')}
                  >
                    <div className="flex items-center gap-1">
                      Instructor Name
                      {sortField === 'fullName' && (
                        sortDirection === 'asc' ? <ChevronUp size={12} className="text-teal-600" /> : <ChevronDown size={12} className="text-teal-600" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[25%]">Email</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">Mobile</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">Email Verified</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedInstructors.map((instructor) => (
                  <tr key={instructor.instructorCode} className="hover:bg-gray-50 transition group">
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelectInstructor(instructor.instructorCode)} className="text-gray-400 hover:text-teal-600 transition">
                        {selectedInstructors.includes(instructor.instructorCode) ? (
                          <CheckSquare size={14} className="text-teal-600" />
                        ) : (
                          <Square size={14} />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600 text-xs">
                      {instructor.instructorCode}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-sm group-hover:text-teal-600 transition-colors">
                        {instructor.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {instructor.email}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {instructor.mobileNumber || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {instructor.emailVerified ? (
                        <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
                          <ShieldCheck size={14} /> Yes
                        </span>
                      ) : (
                        <span className="text-red-500 text-xs font-semibold">
                          ✕ No
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(instructor.instructorCode)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center cursor-pointer transition ${
                          instructor.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                          instructor.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span>{instructor.isActive ? "Active" : "Inactive"}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => handleViewInstructor(instructor.instructorCode)} 
                          className="p-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-teal-600 transition" 
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(instructor)} 
                          className="p-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-teal-600 transition" 
                          title="Edit Instructor"
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedInstructors.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-400">
                      No instructors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalElements)} of {totalElements} instructors
            </div>
            <div className="flex gap-1.5">
              <button 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                disabled={currentPage === 1} 
                className="p-1 border border-gray-200 rounded disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-teal-600 text-white rounded text-xs font-medium">{currentPage}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                disabled={currentPage === totalPages} 
                className="p-1 border border-gray-200 rounded disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">Add New Instructor</h2>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={formSubmitting}
              >
                <X size={18} />
              </button>
            </div>
            {formError && (
              <div className="bg-red-50 text-red-600 text-xs p-3 m-4 rounded-lg">
                {formError}
              </div>
            )}
            <form onSubmit={handleAddSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
                <input 
                  required 
                  placeholder="Enter full name" 
                  value={addForm.fullName} 
                  onChange={e => setAddForm({...addForm, fullName: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                  disabled={formSubmitting}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</label>
                <input 
                  required 
                  type="email" 
                  placeholder="Enter email address" 
                  value={addForm.email} 
                  onChange={e => setAddForm({...addForm, email: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                  disabled={formSubmitting}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    required
                    placeholder="Enter mobile number" 
                    value={addForm.mobileNumber} 
                    onChange={e => setAddForm({...addForm, mobileNumber: e.target.value})} 
                    className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                    disabled={formSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    required 
                    type="password"
                    placeholder="Password for verification" 
                    value={addForm.password} 
                    onChange={e => setAddForm({...addForm, password: e.target.value})} 
                    className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                    disabled={formSubmitting}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 hover:shadow-md transition"
                disabled={formSubmitting}
              >
                {formSubmitting ? "Registering Instructor..." : "Register Instructor"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">Edit Instructor Profile</h2>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={formSubmitting}
              >
                <X size={18} />
              </button>
            </div>
            {formError && (
              <div className="bg-red-50 text-red-600 text-xs p-3 m-4 rounded-lg">
                {formError}
              </div>
            )}
            <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Instructor Code</label>
                <input 
                  type="text"
                  value={editForm.instructorCode} 
                  disabled 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
                <input 
                  required 
                  placeholder="Enter full name" 
                  value={editForm.fullName} 
                  onChange={e => setEditForm({...editForm, fullName: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                  disabled={formSubmitting}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    placeholder="Enter mobile number" 
                    value={editForm.mobileNumber} 
                    onChange={e => setEditForm({...editForm, mobileNumber: e.target.value})} 
                    className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                    disabled={formSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Profile Image URL</label>
                <div className="relative">
                  <Image className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    placeholder="Enter image URL" 
                    value={editForm.profileImage} 
                    onChange={e => setEditForm({...editForm, profileImage: e.target.value})} 
                    className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                    disabled={formSubmitting}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 hover:shadow-md transition"
                disabled={formSubmitting}
              >
                {formSubmitting ? "Saving Changes..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewInstructor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden relative">
            <button 
              onClick={() => setViewInstructor(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-lg transition"
            >
              ✕
            </button>
            <div className="p-6">
              <div className="text-center mb-6">
                {viewInstructor.profileImage ? (
                  <img 
                    src={viewInstructor.profileImage} 
                    alt={viewInstructor.fullName} 
                    className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-teal-600"
                  />
                ) : (
                  <div className="w-20 h-20 mx-auto rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-2xl font-bold">
                    {viewInstructor.fullName?.charAt(0)}
                  </div>
                )}
                <h3 className="font-bold text-gray-900 text-lg mt-3">{viewInstructor.fullName}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{viewInstructor.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Instructor Code</p>
                  <p className="font-semibold font-mono">{viewInstructor.instructorCode}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Username</p>
                  <p className="font-semibold">{viewInstructor.username}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Mobile Number</p>
                  <p className="font-semibold">{viewInstructor.mobileNumber || "—"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Active Status</p>
                  <p className="font-semibold capitalize">{viewInstructor.isActive ? "Active" : "Inactive"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Email Verified</p>
                  <p className="font-semibold">{viewInstructor.emailVerified ? "Verified" : "Unverified"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Auth Type</p>
                  <p className="font-semibold uppercase">{viewInstructor.authType}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorsManagement;
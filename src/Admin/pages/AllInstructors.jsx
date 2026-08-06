import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserPlus,
  Edit,
  X,
  ChevronDown,
  ChevronUp,
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

const initials = (name) => (name ? name.trim().charAt(0).toUpperCase() : "I");

const Avatar = ({ name, size = "w-9 h-9", textSize = "text-xs" }) => (
  <div
    className={`${size} rounded-full bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center ${textSize} font-bold text-white flex-shrink-0`}
  >
    {initials(name)}
  </div>
);

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
    <div className="min-h-screen bg-navy-50/40 p-5">
      {/* Breadcrumbs */}
      <p className="text-sm text-gray-400 mb-4 flex items-center">
        <Link to="/admin/dashboard" className="hover:text-brand-orange-dark transition">
          Dashboard
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-gray-600">All Instructors</span>
      </p>

      {/* Header banner */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 px-6 py-6 shadow-lg relative overflow-hidden mb-6">
        <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-brand-orange/10 blur-2xl" />
        <div className="absolute right-16 bottom-0 w-24 h-24 rounded-full bg-brand-orange/20 blur-xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Instructors Management</h1>
            <div className="h-1 w-12 bg-brand-orange rounded-full mt-2 mb-2" />
            <p className="text-sm text-navy-100/70">Manage your teaching staff, track status, and register instructors</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { fetchInstructors(); fetchStats(); }}
              className="p-2.5 text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-brand-orange-dark transition shadow-sm font-semibold text-sm cursor-pointer"
            >
              <UserPlus size={18} />
              Add Instructor
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-xs">Total Instructors</p>
            <h3 className="text-xl font-bold text-navy-900">{totalCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-xs">Active Instructors</p>
            <h3 className="text-xl font-bold text-navy-900">{activeCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
              <X size={18} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-xs">Inactive Instructors</p>
            <h3 className="text-xl font-bold text-navy-900">{totalCount - activeCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-brand-orange-50 text-brand-orange-dark flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-gray-500 text-xs">Verified (Page)</p>
            <h3 className="text-xl font-bold text-navy-900">
              {instructors.filter(i => i.emailVerified).length}
            </h3>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Filter Bar & Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
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
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:ring-1 focus:ring-navy-600 focus:border-navy-600 outline-none"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none border border-gray-200 rounded-lg px-3 py-1.5 pr-7 bg-white focus:ring-1 focus:ring-navy-600 outline-none text-sm cursor-pointer"
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
          <div className="bg-navy-50 px-4 py-2 flex items-center justify-between border-b border-navy-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-navy-800">{selectedInstructors.length} instructor(s) selected</span>
            </div>
            <button className="text-xs text-navy-800 bg-white border border-navy-200 px-3 py-1 rounded hover:bg-navy-50 transition">
              Group Message
            </button>
          </div>
        )}

        {/* Instructors Table */}
        <div className="overflow-x-auto scrollbar-hide">
          {loading ? (
            <div className="p-20 text-center text-gray-500">
              <div className="w-10 h-10 border-4 border-t-navy-700 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
              <span>Fetching instructors...</span>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <button
                      onClick={toggleSelectAll}
                      className="text-gray-400 hover:text-navy-700 transition"
                      disabled={instructors.length === 0}
                    >
                      {selectedInstructors.length === instructors.length && instructors.length > 0 ?
                        <CheckSquare size={14} className="text-navy-700" /> : <Square size={14} />
                      }
                    </button>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy-800 uppercase tracking-wider w-[15%]">Instructor Code</th>
                  <th
                    className="px-4 py-3 text-xs font-semibold text-navy-800 uppercase tracking-wider cursor-pointer hover:text-brand-orange-dark w-[25%]"
                    onClick={() => handleSort('fullName')}
                  >
                    <div className="flex items-center gap-1">
                      Instructor Name
                      {sortField === 'fullName' && (
                        sortDirection === 'asc' ? <ChevronUp size={12} className="text-brand-orange" /> : <ChevronDown size={12} className="text-brand-orange" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy-800 uppercase tracking-wider w-[25%]">Email</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy-800 uppercase tracking-wider w-[15%]">Mobile</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy-800 uppercase tracking-wider w-[10%]">Email Verified</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy-800 uppercase tracking-wider w-[10%]">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy-800 uppercase tracking-wider w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedInstructors.map((instructor) => (
                  <tr key={instructor.instructorCode} className="hover:bg-navy-50/50 transition group">
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelectInstructor(instructor.instructorCode)} className="text-gray-400 hover:text-navy-700 transition">
                        {selectedInstructors.includes(instructor.instructorCode) ? (
                          <CheckSquare size={14} className="text-navy-700" />
                        ) : (
                          <Square size={14} />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500 text-xs">
                      {instructor.instructorCode}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={instructor.fullName} />
                        <div className="font-medium text-gray-900 text-sm group-hover:text-navy-800 transition-colors">
                          {instructor.fullName}
                        </div>
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
                        <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                          <ShieldCheck size={14} /> Yes
                        </span>
                      ) : (
                        <span className="text-rose-500 text-xs font-semibold">
                          ✕ No
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(instructor.instructorCode)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center cursor-pointer transition ${
                          instructor.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                          instructor.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}></span>
                        <span>{instructor.isActive ? "Active" : "Inactive"}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleViewInstructor(instructor.instructorCode)}
                          className="p-1 rounded border border-gray-200 text-gray-500 hover:bg-navy-50 hover:text-navy-700 hover:border-navy-300 transition"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(instructor)}
                          className="p-1 rounded border border-gray-200 text-gray-500 hover:bg-brand-orange-50 hover:text-brand-orange-dark hover:border-brand-orange/40 transition"
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
                      <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
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
          <div className="px-4 py-3 border-t border-navy-100 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalElements)} of {totalElements} instructors
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 border border-gray-200 rounded disabled:opacity-50 hover:bg-navy-50 hover:border-navy-300 transition"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-brand-orange text-white font-semibold rounded text-xs">{currentPage}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 border border-gray-200 rounded disabled:opacity-50 hover:bg-navy-50 hover:border-navy-300 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-navy-100">
              <h2 className="text-lg font-bold text-navy-900">Add New Instructor</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-rose-500 transition"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-navy-600 outline-none"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-navy-600 outline-none"
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
                    className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-navy-600 outline-none"
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
                    className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-navy-600 outline-none"
                    disabled={formSubmitting}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-brand-orange text-white py-2 rounded-lg text-sm font-semibold hover:bg-brand-orange-dark hover:shadow-md transition"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-navy-100">
              <h2 className="text-lg font-bold text-navy-900">Edit Instructor Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-rose-500 transition"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-navy-600 outline-none"
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
                    className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-navy-600 outline-none"
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
                    className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-navy-600 outline-none"
                    disabled={formSubmitting}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-brand-orange text-white py-2 rounded-lg text-sm font-semibold hover:bg-brand-orange-dark hover:shadow-md transition"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden relative">
            <button
              onClick={() => setViewInstructor(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-rose-500 text-lg transition"
            >
              ✕
            </button>
            <div className="p-6">
              <div className="text-center mb-6">
                {viewInstructor.profileImage ? (
                  <img
                    src={viewInstructor.profileImage}
                    alt={viewInstructor.fullName}
                    className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-brand-orange"
                  />
                ) : (
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-brand-orange/20">
                    {viewInstructor.fullName?.charAt(0)}
                  </div>
                )}
                <h3 className="font-bold text-navy-900 text-lg mt-3">{viewInstructor.fullName}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{viewInstructor.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-navy-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Instructor Code</p>
                  <p className="font-semibold font-mono text-navy-900">{viewInstructor.instructorCode}</p>
                </div>
                <div className="bg-navy-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Username</p>
                  <p className="font-semibold text-navy-900">{viewInstructor.username}</p>
                </div>
                <div className="bg-navy-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Mobile Number</p>
                  <p className="font-semibold text-navy-900">{viewInstructor.mobileNumber || "—"}</p>
                </div>
                <div className="bg-navy-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Active Status</p>
                  <p className="font-semibold capitalize text-navy-900">{viewInstructor.isActive ? "Active" : "Inactive"}</p>
                </div>
                <div className="bg-navy-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Email Verified</p>
                  <p className="font-semibold text-navy-900">{viewInstructor.emailVerified ? "Verified" : "Unverified"}</p>
                </div>
                <div className="bg-navy-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Auth Type</p>
                  <p className="font-semibold uppercase text-navy-900">{viewInstructor.authType}</p>
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

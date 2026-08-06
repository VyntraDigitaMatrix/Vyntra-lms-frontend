import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminCourseApi } from "../auth/api";
import {
  BookOpen,
  PlayCircle,
  Clock,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  CheckSquare,
  Square,
  Download,
  Eye,
  MoreVertical,
  Archive,
} from "lucide-react";

// StatCard Component
const StatCard = ({ icon, title, value, color }) => {
  const colorMap = {
    navy: "bg-navy-50 text-navy-700",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    orange: "bg-brand-orange-50 text-brand-orange-dark",
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className={`w-8 h-8 rounded-lg ${colorMap[color]} flex items-center justify-center`}>
        {icon}
      </div>
      <div className="mt-2">
        <p className="text-gray-500 text-xs">{title}</p>
        <h3 className="text-xl font-bold text-navy-900">{value.toLocaleString()}</h3>
      </div>
    </div>
  );
};

// SelectBox Component
const SelectBox = ({ value, onChange, children }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none border border-gray-200 rounded-lg px-3 py-1.5 pr-7 bg-white focus:ring-1 focus:ring-navy-600 focus:border-navy-600 outline-none text-sm cursor-pointer"
    >
      {children}
    </select>
    <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
  </div>
);

// Main AdminCourses Component
const AdminCourses = () => {
  const navigate = useNavigate();

  // ---------- API State ----------
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------- UI State ----------
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [actionMenu, setActionMenu] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ---------- Data Lists ----------
  const categories = ["Development", "Data Science", "Design", "Programming", "Marketing"];

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminCourseApi.getAllCourses(0, 500);
      if (res.data && res.data.data) {
        setCourses(res.data.data.content || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses catalog from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
    setCurrentPage(1);
  };

  const openAddModal = () => {
    navigate("/admin/create-course");
  };

  const openEditModal = (course) => {
    // Full course editing (basic info, pricing, features, FAQs, tags) is handled
    // on the dedicated Course Settings page, which maps directly to the real
    // backend endpoints (PUT .../basic-info, .../pricing, .../features, etc.)
    navigate(`/admin/course-settings/${course.slug}`);
  };

  const handlePublishCourse = async (courseSlug) => {
    if (window.confirm("Are you sure you want to PUBLISH this course? Students will be able to enroll immediately.")) {
      setActionLoading(true);
      try {
        await adminCourseApi.publishCourse(courseSlug);
        alert("Course published successfully!");
        fetchCourses();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to publish course. Make sure the course contains modules & lessons.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleArchiveCourse = async (courseSlug) => {
    if (window.confirm("Are you sure you want to ARCHIVE this course?")) {
      setActionLoading(true);
      try {
        await adminCourseApi.archiveCourse(courseSlug);
        alert("Course archived successfully!");
        fetchCourses();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to archive course.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const toggleSelectCourse = (slug) => {
    setSelectedCourses((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCourses.length === paginatedCourses.length && paginatedCourses.length > 0) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(paginatedCourses.map((c) => c.slug));
    }
  };

  const handleBulkArchive = async () => {
    if (selectedCourses.length === 0) return;
    if (window.confirm(`Are you sure you want to archive ${selectedCourses.length} course(s)?`)) {
      setActionLoading(true);
      try {
        await Promise.all(selectedCourses.map(slug => adminCourseApi.archiveCourse(slug)));
        alert("Selected courses archived successfully!");
        fetchCourses();
        setSelectedCourses([]);
      } catch (err) {
        console.error(err);
        alert("An error occurred during bulk archiving.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Title", "Instructor", "Category", "Status"];
    const rows = filteredCourses.map((c) => [
      c.id,
      c.title,
      c.instructors?.[0]?.fullName || "Unassigned",
      c.category || "Development",
      c.status,
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "courses_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtering & Sorting
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    result = result.filter((course) => {
      const instructorName = course.instructors?.[0]?.fullName || "";
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.category || "Development").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All Categories" || (course.category || "Development") === categoryFilter;

      const matchesStatus = statusFilter === "All Status" || course.status === statusFilter.toUpperCase();
      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sortBy === "Students") {
      result.sort((a, b) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0));
    } else if (sortBy === "Course Name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "Newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return result;
  }, [courses, searchTerm, categoryFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => setCurrentPage(1), [searchTerm, categoryFilter, statusFilter, sortBy, itemsPerPage]);

  // Stats calculation
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(c => c.status === "PUBLISHED").length;
  const draftCourses = courses.filter(c => c.status === "DRAFT").length;
  const archivedCourses = courses.filter(c => c.status === "ARCHIVED").length;

  const getIcon = () => (
    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-navy-700 to-navy-900 flex-shrink-0">
      <BookOpen size={18} />
    </div>
  );

  const getCategoryColor = (category) => {
    const map = {
      Development: "bg-navy-50 text-navy-700",
      "Data Science": "bg-purple-50 text-purple-700",
      Design: "bg-amber-50 text-amber-700",
      Programming: "bg-blue-50 text-blue-700",
      Marketing: "bg-pink-50 text-pink-700",
    };
    return map[category || "Development"] || "bg-gray-50 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-navy-50/40 font-sans">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-5 py-5">
        {/* Breadcrumb */}
        <p className="text-sm text-gray-400 mb-4 flex items-center">
          <Link to="/admin/dashboard" className="hover:text-brand-orange-dark transition no-underline">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600 font-medium">All Courses</span>
        </p>

        {/* Header banner */}
        <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 px-6 py-6 shadow-lg relative overflow-hidden mb-6">
          <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-brand-orange/10 blur-2xl" />
          <div className="absolute right-16 bottom-0 w-24 h-24 rounded-full bg-brand-orange/20 blur-xl" />
          <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Course Management</h1>
              <div className="h-1 w-12 bg-brand-orange rounded-full mt-2 mb-2" />
              <p className="text-sm text-navy-100/70">Manage your course catalog, track performance, and organize content</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportToCSV} className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white text-sm transition font-semibold cursor-pointer">
                <Download size={16} />
                Export CSV
              </button>
              <button onClick={openAddModal} className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-4 py-2 rounded-lg text-sm transition shadow-sm font-semibold border-none cursor-pointer">
                <Plus size={16} />
                New Course
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<BookOpen size={18} />} title="Total Courses" value={totalCourses} color="navy" />
          <StatCard icon={<PlayCircle size={18} />} title="Published" value={publishedCourses} color="green" />
          <StatCard icon={<Clock size={18} />} title="Drafts" value={draftCourses} color="amber" />
          <StatCard icon={<Archive size={18} />} title="Archived" value={archivedCourses} color="orange" />
        </div>

        {/* Filter Bar & Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Filters */}
          <div className="p-4 flex flex-wrap items-center gap-3 border-b border-gray-100">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search courses by title, instructor or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:ring-1 focus:ring-navy-600 focus:border-navy-600 outline-none"
              />
            </div>
            <SelectBox value={categoryFilter} onChange={setCategoryFilter}>
              <option>All Categories</option>
              {categories.map(cat => <option key={cat}>{cat}</option>)}
            </SelectBox>
            <SelectBox value={statusFilter} onChange={setStatusFilter}>
              <option>All Status</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </SelectBox>
            <SelectBox value={sortBy} onChange={setSortBy}>
              <option>Newest</option>
              <option>Students</option>
              <option>Course Name</option>
            </SelectBox>
            <button onClick={resetFilters} className="flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-navy-50 text-sm text-gray-600 transition cursor-pointer">
              <X size={14} />
              Clear
            </button>
          </div>

          {/* Bulk Actions Bar */}
          {selectedCourses.length > 0 && (
            <div className="bg-navy-50 px-4 py-2 flex items-center justify-between border-b border-navy-100">
              <div className="flex items-center gap-2">
                <CheckSquare size={14} className="text-navy-700" />
                <span className="text-xs font-medium text-navy-800">{selectedCourses.length} course(s) selected</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleBulkArchive} disabled={actionLoading} className="flex items-center gap-1 text-xs bg-white border border-amber-200 text-amber-600 px-2 py-1 rounded hover:bg-amber-50 transition cursor-pointer disabled:opacity-50">
                  <Archive size={12} />
                  Archive
                </button>
              </div>
            </div>
          )}

          {/* Courses Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <button
                      onClick={toggleSelectAll}
                      className="text-gray-400 hover:text-navy-700 transition border-none bg-transparent cursor-pointer"
                      disabled={paginatedCourses.length === 0}
                    >
                      {selectedCourses.length === paginatedCourses.length && paginatedCourses.length > 0 ?
                        <CheckSquare size={14} className="text-navy-700" /> : <Square size={14} />}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy-800 uppercase tracking-wider">Course</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy-800 uppercase tracking-wider">Instructor</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy-800 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy-800 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy-800 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-navy-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-gray-500">
                      <div className="w-8 h-8 border-4 border-t-navy-700 border-gray-200 rounded-full animate-spin mx-auto mb-2"></div>
                      <span>Loading courses catalog...</span>
                    </td>
                  </tr>
                ) : paginatedCourses.map((course) => {
                  const instructorName = course.instructors?.[0]?.fullName || "Unassigned";
                  const displayPrice = course.discountPrice ?? course.actualPrice ?? course.displayPrice;
                  return (
                  <tr key={course.id} className="hover:bg-navy-50/50 transition group">
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelectCourse(course.slug)} className="text-gray-400 hover:text-navy-700 transition border-none bg-transparent cursor-pointer">
                        {selectedCourses.includes(course.slug) ? <CheckSquare size={14} className="text-navy-700" /> : <Square size={14} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {course.thumbnailUrl ? (
                          <img src={course.thumbnailUrl} alt="Thumbnail" className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                        ) : getIcon()}
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{course.title}</h3>
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{course.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm font-medium">{instructorName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${getCategoryColor(course.category)}`}>
                        {course.category || "Development"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm font-semibold">
                      {course.free ? "Free" : displayPrice != null ? `₹${displayPrice}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        course.status === "PUBLISHED"
                          ? "bg-emerald-100 text-emerald-700"
                          : course.status === "ARCHIVED"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-amber-100 text-amber-700"
                      }`}>
                        {course.status || "DRAFT"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/admin/course-preview/${course.slug}`}
                          className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-navy-50 hover:text-navy-700 transition flex items-center justify-center"
                          title="View course details"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={() => openEditModal(course)}
                          className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-brand-orange-50 hover:text-brand-orange-dark transition cursor-pointer bg-transparent"
                          title="Edit course"
                        >
                          <Edit size={14} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setActionMenu(actionMenu === course.id ? null : course.id)}
                            className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 transition cursor-pointer bg-transparent"
                          >
                            <MoreVertical size={14} />
                          </button>
                          {actionMenu === course.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1 font-semibold text-xs">
                              {course.status !== "PUBLISHED" && (
                                <button onClick={() => { handlePublishCourse(course.slug); setActionMenu(null); }} className="w-full text-left px-3 py-1.5 text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 border-none bg-transparent cursor-pointer">
                                  <CheckSquare size={12} /> Publish
                                </button>
                              )}
                              {course.status === "PUBLISHED" && (
                                <button onClick={() => { handleArchiveCourse(course.slug); setActionMenu(null); }} className="w-full text-left px-3 py-1.5 text-amber-600 hover:bg-amber-50 flex items-center gap-2 border-none bg-transparent cursor-pointer">
                                  <Archive size={12} /> Archive
                                </button>
                              )}
                              <button onClick={() => { alert("Deletion is disabled on the frontend. Re-assign or archive the course instead."); setActionMenu(null); }} className="w-full text-left px-3 py-1.5 text-gray-400 hover:bg-gray-50 flex items-center gap-2 border-none bg-transparent cursor-pointer">
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  );
                })}
                {!loading && paginatedCourses.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <BookOpen size={48} strokeWidth={1} />
                        <p className="text-sm font-medium">No courses found matching this catalog filter.</p>
                        <button onClick={resetFilters} className="text-navy-700 text-sm hover:text-brand-orange-dark font-semibold border-none bg-transparent cursor-pointer">Clear all filters</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-navy-100 flex flex-wrap justify-between items-center gap-3">
            <div className="text-xs text-gray-500">
              Showing {paginatedCourses.length} of {filteredCourses.length} courses
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 font-medium">Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-200 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-navy-600"
                >
                  {[8, 16, 24, 32].map(num => <option key={num}>{num}</option>)}
                </select>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p-1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded border border-gray-200 disabled:opacity-50 hover:bg-navy-50 transition cursor-pointer bg-white"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-3 py-1 bg-brand-orange text-white rounded text-xs font-semibold">{currentPage}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 rounded border border-gray-200 disabled:opacity-50 hover:bg-navy-50 transition cursor-pointer bg-white"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCourses;

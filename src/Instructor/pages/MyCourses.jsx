import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import S1 from "../../assets/S1.jpg";
import {
  FaChevronLeft, FaChevronRight, FaEdit, FaTrash,
  FaEye, FaPlus, FaArchive, FaTimes, FaExclamationTriangle,
} from "react-icons/fa";
import {
  MdCheckCircle, MdWarning, MdArchive,
} from "react-icons/md";
import { instructorCourseApi } from "../auth/api";
import ArchiveCourseModal from "../components/ArchiveCourseModal";
import DeleteCourseModal from "../components/DeleteCourseModal";

const defaultImage = S1;

function Toast({ msg, type = "success", onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed top-5 right-5 z-[9999] bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl min-w-[280px] animate-fade-in">
      {type === "success"
        ? <MdCheckCircle className="text-emerald-500 text-xl flex-shrink-0" />
        : <MdWarning className="text-amber-500 text-xl flex-shrink-0" />}
      <span className="text-sm font-medium text-gray-800 flex-1">{msg}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
    </div>
  );
}

/* STATUS BADGE */
const StatusBadge = ({ course }) => {
  if (course.status === "PUBLISHED")
    return <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full">● PUBLISHED</span>;
  if (course.status === "ARCHIVED")
    return <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-full">🗄 ARCHIVED</span>;
  if (course.publishRequested)
    return <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full">⏳ PENDING</span>;
  return <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2.5 py-1 rounded-full">✎ {course.status || "DRAFT"}</span>;
}

/* STAT CARDS */
const StatCards = ({ courses }) => {
  const total = courses.length;
  const published = courses.filter(c => c.status === "PUBLISHED").length;
  const draft = courses.filter(c => c.status === "DRAFT" || (!c.status)).length;
  const archived = courses.filter(c => c.status === "ARCHIVED").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {[
        { label: "Total Courses", value: total, color: "text-violet-600", border: "border-t-violet-500", bg: "bg-violet-50", icon: "📚" },
        { label: "Published", value: published, color: "text-emerald-600", border: "border-t-emerald-500", bg: "bg-emerald-50", icon: "✅" },
        { label: "Draft", value: draft, color: "text-amber-600", border: "border-t-amber-500", bg: "bg-amber-50", icon: "✎" },
        { label: "Archived", value: archived, color: "text-orange-600", border: "border-t-orange-500", bg: "bg-orange-50", icon: "🗄" },
      ].map(({ label, value, color, border, bg, icon }) => (
        <div key={label} className={`bg-white rounded-xl border border-gray-200 ${border} border-t-2 p-4 shadow-sm flex items-center gap-3`}>
          <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>{icon}</div>
          <div>
            <div className={`text-2xl font-black ${color} leading-none`}>{value}</div>
            <div className="text-xs text-gray-500 mt-0.5 font-medium">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* MAIN COMPONENT */
const InstructorCourses = () => {
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("Popular");
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [coursesPerPage] = useState(6);

  // Archive state
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [archiving, setArchiving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch ── */
  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await instructorCourseApi.getInstructorCourses(0, 100);
      if (res.data?.data) {
        const fetchedCourses = res.data.data.content || [];
        setAllCourses(fetchedCourses);
        setTotalElements(fetchedCourses.length);
        setTotalPages(Math.ceil(fetchedCourses.length / coursesPerPage));
        applyFiltersAndSort(fetchedCourses, statusFilter, sortBy, currentPage);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    applyFiltersAndSort(allCourses, statusFilter, sortBy, currentPage);
  }, [statusFilter, sortBy, currentPage, allCourses]);

  const applyFiltersAndSort = (coursesData, filter, sort, page) => {
    // Filter
    let filtered = coursesData.filter(c => {
      if (filter === "ALL") return true;
      if (filter === "ARCHIVED") return c.status === "ARCHIVED";
      if (filter === "PUBLISHED") return c.status === "PUBLISHED";
      if (filter === "DRAFT") return c.status === "DRAFT" || !c.status;
      return true;
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sort === "Popular") return (b.averageRating || 0) - (a.averageRating || 0);
      if (sort === "Latest") return b.id - a.id;
      if (sort === "Price Low") return (a.price || 0) - (b.price || 0);
      if (sort === "Price High") return (b.price || 0) - (a.price || 0);
      return 0;
    });

    // Paginate
    const start = page * coursesPerPage;
    const end = start + coursesPerPage;
    const paginated = sorted.slice(start, end);

    setCourses(paginated);
    setTotalPages(Math.ceil(sorted.length / coursesPerPage));
    setTotalElements(sorted.length);
  };

  const changePage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  /* ── Archive handler ── */
  const handleArchiveConfirm = async () => {
    if (!archiveTarget) return;
    setArchiving(true);
    try {
      await instructorCourseApi.archiveCourse(archiveTarget.slug);
      showToast(`"${archiveTarget.title}" has been archived successfully.`);
      setArchiveTarget(null);
      await fetchCourses();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to archive course.", "error");
    } finally {
      setArchiving(false);
    }
  };

  // No delete action available for instructor


  /* ── Status filter tabs ── */
  const STATUS_TABS = [
    { key: "ALL", label: "All", count: allCourses.length },
    { key: "PUBLISHED", label: "Published", count: allCourses.filter(c => c.status === "PUBLISHED").length },
    { key: "DRAFT", label: "Draft", count: allCourses.filter(c => c.status === "DRAFT" || !c.status).length },
    { key: "ARCHIVED", label: "Archived", count: allCourses.filter(c => c.status === "ARCHIVED").length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-5 font-sans">
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
        .animate-fade-in { animation: fadeIn 0.18s ease; }
      `}</style>

      <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

      {/* Archive modal */}
      {archiveTarget && (
        <ArchiveCourseModal
          course={archiveTarget}
          onClose={() => setArchiveTarget(null)}
          onConfirm={handleArchiveConfirm}
          loading={archiving}
        />
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteCourseModal
          course={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">
              <Link to="/instructor/dashboard" className="hover:text-violet-600 transition">Dashboard</Link>
              <span className="mx-1.5">&gt;</span>
              <span className="text-gray-600 font-medium">My Courses</span>
            </p>
            <h1 className="text-xl font-bold text-gray-900 mt-2">My Courses</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track all your created courses.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/instructor/create-course")}
            className="flex items-center gap-2 h-10 px-5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition shadow-sm"
          >
            <FaPlus className="text-xs" /> Create New Course
          </button>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 mb-5 text-sm flex items-center gap-2">
            <FaExclamationTriangle className="text-red-400 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── Stat cards ── */}
        <StatCards courses={allCourses} />

        {/* ── Filter tabs + Sort ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          {/* Status tabs */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1 overflow-x-auto w-full sm:w-auto">
            {STATUS_TABS.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => {
                  setStatusFilter(key);
                  setCurrentPage(0);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap
                  ${statusFilter === key
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-violet-600 hover:bg-violet-50"}`}
              >
                {label}
                <span className={`text-[10px] font-bold ${statusFilter === key ? "text-violet-200" : "text-gray-400"}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <p className="text-xs text-gray-500 whitespace-nowrap">
              {loading ? "Loading..." : `${totalElements} courses`}
            </p>
            <select
              value={sortBy}
              onChange={e => {
                setSortBy(e.target.value);
                setCurrentPage(0);
              }}
              className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-xs font-medium outline-none focus:border-violet-400 transition"
            >
              <option value="Popular">Sort: Popular</option>
              <option value="Latest">Sort: Latest</option>
              <option value="Price Low">Sort: Price Low</option>
              <option value="Price High">Sort: Price High</option>
            </select>
          </div>
        </div>

        {/* ── Course Grid ── */}
        {loading ? (
          <div className="py-20 text-center text-gray-500">
            <div className="w-10 h-10 border-4 border-t-violet-600 border-gray-200 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm">Fetching courses…</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-gray-200">
            <div className="text-5xl mb-3">📚</div>
            <p className="text-sm font-semibold text-gray-500">
              {statusFilter !== "ALL"
                ? `No ${statusFilter.toLowerCase()} courses found`
                : "No courses found"}
            </p>
            {statusFilter === "ALL" && (
              <button onClick={() => navigate("/instructor/create-course")}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition">
                <FaPlus className="text-xs" /> Create your first course
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {courses.map((course, idx) => {
              const fallback = defaultImage;
              const isArchived = course.status === "ARCHIVED";

              return (
                <div
                  key={course.id}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition duration-200
                    ${isArchived ? "border-orange-200 opacity-80" : "border-gray-200"}`}
                >
                  {/* Thumbnail */}
                  <div className="relative">
                    <img
                      src={course.thumbnailUrl || fallback}
                      alt={course.title}
                      className={`w-full h-[160px] object-cover ${isArchived ? "grayscale-[30%]" : ""}`}
                    />
                    <div className="absolute top-3 right-3">
                      <StatusBadge course={course} />
                    </div>
                    {isArchived && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <FaArchive className="text-[9px]" /> Archived
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <h2 className="font-bold text-gray-900 text-sm leading-5 min-h-[38px] line-clamp-2 mb-2">
                      {course.title}
                    </h2>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
                      <span className="text-yellow-400">★</span>
                      <span>{course.averageRating || "0.0"} ({course.totalRatings || 0})</span>
                      {course.level && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] uppercase font-semibold">
                          {course.level}
                        </span>
                      )}
                      {course.language && (
                        <span className="px-2 py-0.5 bg-violet-50 text-violet-600 rounded text-[10px] font-semibold">
                          {course.language.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 leading-5 min-h-[36px] line-clamp-2 mb-3">
                      {course.shortDescription || "No description provided."}
                    </p>

                    {/* Price row */}
                    <div className="flex items-center justify-between py-2.5 border-t border-b border-gray-100 mb-3">
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400 mb-0.5">Price</p>
                        {course.free ? (
                          <p className="text-sm font-bold text-emerald-600">Free</p>
                        ) : course.actualPrice && course.discountPrice ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm font-bold text-gray-900">
                                ₹{(Number(course.actualPrice) - Number(course.discountPrice)).toLocaleString()}
                              </span>
                              <span className="text-[10px] text-gray-400 line-through">
                                ₹{Number(course.actualPrice).toLocaleString()}
                              </span>
                            </div>
                            <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 rounded px-1 py-0.5">
                              Save ₹{Number(course.discountPrice).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm font-bold text-gray-800">
                            {course.actualPrice ? `₹${Number(course.actualPrice).toLocaleString()}` : "—"}
                          </p>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400">Students</p>
                        <p className="text-xs font-bold text-gray-800">{course.totalEnrollments || 0}</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mb-2">
                      <Link
                        to={`/instructor/course-builder/${course.slug}`}
                        className="flex-1 h-8 rounded-lg border border-violet-300 text-violet-600 text-xs font-semibold hover:bg-violet-600 hover:text-white transition flex items-center justify-center gap-1"
                      >
                        <FaEye className="text-[10px]" /> View
                      </Link>
                      <Link
                        to={`/instructor/section-settings/${course.slug}`}
                        className="flex-1 h-8 rounded-lg border border-violet-300 text-violet-600 text-xs font-semibold hover:bg-violet-600 hover:text-white transition flex items-center justify-center gap-1"
                      >
                        <FaEdit className="text-[10px]" /> Edit
                      </Link>

                      {!isArchived && (
                        <button
                          type="button"
                          onClick={() => setArchiveTarget(course)}
                          title="Archive Course"
                          className="h-8 w-8 rounded-lg border border-orange-200 text-orange-400 text-xs hover:bg-orange-50 hover:text-orange-600 transition flex items-center justify-center"
                        >
                          <FaArchive className="text-[10px]" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(course)}
                        title="Delete Course"
                        className="h-8 w-8 rounded-lg border border-red-200 text-red-400 text-xs hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center"
                      >
                        <FaTrash className="text-[10px]" />
                      </button>
                    </div>

                    {/* Publish request / archived notice */}
                    {isArchived && (
                      <div className="w-full h-8 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold flex items-center justify-center gap-1.5">
                        <FaArchive className="text-[10px]" /> Course is Archived
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-7 flex-wrap">
            <button
              type="button"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 0}
              className="w-9 h-9 rounded-lg bg-white border border-gray-200 disabled:opacity-40 flex items-center justify-center hover:bg-violet-50 hover:border-violet-300 transition"
            >
              <FaChevronLeft className="text-xs text-gray-600" />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 2) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 1 + i;
              }
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => changePage(pageNum - 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition
                    ${currentPage === pageNum - 1
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-violet-50 hover:border-violet-300"}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="w-9 h-9 rounded-lg bg-white border border-gray-200 disabled:opacity-40 flex items-center justify-center hover:bg-violet-50 hover:border-violet-300 transition"
            >
              <FaChevronRight className="text-xs text-gray-600" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default InstructorCourses;
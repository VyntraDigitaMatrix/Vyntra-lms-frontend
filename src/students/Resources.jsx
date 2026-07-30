import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { studentResourceApi, studentLearningApi } from "./auth/api";
import {
  FaSearch,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
  FaVideo,
  FaFile,
  FaDownload,
  FaEye,
  FaTimes,
  FaGraduationCap,
  FaFilter,
  FaUserGraduate,
  FaCalendarAlt,
  FaChevronDown,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import { MdFolder } from "react-icons/md";

const TYPE_ICON = {
  PDF: { icon: FaFilePdf, color: "text-red-500", bg: "bg-red-50" },
  PPT: { icon: FaFilePowerpoint, color: "text-orange-500", bg: "bg-orange-50" },
  DOC: { icon: FaFileWord, color: "text-blue-500", bg: "bg-blue-50" },
  DOCX: { icon: FaFileWord, color: "text-blue-500", bg: "bg-blue-50" },
  VIDEO: { icon: FaVideo, color: "text-purple-500", bg: "bg-purple-50" },
};
const iconFor = (type) => TYPE_ICON[type?.toUpperCase()] || { icon: FaFile, color: "text-gray-500", bg: "bg-gray-50" };

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0, val = bytes;
  while (val >= 1024 && i < units.length - 1) { val /= 1024; i++; }
  return `${val.toFixed(val >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Resources() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [previewResource, setPreviewResource] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const coursesRes = await studentLearningApi.getMyEnrolledCourses(0, 100);
      const courseBody = coursesRes.data?.data ?? coursesRes.data;
      const courses = courseBody?.content ?? [];

      const perCourse = await Promise.all(
        courses.map(async (course) => {
          const slug = course.courseSlug || course.slug;
          if (!slug) return [];
          try {
            const res = await studentResourceApi.getCourseResources(slug, 0, 100);
            const body = res.data?.data ?? res.data;
            const list = body?.content ?? [];
            return list.map((r) => ({
              ...r,
              courseTitle: course.title || course.courseTitle || "Untitled Course",
              courseSlug: slug,
            }));
          } catch (err) {
            console.error(`Failed to load resources for ${slug}:`, err?.response?.data || err);
            return [];
          }
        })
      );

      setResources(perCourse.flat());
    } catch (err) {
      console.error("Failed to load resources:", err?.response?.data || err);
      setFetchError("Couldn't load your resources. Please try again.");
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const filterOptions = useMemo(() => {
    const types = new Set(resources.map((r) => (r.resourceType || "").toUpperCase()).filter(Boolean));
    return ["All", ...Array.from(types)];
  }, [resources]);

  const stats = useMemo(() => ({
    totalResources: resources.length,
    courses: new Set(resources.map((r) => r.courseSlug)).size,
  }), [resources]);

  const typeCounts = useMemo(() => {
    const counts = {};
    resources.forEach((r) => {
      const t = (r.resourceType || "OTHER").toUpperCase();
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [resources]);

  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      (item.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.courseTitle || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || (item.resourceType || "").toUpperCase() === filterType;
    return matchesSearch && matchesType;
  });

  // Fetch full resource (with fileUrl) on demand, since list items don't include it
  const loadFullResource = async (resourceId) => {
    const res = await studentResourceApi.getResource(resourceId);
    return res.data?.data ?? res.data;
  };

  const handlePreview = async (item) => {
    setPreviewLoading(true);
    setPreviewResource(null);
    try {
      const full = await loadFullResource(item.resourceId);
      setPreviewResource(full);
    } catch (err) {
      console.error("Failed to load resource details:", err?.response?.data || err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownload = async (item) => {
    setActioningId(item.resourceId);
    try {
      const full = await loadFullResource(item.resourceId);
      if (full?.fileUrl) {
        const a = document.createElement("a");
        a.href = full.fileUrl;
        a.download = full.fileName || full.title || "resource";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      console.error("Failed to download resource:", err?.response?.data || err);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Breadcrumb */}
      <div className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-6">
        <p className="text-xs sm:text-sm text-gray-400">
          <Link to="/student/dashboard" className="hover:text-[#043573] transition">Dashboard</Link>
          <span className="mx-1 sm:mx-2">&gt;</span>
          <span className="text-gray-600 font-medium">Resources</span>
        </p>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 py-3 sm:py-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Learning Resources</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Access study materials, notes, and educational content from your courses</p>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 pb-6 sm:pb-8">

        {fetchError && (
          <div className="mb-5 flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold">
            <span className="flex items-center gap-2"><FaExclamationCircle className="flex-shrink-0" /> {fetchError}</span>
            <button onClick={fetchResources} className="px-3 py-1.5 bg-white border border-red-200 rounded-lg hover:bg-red-100 transition flex-shrink-0">Retry</button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-xl bg-[#043573]/10 flex items-center justify-center">
                <FaFile className="text-[#043573] text-lg sm:text-2xl" />
              </div>
              <div>
                <p className="text-[10px] sm:text-sm text-gray-500 font-medium">Total Resources</p>
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">{stats.totalResources}</h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-xl bg-purple-50 flex items-center justify-center">
                <FaGraduationCap className="text-purple-600 text-base sm:text-[22px]" />
              </div>
              <div>
                <p className="text-[10px] sm:text-sm text-gray-500 font-medium">Courses Covered</p>
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">{stats.courses}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-5 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#043573] focus:border-transparent outline-none transition text-xs sm:text-sm"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="w-full sm:w-auto h-9 sm:h-11 px-3 sm:px-5 border border-gray-200 rounded-lg flex items-center justify-center sm:justify-between gap-2 text-gray-700 hover:bg-gray-50 transition text-xs sm:text-sm"
              >
                <FaFilter className="text-xs sm:text-sm" />
                <span className="font-medium">Filter: {filterType}</span>
                <FaChevronDown className={`text-[10px] sm:text-xs transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showFilterDropdown && (
                <div className="absolute top-10 sm:top-12 right-0 w-40 sm:w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-2 animate-fadeIn">
                  {filterOptions.map((type) => (
                    <button
                      key={type}
                      onClick={() => { setFilterType(type); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm transition-all duration-200 ${
                        filterType === type ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-5 sm:mb-6">
          <div className="lg:col-span-4 bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <MdFolder className="text-[#043573]" />
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(typeCounts).map(([type, count]) => {
                const { icon: Icon, color } = iconFor(type);
                return (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                      filterType === type ? "bg-[#043573] border-[#043573] text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={color} />
                    <span className="text-xs sm:text-sm font-medium">{type}</span>
                    <span className="text-[10px] sm:text-xs font-bold bg-white px-1.5 py-0.5 rounded-full border border-gray-100">{count}</span>
                  </button>
                );
              })}
              {Object.keys(typeCounts).length === 0 && !loading && (
                <p className="text-xs text-gray-400 py-2">No resource types yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <FaSpinner className="animate-spin text-3xl text-[#043573]" />
            <p className="text-sm text-gray-400">Loading resources…</p>
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {filteredResources.map((item) => {
              const { icon: Icon, color, bg } = iconFor(item.resourceType);
              return (
                <div
                  key={item.resourceId}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-1 bg-gradient-to-r from-[#043573] to-[#043573]" />

                  <div className="p-3 sm:p-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`w-12 h-12 sm:w-[54px] sm:h-[54px] rounded-xl ${bg} flex items-center justify-center text-xl sm:text-2xl shrink-0`}>
                        <Icon className={color} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-sm sm:text-lg font-bold text-gray-800 truncate hover:text-[#043573] transition">
                              {item.title}
                            </h2>
                            <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5">
                              {item.courseTitle} • {(item.resourceType || "").toUpperCase()} • {formatBytes(item.fileSize)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                          <span className="flex items-center gap-0.5 sm:gap-1">
                            <FaCalendarAlt className="text-gray-400 text-[9px] sm:text-xs" />
                            {formatDate(item.createdAt)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          <button
                            onClick={() => handlePreview(item)}
                            className="h-7 sm:h-[34px] px-2 sm:px-3 bg-[#043573]/10 text-[#043573] rounded-lg text-[10px] sm:text-sm font-medium flex items-center gap-1 hover:bg-[#043573]/20 transition"
                          >
                            <FaEye size={10} className="sm:text-xs" />
                            Preview
                          </button>

                          <button
                            onClick={() => handleDownload(item)}
                            disabled={actioningId === item.resourceId}
                            className="h-7 sm:h-[34px] px-2 sm:px-3 bg-[#043573] text-white rounded-lg text-[10px] sm:text-sm font-medium flex items-center gap-1 hover:bg-[#043573]/80 transition shadow-sm disabled:opacity-60"
                          >
                            {actioningId === item.resourceId
                              ? <FaSpinner size={10} className="animate-spin sm:text-xs" />
                              : <FaDownload size={10} className="sm:text-xs" />}
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-sm border border-gray-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FaFile className="text-2xl sm:text-4xl text-gray-400" />
            </div>
            <h3 className="text-base sm:text-xl font-semibold text-gray-600 mb-1 sm:mb-2">No resources found</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              {search || filterType !== "All" ? "Try adjusting your search or filter criteria." : "Your instructors haven't uploaded any resources yet."}
            </p>
            {(search || filterType !== "All") && (
              <button
                onClick={() => { setSearch(""); setFilterType("All"); }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-[#043573] hover:bg-[#043573]/10 rounded-lg transition text-xs sm:text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {(previewLoading || previewResource) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4" onClick={() => setPreviewResource(null)}>
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-lg w-full shadow-2xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            {previewLoading ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <FaSpinner className="animate-spin text-2xl text-[#043573]" />
                <p className="text-sm text-gray-400">Loading resource…</p>
              </div>
            ) : previewResource && (
              <>
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{previewResource.title}</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{previewResource.courseTitle}</p>
                  </div>
                  <button onClick={() => setPreviewResource(null)} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0">
                    <FaTimes className="text-gray-500 text-sm sm:text-base" />
                  </button>
                </div>
                <div className="p-4 sm:p-6 space-y-3 text-sm">
                  {previewResource.description && (
                    <p className="text-gray-600 leading-relaxed">{previewResource.description}</p>
                  )}
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div><span className="text-gray-400">Type:</span> <span className="font-semibold text-gray-700">{(previewResource.resourceType || "").toUpperCase()}</span></div>
                    <div><span className="text-gray-400">Size:</span> <span className="font-semibold text-gray-700">{formatBytes(previewResource.fileSize)}</span></div>
                    <div><span className="text-gray-400">Uploaded by:</span> <span className="font-semibold text-gray-700">{previewResource.uploadedByInstructorName || "—"}</span></div>
                    <div><span className="text-gray-400">Date:</span> <span className="font-semibold text-gray-700">{formatDate(previewResource.createdAt)}</span></div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 p-4 sm:p-6 border-t border-gray-100">
                  <button onClick={() => setPreviewResource(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition text-sm">
                    Close
                  </button>
                  {previewResource.fileUrl && (
                    <a
                      href={previewResource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#043573] text-white rounded-lg font-semibold hover:bg-[#043573]/80 transition text-sm"
                    >
                      Open File
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}

export default Resources;
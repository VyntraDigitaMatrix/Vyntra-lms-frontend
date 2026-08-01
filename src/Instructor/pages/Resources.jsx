import React, { useState, useEffect, useCallback } from "react";
import { instructorCourseApi, instructorResourceApi } from "../auth/api";
import {
  FaFilePdf, FaFileWord, FaFilePowerpoint, FaFileVideo, FaFileImage,
  FaFileArchive, FaFileAlt, FaUpload, FaEdit, FaTrash, FaDownload,
  FaTimes, FaSave, FaSpinner, FaChevronLeft, FaChevronRight,
  FaExclamationCircle, FaCheckCircle, FaBookOpen, FaFolderOpen,
} from "react-icons/fa";
import { Link } from "react-router-dom";

/* Guessed resourceType enum based on the "PDF" example in the schema —
   adjust/extend to match your backend enum exactly if it differs. */
const TYPE_ICONS = {
  PDF: { Icon: FaFilePdf, color: "text-red-500", bg: "bg-red-50" },
  DOC: { Icon: FaFileWord, color: "text-blue-500", bg: "bg-blue-50" },
  DOCX: { Icon: FaFileWord, color: "text-blue-500", bg: "bg-blue-50" },
  PPT: { Icon: FaFilePowerpoint, color: "text-orange-500", bg: "bg-orange-50" },
  PPTX: { Icon: FaFilePowerpoint, color: "text-orange-500", bg: "bg-orange-50" },
  VIDEO: { Icon: FaFileVideo, color: "text-purple-500", bg: "bg-purple-50" },
  IMAGE: { Icon: FaFileImage, color: "text-emerald-500", bg: "bg-emerald-50" },
  ZIP: { Icon: FaFileArchive, color: "text-amber-600", bg: "bg-amber-50" },
};
const DEFAULT_TYPE_ICON = { Icon: FaFileAlt, color: "text-slate-500", bg: "bg-slate-100" };

const formatFileSize = (bytes) => {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(size >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
};

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";

const Resources = () => {
  // ── Course selection ──
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState("");

  // ── Resources list ──
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ── Upload / Edit form ──
  const [formMode, setFormMode] = useState(null); // null | "upload" | resourceId being edited
  const [formData, setFormData] = useState({ title: "", description: "", file: null });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // ── Row-level busy state ──
  const [busyId, setBusyId] = useState(null);

  const [toast, setToast] = useState({ text: "", type: "" });
  const notify = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: "", type: "" }), 3500);
  };

  /* ── Load courses on mount ── */
  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        const res = await instructorCourseApi.getInstructorCourses(0, 200);
        if (res.data?.success) {
          const list = res.data.data?.content || [];
          setCourses(list);
          if (list.length > 0) setSelectedCourseSlug(list[0].slug);
        }
      } catch (err) {
        notify(err.response?.data?.message || "Failed to load courses", "error");
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  /* ── Load resources for selected course ── */
  const fetchResources = useCallback(async (pageNum = 0) => {
    if (!selectedCourseSlug) return;
    setResourcesLoading(true);
    try {
      const res = await instructorResourceApi.getCourseResources(selectedCourseSlug, pageNum, 20);
      if (res.data?.success) {
        setResources(res.data.data?.content || []);
        setTotalPages(res.data.data?.totalPages || 0);
        setPage(pageNum);
      }
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load resources", "error");
    } finally {
      setResourcesLoading(false);
    }
  }, [selectedCourseSlug]);

  useEffect(() => {
    if (selectedCourseSlug) fetchResources(0);
  }, [selectedCourseSlug, fetchResources]);

  /* ── Upload / Edit form handlers ── */
  const openUpload = () => {
    setFormData({ title: "", description: "", file: null });
    setFormError("");
    setFormMode("upload");
  };

  const openEdit = async (resource) => {
    setFormError("");
    setFormMode(resource.resourceId);
    setFormLoading(true);
    try {
      // List summary doesn't include description — fetch full detail to prefill it
      const res = await instructorResourceApi.getResource(resource.resourceId);
      if (res.data?.success) {
        const detail = res.data.data;
        setFormData({ title: detail.title || "", description: detail.description || "", file: null });
      }
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load resource details", "error");
      setFormMode(null);
    } finally {
      setFormLoading(false);
    }
  };

  const closeForm = () => { setFormMode(null); setFormData({ title: "", description: "", file: null }); };

  const handleSaveForm = async () => {
    if (!formData.title.trim()) { setFormError("Title is required"); return; }
    setFormLoading(true);
    setFormError("");
    try {
      if (formMode === "upload") {
        const res = await instructorResourceApi.uploadResource(selectedCourseSlug, formData);
        if (res.data?.success) {
          notify("Resource uploaded successfully!");
          closeForm();
          fetchResources(page);
        }
      } else {
        const res = await instructorResourceApi.updateResource(formMode, formData);
        if (res.data?.success) {
          notify("Resource updated successfully!");
          closeForm();
          fetchResources(page);
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save resource");
    } finally {
      setFormLoading(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (resource) => {
    if (!window.confirm(`Delete "${resource.title}"? This cannot be undone.`)) return;
    setBusyId(resource.resourceId);
    try {
      const res = await instructorResourceApi.deleteResource(resource.resourceId);
      if (res.data?.success) {
        notify("Resource deleted.");
        fetchResources(page);
      }
    } catch (err) {
      notify(err.response?.data?.message || "Failed to delete resource", "error");
    } finally {
      setBusyId(null);
    }
  };

  /* ── View / Download (list summary has no fileUrl, so fetch detail first) ── */
  const handleOpenFile = async (resource) => {
    setBusyId(resource.resourceId);
    try {
      const res = await instructorResourceApi.getResource(resource.resourceId);
      if (res.data?.success && res.data.data?.fileUrl) {
        window.open(res.data.data.fileUrl, "_blank", "noopener,noreferrer");
      } else {
        notify("No file available for this resource", "error");
      }
    } catch (err) {
      notify(err.response?.data?.message || "Failed to open file", "error");
    } finally {
      setBusyId(null);
    }
  };

  const isEditing = formMode !== null && formMode !== "upload";

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-[#f7f8fc] font-sans">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Breadcrumbs */}
        <div className="mb-3">
          <Link to="/instructor/dashboard" className="text-sm text-slate-400 hover:text-[#7c3aed] transition">
            Dashboard
          </Link>
          <span className="mx-2 text-slate-400">&gt;</span>
          <span className="text-sm font-semibold text-slate-800">Resources</span>
        </div>

        {/* Page title */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Resources</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Upload and manage downloadable materials for your courses</p>
          </div>
          {selectedCourseSlug && (
            <button
              onClick={openUpload}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-violet-750 text-white text-sm font-bold shadow-sm transition"
            >
              <FaUpload size={12} /> Upload Resource
            </button>
          )}
        </div>

        {/* Toast */}
        {toast.text && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold ${
            toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
          }`}>
            {toast.type === "error" ? <FaExclamationCircle /> : <FaCheckCircle />}
            {toast.text}
          </div>
        )}

        {/* Course selector */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            <FaBookOpen size={10} /> Course
          </label>
          {coursesLoading ? (
            <div className="h-[42px] rounded-xl bg-slate-100 animate-pulse" />
          ) : (
            <select
              value={selectedCourseSlug}
              onChange={e => setSelectedCourseSlug(e.target.value)}
              className="select-base"
            >
              {courses.length === 0 && <option value="">No courses found</option>}
              {courses.map(c => (
                <option key={c.id} value={c.slug}>{c.title}</option>
              ))}
            </select>
          )}
        </div>

        {/* Resources list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
          <SectionHeader icon={<FaFolderOpen />} title="Course Resources" subtitle="Files available to students in this course" />

          {!selectedCourseSlug ? (
            <EmptyState icon={<FaFolderOpen />} text="Select a course to view its resources" />
          ) : resourcesLoading ? (
            <LoadingBlock />
          ) : resources.length === 0 ? (
            <EmptyState icon={<FaFolderOpen />} text="No resources uploaded yet" />
          ) : (
            <div className="mt-4 space-y-2.5">
              {resources.map(resource => {
                const { Icon, color, bg } = TYPE_ICONS[resource.resourceType] || DEFAULT_TYPE_ICON;
                const busy = busyId === resource.resourceId;
                return (
                  <div key={resource.resourceId} className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className={`w-11 h-11 rounded-xl ${bg} ${color} flex items-center justify-center text-lg flex-shrink-0`}>
                      <Icon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">{resource.title}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap text-[11px] text-slate-500">
                        <span className="font-bold text-slate-400 uppercase">{resource.resourceType || "FILE"}</span>
                        <span>{formatFileSize(resource.fileSize)}</span>
                        <span>{formatDate(resource.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleOpenFile(resource)}
                        disabled={busy}
                        title="View / Download"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-violet-100 hover:text-[#7c3aed] transition disabled:opacity-40"
                      >
                        {busy ? <FaSpinner className="animate-spin" size={12} /> : <FaDownload size={12} />}
                      </button>
                      <button
                        onClick={() => openEdit(resource)}
                        title="Edit"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-violet-100 hover:text-[#7c3aed] transition"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(resource)}
                        disabled={busy}
                        title="Delete"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-violet-100 hover:text-[#7c3aed] transition disabled:opacity-40"
                      >
                        <FaTrash size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onChange={fetchResources} />
        </div>
      </div>

      {/* ══════════ UPLOAD / EDIT MODAL ══════════ */}
      {formMode !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeForm}>
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900">
                {isEditing ? "Edit Resource" : "Upload Resource"}
              </h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600 transition text-lg leading-none">
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formError && (
                <div className="px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 font-medium">
                  {formError}
                </div>
              )}

              {formLoading && isEditing && !formData.title ? (
                <LoadingBlock />
              ) : (
                <>
                  <Field label="Title *">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Week 1 Slides"
                      className="input-base"
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                      placeholder="Optional notes about this file…"
                      className="input-base resize-none"
                    />
                  </Field>
                  <Field label={isEditing ? "Replace File (optional)" : "File"}>
                    <input
                      type="file"
                      onChange={e => setFormData(p => ({ ...p, file: e.target.files[0] || null }))}
                      className="input-base"
                    />
                  </Field>
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleSaveForm}
                disabled={formLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-violet-750 disabled:opacity-50 text-white text-sm font-bold shadow-sm transition"
              >
                <FaSave size={12} />{formLoading ? "Saving..." : "Save"}
              </button>
              <button onClick={closeForm} className="px-5 py-2.5 rounded-xl text-slate-500 text-sm font-bold border border-slate-200 hover:bg-slate-50 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .select-base,.input-base{width:100%;border:1px solid #e5e7eb;border-radius:0.75rem;padding:0.625rem 1rem;font-size:0.875rem;background:#f9fafb;outline:none;transition:all .15s}
        .select-base:focus,.input-base:focus{background:#fff;border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124, 58, 237, 0.1)}
      `}</style>
    </div>
  );
};

/* ══════════════════════════════════════════
   Sub-components
 ══════════════════════════════════════════ */
const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#7c3aed] text-sm flex-shrink-0">{icon}</div>
    <div>
      <h2 className="text-sm font-black text-slate-900">{title}</h2>
      {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
    {children}
  </div>
);

const LoadingBlock = () => (
  <div className="py-10 text-center">
    <div className="w-7 h-7 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin mx-auto" />
  </div>
);

const EmptyState = ({ icon, text }) => (
  <div className="py-10 text-center">
    <div className="text-3xl text-slate-200 mx-auto mb-2 flex justify-center">{icon}</div>
    <p className="text-sm text-slate-400">{text}</p>
  </div>
);

const Pagination = ({ page, totalPages, onChange }) => {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-5">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="w-8 h-8 rounded-lg bg-white border border-slate-200 disabled:opacity-40 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition"
      >
        <FaChevronLeft className="text-[10px] text-slate-600" />
      </button>
      <span className="text-xs font-semibold text-slate-500 px-2">
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="w-8 h-8 rounded-lg bg-white border border-slate-200 disabled:opacity-40 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition"
      >
        <FaChevronRight className="text-[10px] text-slate-600" />
      </button>
    </div>
  );
};

export default Resources;
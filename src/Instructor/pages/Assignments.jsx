import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  MdOutlineAssignment, MdAdd, MdSearch,
  MdRefresh, MdFilterList
} from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  instructorAssignmentApi,
  instructorCourseApi,
  instructorModuleApi,
  instructorLessonApi,
} from "../auth/api";

import { ASSIGNMENT_TYPES, extractList } from "../components/Assignments/utils";
import AssignmentModal from "../components/Assignments/AssignmentModal";
import AssignmentCard from "../components/Assignments/AssignmentCard";
import SubmissionsPanel from "../components/Assignments/SubmissionsPanel";
import LessonPicker from "../components/Assignments/LessonPicker";

/* ─── Toast ─── */
function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold ${type === "error" ? "bg-red-600" : "bg-emerald-600"}`}>
      {msg}
    </div>
  );
}

/* ─── Main Page ─── */
export default function Assignments() {
  const navigate = useNavigate();
  const { assignmentSlug } = useParams();
  const location = useLocation();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewSubs, setViewSubs] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [backendError, setBackendError] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAssignments = useCallback(async (lessonSlug) => {
    setLoading(true);
    setBackendError(null);
    try {
      let list = [];
      if (lessonSlug) {
        const res = await instructorAssignmentApi.getByLesson(lessonSlug, 0, 100);
        list = extractList(res);
      } else {
        try {
          const res = await instructorAssignmentApi.getAllAssignments();
          list = extractList(res);
        } catch (allErr) {
          console.warn("getAllAssignments failed with 400 (Backend EL1004E Error), falling back to nested fetching...", allErr?.response?.data?.message);

          const coursesRes = await instructorCourseApi.getInstructorCourses(0, 100).catch(() => null);
          const courseList = extractList(coursesRes);

          const allAss = await Promise.all(
            courseList.map(async (course) => {
              const cSlug = course.slug ?? course.courseSlug;
              if (!cSlug) return [];
              const mods = extractList(await instructorModuleApi.getCourseModules(cSlug, 0, 100).catch(() => null));

              const mq = (await Promise.all(mods.map(async (mod) => {
                const mSlug = mod.slug ?? mod.moduleSlug;
                if (!mSlug) return [];
                const less = extractList(await instructorLessonApi.getModuleLessons(mSlug, 0, 100).catch(() => null));

                return (await Promise.all(less.map(async (lesson) => {
                  const lSlug = lesson.slug ?? lesson.lessonSlug;
                  if (!lSlug) return [];
                  return instructorAssignmentApi.getByLesson(lSlug, 0, 50)
                    .then(r => extractList(r))
                    .catch(() => []);
                }))).flat();
              }))).flat();
              return mq;
            })
          );
          list = allAss.flat();
        }
      }
      setAssignments(list);
    } catch (err) {
      console.error(err);
      if (err.response) {
        setBackendError(err.response.data);
      }
      showToast("Failed to load assignments.", "error");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    loadAssignments(selectedLesson?.slug);
  }, [selectedLesson, loadAssignments]);

  const handleLessonSelect = (slug, lesson) => {
    setSelectedLesson({ slug, title: lesson?.title || slug });
    setAssignments([]);
  };

  useEffect(() => {
    if (assignmentSlug && assignments.length > 0) {
      const found = assignments.find((a) => a.slug === assignmentSlug || String(a.id) === assignmentSlug);
      if (found) {
        if (location.pathname.endsWith("/submissions")) {
          if (!viewSubs) setViewSubs(found);
        } else {
          if (!editData) { setEditData(found); setModalOpen(true); }
        }
      } else {
        navigate("/instructor/assignments");
      }
    } else if (!assignmentSlug) {
      if (editData) setEditData(null);
      if (modalOpen && editData) setModalOpen(false); // Only close if editing, not creating
      if (viewSubs) setViewSubs(null);
    }
  }, [assignmentSlug, location.pathname, assignments, editData, viewSubs, modalOpen, navigate]);

  const handlePublish = async (a) => {
    try { await instructorAssignmentApi.publish(a.slug); showToast("Assignment published!"); loadAssignments(selectedLesson?.slug); }
    catch { showToast("Failed to publish.", "error"); }
  };
  const handleArchive = async (a) => {
    try { await instructorAssignmentApi.archive(a.slug); showToast("Assignment archived."); loadAssignments(selectedLesson?.slug); }
    catch { showToast("Failed to archive.", "error"); }
  };
  const handleDelete = async (a) => {
    if (!window.confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
    try { await instructorAssignmentApi.delete(a.slug); showToast("Assignment deleted."); loadAssignments(selectedLesson?.slug); }
    catch { showToast("Failed to delete.", "error"); }
  };

  const filtered = assignments.filter(a => {
    const matchSearch = !search || a.title?.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || a.assignmentType === typeFilter;
    return matchSearch && matchType;
  });

  const stats = {
    total: assignments.length,
    published: assignments.filter(a => a.assignmentStatus === "PUBLISHED").length,
    draft: assignments.filter(a => a.assignmentStatus === "DRAFT").length,
  };

  if (modalOpen) {
    return (
      <AssignmentModal editData={editData}
        onClose={() => {
          setModalOpen(false); setEditData(null);
          if (assignmentSlug) navigate("/instructor/assignments");
        }}
        onSaved={() => {
          setModalOpen(false); setEditData(null);
          if (assignmentSlug) navigate("/instructor/assignments");
          showToast(editData ? "Assignment updated!" : "Assignment created!");
          loadAssignments(selectedLesson?.slug);
        }} />
    );
  }

  if (viewSubs) {
    return (
      <SubmissionsPanel assignment={viewSubs} onClose={() => {
        setViewSubs(null);
        if (assignmentSlug) navigate("/instructor/assignments");
      }} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
              <MdOutlineAssignment className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Assignments</h1>
              <p className="text-sm text-gray-400">Manage lesson assignments and submissions</p>
            </div>
          </div>
          <button onClick={() => { setEditData(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition shadow-sm">
            <MdAdd size={18} /> New Assignment
          </button>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Lesson Picker */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <MdFilterList className="text-violet-500" /> Browse Assignments by Lesson
          </p>
          <LessonPicker onSelect={handleLessonSelect} />
          {selectedLesson && (
            <p className="mt-3 text-xs text-violet-600 font-semibold">
              Showing: <span className="font-bold">{selectedLesson.title}</span>
            </p>
          )}
        </div>

        {backendError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <h3 className="text-red-700 font-bold mb-2">API Error (400) Details</h3>
            <pre className="text-xs text-red-600 whitespace-pre-wrap font-mono">
              {JSON.stringify(backendError, null, 2)}
            </pre>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", val: stats.total, color: "text-gray-900", bg: "bg-white" },
            { label: "Published", val: stats.published, color: "text-emerald-700", bg: "bg-emerald-50" },
            { label: "Draft", val: stats.draft, color: "text-amber-700", bg: "bg-amber-50" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-100 p-5 text-center shadow-sm`}>
              <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition">
            <MdSearch className="text-gray-400 text-lg flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assignments..."
              className="flex-1 text-sm text-gray-800 outline-none bg-transparent" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition">
            <option value="">All Types</option>
            {ASSIGNMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <button onClick={() => loadAssignments(selectedLesson?.slug)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
            <MdRefresh size={16} /> Refresh
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20"><AiOutlineLoading3Quarters className="animate-spin text-violet-500 text-3xl" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <MdOutlineAssignment className="text-gray-200 text-6xl mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No assignments found</p>
            <button onClick={() => { setEditData(null); setModalOpen(true); }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition">
              <MdAdd /> Create First Assignment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(a => (
              <AssignmentCard key={a.id} a={a}
                onEdit={item => { navigate(`/instructor/assignments/${item.slug || item.id}`); }}
                onDelete={handleDelete} onPublish={handlePublish}
                onArchive={handleArchive} onViewSubmissions={item => navigate(`/instructor/assignments/${item.slug || item.id}/submissions`)} />
            ))}
          </div>
        )}
      </div>

      <Toast msg={toast?.msg} type={toast?.type} />
    </div>
  );
}

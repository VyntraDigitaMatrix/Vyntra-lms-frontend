import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  MdOutlineAssignment, MdAdd, MdClose, MdSearch,
  MdGrade, MdRefresh, MdEdit, MdVisibility, MdFilterList,
  MdPublish, MdArchive, MdDelete, MdArrowBack
} from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  instructorAssignmentApi,
  instructorCourseApi,
  instructorModuleApi,
  instructorLessonApi,
} from "../auth/api";

/* ─── Constants ─── */
const ASSIGNMENT_TYPES = [
  { value: "IN_CLASS_ASSIGNMENT", label: "In-Class Assignment" },
  { value: "HOMEWORK_ASSIGNMENT", label: "Homework Assignment" },
];
const STATUS_STYLE = {
  DRAFT: "text-amber-700 bg-amber-50 border-amber-200",
  PUBLISHED: "text-emerald-700 bg-emerald-50 border-emerald-200",
  ARCHIVED: "text-slate-600 bg-slate-100 border-slate-200",
};

/* ─── Helpers ─── */
const extractList = (res) => {
  const body = res?.data?.data ?? res?.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.content)) return body.content;
  return [];
};
const fmt = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
const fmtType = (type) => ASSIGNMENT_TYPES.find(t => t.value === type)?.label ?? type ?? "—";

/* ─── Toast ─── */
function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold ${type === "error" ? "bg-red-600" : "bg-emerald-600"}`}>
      {msg}
    </div>
  );
}

/* ─── Create / Edit Modal ─── */
const EMPTY_FORM = {
  title: "", description: "", instructions: "",
  assignmentType: "IN_CLASS_ASSIGNMENT", maxMarks: 100,
  dueDate: "", active: true, allowLateSubmission: false, allowResubmission: false,
  courseSlug: "", moduleSlug: "", lessonSlug: "",
};

function AssignmentModal({ editData, onClose, onSaved }) {
  const isEdit = Boolean(editData);
  const [form, setForm] = useState(isEdit ? {
    ...EMPTY_FORM,
    title: editData.title || "",
    description: editData.description || "",
    instructions: editData.instructions || "",
    assignmentType: editData.assignmentType || "IN_CLASS_ASSIGNMENT",
    maxMarks: editData.maxMarks || 100,
    dueDate: editData.dueDate ? editData.dueDate.slice(0, 16) : "",
    active: editData.active ?? true,
    allowLateSubmission: editData.allowLateSubmission ?? false,
    allowResubmission: editData.allowResubmission ?? false,
    lessonSlug: editData.lessonSlug || "",
  } : { ...EMPTY_FORM });

  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const up = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    instructorCourseApi.getInstructorCourses(0, 100)
      .then(res => setCourses(extractList(res))).catch(console.error);
  }, []);

  useEffect(() => {
    setModules([]); up("moduleSlug", "");
    if (!form.courseSlug) return;
    instructorModuleApi.getCourseModules(form.courseSlug, 0, 100)
      .then(res => setModules(res?.data?.data?.content ?? extractList(res))).catch(console.error);
  }, [form.courseSlug]);

  useEffect(() => {
    setLessons([]);
    if (!form.moduleSlug) return;
    instructorLessonApi.getModuleLessons(form.moduleSlug, 0, 100)
      .then(res => {
        const list = res?.data?.data?.content ?? extractList(res);
        setLessons(list);
      }).catch(console.error);
  }, [form.moduleSlug]);

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!isEdit && !form.lessonSlug) { setError("Please select a lesson."); return; }
    setSaving(true); setError("");
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        instructions: form.instructions.trim(),
        assignmentType: form.assignmentType,
        maxMarks: Number(form.maxMarks) || 1,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        active: form.active,
        allowLateSubmission: form.allowLateSubmission,
        allowResubmission: form.allowResubmission,
      };
      if (isEdit) {
        await instructorAssignmentApi.update(editData.slug, payload);
      } else {
        await instructorAssignmentApi.createByLesson(form.lessonSlug, payload);
      }
      onSaved();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save assignment.");
    } finally { setSaving(false); }
  };

  const inp = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-white";
  const lbl = "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block";

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 bg-white">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition"><MdArrowBack size={20} /></button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Assignment" : "Create Assignment"}</h2>
          <p className="text-sm text-gray-500">{isEdit ? (editData.title || "Update assignment details") : "Set up a new assignment for your students"}</p>
        </div>
      </div>
      <div className="bg-white p-6 md:p-8 space-y-6">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

        {/* Course → Module → Lesson selectors (create only) */}
        {!isEdit && (
          <div className="space-y-3">
            <div>
              <label className={lbl}>Course*</label>
              <select value={form.courseSlug} onChange={e => up("courseSlug", e.target.value)} className={inp}>
                <option value="">— Select Course —</option>
                {courses.map(c => <option key={c.slug || c.id} value={c.slug || c.id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Module*</label>
              <select value={form.moduleSlug} onChange={e => up("moduleSlug", e.target.value)} disabled={!form.courseSlug} className={inp}>
                <option value="">— Select Module —</option>
                {modules.map(m => <option key={m.slug || m.id} value={m.slug || m.id}>{m.title}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Lesson*</label>
              <select value={form.lessonSlug} onChange={e => up("lessonSlug", e.target.value)} disabled={!form.moduleSlug} className={inp}>
                <option value="">— Select Lesson —</option>
                {lessons.map(l => <option key={l.lessonSlug || l.id} value={l.lessonSlug || l.id}>{l.title}</option>)}
              </select>
            </div>
          </div>
        )}
        {isEdit && (
          <div className="px-3 py-2 bg-violet-50 rounded-xl border border-violet-100 text-sm text-violet-700">
            <span className="font-semibold">Lesson:</span> {editData.lessonName || editData.lessonSlug}
          </div>
        )}

        <div><label className={lbl}>Title*</label><input value={form.title} onChange={e => up("title", e.target.value)} placeholder="Assignment title" className={inp} /></div>
        <div><label className={lbl}>Description</label><textarea value={form.description} onChange={e => up("description", e.target.value)} rows={3} placeholder="Brief description..." className={`${inp} resize-none`} /></div>
        <div><label className={lbl}>Instructions</label><textarea value={form.instructions} onChange={e => up("instructions", e.target.value)} rows={4} placeholder="Step-by-step instructions for students..." className={`${inp} resize-none`} /></div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Assignment Type*</label>
            <select value={form.assignmentType} onChange={e => up("assignmentType", e.target.value)} className={inp}>
              {ASSIGNMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Max Marks*</label>
            <input type="number" min="1" value={form.maxMarks} onChange={e => up("maxMarks", e.target.value)} className={inp} />
          </div>
        </div>

        <div><label className={lbl}>Due Date</label><input type="datetime-local" value={form.dueDate} onChange={e => up("dueDate", e.target.value)} className={inp} /></div>

        {/* Toggle switches */}
        <div className="space-y-3">
          {[
            { key: "active", label: "Active", desc: "Assignment visible to enrolled students" },
            { key: "allowLateSubmission", label: "Allow Late Submission", desc: "Students can submit after due date" },
            { key: "allowResubmission", label: "Allow Resubmission", desc: "Students can re-submit their work" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-700">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <button onClick={() => up(key, !form[key])}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${form[key] ? "bg-violet-600" : "bg-gray-300"}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${form[key] ? "left-7" : "left-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end rounded-b-2xl">
        <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
        <button onClick={handleSave} disabled={saving}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition flex items-center gap-2">
          {saving && <AiOutlineLoading3Quarters className="animate-spin" />}
          {isEdit ? "Save Changes" : "Create Assignment"}
        </button>
      </div>

    </div>
  );
}

/* ─── Assignment Card ─── */
function AssignmentCard({ a, onEdit, onDelete, onPublish, onArchive, onViewSubmissions }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = a.assignmentStatus || "DRAFT";
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
            <MdOutlineAssignment className="text-violet-600 text-xl" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-violet-700 transition">{a.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{a.lessonName || a.lessonSlug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[status] || STATUS_STYLE.DRAFT}`}>{status}</span>
          <div className="relative">
            <button onClick={() => setMenuOpen(p => !p)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
              <MdFilterList size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 bg-white border border-gray-100 rounded-xl shadow-xl min-w-[170px] py-1 text-sm">
                <button onClick={() => { onEdit(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-violet-50 text-gray-700 hover:text-violet-700 transition"><MdEdit size={15} /> Edit</button>
                <button onClick={() => { onViewSubmissions(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-violet-50 text-gray-700 hover:text-violet-700 transition"><MdVisibility size={15} /> Submissions</button>
                {(status === "DRAFT" || status === "ARCHIVED") && <button onClick={() => { onPublish(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-emerald-50 text-emerald-700 transition"><MdPublish size={15} /> Publish</button>}
                {status === "PUBLISHED" && <button onClick={() => { onArchive(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-50 text-slate-600 transition"><MdArchive size={15} /> Archive</button>}
                <button onClick={() => { onDelete(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50 text-red-600 transition"><MdDelete size={15} /> Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 rounded-lg py-2"><p className="text-xs text-gray-400">Type</p><p className="text-xs font-semibold text-gray-700 truncate px-1">{fmtType(a.assignmentType)}</p></div>
        <div className="bg-gray-50 rounded-lg py-2"><p className="text-xs text-gray-400">Max Marks</p><p className="text-sm font-bold text-gray-900">{a.maxMarks ?? "—"}</p></div>
        <div className="bg-gray-50 rounded-lg py-2"><p className="text-xs text-gray-400">Due</p><p className="text-xs font-semibold text-gray-700">{fmt(a.dueDate)}</p></div>
      </div>

      <div className="mt-3 flex gap-2 flex-wrap">
        {a.allowLateSubmission && <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">Late OK</span>}
        {a.allowResubmission && <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full border border-purple-100">Resubmit OK</span>}
        {!a.active && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full border border-gray-200">Inactive</span>}
      </div>
      <p className="mt-3 text-xs text-gray-400 truncate">{[a.courseName, a.moduleName].filter(Boolean).join(" › ")}</p>
    </div>
  );
}

/* ─── Submissions Panel ─── */
function SubmissionsPanel({ assignment, onClose }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(null);
  const [gradeVal, setGradeVal] = useState("");

  useEffect(() => {
    if (!assignment?.slug) return;
    instructorAssignmentApi.getSubmissions(assignment.slug)
      .then(res => setSubmissions(extractList(res))).catch(console.error)
      .finally(() => setLoading(false));
  }, [assignment]);

  const handleGrade = async (subId) => {
    if (!gradeVal) return;
    try {
      await instructorAssignmentApi.grade(subId, { obtainedMarks: Number(gradeVal) });
      setGrading(null); setGradeVal("");
      const res = await instructorAssignmentApi.getSubmissions(assignment.slug);
      setSubmissions(extractList(res));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 bg-white">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition"><MdArrowBack size={20} /></button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Submissions</h2>
            <p className="text-sm text-gray-500">{assignment.title}</p>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-gray-50/50">
          {loading ? (
            <div className="flex justify-center py-12"><AiOutlineLoading3Quarters className="animate-spin text-violet-500 text-2xl" /></div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <MdOutlineAssignment className="text-gray-300 text-5xl mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map(sub => {
                const subId = sub.submissionId || sub.id;
                const hasMarks = sub.obtainedMarks != null || sub.score != null || sub.marks != null;
                const marksVal = sub.obtainedMarks ?? sub.score ?? sub.marks;
                return (
                  <div key={subId} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{sub.studentName || sub.studentId || "Student"}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Submitted: {fmt(sub.submittedAt || sub.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {hasMarks ? (
                          <span className="text-sm font-bold text-emerald-600">{marksVal}/{assignment.maxMarks}</span>
                        ) : grading === subId ? (
                          <div className="flex items-center gap-2">
                            <input type="number" min="0" max={assignment.maxMarks} value={gradeVal} onChange={e => setGradeVal(e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm" placeholder="Marks" />
                            <button onClick={() => handleGrade(subId)} className="px-3 py-1 bg-violet-600 text-white text-xs rounded-lg hover:bg-violet-700">Save</button>
                            <button onClick={() => setGrading(null)} className="text-gray-400 hover:text-gray-600"><MdClose /></button>
                          </div>
                        ) : (
                          <button onClick={() => { setGrading(subId); setGradeVal(""); }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-semibold rounded-lg hover:bg-violet-100 transition">
                            <MdGrade size={14} /> Grade
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Submission Content Viewer */}
                    <div className="mt-4 bg-white rounded-lg p-3 border border-gray-200">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Submission Details</h4>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap">
                        {sub.submissionText || sub.content || sub.answer || <span className="text-gray-400 italic">No text provided.</span>}
                      </div>

                      {(sub.fileUrl || sub.file || sub.attachmentUrl || sub.attachment) && (
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-500">Attachment:</span>
                          <a href={sub.fileUrl || sub.file || sub.attachmentUrl || sub.attachment} target="_blank" rel="noreferrer"
                            className="text-sm text-violet-600 hover:text-violet-700 font-semibold flex items-center gap-1 hover:underline">
                            <MdVisibility size={14} /> View Attached File
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Lesson Picker ─── */
function LessonPicker({ onSelect }) {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [cSlug, setCSlug] = useState("");
  const [mSlug, setMSlug] = useState("");

  useEffect(() => {
    instructorCourseApi.getInstructorCourses(0, 100)
      .then(res => setCourses(extractList(res))).catch(console.error);
  }, []);

  useEffect(() => {
    setModules([]); setMSlug(""); setLessons([]);
    if (!cSlug) return;
    instructorModuleApi.getCourseModules(cSlug, 0, 100)
      .then(res => setModules(res?.data?.data?.content ?? extractList(res))).catch(console.error);
  }, [cSlug]);

  useEffect(() => {
    setLessons([]);
    if (!mSlug) return;
    instructorLessonApi.getModuleLessons(mSlug, 0, 100)
      .then(res => {
        const list = res?.data?.data?.content ?? extractList(res);
        setLessons(list);
      }).catch(console.error);
  }, [mSlug]);

  const sel = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white";
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[160px]">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Course</label>
        <select value={cSlug} onChange={e => {
          setCSlug(e.target.value);
          if (!e.target.value) onSelect(null, null);
        }} className={sel}>
          <option value="">All Courses</option>
          {courses.map(c => <option key={c.slug || c.id} value={c.slug || c.id}>{c.title}</option>)}
        </select>
      </div>
      <div className="flex-1 min-w-[140px]">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Module</label>
        <select value={mSlug} onChange={e => {
          setMSlug(e.target.value);
          if (!e.target.value) onSelect(null, null);
        }} disabled={!cSlug} className={sel}>
          <option value="">All Modules</option>
          {modules.map(m => <option key={m.slug || m.id} value={m.slug || m.id}>{m.title}</option>)}
        </select>
      </div>
      <div className="flex-1 min-w-[140px]">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Lesson</label>
        <select disabled={!mSlug}
          onChange={e => {
            if (e.target.value) onSelect(e.target.value, lessons.find(l => (l.lessonSlug || l.id) === e.target.value));
            else onSelect(null, null);
          }}
          className={sel}>
          <option value="">— Pick Lesson —</option>
          {lessons.map(l => <option key={l.lessonSlug || l.id} value={l.lessonSlug || l.id}>{l.title}</option>)}
        </select>
      </div>
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

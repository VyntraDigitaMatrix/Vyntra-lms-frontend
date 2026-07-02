import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineAssignment, MdAdd, MdClose, MdSearch,
  MdPeople, MdCheckCircle, MdPending, MdGrade, MdErrorOutline,
  MdRefresh, MdMoreVert, MdCalendarToday, MdEdit,
  MdVisibility, MdStar, MdFilterList,
} from "react-icons/md";
import {
  FaTrash, FaEdit, FaCheck, FaUserGraduate, FaFileAlt,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  instructorAssignmentApi,
  instructorCourseApi,
  instructorModuleApi,
} from "../auth/api";

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
const extractList = (res) => {
  const body = res?.data?.data ?? res?.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.content)) return body.content;
  return [];
};

const normalizeAssignment = (raw) => ({
  id: raw.id ?? raw.assignmentId,
  title: raw.title ?? raw.name ?? "Untitled Assignment",
  description: raw.description ?? raw.instructions ?? "",
  courseId: raw.courseId ?? null,
  courseTitle: raw.courseTitle ?? raw.course?.title ?? "—",
  moduleId: raw.moduleId ?? raw.module?.id ?? null,
  moduleName: raw.moduleName ?? raw.module?.title ?? null,
  dueDate: raw.dueDate ?? raw.deadline ?? null,
  totalMarks: raw.totalMarks ?? raw.maxMarks ?? raw.marks ?? 0,
  submissionCount: raw.submissionCount ?? raw.totalSubmissions ?? 0,
  gradedCount: raw.gradedCount ?? raw.totalGraded ?? 0,
  status: raw.status ?? (raw.published ? "PUBLISHED" : "DRAFT"),
  createdAt: raw.createdAt ?? null,
});

const STATUS = {
  PUBLISHED: { label: "Published", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  DRAFT: { label: "Draft", color: "text-amber-700 bg-amber-50 border-amber-200" },
  CLOSED: { label: "Closed", color: "text-slate-600 bg-slate-100 border-slate-200" },
};

/* ══════════════════════════════════════════════════════════
   CREATE / EDIT MODAL
   API used:
     POST /api/instructor/assignments/modules/{moduleId}   ← create
     PUT  /api/instructor/assignments/{assignmentId}        ← update
══════════════════════════════════════════════════════════ */
const AssignmentModal = ({ courses, initialData, onClose, onSaved }) => {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    courseId: initialData?.courseId ? String(initialData.courseId) : "",
    moduleId: initialData?.moduleId ? String(initialData.moduleId) : "",
    dueDate: initialData?.dueDate ? initialData.dueDate.slice(0, 16) : "",
    totalMarks: initialData?.totalMarks || 100,
    status: initialData?.status || "DRAFT",
  });

  const [modules, setModules] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const up = (k, v) => setForm(p => ({ ...p, [k]: v }));

  /* Load modules when course changes */
  useEffect(() => {
    if (!form.courseId) { setModules([]); up("moduleId", ""); return; }
    instructorModuleApi
      .getCourseModules(form.courseId, 0, 100)
      .then(res => {
        const list = res?.data?.data?.content ?? res?.data?.content ?? extractList(res);
        setModules(list);
      })
      .catch(console.error);
  }, [form.courseId]);

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.courseId) { setError("Please select a course."); return; }
    if (!isEdit && !form.moduleId) { setError("Please select a module."); return; }

    setSaving(true); setError("");
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        courseId: Number(form.courseId),
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        maxMarks: Number(form.totalMarks),
        status: form.status,
      };
      console.log(
        "ASSIGNMENT PAYLOAD",
        JSON.stringify(payload, null, 2)
      );

      if (isEdit) {
        // PUT /api/instructor/assignments/{assignmentId}
        await instructorAssignmentApi.update(initialData.id, payload);
      } else {
        // POST /api/instructor/assignments/modules/{moduleId}
        await instructorAssignmentApi.createByModule(form.moduleId, payload);
      }

      await onSaved();
      onClose();
    } catch (err) {
      const data = err?.response?.data;
      setError(data?.message || data?.error || "Couldn't save. Please try again.");
    } finally { setSaving(false); }
  };

  const inp = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition bg-white placeholder-slate-400";
  const lbl = "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-2xl flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <MdOutlineAssignment className="text-white text-lg" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-black text-white">
              {isEdit ? "Edit Assignment" : "Create Assignment"}
            </h2>
            <p className="text-[11px] text-violet-200 mt-0.5">
              {isEdit ? "Update assignment details" : "Fill in the details below"}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition">
            <MdClose />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className={lbl}>Title *</label>
            <input className={inp} placeholder="e.g. Build a To-Do App with React"
              value={form.title} onChange={e => up("title", e.target.value)} />
          </div>

          <div>
            <label className={lbl}>Instructions / Description</label>
            <textarea className={inp} rows={4}
              placeholder="Describe the assignment, requirements, and submission guidelines…"
              value={form.description} onChange={e => up("description", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Course */}
            <div>
              <label className={lbl}>Course *</label>
              <select className={inp} value={form.courseId}
                onChange={e => { up("courseId", e.target.value); up("moduleId", ""); }}>
                <option value="">Select a course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title || c.name}</option>
                ))}
              </select>
            </div>

            {/* Module — required for create, shown for edit too */}
            <div>
              <label className={lbl}>Module {!isEdit && "*"}</label>
              <select className={inp} value={form.moduleId}
                onChange={e => up("moduleId", e.target.value)}
                disabled={!form.courseId}>
                <option value="">
                  {form.courseId ? "Select a module" : "Select course first"}
                </option>
                {modules.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Status</label>
              <select className={inp} value={form.status}
                onChange={e => up("status", e.target.value)}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Total Marks</label>
              <input type="number" className={inp} min={1} max={1000}
                value={form.totalMarks}
                onChange={e => up("totalMarks", Number(e.target.value))} />
            </div>
          </div>

          <div>
            <label className={lbl}>Due Date</label>
            <input type="datetime-local" className={inp}
              value={form.dueDate} onChange={e => up("dueDate", e.target.value)} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0 space-y-2">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-[11px] font-semibold">
              <MdErrorOutline className="flex-shrink-0" /> {error}
              <button onClick={() => setError("")} className="ml-auto"><MdClose className="text-xs" /></button>
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <button onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition bg-white">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-sm">
              {saving ? <AiOutlineLoading3Quarters className="animate-spin" /> : <MdCheckCircle />}
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Assignment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   SUBMISSIONS MODAL
   API used:
     GET  /api/instructor/assignments/{assignmentId}/submissions
     GET  /api/instructor/assignments/submissions/{submissionId}
     POST /api/instructor/assignments/submissions/{submissionId}/grade
══════════════════════════════════════════════════════════ */
const SubmissionsModal = ({ assignment, onClose }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [gradingId, setGradingId] = useState(null);
  const [gradeForm, setGradeForm] = useState({ marks: "", feedback: "" });
  const [gradeSaving, setGradeSaving] = useState(false);
  const [detailId, setDetailId] = useState(null);  // for view single submission
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  /* ── fetch all submissions ── */
  const fetchSubmissions = useCallback(() => {
    setLoading(true); setError("");
    // GET /api/instructor/assignments/{assignmentId}/submissions
    instructorAssignmentApi
      .getSubmissions(assignment.id)
      .then(res => setSubmissions(extractList(res)))
      .catch(() => setError("Couldn't load submissions."))
      .finally(() => setLoading(false));
  }, [assignment.id]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  /* ── view single submission detail ── */
  const handleViewDetail = async (subId) => {
    if (detailId === subId) { setDetailId(null); setDetail(null); return; }
    setDetailId(subId); setDetailLoading(true); setDetail(null);
    try {
      // GET /api/instructor/assignments/submissions/{submissionId}
      const res = await instructorAssignmentApi.getSubmission(subId);
      setDetail(res?.data?.data ?? res?.data ?? null);
    } catch { setDetail(null); }
    finally { setDetailLoading(false); }
  };

  /* ── grade submission ── */
  const handleGrade = async (submissionId) => {
    if (!gradeForm.marks && gradeForm.marks !== 0) return;
    setGradeSaving(true);
    try {
      // POST /api/instructor/assignments/submissions/{submissionId}/grade
      await instructorAssignmentApi.grade(submissionId, {
        obtainedMarks: Number(gradeForm.marks),
        feedback: gradeForm.feedback,
      });
      setGradingId(null);
      setGradeForm({ marks: "", feedback: "" });
      await fetchSubmissions();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save grade.");
    } finally { setGradeSaving(false); }
  };

  const filtered = submissions.filter(s => {
    const name = (s.studentName ?? s.student?.name ?? "").toLowerCase();
    const email = (s.studentEmail ?? s.student?.email ?? "").toLowerCase();
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  });

  const gradedCount = submissions.filter(s => s.status === "GRADED" || s.obtainedMarks != null || s.marks != null || s.score != null).length;
  const pendingCount = submissions.length - gradedCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[88vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-t-2xl flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <FaFileAlt className="text-white text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-black text-white truncate">{assignment.title}</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
              {" · "}{gradedCount} graded · {pendingCount} pending
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition flex-shrink-0">
            <MdClose />
          </button>
        </div>

        {/* Stats bar */}
        {!loading && submissions.length > 0 && (
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-4 text-[11px] font-semibold flex-shrink-0">
            <span className="text-slate-500">{submissions.length} total</span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${submissions.length ? (gradedCount / submissions.length) * 100 : 0}%` }} />
            </div>
            <span className="text-emerald-600">{gradedCount} graded</span>
            <span className="text-amber-600">{pendingCount} pending</span>
          </div>
        )}

        {/* Search */}
        <div className="px-5 py-3 border-b border-slate-100 flex-shrink-0">
          <div className="relative max-w-xs">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search students…"
              className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition w-full" />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-between gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-xs font-semibold">
              <span className="flex items-center gap-2"><MdErrorOutline /> {error}</span>
              <button onClick={fetchSubmissions}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 rounded-lg hover:bg-rose-100 transition">
                <MdRefresh /> Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-14">
              <FaUserGraduate className="text-slate-300 text-4xl mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-500">
                {search ? "No students match your search" : "No submissions yet"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {!search && "Students haven't submitted this assignment yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((s, idx) => {
                const subId = s.id ?? s.submissionId;
                const name = s.studentName ?? s.student?.name ?? "Student";
                const email = s.studentEmail ?? s.student?.email ?? "";
                const marks = s.obtainedMarks ?? s.marks ?? s.score ?? null;
                const feedback = s.feedback ?? "";
                const submittedAt = s.submittedAt ?? s.createdAt ?? null;
                const fileUrl = s.fileUrl ?? s.submissionUrl ?? s.attachmentUrl ?? null;
                const submissionText = s.submissionText ?? s.text ?? null;
                const status = s.status ?? (marks != null ? "GRADED" : submittedAt ? "SUBMITTED" : "PENDING");
                const isGrading = gradingId === subId;
                const isDetail = detailId === subId;

                const statusCfg = {
                  GRADED: { label: "Graded", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
                  SUBMITTED: { label: "Submitted", cls: "text-blue-700 bg-blue-50 border-blue-200" },
                  PENDING: { label: "Pending", cls: "text-amber-700 bg-amber-50 border-amber-200" },
                }[status] ?? { label: status, cls: "text-slate-600 bg-slate-100 border-slate-200" };

                return (
                  <div key={subId ?? idx}
                    className="border border-slate-200 rounded-xl overflow-hidden hover:border-violet-200 transition">

                    {/* Main row */}
                    <div className="flex items-center gap-3 p-3 bg-white">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-black text-white">{name.charAt(0).toUpperCase()}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800">{name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {email && <p className="text-[10px] text-slate-400 truncate">{email}</p>}
                          {submittedAt && (
                            <p className="text-[10px] text-slate-400 hidden sm:block">
                              · {new Date(submittedAt).toLocaleDateString("en-IN", {
                                day: "2-digit", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Score badge */}
                      {marks != null && (
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex-shrink-0">
                          {marks}/{assignment.totalMarks}
                        </span>
                      )}

                      {/* Status badge */}
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${statusCfg.cls}`}>
                        {statusCfg.label}
                      </span>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* View submission detail */}
                        {(fileUrl || submissionText || subId) && (
                          <button onClick={() => handleViewDetail(subId)}
                            className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold rounded-xl border transition ${isDetail ? "bg-indigo-100 border-indigo-300 text-indigo-700" : "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"}`}>
                            <MdVisibility className="text-sm" /> View
                          </button>
                        )}

                        {/* Grade / Edit grade */}
                        <button
                          onClick={() => {
                            if (isGrading) { setGradingId(null); return; }
                            setGradingId(subId);
                            setGradeForm({ marks: marks ?? "", feedback: feedback });
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold rounded-xl border transition ${isGrading ? "bg-slate-100 border-slate-200 text-slate-600" : "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100"}`}>
                          <MdGrade className="text-sm" />
                          {marks != null ? "Re-grade" : "Grade"}
                        </button>
                      </div>
                    </div>

                    {/* View detail panel */}
                    {isDetail && (
                      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                        {detailLoading ? (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <AiOutlineLoading3Quarters className="animate-spin" /> Loading submission…
                          </div>
                        ) : detail ? (
                          <div className="space-y-2">
                            {(detail.submissionText ?? detail.text) && (
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Submission Text</p>
                                <p className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-xl p-3">
                                  {detail.submissionText ?? detail.text}
                                </p>
                              </div>
                            )}
                            {(detail.fileUrl ?? detail.submissionUrl ?? detail.attachmentUrl) && (
                              <a href={detail.fileUrl ?? detail.submissionUrl ?? detail.attachmentUrl}
                                target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition">
                                <MdVisibility className="text-sm" /> Open Attachment
                              </a>
                            )}
                            {detail.feedback && (
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Instructor Feedback</p>
                                <p className="text-xs text-slate-600 italic">{detail.feedback}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400">No submission content available.</p>
                        )}
                      </div>
                    )}

                    {/* Grade form */}
                    {isGrading && (
                      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 space-y-3">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          {marks != null ? "Update Grade" : "Grade Submission"}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                              Marks / {assignment.totalMarks}
                            </label>
                            <input type="number" min={0} max={assignment.totalMarks}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition bg-white"
                              placeholder="e.g. 85"
                              value={gradeForm.marks}
                              onChange={e => setGradeForm(p => ({ ...p, marks: e.target.value }))} />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                              Feedback (optional)
                            </label>
                            <input
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition bg-white"
                              placeholder="Great work! Consider improving…"
                              value={gradeForm.feedback}
                              onChange={e => setGradeForm(p => ({ ...p, feedback: e.target.value }))} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleGrade(subId)}
                            disabled={gradeSaving || gradeForm.marks === ""}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition">
                            {gradeSaving
                              ? <AiOutlineLoading3Quarters className="animate-spin text-xs" />
                              : <FaCheck className="text-[9px]" />}
                            {gradeSaving ? "Saving…" : "Save Grade"}
                          </button>
                          <button onClick={() => setGradingId(null)}
                            className="px-3 py-1.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition bg-white">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   DELETE MODAL
══════════════════════════════════════════════════════════ */
const DeleteModal = ({ assignment, deleting, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
        <FaTrash className="text-red-500 text-lg" />
      </div>
      <h3 className="text-base font-black text-slate-900 mb-1">Delete Assignment</h3>
      <p className="text-xs text-slate-500 mb-1">This will permanently delete</p>
      <p className="text-sm font-bold text-slate-800 mb-4">"{assignment?.title}"</p>
      <p className="text-[11px] text-slate-400 mb-5">
        All student submissions will also be removed. This cannot be undone.
      </p>
      <div className="flex gap-2">
        <button onClick={onClose} disabled={deleting}
          className="flex-1 py-2.5 text-xs font-bold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition disabled:opacity-50">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={deleting}
          className="flex-1 py-2.5 text-xs font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-1.5">
          {deleting && <AiOutlineLoading3Quarters className="animate-spin text-xs" />}
          {deleting ? "Deleting…" : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   ASSIGNMENT CARD
══════════════════════════════════════════════════════════ */
const AssignmentCard = ({ assignment, onEdit, onDelete, onViewSubmissions }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const sc = STATUS[assignment.status] ?? STATUS.DRAFT;
  const total = assignment.submissionCount ?? 0;
  const graded = assignment.gradedCount ?? 0;
  const pending = Math.max(0, total - graded);
  const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && assignment.status !== "CLOSED";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="flex items-start gap-4 p-5">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${assignment.status === "PUBLISHED" ? "bg-violet-50 border-violet-100" : "bg-slate-50 border-slate-200"}`}>
          <MdOutlineAssignment className={`text-2xl ${assignment.status === "PUBLISHED" ? "text-violet-500" : "text-slate-400"}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-900 leading-tight truncate">{assignment.title}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                {assignment.courseTitle}
                {assignment.moduleName && (
                  <span className="text-slate-400"> / {assignment.moduleName}</span>
                )}
              </p>
              {assignment.description && (
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {assignment.description}
                </p>
              )}
            </div>

            {/* Status + menu */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${sc.color}`}>
                {sc.label}
              </span>
              <div className="relative">
                <button onClick={() => setMenuOpen(v => !v)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
                  <MdMoreVert />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-9 z-20 w-44 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                      <button onClick={() => { onEdit(assignment); setMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-left">
                        <FaEdit className="text-violet-400 w-3 h-3" /> Edit Assignment
                      </button>
                      <button onClick={() => { onViewSubmissions(assignment); setMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-left">
                        <MdVisibility className="text-blue-400 w-3.5 h-3.5" /> View Submissions
                      </button>
                      <div className="border-t border-slate-100" />
                      <button onClick={() => { onDelete(assignment); setMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition text-left">
                        <FaTrash className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats footer */}
      <div className="border-t border-slate-100 px-5 py-3 grid grid-cols-4 gap-3 bg-slate-50/50">
        {/* Due date */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isOverdue ? "bg-red-50" : "bg-slate-100"}`}>
            <MdCalendarToday className={`text-sm ${isOverdue ? "text-red-500" : "text-slate-500"}`} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 font-medium leading-none">Due Date</p>
            <p className={`text-xs font-black leading-tight mt-0.5 ${isOverdue ? "text-red-500" : "text-slate-700"}`}>
              {dueDate
                ? dueDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                : "—"}
            </p>
          </div>
        </div>

        {/* Total Marks */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <MdStar className="text-amber-500 text-sm" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 font-medium leading-none">Marks</p>
            <p className="text-base font-black text-slate-700 leading-tight mt-0.5">{assignment.totalMarks}</p>
          </div>
        </div>

        {/* Submissions count + progress */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <MdPeople className="text-blue-500 text-sm" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 font-medium leading-none">Submissions</p>
            <p className="text-base font-black text-blue-600 leading-tight mt-0.5">{total}</p>
          </div>
        </div>

        {/* Graded/pending + CTA */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 font-medium leading-none">Graded</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-base font-black text-emerald-600 leading-tight">{graded}</p>
              {pending > 0 && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                  {pending} left
                </span>
              )}
            </div>
            {total > 0 && (
              <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(graded / total) * 100}%` }} />
              </div>
            )}
          </div>
          <button onClick={() => onViewSubmissions(assignment)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded-lg hover:bg-violet-100 transition flex-shrink-0">
            <MdVisibility className="text-sm" /> View
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   Fetch strategy:
     • GET /api/instructor/assignments/modules/{moduleId}
       called for every module across every course.
     • Results are deduplicated by assignment id.
══════════════════════════════════════════════════════════ */
const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [courseFilter, setCourseFilter] = useState("ALL");

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [viewTarget, setViewTarget] = useState(null);

  /* ── Fetch all assignments by iterating modules ── */
  const fetchAll = useCallback(async () => {
    setLoading(true); setFetchError("");
    try {
      // 1. get courses
      const cRes = await instructorCourseApi.getInstructorCourses(0, 100);
      const courseList = extractList(cRes);
      setCourses(courseList);

      // 2. get modules for each course, then assignments for each module
      const allAssignments = await Promise.all(
        courseList.map(async (course) => {
          const mRes = await instructorModuleApi
            .getCourseModules(course.id, 0, 100)
            .catch(() => null);
          const modules = mRes?.data?.data?.content ?? mRes?.data?.content ?? extractList(mRes);

          const perModule = await Promise.all(
            modules.map(mod =>
              // GET /api/instructor/assignments/modules/{moduleId}
              instructorAssignmentApi
                .getByModule(mod.id)
                .then(r => extractList(r).map(raw => ({
                  ...normalizeAssignment(raw),
                  courseId: course.id,
                  courseTitle: course.title ?? course.name ?? "—",
                  moduleId: mod.id,
                  moduleName: mod.title,
                })))
                .catch(() => [])
            )
          );
          return perModule.flat();
        })
      );

      // 3. deduplicate
      const seen = new Set();
      const deduped = allAssignments.flat().filter(a => {
        if (seen.has(a.id)) return false;
        seen.add(a.id); return true;
      });
      setAssignments(deduped);
    } catch (err) {
      console.error("Failed to load assignments", err);
      setFetchError("Couldn't load assignments. Please try again.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Stats ── */
  const total = assignments.length;
  const published = assignments.filter(a => a.status === "PUBLISHED").length;
  const draft = assignments.filter(a => a.status === "DRAFT").length;
  const totalSubmissions = assignments.reduce((s, a) => s + (a.submissionCount ?? 0), 0);
  const pendingGrading = assignments.reduce(
    (s, a) => s + Math.max(0, (a.submissionCount ?? 0) - (a.gradedCount ?? 0)), 0
  );

  /* ── Filtered list ── */
  const tabMap = {
    all: () => true,
    published: a => a.status === "PUBLISHED",
    draft: a => a.status === "DRAFT",
    closed: a => a.status === "CLOSED",
  };
  const filtered = assignments
    .filter(tabMap[activeTab] ?? (() => true))
    .filter(a => courseFilter === "ALL" || String(a.courseId) === String(courseFilter))
    .filter(a =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      (a.moduleName ?? "").toLowerCase().includes(search.toLowerCase())
    );

  /* ── Delete ── */
  const handleDelete = async () => {
    setDeleting(true);
    try {
      // DELETE /api/instructor/assignments/{assignmentId}
      await instructorAssignmentApi.delete(deleteTarget.id);
      setAssignments(p => p.filter(a => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Couldn't delete. Please try again.");
    } finally { setDeleting(false); }
  };

  const tabs = [
    { id: "all", label: "All", count: total },
    { id: "published", label: "Published", count: published },
    { id: "draft", label: "Draft", count: draft },
    { id: "closed", label: "Closed", count: assignments.filter(a => a.status === "CLOSED").length },
  ];

  const statCards = [
    { label: "Total Assignments", value: total, icon: <MdOutlineAssignment />, bg: "bg-violet-50", color: "text-violet-500" },
    { label: "Published", value: published, icon: <MdCheckCircle />, bg: "bg-emerald-50", color: "text-emerald-500" },
    { label: "Total Submissions", value: totalSubmissions, icon: <MdPeople />, bg: "bg-blue-50", color: "text-blue-500" },
    { label: "Pending Grading", value: pendingGrading, icon: <MdPending />, bg: "bg-amber-50", color: "text-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] antialiased">
      <div className="max-w-5xl mx-auto px-5 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="text-sm text-gray-400">
                        <Link to="/instructor/dashboard" className="hover:text-violet-600 transition text-sm">Dashboard</Link>
                        <span className="mx-2 text-sm">&gt;</span>
                        <span className="text-gray-600 font-medium text-sm">Assignments</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assignments</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Create assignments, review submissions, and grade student work
            </p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-violet-200 flex-shrink-0">
            <MdAdd className="text-lg" /> Add Assignment
          </button>
        </div>

        {/* Error */}
        {fetchError && (
          <div className="flex items-center justify-between gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-xs font-semibold">
            <span className="flex items-center gap-2"><MdErrorOutline className="flex-shrink-0" /> {fetchError}</span>
            <button onClick={fetchAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 rounded-lg hover:bg-rose-100 transition flex-shrink-0">
              <MdRefresh /> Retry
            </button>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${s.bg} ${s.color} flex-shrink-0`}>
                {s.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{s.label}</p>
                <p className="text-2xl font-black text-slate-900 leading-none mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + filter + search */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}>
                {tab.label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}
              className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition">
              <option value="ALL">All Courses</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title || c.name}</option>)}
            </select>
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition w-44" />
            </div>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-36 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4">
              <MdOutlineAssignment className="text-slate-300 text-3xl" />
            </div>
            <p className="text-sm font-black text-slate-700 mb-1">
              {search || courseFilter !== "ALL" ? "No assignments match your filters" : "No assignments yet"}
            </p>
            <p className="text-xs text-slate-400 mb-5">
              {search || courseFilter !== "ALL" ? "Try a different filter or search term" : "Create your first assignment to get started"}
            </p>
            {!search && courseFilter === "ALL" && (
              <button onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition shadow-sm">
                <MdAdd className="text-base" /> Create First Assignment
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => (
              <AssignmentCard key={a.id} assignment={a}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
                onViewSubmissions={setViewTarget} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <AssignmentModal courses={courses}
          onClose={() => setShowCreate(false)} onSaved={fetchAll} />
      )}
      {editTarget && (
        <AssignmentModal courses={courses} initialData={editTarget}
          onClose={() => setEditTarget(null)} onSaved={fetchAll} />
      )}
      {deleteTarget && (
        <DeleteModal assignment={deleteTarget} deleting={deleting}
          onClose={() => !deleting && setDeleteTarget(null)} onConfirm={handleDelete} />
      )}
      {viewTarget && (
        <SubmissionsModal assignment={viewTarget}
          onClose={() => setViewTarget(null)} />
      )}
    </div>
  );
};

export default Assignments;
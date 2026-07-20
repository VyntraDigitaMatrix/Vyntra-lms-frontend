import React, { useState, useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { instructorCourseApi, instructorModuleApi, instructorLessonApi, instructorAssignmentApi } from "../../auth/api";
import { EMPTY_FORM, ASSIGNMENT_TYPES, extractList } from "./utils";

export default function AssignmentModal({ editData, onClose, onSaved }) {
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

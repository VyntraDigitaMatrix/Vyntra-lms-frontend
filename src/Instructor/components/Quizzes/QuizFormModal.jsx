import React, { useState, useEffect } from "react";
import { MdOutlineAddCircle, MdClose, MdErrorOutline, MdCheckCircle } from "react-icons/md";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { instructorModuleApi, instructorLessonApi, instructorQuizApi } from "../../auth/api";
import { extractList, extractObj } from "./utils";

const QuizFormModal = ({ mode = "create", courses, initialData, onClose, onSaved }) => {
    const isEditMode = mode === "edit";
    const [form, setForm] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        courseId: initialData?.courseId ? String(initialData.courseId) : "",
        courseSlug: initialData?.courseSlug || "",
        moduleId: initialData?.moduleId ? String(initialData.moduleId) : "",
        moduleSlug: initialData?.moduleSlug || "",
        lessonId: initialData?.lessonId ? String(initialData.lessonId) : "",
        lessonSlug: initialData?.lessonSlug || "",
        type: initialData?.type || "COURSE",
        duration: initialData?.duration || 40,
        totalMarks: initialData?.totalMarks || 30,
        maxAttempts: initialData?.maxAttempts || 3,
        passingScore: initialData?.passingScore || 18,
        published: initialData?.published ?? false,
        resumeAllowed: initialData?.resumeAllowed ?? true,
        autoSubmitOnDisconnect: initialData?.autoSubmitOnDisconnect ?? true,
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [modules, setModules] = useState([]);
    const [lessons, setLessons] = useState([]);

    const up = (k, v) => setForm(p => ({ ...p, [k]: v }));

    useEffect(() => {
        if (!form.courseSlug) { setModules([]); return; }
        instructorModuleApi.getCourseModules(form.courseSlug, 0, 100)
            .then(res => setModules(extractList(res)))
            .catch(console.error);
    }, [form.courseSlug]);

    useEffect(() => {
        if (!form.moduleSlug) { setLessons([]); return; }
        instructorLessonApi.getModuleLessons(form.moduleSlug, 0, 100)
            .then(res => setLessons(extractList(res)))
            .catch(console.error);
    }, [form.moduleSlug]);

    const handleSave = async () => {
        if (!form.title.trim()) { setError("Quiz title is required."); return; }
        if (!form.courseId) { setError("Please select a course."); return; }
        if (form.type === "MODULE" && !form.moduleId) { setError("Please select a module."); return; }
        if (form.type === "LESSON" && (!form.moduleId || !form.lessonId)) { setError("Please select a module and a lesson."); return; }

        setSaving(true);
        setError("");

        try {
            const payload = {
                title: form.title.trim(),
                description: form.description.trim(),
                quizType: form.type,
                totalMarks: Number(form.totalMarks),
                passingMarks: Number(form.passingScore),
                durationInMinutes: Number(form.duration),
                maxAttempts: Number(form.maxAttempts),
                resumeAllowed: form.resumeAllowed ?? true,
                autoSubmitOnDisconnect: form.autoSubmitOnDisconnect ?? true,
            };

            if (form.type === "COURSE") {
                payload.courseId = form.courseId;
            } else if (form.type === "MODULE") {
                payload.courseId = form.courseId;
                payload.moduleId = form.moduleId;
            } else if (form.type === "LESSON") {
                payload.courseId = form.courseId;
                payload.moduleId = form.moduleId;
                payload.lessonId = form.lessonId;
            }

            let savedSlug = initialData?.slug ?? null;
            let savedData = {};

            if (savedSlug) {
                const res = await instructorQuizApi.updateQuiz(savedSlug, payload);
                savedData = extractObj(res);
            } else {
                const res = await instructorQuizApi.createQuiz(payload);
                savedData = extractObj(res);
                savedSlug = savedData.slug ?? savedData.quizSlug ?? savedData.id ?? savedData.quizId;
                if (!savedSlug) throw new Error("Quiz created but no slug/id returned from API.");
            }

            onSaved({
                ...savedData,
                id: savedData.id ?? initialData?.id,
                slug: savedSlug,
                title: form.title.trim(),
                isNew: !isEditMode,
            });
            onClose();
        } catch (err) {
            console.error("Quiz save failed:", err?.response?.data || err);
            const data = err?.response?.data;
            const detail = data?.message || data?.error ||
                (Array.isArray(data?.errors) && data.errors.map(e => e.defaultMessage || e.message).join(", ")) ||
                (typeof data === "string" ? data : null);
            setError(detail || "Couldn't save the quiz. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#043573]/30 focus:border-blue-400 transition bg-white placeholder-slate-400";
    const labelCls = "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-[#043573] to-blue-900 rounded-t-2xl flex-shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                        <MdOutlineAddCircle className="text-white text-lg" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-sm font-black text-white">{isEditMode ? "Edit Quiz Details" : "Create New Quiz"}</h2>
                        <p className="text-[11px] text-blue-200 mt-0.5">
                            {isEditMode ? "Update quiz settings — questions are managed separately" : "Set up the quiz — you'll add questions next"}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition">
                        <MdClose />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    <div>
                        <label className={labelCls}>Quiz Title *</label>
                        <input className={inputCls} placeholder="e.g. React Fundamentals Assessment"
                            value={form.title} onChange={e => up("title", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Description</label>
                        <textarea className={inputCls} rows={2} placeholder="Brief description of this quiz…"
                            value={form.description} onChange={e => up("description", e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Course *</label>
                            <select className={inputCls} value={form.courseId}
                                onChange={e => {
                                    const selected = courses.find(c => String(c.id) === e.target.value);
                                    up("courseId", e.target.value);
                                    up("courseSlug", selected?.slug ?? selected?.courseSlug ?? "");
                                    up("moduleId", ""); up("moduleSlug", "");
                                    up("lessonId", ""); up("lessonSlug", "");
                                }}>
                                <option value="">Select a course</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.title || c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Quiz Type</label>
                            <select className={inputCls} value={form.type}
                                onChange={e => {
                                    up("type", e.target.value);
                                    up("moduleId", ""); up("moduleSlug", "");
                                    up("lessonId", ""); up("lessonSlug", "");
                                }}>
                                <option value="COURSE">Course-level Quiz</option>
                                <option value="MODULE">Module-level Quiz</option>
                                <option value="LESSON">Lesson-level Quiz</option>
                            </select>
                        </div>

                        {(form.type === "MODULE" || form.type === "LESSON") && (
                            <div className="col-span-2">
                                <label className={labelCls}>Module *</label>
                                <select className={inputCls} value={form.moduleId}
                                    onChange={e => {
                                        const selected = modules.find(m => String(m.id) === e.target.value);
                                        up("moduleId", e.target.value);
                                        up("moduleSlug", selected?.slug ?? selected?.moduleSlug ?? "");
                                        up("lessonId", ""); up("lessonSlug", "");
                                    }}>
                                    <option value="">Select Module</option>
                                    {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                                </select>
                            </div>
                        )}

                        {form.type === "LESSON" && form.moduleSlug && (
                            <div className="col-span-2">
                                <label className={labelCls}>Lesson *</label>
                                <select className={inputCls} value={form.lessonId}
                                    onChange={e => {
                                        const selected = lessons.find(l => String(l.id) === e.target.value);
                                        up("lessonId", e.target.value);
                                        up("lessonSlug", selected?.lessonSlug ?? selected?.slug ?? "");
                                    }}>
                                    <option value="">Select Lesson</option>
                                    {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                            <label className={labelCls}>Total Marks</label>
                            <input type="number" className={inputCls} min={1} value={form.totalMarks}
                                onChange={e => up("totalMarks", Number(e.target.value))} />
                        </div>
                        <div>
                            <label className={labelCls}>Duration (mins)</label>
                            <input type="number" className={inputCls} min={5} max={300} value={form.duration}
                                onChange={e => up("duration", Number(e.target.value))} />
                        </div>
                        <div>
                            <label className={labelCls}>Max Attempts</label>
                            <input type="number" className={inputCls} min={1} max={10} value={form.maxAttempts}
                                onChange={e => up("maxAttempts", Number(e.target.value))} />
                        </div>
                        <div>
                            <label className={labelCls}>Passing Marks</label>
                            <input type="number" className={inputCls} min={0} value={form.passingScore}
                                onChange={e => up("passingScore", Number(e.target.value))} />
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 p-3.5 rounded-xl border ${form.published ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
                        <button type="button" onClick={() => up("published", !form.published)}
                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${form.published ? "bg-emerald-500" : "bg-slate-300"}`}>
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.published ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                        <div className="flex-1">
                            <p className={`text-xs font-bold ${form.published ? "text-emerald-700" : "text-slate-700"}`}>
                                {form.published ? "Published — visible to students" : "Draft — only you can see this"}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                                {form.published ? "Students can attempt this quiz now" : "Toggle to publish when ready, then click Save"}
                            </p>
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border flex-shrink-0 ${form.published ? "text-emerald-700 bg-emerald-100 border-emerald-200" : "text-amber-700 bg-amber-50 border-amber-200"}`}>
                            {form.published ? <FaLockOpen className="text-[9px]" /> : <FaLock className="text-[9px]" />}
                            {form.published ? "Published" : "Draft"}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
                    {error && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-[11px] font-semibold">
                            <MdErrorOutline className="text-sm flex-shrink-0" /> {error}
                            <button onClick={() => setError("")} className="ml-auto flex-shrink-0"><MdClose className="text-xs" /></button>
                        </div>
                    )}
                    <div className="flex items-center justify-between gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition bg-white">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving || !form.title.trim() || !form.courseId}
                            className="flex items-center gap-2 px-5 py-2 bg-[#043573] hover:bg-blue-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-sm">
                            {saving ? <AiOutlineLoading3Quarters className="animate-spin" /> : <MdCheckCircle />}
                            {saving ? "Saving…" : isEditMode ? "Save Changes" : "Create Quiz"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizFormModal;

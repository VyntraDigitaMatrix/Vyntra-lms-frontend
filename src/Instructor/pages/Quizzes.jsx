import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    instructorQuizApi,
    instructorCourseApi,
    instructorModuleApi,
    instructorLessonApi,
    instructorQuizQuestionApi,
    instructorQuizOptionApi,
    instructorQuizAnalyticsApi,
} from "../auth/api";
import {
    MdOutlineQuiz, MdAdd, MdBarChart,
    MdCheckCircle, MdMoreVert,
    MdClose, MdSearch, MdFilterList, MdPeople, MdTimer,
    MdQuiz, MdOutlineAddCircle, MdErrorOutline, MdRefresh,
    MdMenuBook, MdViewModule, MdPlayCircleOutline, MdEdit,
    MdHelpOutline, MdListAlt,
} from "react-icons/md";
import {
    FaTrophy, FaChevronRight, FaTrash, FaEdit,
    FaPlus, FaCheck, FaLock, FaLockOpen,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

/* ══════════════════════════════════════════════════════════
   RESPONSE HELPERS
══════════════════════════════════════════════════════════ */
const extractList = (res) => {
    const body = res?.data?.data ?? res?.data;
    if (!body) return [];
    if (Array.isArray(body)) return body;
    if (Array.isArray(body?.content)) return body.content;
    if (typeof body === 'object' && body !== null && body.id) return [body];
    return [];
};

const extractObj = (res) => res?.data?.data ?? res?.data ?? {};

const resolveStatus = (raw) => {
    if (raw.quizStatus === "ARCHIVED" || raw.status === "ARCHIVED") return "archived";
    if (raw.published === true ||
        raw.isPublished === true ||
        raw.quizStatus === "PUBLISHED" ||
        raw.status === "PUBLISHED" ||
        raw.status === "ACTIVE") return "active";
    return "draft";
};

const normalizeQuiz = (raw, course) => {
    const status = resolveStatus(raw);
    const published = status === "active";
    const questionCount =
        raw.questionCount ?? raw.totalQuestions ?? raw.noOfQuestions ??
        raw.questionsCount ?? (Array.isArray(raw.questions) ? raw.questions.length : null) ?? 0;
    const duration = raw.durationInMinutes ?? raw.duration ?? raw.durationMinutes ?? raw.timeLimit ?? 0;
    return {
        id: raw.id ?? raw.quizId,
        slug: raw.slug ?? raw.quizSlug,
        title: raw.title ?? raw.name ?? "Untitled Quiz",
        description: raw.description ?? "",
        course: course?.title ?? course?.name ?? raw.courseTitle ?? "—",
        courseId: course?.id ?? raw.courseId ?? null,
        courseSlug: course?.slug ?? course?.courseSlug ?? raw.courseSlug ?? null,
        moduleId: raw.moduleId ?? null,
        moduleSlug: raw.moduleSlug ?? null,
        moduleName: raw.moduleTitle ?? raw.moduleName ?? null,
        lessonId: raw.lessonId ?? null,
        lessonSlug: raw.lessonSlug ?? null,
        lessonName: raw.lessonTitle ?? raw.lessonName ?? null,
        type: raw.type ?? raw.quizType ?? "COURSE",
        questions: questionCount,
        duration,
        attempts: raw.attemptCount ?? raw.totalAttempts ?? 0,
        avgScore: raw.avgScore ?? raw.averageScore ?? 0,
        published,
        status,
        maxAttempts: raw.maxAttempts ?? 0,
        totalStudents: raw.totalStudents ?? course?.enrolledStudents ?? course?.studentsCount ?? 0,
        totalMarks: raw.totalMarks ?? raw.maxScore ?? 30,
        passingScore: raw.passingMarks ?? raw.passingScore ?? 18,
        resumeAllowed: raw.resumeAllowed ?? true,
        autoSubmitOnDisconnect: raw.autoSubmitOnDisconnect ?? true,
        _raw: raw,
    };
};

const parseOptions = (rawOpts) => {
    if (!Array.isArray(rawOpts) || rawOpts.length === 0) return [];
    return [...rawOpts].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
};

const parseQuestion = (q) => {
    const opts = parseOptions(q.options ?? q.optionList ?? []);
    return {
        id: q.id ?? q.questionId,
        question: q.questionText ?? q.question ?? q.text ?? "",
        explanation: q.explanation ?? q.explanationText ?? "",
        marks: q.marks ?? q.marksPerQuestion ?? 1,
        sortOrder: q.sortOrder ?? 0,
        optionObjects: opts,
    };
};

const fetchQuestionsWithOptions = async (quizSlug) => {
    const res = await instructorQuizQuestionApi.getQuizQuestions(quizSlug);
    const body = res?.data?.data ?? res?.data;
    const raw = Array.isArray(body) ? body
        : Array.isArray(body?.content) ? body.content
            : Array.isArray(body?.questions) ? body.questions
                : [];

    const questions = await Promise.all(raw.map(async (q) => {
        let parsed = parseQuestion(q);
        if (parsed.optionObjects.length === 0 && parsed.id) {
            try {
                const optRes = await instructorQuizOptionApi.getQuestionOptions(parsed.id);
                const optBody = optRes?.data?.data ?? optRes?.data;
                const optList = Array.isArray(optBody) ? optBody
                    : Array.isArray(optBody?.content) ? optBody.content : [];
                parsed = { ...parsed, optionObjects: parseOptions(optList) };
            } catch {
            }
        }
        return parsed;
    }));

    return questions.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
};

const blankQuestion = () => ({ question: "", explanation: "", marks: 1 });

const QuestionEditor = ({ question, onChange, onCancel, onSave, saving, label, saveLabel }) => {
    const inp = "w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition bg-white placeholder-slate-400";
    const up = (k, v) => onChange({ ...question, [k]: v });

    return (
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50/60 to-white p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-violet-100 flex items-center justify-center">
                        <MdHelpOutline className="text-violet-600 text-xs" />
                    </div>
                    <p className="text-xs font-black text-violet-700 uppercase tracking-wide">{label ?? "New Question"}</p>
                </div>
                {onCancel && (
                    <button onClick={onCancel} className="w-6 h-6 rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 flex items-center justify-center transition">
                        <MdClose className="text-xs" />
                    </button>
                )}
            </div>

            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Question *</label>
                <textarea className={inp + " resize-none"} rows={2} placeholder="Type your question here…"
                    value={question.question} onChange={e => up("question", e.target.value)} />
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Explanation (optional)</label>
                    <input className={inp} placeholder="Why is this the correct answer?"
                        value={question.explanation} onChange={e => up("explanation", e.target.value)} />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Marks</label>
                    <input type="number" min={1} className={inp} placeholder="1"
                        value={question.marks} onChange={e => up("marks", Number(e.target.value))} />
                </div>
            </div>

            {onSave && (
                <button onClick={onSave} disabled={saving || !question.question.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition">
                    {saving ? <AiOutlineLoading3Quarters className="animate-spin text-xs" /> : <FaCheck className="text-[9px]" />}
                    {saving ? "Saving…" : (saveLabel ?? "Save Question")}
                </button>
            )}
        </div>
    );
};

const OptionRow = ({ option, isCorrect, onSave, onDelete }) => {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(option.optionText ?? option.text ?? "");
    const [correct, setCorrect] = useState(isCorrect);
    const [sortOrder, setSortOrder] = useState(option.sortOrder ?? 1);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        setText(option.optionText ?? option.text ?? "");
        setCorrect(isCorrect);
        setSortOrder(option.sortOrder ?? 1);
    }, [option, isCorrect]);

    const handleSave = async () => {
        if (!text.trim()) return;
        setSaving(true);
        try {
            await onSave(text.trim(), correct, Number(sortOrder) || 1);
            setEditing(false);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this option?")) return;
        setDeleting(true);
        try {
            await onDelete();
        } finally {
            setDeleting(false);
        }
    };

    if (editing) {
        return (
            <div className="flex items-center gap-2 p-2 bg-white border border-violet-200 rounded-xl">
                <input
                    autoFocus
                    className="flex-1 text-xs text-slate-700 bg-transparent border-0 focus:outline-none focus:ring-0"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSave()}
                />
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Order</span>
                    <input
                        type="number"
                        className="w-12 text-xs text-center border border-slate-200 rounded p-1"
                        value={sortOrder}
                        onChange={e => setSortOrder(e.target.value)}
                        min="1"
                    />
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer flex-shrink-0 ml-2">
                    <input type="checkbox" checked={correct} onChange={e => setCorrect(e.target.checked)}
                        className="w-3.5 h-3.5 accent-emerald-500 rounded-sm cursor-pointer" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Correct</span>
                </label>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button disabled={saving || !text.trim()} onClick={handleSave}
                    className="px-3 py-1.5 text-[10px] font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg disabled:opacity-50 transition">
                    {saving ? "Saving…" : "Save"}
                </button>
                <button disabled={saving} onClick={() => setEditing(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                    <MdClose className="text-sm" />
                </button>
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border transition ${isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex items-center gap-2 min-w-0">
                <span className="flex-shrink-0 text-[10px] font-bold text-slate-400 w-4 text-center">
                    {option.sortOrder ?? 1}
                </span>
                <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5 min-w-0">
                    {isCorrect && <FaCheck className="text-emerald-500 text-[9px] flex-shrink-0" />}
                    <span className="truncate">{option.optionText ?? option.text}</span>
                </span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setEditing(true)}
                    className="w-6 h-6 rounded-lg bg-violet-50 text-violet-500 hover:bg-violet-100 flex items-center justify-center transition">
                    <MdEdit className="text-xs" />
                </button>
                <button onClick={handleDelete} disabled={deleting}
                    className="w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition disabled:opacity-50">
                    {deleting ? <AiOutlineLoading3Quarters className="animate-spin text-[9px]" /> : <FaTrash className="text-[9px]" />}
                </button>
            </div>
        </div>
    );
};

const InlineOptionEditor = ({ questionId, existingOptions, sortOrder: initialSortOrder, onSaveSuccess, onCancel }) => {
    const [optText, setOptText] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [sortOrder, setSortOrder] = useState(initialSortOrder || 1);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!optText.trim()) return;
        setSaving(true);
        try {
            // Use POST /bulk for adding new options, because PUT doesn't support creation.
            await instructorQuizOptionApi.bulkCreateOptions(questionId, [{
                optionText: optText.trim(),
                correct: isCorrect,
                sortOrder: Number(sortOrder) || 1,
            }]);
            onSaveSuccess();
        } catch (err) {
            console.error("Save option failed", err);
            alert("Failed to save option.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex items-center gap-2 p-2 bg-violet-50/50 border border-violet-200 border-dashed rounded-xl mt-2">
            <input
                autoFocus
                placeholder="Option text..."
                className="flex-1 text-xs text-slate-700 bg-transparent border-0 focus:outline-none focus:ring-0"
                value={optText}
                onChange={e => setOptText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSave()}
            />
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Order</span>
                <input
                    type="number"
                    className="w-12 text-xs text-center border border-slate-200 rounded p-1"
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                    min="1"
                />
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer flex-shrink-0 ml-2">
                <input type="checkbox" checked={isCorrect} onChange={e => setIsCorrect(e.target.checked)}
                    className="w-3.5 h-3.5 accent-emerald-500 rounded-sm" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Correct</span>
            </label>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button disabled={saving || !optText.trim()} onClick={handleSave}
                className="px-3 py-1.5 text-[10px] font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg disabled:opacity-50 transition">
                {saving ? "Saving..." : "Save"}
            </button>
            <button disabled={saving} onClick={onCancel}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                <MdClose className="text-sm" />
            </button>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   QUIZ FORM MODAL — metadata ONLY. No questions/options here.
   Used for both Create and Edit.
══════════════════════════════════════════════════════════ */
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
                savedSlug = savedData.slug ?? savedData.quizSlug;
                if (!savedSlug) throw new Error("Quiz created but no slug returned from API.");
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

    const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition bg-white placeholder-slate-400";
    const labelCls = "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-2xl flex-shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                        <MdOutlineAddCircle className="text-white text-lg" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-sm font-black text-white">{isEditMode ? "Edit Quiz Details" : "Create New Quiz"}</h2>
                        <p className="text-[11px] text-violet-200 mt-0.5">
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
                            className="flex items-center gap-2 px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-sm">
                            {saving ? <AiOutlineLoading3Quarters className="animate-spin" /> : <MdCheckCircle />}
                            {saving ? "Saving…" : isEditMode ? "Save Changes" : "Create Quiz"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   QUESTIONS MANAGER MODAL — separate from quiz metadata.
   Questions and options are each managed independently:
   every add/edit/delete hits the API immediately.
══════════════════════════════════════════════════════════ */
const QuestionsManagerModal = ({ quiz, onClose }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [newQ, setNewQ] = useState(blankQuestion());
    const [addingQuestion, setAddingQuestion] = useState(false);

    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editDraft, setEditDraft] = useState(null);
    const [savingQuestion, setSavingQuestion] = useState(false);

    const [addingOptionForQuestionId, setAddingOptionForQuestionId] = useState(null);

    const loadQuestions = useCallback(async () => {
        if (!quiz?.slug) return;
        setLoading(true);
        try {
            const qs = await fetchQuestionsWithOptions(quiz.slug);
            setQuestions(qs);
        } catch (err) {
            console.error(err);
            setError("Failed to load questions.");
        } finally {
            setLoading(false);
        }
    }, [quiz?.slug]);

    useEffect(() => { loadQuestions(); }, [loadQuestions]);

    /* ── Question CRUD ── */
    /* ── Question CRUD ── */
    const handleAddQuestion = async () => {
        if (!newQ.question.trim()) { setError("Please enter a question."); return; }
        setAddingQuestion(true);
        setError("");
        try {
            const res = await instructorQuizQuestionApi.createQuestion(quiz.slug, {
                questionText: newQ.question.trim(),
                explanation: newQ.explanation?.trim() ?? "",
                marks: Number(newQ.marks || 1),
                sortOrder: questions.length + 1,
            });

            // Extract the new question's ID so we can open its option editor right away
            let created = res?.data?.data ?? res?.data;
            if (Array.isArray(created)) created = created[0];
            const newQuestionId = created?.id ?? created?.questionId ?? null;

            setNewQ(blankQuestion());
            await loadQuestions();

            // Auto-open "Add Option" for the question just created, instead of
            // leaving the user to hunt for it in the list
            if (newQuestionId) {
                setAddingOptionForQuestionId(newQuestionId);
            }
        } catch (err) {
            console.error("Add question failed:", err?.response?.data ?? err);
            setError(err?.response?.data?.message || "Failed to add question.");
        } finally {
            setAddingQuestion(false);
        }
    };
    const startEditQuestion = (q) => {
        setEditingQuestionId(q.id);
        setEditDraft({ question: q.question, explanation: q.explanation, marks: q.marks });
    };

    const handleSaveQuestionEdit = async (q) => {
        if (!editDraft?.question?.trim()) return;
        setSavingQuestion(true);
        setError("");
        try {
            await instructorQuizQuestionApi.updateQuestion(q.id, {
                questionText: editDraft.question.trim(),
                explanation: editDraft.explanation?.trim() ?? "",
                marks: Number(editDraft.marks || 1),
            });
            setEditingQuestionId(null);
            setEditDraft(null);
            await loadQuestions();
        } catch (err) {
            console.error("Update question failed:", err?.response?.data ?? err);
            setError(err?.response?.data?.message || "Failed to update question.");
        } finally {
            setSavingQuestion(false);
        }
    };

    const handleDeleteQuestion = async (q) => {
        if (!window.confirm("Delete this question and all its options?")) return;
        setError("");
        try {
            await instructorQuizQuestionApi.deleteQuestion(q.id);
            await loadQuestions();
        } catch (err) {
            console.error("Delete question failed:", err?.response?.data ?? err);
            setError("Failed to delete question.");
        }
    };

    /* ── Option CRUD (independent of question editing) ── */
    const handleUpdateOption = async (questionId, option, newText, newCorrect, newSortOrder) => {
        try {
            const question = questions.find(q => q.id === questionId);
            const existingOptions = question?.optionObjects || [];

            const payload = existingOptions.map(o => {
                if (o.id === option.id) {
                    return {
                        id: o.id,
                        optionId: o.id,
                        optionText: newText,
                        correct: newCorrect,
                        sortOrder: newSortOrder ?? o.sortOrder ?? 1,
                    };
                }
                return {
                    id: o.id,
                    optionId: o.id,
                    optionText: o.optionText ?? o.text,
                    correct: newCorrect ? false : (o.correct === true || o.isCorrect === true),
                    sortOrder: o.sortOrder ?? 1,
                };
            });

            await instructorQuizOptionApi.updateOptions(questionId, payload);
            await loadQuestions();
        } catch (err) {
            console.error("Update option failed:", JSON.stringify(err?.response?.data || err.message));
            setError(err?.response?.data?.message || "Failed to update option.");
        }
    };

    const handleDeleteOption = async (optionId) => {
        try {
            await instructorQuizOptionApi.deleteOption(optionId);
            await loadQuestions();
        } catch (err) {
            console.error("Delete option failed:", err?.response?.data ?? err);
            setError("Failed to delete option.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-2xl flex-shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                        <MdListAlt className="text-white text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-black text-white truncate">Manage Questions</h2>
                        <p className="text-[11px] text-violet-200 mt-0.5 truncate">{quiz?.title} · {questions.length} question{questions.length !== 1 ? "s" : ""}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition flex-shrink-0">
                        <MdClose />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    {loading && (
                        <div className="space-y-2">
                            {[1, 2].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
                        </div>
                    )}

                    {!loading && questions.length === 0 && (
                        <p className="text-[11px] text-slate-400 text-center py-4">
                            No questions yet — add your first question below.
                        </p>
                    )}

                    {!loading && questions.map((q, idx) => {
                        const isEditing = editingQuestionId === q.id;
                        return (
                            <div key={q.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                                {/* Question section */}
                                {isEditing ? (
                                    <QuestionEditor
                                        question={editDraft}
                                        label={`Edit Question ${idx + 1}`}
                                        saveLabel="Save Question"
                                        onChange={setEditDraft}
                                        onCancel={() => { setEditingQuestionId(null); setEditDraft(null); }}
                                        onSave={() => handleSaveQuestionEdit(q)}
                                        saving={savingQuestion}
                                    />
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 bg-violet-100 text-violet-600">
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-slate-800 leading-snug">{q.question}</p>
                                            {q.explanation && <p className="text-[11px] text-slate-400 mt-1">{q.explanation}</p>}
                                            <span className="inline-block text-[10px] text-slate-400 mt-1">{q.marks} mark{q.marks !== 1 ? "s" : ""}</span>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button onClick={() => startEditQuestion(q)}
                                                className="w-6 h-6 rounded-lg bg-violet-50 text-violet-500 hover:bg-violet-100 flex items-center justify-center transition">
                                                <MdEdit className="text-xs" />
                                            </button>
                                            <button onClick={() => handleDeleteQuestion(q)}
                                                className="w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition">
                                                <FaTrash className="text-[9px]" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Options section — fully separate UI */}
                                <div className="pl-9 space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Options</p>

                                    {q.optionObjects.length === 0 && addingOptionForQuestionId !== q.id && (
                                        <p className="text-[11px] text-slate-400">No options yet.</p>
                                    )}

                                    {q.optionObjects.map(opt => (
                                        <OptionRow
                                            key={opt.id}
                                            option={opt}
                                            isCorrect={opt.isCorrect === true || opt.correct === true}
                                            onSave={(text, correct, newSortOrder) => handleUpdateOption(q.id, opt, text, correct, newSortOrder)}
                                            onDelete={() => handleDeleteOption(opt.id)}
                                        />
                                    ))}

                                    {addingOptionForQuestionId === q.id ? (
                                        <InlineOptionEditor
                                            questionId={q.id}
                                            existingOptions={q.optionObjects || []}
                                            sortOrder={(q.optionObjects?.length || 0) + 1}
                                            onSaveSuccess={() => { setAddingOptionForQuestionId(null); loadQuestions(); }}
                                            onCancel={() => setAddingOptionForQuestionId(null)}
                                        />
                                    ) : (
                                        <button onClick={() => setAddingOptionForQuestionId(q.id)}
                                            className="flex items-center gap-1.5 text-[11px] font-bold text-violet-600 hover:text-violet-700 transition">
                                            <FaPlus className="text-[8px]" /> Add Option
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Add new question section — always at the bottom, separate from options entirely */}
                    {!loading && (
                        <div className="pt-2 space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-slate-200" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Add New Question</span>
                                <div className="flex-1 h-px bg-slate-200" />
                            </div>
                            <QuestionEditor question={newQ} onChange={setNewQ} />
                            <button type="button" onClick={handleAddQuestion}
                                disabled={addingQuestion || !newQ.question.trim()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition">
                                {addingQuestion
                                    ? <><AiOutlineLoading3Quarters className="animate-spin text-xs" /> Adding question…</>
                                    : <><FaPlus className="text-[9px]" /> Add Question</>}
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
                    {error && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-[11px] font-semibold">
                            <MdErrorOutline className="text-sm flex-shrink-0" /> {error}
                            <button onClick={() => setError("")} className="ml-auto flex-shrink-0"><MdClose className="text-xs" /></button>
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition">
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── DELETE MODAL ── */
const DeleteModal = ({ quiz, deleting, onClose, onConfirm }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-red-500 text-lg" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">Delete Quiz</h3>
            <p className="text-xs text-slate-500 mb-1">This will permanently delete</p>
            <p className="text-sm font-bold text-slate-800 mb-4">"{quiz?.title}"</p>
            <p className="text-[11px] text-slate-400 mb-5">All student attempts and scores will be removed. This cannot be undone.</p>
            <div className="flex gap-2">
                <button onClick={onClose} disabled={deleting}
                    className="flex-1 py-2.5 text-xs font-bold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition disabled:opacity-50">Cancel</button>
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
   QUIZ CARD — clicking the card opens the Questions Manager.
   Dropdown menu handles Edit Details / Manage Questions / Results / Delete.
══════════════════════════════════════════════════════════ */
const QuizCard = ({ quiz, onEditDetails, onManageQuestions, onDelete, onViewResults, onPublish, onArchive }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const s = quiz.status === "archived"
        ? { label: "Archived", color: "text-slate-600 bg-slate-100 border-slate-300" }
        : (quiz.status === "active" || quiz.published)
            ? { label: "Published", color: "text-emerald-700 bg-emerald-50 border-emerald-200" }
            : { label: "Draft", color: "text-amber-700 bg-amber-50 border-amber-200" };
    const typeColor = {
        LESSON: "bg-violet-50 text-violet-700 border-violet-200",
        COURSE: "bg-purple-50 text-purple-700 border-purple-200",
        MODULE: "bg-indigo-50 text-indigo-700 border-indigo-200",
    };
    const attemptRate = quiz.totalStudents > 0 ? Math.round((quiz.attempts / quiz.totalStudents) * 100) : 0;
    const scopeLabel = quiz.type === "MODULE" && quiz.moduleName ? quiz.moduleName
        : quiz.type === "LESSON" && quiz.lessonName ? quiz.lessonName : null;
    const qCount = quiz.questions ?? 0;

    const stop = (fn) => (e) => { e.stopPropagation(); fn(); };

    return (
        <div onClick={() => onManageQuestions(quiz)}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-violet-200 transition-all group cursor-pointer">
            <div className="flex items-start gap-4 p-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${s.label === "Published" ? "bg-violet-50 border-violet-100" : "bg-slate-50 border-slate-200"}`}>
                    <MdOutlineQuiz className={`text-2xl ${s.label === "Published" ? "text-violet-500" : "text-slate-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="text-sm font-black text-slate-900 leading-tight truncate">{quiz.title}</h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeColor[quiz.type] ?? typeColor.COURSE}`}>{quiz.type}</span>
                                <span className="text-[10px] text-slate-400">•</span>
                                <span className="text-[11px] text-slate-500 font-medium truncate">{quiz.course}</span>
                                {scopeLabel && (<><span className="text-[10px] text-slate-300">/</span><span className="text-[11px] text-slate-400 font-medium truncate">{scopeLabel}</span></>)}
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-medium flex-wrap">
                                <span className="flex items-center gap-1"><MdOutlineQuiz className="text-slate-400" />{qCount} Question{qCount !== 1 ? "s" : ""}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><MdTimer className="text-slate-400" />{quiz.duration > 0 ? `${quiz.duration} mins` : "—"}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><MdPeople className="text-slate-400" />{quiz.attempts} Attempt{quiz.attempts !== 1 ? "s" : ""}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.color}`}>{s.label}</span>
                            <div className="relative">
                                <button onClick={stop(() => setMenuOpen(v => !v))}
                                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
                                    <MdMoreVert />
                                </button>
                                {menuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={stop(() => setMenuOpen(false))} />
                                        <div className="absolute right-0 top-9 z-20 w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                                            <button onClick={stop(() => { onEditDetails(quiz); setMenuOpen(false); })}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-left">
                                                <FaEdit className="text-violet-400 w-3 h-3" /> Edit Details
                                            </button>
                                            <button onClick={stop(() => { onManageQuestions(quiz); setMenuOpen(false); })}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-left">
                                                <MdListAlt className="text-indigo-400 w-3.5 h-3.5" /> Manage Questions
                                            </button>
                                            <button onClick={stop(() => { onPublish(quiz); setMenuOpen(false); })}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-left">
                                                <MdCheckCircle className="text-emerald-400 w-3.5 h-3.5" /> Publish Quiz
                                            </button>
                                            <button onClick={stop(() => { onArchive(quiz); setMenuOpen(false); })}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-left">
                                                <FaLock className="text-amber-400 w-3 h-3" /> Archive Quiz
                                            </button>
                                            <div className="border-t border-slate-100" />
                                            <button onClick={stop(() => { onDelete(quiz); setMenuOpen(false); })}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition text-left">
                                                <FaTrash className="w-3 h-3" /> Delete Quiz
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-100 px-5 py-3 flex items-center gap-4 bg-slate-50/50 rounded-b-2xl">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${quiz.avgScore >= 60 ? "bg-emerald-50" : "bg-rose-50"}`}>
                        <FaTrophy className={`text-xs ${quiz.avgScore >= 60 ? "text-emerald-500" : "text-rose-400"}`} />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-medium">Avg Score</p>
                        <p className={`text-sm font-black ${quiz.avgScore >= 60 ? "text-emerald-600" : "text-rose-500"}`}>{Number(quiz.avgScore || 0).toFixed(1)}%</p>
                    </div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                        <MdPeople className="text-violet-400 text-sm" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-medium">Attempt Rate</p>
                        <p className="text-sm font-black text-violet-600">{attemptRate}%</p>
                    </div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-400 font-medium">Max Attempts</p>
                    <p className="text-sm font-black text-slate-700">{quiz.maxAttempts === 0 ? "Unlimited" : quiz.maxAttempts}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={stop(() => onViewResults(quiz))}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition">
                        <MdBarChart className="text-sm" /> Results
                    </button>
                    <button onClick={stop(() => onManageQuestions(quiz))}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded-xl hover:bg-violet-100 transition">
                        <MdListAlt className="text-[11px]" /> Questions
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
const Quizzes = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterLoading, setFilterLoading] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingQuizMeta, setEditingQuizMeta] = useState(null);
    const [managingQuestionsFor, setManagingQuestionsFor] = useState(null);
    const [deletingQuiz, setDeletingQuiz] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [typeFilter, setTypeFilter] = useState("ALL");
    const [courseFilter, setCourseFilter] = useState("ALL");
    const [moduleFilter, setModuleFilter] = useState("ALL");
    const [lessonFilter, setLessonFilter] = useState("ALL");
    const [filterModules, setFilterModules] = useState([]);
    const [filterLessons, setFilterLessons] = useState([]);
    const [scopedQuizzes, setScopedQuizzes] = useState(null);

    const fetchQuizzes = useCallback(async () => {
        setLoading(true);
        setFetchError("");
        try {
            const coursesRes = await instructorCourseApi.getInstructorCourses(0, 100);
            const courseList = extractList(coursesRes);
            setCourses(courseList);

            const all = await Promise.all(
                courseList.map(async (course) => {
                    const courseSlug = course.slug ?? course.courseSlug;
                    if (!courseSlug) return [];

                    const cq = await instructorQuizApi.getQuizzesByCourse(courseSlug, 0, 100)
                        .then(r => extractList(r).map(raw => normalizeQuiz(raw, course)))
                        .catch(() => []);

                    const mods = extractList(
                        await instructorModuleApi.getCourseModules(courseSlug, 0, 100).catch(() => null)
                    );

                    const mq = (await Promise.all(mods.map(async (mod) => {
                        const modSlug = mod.slug ?? mod.moduleSlug;
                        if (!modSlug) return [];
                        return instructorQuizApi.getQuizzesByModule(modSlug, 0, 50)
                            .then(r => extractList(r).map(raw => ({
                                ...normalizeQuiz(raw, course),
                                moduleId: mod.id,
                                moduleSlug: modSlug,
                                moduleName: mod.title,
                            })))
                            .catch(() => []);
                    }))).flat();

                    const lq = (await Promise.all(mods.map(async (mod) => {
                        const modSlug = mod.slug ?? mod.moduleSlug;
                        if (!modSlug) return [];
                        const lessons = extractList(
                            await instructorLessonApi.getModuleLessons(modSlug, 0, 100).catch(() => null)
                        );
                        return (await Promise.all(lessons.map(async (lesson) => {
                            const lessonSlug = lesson.slug ?? lesson.lessonSlug;
                            if (!lessonSlug) return [];
                            return instructorQuizApi.getQuizzesByLesson(lessonSlug, 0, 50)
                                .then(r => extractList(r).map(raw => ({
                                    ...normalizeQuiz(raw, course),
                                    lessonId: lesson.id,
                                    lessonSlug,
                                    lessonName: lesson.title,
                                })))
                                .catch(err => {
                                    if (err?.response?.status !== 404) console.warn("Lesson quiz fetch:", err?.message);
                                    return [];
                                });
                        }))).flat();
                    }))).flat();

                    return [...cq, ...mq, ...lq];
                })
            );

            const seen = new Set();
            setQuizzes(all.flat().filter(q => {
                if (seen.has(q.id)) return false;
                seen.add(q.id);
                return true;
            }));
        } catch (err) {
            console.error("Failed to load quizzes", err);
            setFetchError("Couldn't load your quizzes. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchQuizzes(); }, [fetchQuizzes]);

    useEffect(() => {
        setModuleFilter("ALL"); setFilterModules([]);
        if ((typeFilter !== "MODULE" && typeFilter !== "LESSON") || courseFilter === "ALL") return;
        const course = courses.find(c => String(c.id) === String(courseFilter));
        const slug = course?.slug ?? course?.courseSlug;
        if (!slug) return;
        instructorModuleApi.getCourseModules(slug, 0, 100)
            .then(r => setFilterModules(extractList(r))).catch(console.error);
    }, [typeFilter, courseFilter, courses]);

    useEffect(() => {
        setLessonFilter("ALL"); setFilterLessons([]);
        if (typeFilter !== "LESSON" || moduleFilter === "ALL") return;
        const mod = filterModules.find(m => String(m.id) === String(moduleFilter));
        const slug = mod?.slug ?? mod?.moduleSlug;
        if (!slug) return;
        instructorLessonApi.getModuleLessons(slug, 0, 100)
            .then(r => setFilterLessons(extractList(r))).catch(console.error);
    }, [typeFilter, moduleFilter, filterModules]);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            const course = courses.find(c => String(c.id) === String(courseFilter));
            const courseSlug = course?.slug ?? course?.courseSlug;

            if (typeFilter === "MODULE" && moduleFilter !== "ALL") {
                setFilterLoading(true);
                try {
                    const mod = filterModules.find(m => String(m.id) === String(moduleFilter));
                    const modSlug = mod?.slug ?? mod?.moduleSlug;
                    if (!modSlug) { if (!cancelled) setScopedQuizzes([]); return; }
                    const list = extractList(await instructorQuizApi.getQuizzesByModule(modSlug, 0, 100))
                        .map(raw => ({ ...normalizeQuiz(raw, course), moduleId: moduleFilter, moduleName: mod?.title ?? "" }));
                    if (!cancelled) setScopedQuizzes(list);
                } catch { if (!cancelled) setScopedQuizzes([]); }
                finally { if (!cancelled) setFilterLoading(false); }
                return;
            }
            if (typeFilter === "LESSON" && lessonFilter !== "ALL") {
                setFilterLoading(true);
                try {
                    const lesson = filterLessons.find(l => String(l.id) === String(lessonFilter));
                    const lessonSlug = lesson?.lessonSlug;
                    if (!lessonSlug) { if (!cancelled) setScopedQuizzes([]); return; }
                    const list = extractList(await instructorQuizApi.getQuizzesByLesson(lessonSlug, 0, 100))
                        .map(raw => ({ ...normalizeQuiz(raw, course), lessonId: lessonFilter, lessonName: lesson?.title ?? "" }));
                    if (!cancelled) setScopedQuizzes(list);
                } catch { if (!cancelled) setScopedQuizzes([]); }
                finally { if (!cancelled) setFilterLoading(false); }
                return;
            }
            if (typeFilter === "COURSE" && courseFilter !== "ALL") {
                setFilterLoading(true);
                try {
                    if (!courseSlug) { if (!cancelled) setScopedQuizzes([]); return; }
                    const list = extractList(await instructorQuizApi.getQuizzesByCourse(courseSlug, 0, 100))
                        .map(raw => normalizeQuiz(raw, course));
                    if (!cancelled) setScopedQuizzes(list);
                } catch { if (!cancelled) setScopedQuizzes([]); }
                finally { if (!cancelled) setFilterLoading(false); }
                return;
            }
            if (!cancelled) setScopedQuizzes(null);
        };
        load();
        return () => { cancelled = true; };
    }, [typeFilter, courseFilter, moduleFilter, lessonFilter, courses, filterModules, filterLessons]);

    const totalQuizzes = quizzes.length;
    const publishedCount = quizzes.filter(q => q.status === "active").length;
    const draftCount = quizzes.filter(q => q.status === "draft").length;
    const archivedCount = quizzes.filter(q => q.status === "archived").length;
    const totalAttempts = useMemo(() => quizzes.reduce((s, q) => s + (q.attempts || 0), 0), [quizzes]);
    const avgScore = useMemo(() => {
        const scored = quizzes.filter(q => (q.avgScore || 0) > 0);
        if (!scored.length) return 0;
        return Math.round((scored.reduce((s, q) => s + q.avgScore, 0) / scored.length) * 100) / 100;
    }, [quizzes]);

    const typeCounts = useMemo(() => ({
        ALL: quizzes.length,
        COURSE: quizzes.filter(q => q.type === "COURSE").length,
        MODULE: quizzes.filter(q => q.type === "MODULE").length,
        LESSON: quizzes.filter(q => q.type === "LESSON").length,
    }), [quizzes]);

    const tabFilter = {
        all: () => true,
        published: q => q.status === "active",
        draft: q => q.status === "draft",
        archived: q => q.status === "archived"
    };
    const baseList = scopedQuizzes ?? quizzes;
    const filtered = baseList
        .filter(tabFilter[activeTab] ?? (() => true))
        .filter(q => scopedQuizzes ? true : (typeFilter === "ALL" || q.type === typeFilter))
        .filter(q => scopedQuizzes ? true : (courseFilter === "ALL" || String(q.courseId) === String(courseFilter)))
        .filter(q => q.title.toLowerCase().includes(search.toLowerCase()) || q.course.toLowerCase().includes(search.toLowerCase()));

    const handleDelete = async () => {
        if (!deletingQuiz?.slug) {
            alert("Cannot delete: quiz slug not found.");
            return;
        }
        setDeleting(true);
        try {
            await instructorQuizApi.deleteQuiz(deletingQuiz.slug);
            setQuizzes(prev => prev.filter(q => q.id !== deletingQuiz.id));
            setScopedQuizzes(prev => prev ? prev.filter(q => q.id !== deletingQuiz.id) : prev);
            setDeletingQuiz(null);
        } catch (err) {
            alert(err?.response?.data?.message || "Couldn't delete the quiz.");
        } finally {
            setDeleting(false);
        }
    };

    const handlePublish = async (quiz) => {
        if (!quiz?.slug) return;
        try {
            await instructorQuizApi.publishQuiz(quiz.slug);
            fetchQuizzes();
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to publish quiz.");
        }
    };

    const handleArchive = async (quiz) => {
        if (!quiz?.slug) return;
        try {
            await instructorQuizApi.archiveQuiz(quiz.slug);
            fetchQuizzes();
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to archive quiz.");
        }
    };

    const handleDraft = async (quiz) => {
        if (!quiz?.slug) return;
        try {
            await instructorQuizApi.draftQuiz(quiz.slug);
            fetchQuizzes();
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to move quiz to draft.");
        }
    };


    // After Create or Edit of quiz metadata: refresh list.
    // If it was a brand-new quiz, immediately open the Questions Manager for it.
    const handleQuizFormSaved = (savedQuiz) => {
        fetchQuizzes();
        if (savedQuiz.isNew) {
            setManagingQuestionsFor({ id: savedQuiz.id, slug: savedQuiz.slug, title: savedQuiz.title });
        }
    };

    const handleTypeFilterChange = (t) => { setTypeFilter(t); setCourseFilter("ALL"); setModuleFilter("ALL"); setLessonFilter("ALL"); setScopedQuizzes(null); };
    const clearFilters = () => { setTypeFilter("ALL"); setCourseFilter("ALL"); setModuleFilter("ALL"); setLessonFilter("ALL"); setScopedQuizzes(null); };

    const tabs = [
        { id: "all", label: "All", count: totalQuizzes },
        { id: "published", label: "Published", count: publishedCount },
        { id: "draft", label: "Draft", count: draftCount },
        { id: "archived", label: "Archived", count: archivedCount },
    ];
    const typeFilters = [
        { id: "ALL", label: "All Types", icon: <MdFilterList /> },
        { id: "COURSE", label: "Course", icon: <MdMenuBook /> },
        { id: "MODULE", label: "Module", icon: <MdViewModule /> },
        { id: "LESSON", label: "Lesson", icon: <MdPlayCircleOutline /> },
    ];
    const statCards = [
        { label: "Total Quizzes", value: totalQuizzes, icon: <MdQuiz />, iconBg: "bg-violet-50", iconColor: "text-violet-500" },
        { label: "Published", value: publishedCount, icon: <MdCheckCircle />, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
        { label: "Total Attempts", value: totalAttempts, icon: <MdPeople />, iconBg: "bg-purple-50", iconColor: "text-purple-500" },
        { label: "Avg Score", value: avgScore.toFixed(1) + "%", icon: <FaTrophy />, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
    ];
    const isFiltering = typeFilter !== "ALL" || courseFilter !== "ALL";

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="max-w-7xl mx-auto px-5 py-8 space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="text-sm text-gray-400">
                        <Link to="/instructor/dashboard" className="hover:text-violet-600 transition text-sm">Dashboard</Link>
                        <span className="mx-2 text-sm">&gt;</span>
                        <span className="text-gray-600 font-medium text-sm">Quizzes</span>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-3">Quizzes</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Manage your assessments and track student performance</p>
                    </div>
                    <button onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-violet-200 flex-shrink-0">
                        <MdAdd className="text-lg" /> Add Quiz
                    </button>
                </div>

                {fetchError && (
                    <div className="flex items-center justify-between gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-xs font-semibold">
                        <span className="flex items-center gap-2"><MdErrorOutline className="flex-shrink-0" /> {fetchError}</span>
                        <button onClick={fetchQuizzes} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 rounded-lg hover:bg-rose-100 transition flex-shrink-0">
                            <MdRefresh /> Retry
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {statCards.map((s, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${s.iconBg} ${s.iconColor} flex-shrink-0`}>{s.icon}</div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{s.label}</p>
                                <p className="text-2xl font-black text-slate-900 leading-none mt-0.5">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5 mr-1">
                            <MdFilterList className="text-sm" /> Filter by:
                        </span>
                        {typeFilters.map(tf => (
                            <button key={tf.id} onClick={() => handleTypeFilterChange(tf.id)}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${typeFilter === tf.id ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"}`}>
                                <span className="text-sm">{tf.icon}</span>{tf.label}
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${typeFilter === tf.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{typeCounts[tf.id]}</span>
                            </button>
                        ))}
                        {isFiltering && <button onClick={clearFilters} className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 ml-1">Clear</button>}
                    </div>
                    {typeFilter !== "ALL" && (
                        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-100">
                            <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}
                                className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition">
                                <option value="ALL">Select Course…</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.title || c.name}</option>)}
                            </select>
                            {(typeFilter === "MODULE" || typeFilter === "LESSON") && courseFilter !== "ALL" && (
                                <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}
                                    className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition">
                                    <option value="ALL">Select Module…</option>
                                    {filterModules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                                </select>
                            )}
                            {typeFilter === "LESSON" && moduleFilter !== "ALL" && (
                                <select value={lessonFilter} onChange={e => setLessonFilter(e.target.value)}
                                    className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition">
                                    <option value="ALL">Select Lesson…</option>
                                    {filterLessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                                </select>
                            )}
                            {filterLoading && <span className="flex items-center gap-1.5 text-[11px] text-indigo-500 font-semibold"><AiOutlineLoading3Quarters className="animate-spin text-xs" /> Loading…</span>}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}>
                                {tab.label}
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{tab.count}</span>
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search quizzes…"
                            className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition w-56" />
                    </div>
                </div>

                {isFiltering && !filterLoading && (
                    <p className="text-[11px] text-slate-400 font-medium -mt-3">Showing {filtered.length} quiz{filtered.length !== 1 ? "zes" : ""}</p>
                )}

                {loading || filterLoading ? (
                    <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-white border border-slate-200 rounded-2xl animate-pulse" />)}</div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4">
                            <MdOutlineQuiz className="text-slate-300 text-3xl" />
                        </div>
                        <p className="text-sm font-black text-slate-700 mb-1">{search || isFiltering ? "No quizzes match your filters" : "No quizzes yet"}</p>
                        <p className="text-xs text-slate-400 mb-5">{search || isFiltering ? "Try a different filter or search term" : "Create your first quiz to get started"}</p>
                        {!search && !isFiltering && (
                            <button onClick={() => setIsCreateModalOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition shadow-sm">
                                <MdAdd className="text-base" /> Create First Quiz
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(quiz => (
                            <QuizCard key={quiz.id} quiz={quiz}
                                onEditDetails={q => setEditingQuizMeta(q)}
                                onManageQuestions={q => setManagingQuestionsFor(q)}
                                onDelete={setDeletingQuiz}
                                onPublish={handlePublish}
                                onArchive={handleArchive}
                                onDraft={handleDraft}
                                onViewResults={q => navigate(`/instructor/quiz/${q.slug}/results`)} />
                        ))}
                    </div>
                )}
            </div>

            {isCreateModalOpen && (
                <QuizFormModal mode="create" courses={courses}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSaved={handleQuizFormSaved} />
            )}
            {editingQuizMeta && (
                <QuizFormModal mode="edit" courses={courses} initialData={editingQuizMeta}
                    onClose={() => setEditingQuizMeta(null)}
                    onSaved={handleQuizFormSaved} />
            )}
            {managingQuestionsFor && (
                <QuestionsManagerModal
                    quiz={managingQuestionsFor}
                    onClose={() => { setManagingQuestionsFor(null); fetchQuizzes(); }} />
            )}
            {deletingQuiz && (
                <DeleteModal quiz={deletingQuiz} deleting={deleting}
                    onClose={() => !deleting && setDeletingQuiz(null)} onConfirm={handleDelete} />
            )}
        </div>
    );
};

export default Quizzes;
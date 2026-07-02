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
    MdHelpOutline, MdBugReport,
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
    if (Array.isArray(body)) return body;
    if (Array.isArray(body?.content)) return body.content;
    return [];
};

const extractObj = (res) => res?.data?.data ?? res?.data ?? {};

const resolvePublished = (raw) => {
    return (
        raw.published === true ||
        raw.isPublished === true ||
        raw.quizStatus === "PUBLISHED" ||
        raw.status === "PUBLISHED" ||
        raw.status === "ACTIVE"
    );
};

const normalizeQuiz = (raw, course) => {
    const published = resolvePublished(raw);
    console.log("Quiz Raw:", raw);
    console.log("Quiz Status:", raw.quizStatus);
    console.log("Published:", resolvePublished(raw));
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
        status: published ? "active" : "draft",
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
        _isNew: false,
        id: q.id ?? q.questionId,
        question: q.questionText ?? q.question ?? q.text ?? "",
        explanation: q.explanation ?? q.explanationText ?? "",
        marks: q.marks ?? q.marksPerQuestion ?? 1,
        sortOrder: q.sortOrder ?? 0,
        options: opts.length > 0
            ? opts.map(o => o.optionText ?? o.text ?? o.option ?? "")
            : ["", "", "", ""],
        correct: opts.length > 0
            ? Math.max(0, opts.findIndex(o => o.isCorrect === true || o.correct === true))
            : 0,
        optionObjects: opts,
    };
};

const createQuestionWithOptions = async (quizSlug, q, sortOrder = 1) => {
    const qRes = await instructorQuizQuestionApi.createQuestion(quizSlug, {
        questionText: q.question.trim(),
        explanation: q.explanation?.trim() ?? "",
        marks: q.marks ?? 1,
        sortOrder,
    });
    const qData = extractObj(qRes);
    const questionId = qData.id ?? qData.questionId;
    if (!questionId) throw new Error("createQuestion returned no ID");

    const validOptions = q.options
        .map((text, i) => ({ text: text?.trim() ?? "", idx: i }))
        .filter(o => o.text.length > 0);

    for (let pos = 0; pos < validOptions.length; pos++) {
        const { text, idx } = validOptions[pos];
        await instructorQuizOptionApi.createOption(questionId, {
            optionText: text,
            correct: idx === q.correct,
            isCorrect: idx === q.correct,
            sortOrder: pos + 1,
        });
    }

    return questionId;
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
                const opts = parseOptions(optList);
                parsed = {
                    ...parsed,
                    options: opts.length > 0 ? opts.map(o => o.optionText ?? o.text ?? "") : ["", "", "", ""],
                    correct: opts.length > 0 ? Math.max(0, opts.findIndex(o => o.isCorrect === true || o.correct === true)) : 0,
                    optionObjects: opts,
                };
            } catch {
                // leave with empty options
            }
        }
        return parsed;
    }));

    return questions;
};

/* BLANK QUESTION */
const blankQ = () => ({
    _isNew: true, id: null,
    question: "", explanation: "", marks: 1,
    options: ["", "", "", ""], correct: 0, optionObjects: [],
});

/* QUESTION EDITOR */
const QuestionEditor = ({ question, onChange, onCancel, onSave, saving, label }) => {
    const inp = "w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition bg-white placeholder-slate-400";
    const up = (k, v) => onChange({ ...question, [k]: v });
    const upOpt = (i, val) => { const o = [...question.options]; o[i] = val; up("options", o); };

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

            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Options</label>
                    <span className="text-[10px] text-slate-400">Click the circle to mark the correct answer</span>
                </div>
                <div className="space-y-2">
                    {question.options.map((opt, i) => (
                        <div key={i} className={`flex items-center gap-2 p-2 rounded-xl border transition ${i === question.correct ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200"}`}>
                            <button type="button" onClick={() => up("correct", i)}
                                title={`Mark option ${String.fromCharCode(65 + i)} as correct`}
                                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-black flex-shrink-0 transition ${i === question.correct ? "border-emerald-500 bg-emerald-500 text-white shadow-sm" : "border-slate-300 text-slate-500 hover:border-emerald-400 hover:text-emerald-500"}`}>
                                {i === question.correct ? <FaCheck /> : String.fromCharCode(65 + i)}
                            </button>
                            <input className={`flex-1 bg-transparent border-0 text-xs text-slate-700 placeholder-slate-400 focus:outline-none py-0.5 ${i === question.correct ? "font-semibold" : ""}`}
                                placeholder={`Option ${String.fromCharCode(65 + i)}${i === 0 ? " (e.g. True)" : i === 1 ? " (e.g. False)" : ""}`}
                                value={opt} onChange={e => upOpt(i, e.target.value)} />
                            {i === question.correct && (
                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md flex-shrink-0">CORRECT</span>
                            )}
                        </div>
                    ))}
                </div>
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
                    {saving ? "Saving…" : "Save Changes"}
                </button>
            )}
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   ADD / EDIT QUIZ MODAL
══════════════════════════════════════════════════════════ */
const AddQuizModal = ({ courses, initialData, onClose, onSave }) => {
    const isEditMode = Boolean(initialData);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        // Store courseSlug for API calls, courseId for display matching
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
        questions: [],
    });

    const [newQ, setNewQ] = useState(blankQ());
    const [editingIdx, setEditingIdx] = useState(null);
    const [qSaving, setQSaving] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [qLoading, setQLoading] = useState(false);
    const [modules, setModules] = useState([]);
    const [lessons, setLessons] = useState([]);

    const up = (k, v) => setForm(p => ({ ...p, [k]: v }));

    // Load existing questions when editing
    useEffect(() => {
        if (!isEditMode || !initialData?.slug) return;
        setQLoading(true);
        fetchQuestionsWithOptions(initialData.slug)
            .then(qs => setForm(p => ({ ...p, questions: qs })))
            .catch(err => { setError("Failed to load existing questions."); console.error(err); })
            .finally(() => setQLoading(false));
    }, [isEditMode, initialData?.slug]);

    // Load modules when courseSlug changes
    useEffect(() => {
        if (!form.courseSlug) { setModules([]); return; }
        instructorModuleApi.getCourseModules(form.courseSlug, 0, 100)
            .then(res => setModules(extractList(res)))
            .catch(console.error);
    }, [form.courseSlug]);

    // Load lessons when moduleSlug changes
    useEffect(() => {
        if (!form.moduleSlug) { setLessons([]); return; }
        instructorLessonApi.getModuleLessons(form.moduleSlug, 0, 100)
            .then(res => setLessons(extractList(res)))
            .catch(console.error);
    }, [form.moduleSlug]);

    const reloadQuestions = async (quizSlug) => {
        const qs = await fetchQuestionsWithOptions(quizSlug);
        setForm(p => ({ ...p, questions: qs }));
        return qs;
    };

    const handleAddQuestion = async () => {
        if (!newQ.question.trim()) { setError("Please enter a question."); return; }
        const filledOptions = newQ.options.filter(o => o?.trim());
        if (filledOptions.length < 2) { setError("Please fill in at least 2 options."); return; }

        const quizSlug = initialData?.slug;
        if (!quizSlug) {
            // New quiz — store locally, flush on save
            setForm(p => ({ ...p, questions: [...p.questions, { ...newQ, id: `local_${Date.now()}`, _isNew: true }] }));
            setNewQ(blankQ());
            setError("");
            return;
        }

        setQSaving(true);
        setError("");
        try {
            await createQuestionWithOptions(quizSlug, newQ, form.questions.length + 1);
            await reloadQuestions(quizSlug);
            setNewQ(blankQ());
        } catch (err) {
            console.error("Add question failed:", err?.response?.data ?? err);
            setError(err?.response?.data?.message || "Failed to add question.");
        } finally {
            setQSaving(false);
        }
    };

    const handleSaveExistingQuestion = async (idx) => {
        const q = form.questions[idx];
        if (!q.id || q._isNew) return;
        setQSaving(true);
        setError("");
        try {
            await instructorQuizQuestionApi.updateQuestion(q.id, {
                questionText: q.question.trim(),
                explanation: q.explanation?.trim() ?? "",
                marks: q.marks ?? 1,
            });

            const existingOpts = q.optionObjects ?? [];
            for (let i = 0; i < existingOpts.length; i++) {
                const opt = existingOpts[i];
                if (!opt?.id) continue;
                await instructorQuizOptionApi.updateOption(opt.id, {
                    optionText: q.options[i]?.trim() ?? opt.optionText ?? "",
                    correct: i === q.correct,
                    isCorrect: i === q.correct,
                    sortOrder: i + 1,
                });
            }

            if (q.options.length > existingOpts.length) {
                for (let i = existingOpts.length; i < q.options.length; i++) {
                    const text = q.options[i]?.trim();
                    if (!text) continue;
                    await instructorQuizOptionApi.createOption(q.id, {
                        optionText: text,
                        correct: i === q.correct,
                        isCorrect: i === q.correct,
                        sortOrder: i + 1,
                    });
                }
            }

            setEditingIdx(null);
            if (initialData?.slug) await reloadQuestions(initialData.slug);
        } catch (err) {
            console.error("Save question failed:", err?.response?.data ?? err);
            setError(err?.response?.data?.message || "Failed to save question changes.");
        } finally {
            setQSaving(false);
        }
    };

    const handleDeleteQuestion = async (idx) => {
        const q = form.questions[idx];
        const isLocal = q._isNew || (typeof q.id === "string" && q.id.startsWith("local_"));
        if (isLocal) {
            setForm(p => ({ ...p, questions: p.questions.filter((_, i) => i !== idx) }));
            return;
        }
        if (!window.confirm("Delete this question and all its options?")) return;
        try {
            await instructorQuizQuestionApi.deleteQuestion(q.id);
            if (initialData?.slug) await reloadQuestions(initialData.slug);
            else setForm(p => ({ ...p, questions: p.questions.filter((_, i) => i !== idx) }));
        } catch (err) {
            console.error("Delete failed:", err?.response?.data ?? err);
            setError("Failed to delete question.");
        }
    };

    const handleSave = async () => {
        if (!form.title.trim()) { setError("Quiz title is required."); return; }
        if (!form.courseId) { setError("Please select a course."); return; }

        setSaving(true);
        setError("");

        try {
            // Build payload — backend uses numeric IDs for relations
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
                published: form.published,
                status: form.published ? "PUBLISHED" : "DRAFT",
            };

            // Attach relation IDs based on quiz type
            if (form.type === "COURSE") {
                payload.courseId = Number(form.courseId);
            } else if (form.type === "MODULE") {
                payload.courseId = Number(form.courseId);
                payload.moduleId = Number(form.moduleId);
            } else if (form.type === "LESSON") {
                payload.courseId = Number(form.courseId);
                payload.moduleId = Number(form.moduleId);
                payload.lessonId = Number(form.lessonId);
            }

            let savedSlug = initialData?.slug ?? null;

            if (savedSlug) {
                // Edit mode — use slug
                await instructorQuizApi.updateQuiz(savedSlug, payload);
            } else {
                console.log("QUIZ PAYLOAD", payload);
                // Create mode — get slug from response
                const saveRes = await instructorQuizApi.createQuiz(payload);
                const data = extractObj(saveRes);
                savedSlug = data.slug ?? data.quizSlug;
                if (!savedSlug) throw new Error("Quiz created but no slug returned from API.");
            }

            // Flush any locally-queued questions
            const localQs = form.questions.filter(
                q => q._isNew && typeof q.id === "string" && q.id.startsWith("local_")
            );
            for (let i = 0; i < localQs.length; i++) {
                try {
                    await createQuestionWithOptions(savedSlug, localQs[i], i + 1);
                } catch (err) {
                    console.error("Failed to save local question:", err?.response?.data ?? err);
                }
            }

            await onSave();
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

    const savedQCount = form.questions.filter(q => !q._isNew).length;
    const localQCount = form.questions.filter(q => q._isNew).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-2xl flex-shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                        <MdOutlineAddCircle className="text-white text-lg" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-sm font-black text-white">{isEditMode ? "Edit Quiz" : "Create New Quiz"}</h2>
                        <p className="text-[11px] text-violet-200 mt-0.5">
                            Step {step} of 2 — {step === 1 ? "Quiz Details" : `Questions (${form.questions.length} total)`}
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 mr-2">
                        {[1, 2].map(s => (
                            <button key={s} onClick={() => setStep(s)}
                                className={`w-7 h-7 rounded-full text-xs font-bold transition ${step === s ? "bg-white text-violet-600" : "bg-white/20 text-white hover:bg-white/30"}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition">
                        <MdClose />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                    {/* ── STEP 1: Quiz Details ── */}
                    {step === 1 && (
                        <div className="space-y-4">
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
                                {/* Course selector — stores both id (for payload) and slug (for API calls) */}
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

                                {/* Module selector for MODULE/LESSON types */}
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

                                {/* Lesson selector for LESSON type */}
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

                            {/* Published toggle */}
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
                    )}

                    {/* ── STEP 2: Questions ── */}
                    {step === 2 && (
                        <div className="space-y-4">
                            {isEditMode ? (
                                <div className="flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                    <MdHelpOutline className="text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-blue-700">Edit Mode</p>
                                        <p className="text-[11px] text-blue-600 mt-0.5">
                                            Questions added here are saved to the server immediately. Edit or delete existing questions using the icons on each row.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                    <MdHelpOutline className="text-amber-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-700">New Quiz — Questions are saved with the quiz</p>
                                        <p className="text-[11px] text-amber-600 mt-0.5">
                                            Add questions below, then click <strong>Save Quiz</strong>. All questions and options will be saved together.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {qLoading && (
                                <div className="space-y-2">
                                    {[1, 2].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
                                </div>
                            )}

                            {!qLoading && form.questions.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-wide flex-1">
                                            {form.questions.length} Question{form.questions.length !== 1 ? "s" : ""}
                                        </p>
                                        {savedQCount > 0 && (
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <FaCheck className="text-[8px]" /> {savedQCount} saved
                                            </span>
                                        )}
                                        {localQCount > 0 && (
                                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                                {localQCount} pending save
                                            </span>
                                        )}
                                    </div>

                                    {form.questions.map((q, idx) => (
                                        <div key={q.id ?? idx}>
                                            {editingIdx === idx ? (
                                                <QuestionEditor
                                                    question={q}
                                                    label={`Edit Question ${idx + 1}`}
                                                    onChange={updated => setForm(p => {
                                                        const qs = [...p.questions]; qs[idx] = updated;
                                                        return { ...p, questions: qs };
                                                    })}
                                                    onCancel={() => setEditingIdx(null)}
                                                    onSave={() => handleSaveExistingQuestion(idx)}
                                                    saving={qSaving}
                                                />
                                            ) : (
                                                <div className={`flex items-start gap-3 p-3 rounded-xl border group hover:shadow-sm transition ${q._isNew ? "bg-amber-50/50 border-amber-200" : "bg-slate-50 border-slate-200 hover:border-violet-200"}`}>
                                                    <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${q._isNew ? "bg-amber-100 text-amber-700" : "bg-violet-100 text-violet-600"}`}>
                                                        {idx + 1}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-slate-800 leading-snug">{q.question}</p>
                                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                            {q.options.filter(Boolean).map((opt, oi) => (
                                                                <span key={oi} className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${oi === q.correct ? "bg-emerald-100 text-emerald-700 font-bold" : "bg-slate-100 text-slate-500"}`}>
                                                                    {String.fromCharCode(65 + oi)}. {opt}
                                                                    {oi === q.correct && " ✓"}
                                                                </span>
                                                            ))}
                                                            {q.marks > 1 && <span className="text-[10px] text-slate-400">{q.marks} marks</span>}
                                                            {q._isNew && <span className="text-[10px] text-amber-600 font-bold">unsaved</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                                                        <button onClick={() => setEditingIdx(idx)}
                                                            className="w-6 h-6 rounded-lg bg-violet-50 text-violet-500 hover:bg-violet-100 flex items-center justify-center transition">
                                                            <MdEdit className="text-xs" />
                                                        </button>
                                                        <button onClick={() => handleDeleteQuestion(idx)}
                                                            className="w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition">
                                                            <FaTrash className="text-[9px]" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!qLoading && form.questions.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-px bg-slate-200" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Add Another</span>
                                    <div className="flex-1 h-px bg-slate-200" />
                                </div>
                            )}

                            {!qLoading && (
                                <>
                                    <QuestionEditor question={newQ} onChange={setNewQ} />
                                    <button type="button" onClick={handleAddQuestion}
                                        disabled={qSaving || !newQ.question.trim()}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition">
                                        {qSaving
                                            ? <><AiOutlineLoading3Quarters className="animate-spin text-xs" /> Adding question…</>
                                            : <><FaPlus className="text-[9px]" /> Add Question</>}
                                    </button>
                                </>
                            )}

                            {!qLoading && form.questions.length === 0 && (
                                <p className="text-[11px] text-slate-400 text-center -mt-1">
                                    No questions yet — fill in the form above and click Add Question.
                                </p>
                            )}
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
                    <div className="flex items-center justify-between gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition bg-white">
                            Cancel
                        </button>
                        <div className="flex items-center gap-2">
                            {step === 1 ? (
                                <button onClick={() => setStep(2)} disabled={!form.title.trim() || !form.courseId}
                                    className="flex items-center gap-1.5 px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition">
                                    Next: Add Questions <FaChevronRight className="text-[9px]" />
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => setStep(1)} className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition bg-white">
                                        Back
                                    </button>
                                    <button onClick={handleSave} disabled={saving || !form.title.trim() || !form.courseId}
                                        className="flex items-center gap-2 px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-sm">
                                        {saving ? <AiOutlineLoading3Quarters className="animate-spin" /> : <MdCheckCircle />}
                                        {saving ? "Saving…" : isEditMode ? "Save Changes" : `Save Quiz${localQCount > 0 ? ` + ${localQCount} Q` : ""}`}
                                    </button>
                                </>
                            )}
                        </div>
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
   QUIZ CARD
══════════════════════════════════════════════════════════ */
const QuizCard = ({ quiz, onEdit, onDelete, onViewResults }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const s = (quiz.status === "active" || quiz.published)
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

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
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
                                <button onClick={() => setMenuOpen(v => !v)}
                                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
                                    <MdMoreVert />
                                </button>
                                {menuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                        <div className="absolute right-0 top-9 z-20 w-44 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                                            <button onClick={() => { onEdit(quiz); setMenuOpen(false); }}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-left">
                                                <FaEdit className="text-violet-400 w-3 h-3" /> Edit Quiz
                                            </button>
                                            <button onClick={() => { onViewResults(quiz); setMenuOpen(false); }}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-left">
                                                <MdBarChart className="text-purple-400 w-3.5 h-3.5" /> View Results
                                            </button>
                                            <div className="border-t border-slate-100" />
                                            <button onClick={() => { onDelete(quiz); setMenuOpen(false); }}
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
            <div className="border-t border-slate-100 px-5 py-3 flex items-center gap-4 bg-slate-50/50">
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
                    <button onClick={() => onViewResults(quiz)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition">
                        <MdBarChart className="text-sm" /> Results
                    </button>
                    <button onClick={() => onEdit(quiz)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded-xl hover:bg-violet-100 transition">
                        <FaEdit className="text-[10px]" /> Edit
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
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [courseFilter, setCourseFilter] = useState("ALL");
    const [moduleFilter, setModuleFilter] = useState("ALL");
    const [lessonFilter, setLessonFilter] = useState("ALL");
    const [filterModules, setFilterModules] = useState([]);
    const [filterLessons, setFilterLessons] = useState([]);
    const [scopedQuizzes, setScopedQuizzes] = useState(null);

    // Fetch analytics safely — uses quiz slug
    const fetchQuizAnalytics = useCallback(async (quizSlug) => {
        if (!quizSlug) return { attempts: 0, avgScore: 0 };
        try {
            const response = await instructorQuizAnalyticsApi.getQuizAnalytics(quizSlug);
            const data = extractObj(response);
            return {
                attempts: data.totalAttempts ?? data.attemptCount ?? 0,
                avgScore: data.averageScore ?? data.avgScore ?? 0,
            };
        } catch {
            return { attempts: 0, avgScore: 0 };
        }
    }, []);

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

                    // Course-level quizzes
                    const cq = await instructorQuizApi.getQuizzesByCourse(courseSlug, 0, 100)
                        .then(r => extractList(r).map(raw => normalizeQuiz(raw, course)))
                        .catch(() => []);

                    // Modules — use courseSlug
                    const mods = extractList(
                        await instructorModuleApi.getCourseModules(courseSlug, 0, 100).catch(() => null)
                    );

                    // Module-level quizzes — use module.slug
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

                    // Lesson-level quizzes — use lesson.lessonSlug
                    const lq = (await Promise.all(mods.map(async (mod) => {
                        const modSlug = mod.slug ?? mod.moduleSlug;
                        if (!modSlug) return [];
                        const lessons = extractList(
                            await instructorLessonApi.getModuleLessons(modSlug, 0, 100).catch(() => null)
                        );
                        return (await Promise.all(lessons.map(async (lesson) => {
                            console.log("Lesson:", lesson);
                            console.log("Lesson Slug:", lesson.lessonSlug);
                            console.log("Lesson Slug 2:", lesson.slug);
                            const lessonSlug = lesson.lessonSlug;
                            if (!lessonSlug) return [];
                            return instructorQuizApi.getQuizzesByLesson(
                                lessonSlug,
                                0,
                                50
                            )
                                .then(r => {
                                    console.log("Lesson Quiz Response:", r.data);
                                    return extractList(r).map(raw => ({
                                        ...normalizeQuiz(raw, course),
                                        lessonId: lesson.id,
                                        lessonSlug,
                                        lessonName: lesson.title,
                                    }));
                                })
                                .catch(err => {
                                    console.error("Lesson Quiz Error:", lessonSlug, err.response?.data);
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

    // Filter: load modules when course changes
    useEffect(() => {
        setModuleFilter("ALL"); setFilterModules([]);
        if ((typeFilter !== "MODULE" && typeFilter !== "LESSON") || courseFilter === "ALL") return;
        const course = courses.find(c => String(c.id) === String(courseFilter));
        const slug = course?.slug ?? course?.courseSlug;
        if (!slug) return;
        instructorModuleApi.getCourseModules(slug, 0, 100)
            .then(r => setFilterModules(extractList(r))).catch(console.error);
    }, [typeFilter, courseFilter, courses]);

    // Filter: load lessons when module changes
    useEffect(() => {
        setLessonFilter("ALL"); setFilterLessons([]);
        if (typeFilter !== "LESSON" || moduleFilter === "ALL") return;
        const mod = filterModules.find(m => String(m.id) === String(moduleFilter));
        const slug = mod?.slug ?? mod?.moduleSlug;
        if (!slug) return;
        instructorLessonApi.getModuleLessons(slug, 0, 100)
            .then(r => setFilterLessons(extractList(r))).catch(console.error);
    }, [typeFilter, moduleFilter, filterModules]);

    // Scoped filter fetch
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

    const tabFilter = { all: () => true, published: q => q.status === "active", draft: q => q.status === "draft" };
    const baseList = scopedQuizzes ?? quizzes;
    const filtered = baseList
        .filter(tabFilter[activeTab] ?? (() => true))
        .filter(q => scopedQuizzes ? true : (typeFilter === "ALL" || q.type === typeFilter))
        .filter(q => scopedQuizzes ? true : (courseFilter === "ALL" || String(q.courseId) === String(courseFilter)))
        .filter(q => q.title.toLowerCase().includes(search.toLowerCase()) || q.course.toLowerCase().includes(search.toLowerCase()));

    // Delete — uses quiz.slug
    const handleDelete = async () => {
        if (!deleteTarget?.slug) {
            alert("Cannot delete: quiz slug not found.");
            return;
        }
        setDeleting(true);
        try {
            await instructorQuizApi.deleteQuiz(deleteTarget.slug);
            setQuizzes(prev => prev.filter(q => q.id !== deleteTarget.id));
            setScopedQuizzes(prev => prev ? prev.filter(q => q.id !== deleteTarget.id) : prev);
            setDeleteTarget(null);
        } catch (err) {
            alert(err?.response?.data?.message || "Couldn't delete the quiz.");
        } finally {
            setDeleting(false);
        }
    };

    const handleTypeFilterChange = (t) => { setTypeFilter(t); setCourseFilter("ALL"); setModuleFilter("ALL"); setLessonFilter("ALL"); setScopedQuizzes(null); };
    const clearFilters = () => { setTypeFilter("ALL"); setCourseFilter("ALL"); setModuleFilter("ALL"); setLessonFilter("ALL"); setScopedQuizzes(null); };

    const tabs = [
        { id: "all", label: "All", count: totalQuizzes },
        { id: "published", label: "Published", count: publishedCount },
        { id: "draft", label: "Draft", count: draftCount },
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
                    <button onClick={() => setShowAddModal(true)}
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

                {/* Stat cards */}
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

                {/* Filter panel */}
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

                {/* Tabs + search */}
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

                {/* Quiz list */}
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
                            <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition shadow-sm">
                                <MdAdd className="text-base" /> Create First Quiz
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(quiz => (
                            <QuizCard key={quiz.id} quiz={quiz} onEdit={setEditTarget} onDelete={setDeleteTarget}
                                onViewResults={q => navigate(`/instructor/quiz/${q.slug}/results`)} />
                        ))}
                    </div>
                )}
            </div>

            {showAddModal && (
                <AddQuizModal courses={courses}
                    onClose={() => setShowAddModal(false)}
                    onSave={fetchQuizzes} />
            )}
            {deleteTarget && (
                <DeleteModal quiz={deleteTarget} deleting={deleting}
                    onClose={() => !deleting && setDeleteTarget(null)} onConfirm={handleDelete} />
            )}
            {editTarget && (
                <AddQuizModal courses={courses} initialData={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSave={fetchQuizzes} />
            )}
        </div>
    );
};

export default Quizzes;
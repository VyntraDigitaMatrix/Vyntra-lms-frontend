import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    instructorQuizApi,
    instructorCourseApi,
    instructorModuleApi,
    instructorLessonApi,
} from "../auth/api";
import {
    MdOutlineQuiz, MdAdd, MdCheckCircle,
    MdSearch, MdFilterList, MdPeople,
    MdQuiz, MdErrorOutline, MdRefresh,
    MdMenuBook, MdViewModule, MdPlayCircleOutline,
} from "react-icons/md";
import { FaTrophy } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { extractList, normalizeQuiz } from "../components/Quizzes/utils";
import QuizFormModal from "../components/Quizzes/QuizFormModal";
import QuestionsManagerModal from "../components/Quizzes/QuestionsManagerModal";
import DeleteModal from "../components/Quizzes/DeleteModal";
import QuizCard from "../components/Quizzes/QuizCard";

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

            // Fetch all quizzes course-by-course using the new AllQuizzes endpoint for all types
            const all = await Promise.all(
                courseList.map(async (course) => {
                    const courseSlug = course.slug ?? course.courseSlug;
                    if (!courseSlug) return [];

                    try {
                        const res = await instructorQuizApi.getAllQuizzesByCourse(courseSlug, 0, 500, "");
                        return extractList(res).map(raw => normalizeQuiz(raw, course));
                    } catch (err) {
                        console.error(`Error fetching quizzes for course ${courseSlug}:`, err);
                        return [];
                    }
                })
            );

            const seen = new Set();
            setQuizzes(all.flat().filter(q => {
                if (!q.id) return false;
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
                    if (!courseSlug || !modSlug) { if (!cancelled) setScopedQuizzes([]); return; }
                    const list = extractList(await instructorQuizApi.getQuizzesByModule(modSlug, 0, 100))
                        .map(raw => normalizeQuiz(raw, course));
                    if (!cancelled) setScopedQuizzes(list);
                } catch { if (!cancelled) setScopedQuizzes([]); }
                finally { if (!cancelled) setFilterLoading(false); }
                return;
            }
            if (typeFilter === "LESSON" && lessonFilter !== "ALL") {
                setFilterLoading(true);
                try {
                    const lesson = filterLessons.find(l => String(l.id) === String(lessonFilter));
                    const lessonSlug = lesson?.lessonSlug ?? lesson?.slug;
                    if (!courseSlug || !lessonSlug) { if (!cancelled) setScopedQuizzes([]); return; }
                    const list = extractList(await instructorQuizApi.getQuizzesByLesson(lessonSlug, 0, 100))
                        .map(raw => normalizeQuiz(raw, course));
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
    const totalQuestions = useMemo(() => quizzes.reduce((s, q) => s + (q.questions || 0), 0), [quizzes]);
    const statCards = [
        { label: "Total Quizzes", value: totalQuizzes, icon: <MdQuiz />, iconBg: "bg-violet-50", iconColor: "text-violet-500" },
        { label: "Published", value: publishedCount, icon: <MdCheckCircle />, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
        { label: "Drafts", value: draftCount, icon: <MdPeople />, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
        { label: "Total Questions", value: totalQuestions, icon: <MdOutlineQuiz />, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
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
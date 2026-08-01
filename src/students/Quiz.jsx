import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { studentQuizApi } from "./auth/api";
import { unwrap, colorFor, mergeNonNull, extractScoreData, buildAttemptMap, deriveStatus } from "./components/Quizzes/Helpers";
import QuizPlayer from "./components/Quizzes/QuizPlayer";
import AnalyticsModal from "./components/Quizzes/AnalyticsModal";
import QuizDetailDrawer from "./components/Quizzes/QuizDetailDrawer";
import ActionButton from "./components/Quizzes/ActionButton";
import Pagination from "./components/Quizzes/Pagination";
import LeaderboardModal from "./components/Quizzes/LeaderboardModal";
import {
    FaClipboardCheck, FaCheckCircle, FaTrophy, FaChevronRight,
    FaCheck, FaHourglassHalf, FaTimes, FaRedo,
    FaPlay, FaLock, FaChartBar, FaListUl, FaRegClock, FaAward,
    FaArrowLeft, FaArrowRight, FaMedal, FaSpinner,
    FaChevronLeft, FaChevronRight as FaChevronRightIcon,
    FaCrown, FaStar, FaBook, FaLayerGroup, FaBookOpen,
} from "react-icons/fa";
import { MdQuiz, MdClose, MdLeaderboard, MdMenuBook, MdViewModule, MdPlayCircleOutline } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi";

export const StatusBadge = ({ status }) => {
    const map = {
        Completed: { bg: "bg-emerald-50", text: "text-emerald-600", icon: <FaCheck className="text-[10px]" /> },
        "In Progress": { bg: "bg-amber-50", text: "text-amber-600", icon: <FaHourglassHalf className="text-[10px]" /> },
        Upcoming: { bg: "bg-blue-50", text: "text-blue-600", icon: <FaRegClock className="text-[10px]" /> },
        "Not Attempted": { bg: "bg-gray-100", text: "text-gray-500", icon: null },
    };
    const s = map[status] || map["Not Attempted"];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
            {s.icon} {status}
        </span>
    );
};

export const MetaPill = ({ icon, label }) => (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
        {icon} {label}
    </span>
);

/* ══════════════════════════════════════════════════════════
   MAIN QUIZZES PAGE
══════════════════════════════════════════════════════════ */
const Quizzes = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizPlayerState, setQuizPlayerState] = useState(null);
    const [analyticsQuiz, setAnalyticsQuiz] = useState(null);
    const [leaderboardQuiz, setLeaderboardQuiz] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const fetchQuizzes = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [quizzesRes, attemptsRes] = await Promise.allSettled([
                studentQuizApi.getQuizzes(),
                studentQuizApi.getAttempts(),
            ]);

            if (quizzesRes.status !== "fulfilled") throw quizzesRes.reason;

            const data = unwrap(quizzesRes.value);
            const list = Array.isArray(data) ? data : (data?.content || []);

            let attemptMap = {};
            if (attemptsRes.status === "fulfilled") {
                const attemptsData = unwrap(attemptsRes.value);
                const attemptsList = Array.isArray(attemptsData) ? attemptsData : (attemptsData?.content || []);
                attemptMap = buildAttemptMap(attemptsList);
            } else {
                console.warn("[Quizzes] getAttempts failed:", attemptsRes.reason);
            }

            const enriched = list.map((q) => ({
                ...q,
                attempt: attemptMap[q.quizId ?? q.id] || q.latestAttempt || q.attempt || null,
            }));

            setQuizzes(enriched);
            setCurrentPage(1);
        } catch (err) {
            console.error("[Quizzes] fetchQuizzes error:", err);
            setError(err?.response?.data?.message || "Failed to load quizzes.");
        } finally {
            setLoading(false);
        }
    }, []);

    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleStart = async (quiz) => {
        try {
            if (quiz.canResume) {
                setQuizPlayerState({ quiz, mode: "resume" });
                return;
            }
            if (quiz.remainingAttempts === 0) {
                showToast("You have reached the maximum number of attempts for this quiz.", "error");
                return;
            }
            if (quiz.remainingAttempts > 0 || quiz.remainingAttempts === undefined) {
                setQuizPlayerState({ quiz, mode: "start" });
                return;
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchQuizzes(); }, [fetchQuizzes]);

    const displayQuizzes = quizzes.map((q) => {
        const status = deriveStatus(q);
        const attempt = q.attempt;
        const scoreData = extractScoreData(attempt);
        let scoreLabel = "";

        if (status === "Completed") {
            scoreLabel = scoreData ? `${scoreData.percentage}%` : "";
        } else if (status === "In Progress") {
            scoreLabel = `${attempt?.answeredCount ?? 0}/${q.totalQuestions ?? "?"}`;
        }

        return {
            ...q,
            id: q.quizId ?? q.id,
            quizSlug: q.quizSlug ?? q.slug,
            status,
            questionCount: q.totalQuestions || 0,
            maxAttempts: q.attemptsChance ?? q.maxAttempts ?? 0,
            remainingAttempts: q.remainingAttempts ?? q.attemptsLeft ?? 0,
            scoreLabel,
            scoreData,
            attempt,
        };
    });

    const TABS = ["All", "Pending", "Upcoming", "Completed"];

    const filteredQuizzes = displayQuizzes.filter(q => {
        if (activeTab === "All") return true;
        if (activeTab === "Pending") return q.status === "Not Attempted" || q.status === "In Progress";
        if (activeTab === "Completed") return q.status === "Completed";
        if (activeTab === "Course") return q.quizType === "COURSE";
        return true;
    });

    const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredQuizzes.slice(startIndex, startIndex + itemsPerPage);

    const tabCounts = {
        All: displayQuizzes.length,
        Pending: displayQuizzes.filter(q => q.status === "Not Attempted" || q.status === "In Progress").length,
        Completed: displayQuizzes.filter(q => q.status === "Completed").length,
        Course: displayQuizzes.filter(q => q.quizType === "COURSE").length,
    };

    const stats = {
        total: quizzes.length,
        attempted: displayQuizzes.filter(q => q.status === "Completed" || q.status === "In Progress").length,
        completed: displayQuizzes.filter(q => q.status === "Completed"),
    };

    const avgScore = stats.completed.length
        ? Math.round(
            stats.completed.reduce((s, q) => s + (q.scoreData?.percentage ?? 0), 0) / stats.completed.length
        )
        : 0;

    const handleResume = (q) => setQuizPlayerState({ quiz: q, mode: "resume" });
    const handleAttemptAgain = (q) => setQuizPlayerState({ quiz: q, mode: "retake" });

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            document.getElementById("quiz-list")?.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Helper to get the scope label (Course/Module/Lesson)
    const getScopeLabel = (quiz) => {
        const parts = [];

        // Course
        if (quiz.courseTitle) {
            parts.push({ icon: <MdMenuBook className="text-[10px]" />, label: quiz.courseTitle });
        }

        // Module
        if (quiz.moduleTitle) {
            parts.push({ icon: <MdViewModule className="text-[10px]" />, label: quiz.moduleTitle });
        }

        // Lesson
        if (quiz.lessonTitle) {
            parts.push({ icon: <MdPlayCircleOutline className="text-[10px]" />, label: quiz.lessonTitle });
        }

        return parts;
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-slate-50/60 max-w-7xl mx-auto space-y-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-xs">
                    <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                            <Link to="/student/dashboard" className="hover:text-[#043573] transition">Dashboard</Link>
                            <span>&gt;</span>
                            <span className="text-slate-700 font-semibold">Quizzes</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Quizzes</h1>
                        <p className="text-xs text-slate-500 mt-1">Review your past attempts and track your learning progress.</p>
                    </div>
                    <button onClick={fetchQuizzes} className="px-4 py-2 bg-slate-100/80 text-slate-700 hover:bg-slate-100 hover:text-[#043573] rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer self-start sm:self-auto">
                        <FaRedo className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/70 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#043573] flex items-center justify-center text-lg font-bold">
                            <FaLayerGroup />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500">Total Quizzes</p>
                            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{stats.total}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/70 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold">
                            <FaCheckCircle />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500">Completed</p>
                            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{stats.completed.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/70 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold">
                            <FaHourglassHalf />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500">Pending</p>
                            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{tabCounts.Pending}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/70 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg font-bold">
                            <FaStar />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500">Avg Score</p>
                            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{avgScore}%</p>
                        </div>
                    </div>
                </div>

                {/* Sleek Tabs */}
                <div className="flex items-center gap-2 bg-white rounded-2xl p-1.5 w-fit overflow-x-auto shadow-xs border border-slate-200/70 scrollbar-hide">
                    {["All", "Pending", "Completed", "Course"].map(tab => {
                        const count = tabCounts[tab];
                        const isActive = activeTab === tab;
                        return (
                            <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isActive
                                    ? "bg-[#043573] text-white shadow-md shadow-[#043573]/20"
                                    : "text-slate-600 hover:text-[#043573] hover:bg-slate-100/70"
                                    }`}>
                                <span>{tab}</span>
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md leading-tight ${isActive ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-600"
                                    }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <FaSpinner className="animate-spin text-3xl text-[#043573]" />
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center">
                        <p className="text-xs font-semibold text-rose-600 mb-3">{error}</p>
                        <button onClick={fetchQuizzes}
                            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition cursor-pointer">
                            Retry
                        </button>
                    </div>
                )}

                {/* Quiz list */}
                {!loading && !error && (
                    <div id="quiz-list">
                        <div className="space-y-4">
                            {currentItems.length === 0 && (
                                <div className="bg-white rounded-2xl border border-slate-200/70 p-12 text-center shadow-xs">
                                    <MdQuiz className="text-4xl text-slate-300 mx-auto mb-3" />
                                    <h3 className="text-sm font-bold text-slate-800">No quizzes found</h3>
                                    <p className="text-xs text-slate-500 mt-1">Try selecting a different filter tab.</p>
                                </div>
                            )}
                            {currentItems.map(quiz => {
                                const c = colorFor(quiz.id);
                                const scopeParts = getScopeLabel(quiz);
                                const attemptsExhausted =
                                    quiz.remainingAttempts !== undefined &&
                                    quiz.remainingAttempts !== null &&
                                    quiz.remainingAttempts <= 0 &&
                                    !quiz.canResume;

                                return (
                                    <div key={quiz.quizId || quiz.id}
                                        className="group bg-white border border-slate-200/70 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden">

                                        {/* Subtle side accent */}
                                        <div className={`absolute top-0 bottom-0 left-0 w-1 ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />

                                        {/* Left Side: Info */}
                                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 flex-1">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${c.bg} font-bold`}>
                                                <MdQuiz className={`text-xl ${c.text}`} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                    <StatusBadge status={quiz.status} />
                                                    {quiz.status === "Completed" && (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wide uppercase">
                                                            <FaRedo /> {quiz.remainingAttempts ?? 0} Attempts Left
                                                        </span>
                                                    )}
                                                </div>
                                                <h2 className="text-sm sm:text-sm font-extrabold text-gray-900 leading-snug mb-2 group-hover:text-[#043573] transition-colors">{quiz.title}</h2>

                                                {/* Scope: Course → Module → Lesson */}
                                                {scopeParts.length > 0 && (
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        {scopeParts.map((part, idx) => (
                                                            <React.Fragment key={idx}>
                                                                {idx > 0 && <span className="text-gray-300 text-[10px]">/</span>}
                                                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                                                                    <span className="text-blue-400">{part.icon}</span>
                                                                    {part.label}
                                                                </span>
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs font-medium text-gray-400 bg-gray-50 w-fit px-3 py-1.5 rounded-lg border border-gray-100">
                                                    <span className="capitalize">{quiz.quizType?.toLowerCase() || "Quiz"}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                    <span>{quiz.questionCount || "—"} Questions</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                    <span className="flex items-center gap-1"><HiOutlineClock className="text-sm" />{quiz.durationInMinutes ?? "—"} mins</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                    <span className="flex items-center gap-1">
                                                        <FaRedo className="text-[10px]" /> 
                                                        {(quiz.attemptsChance ?? quiz.maxAttempts) > 0 ? `${quiz.attemptsChance ?? quiz.maxAttempts} Attempts` : "Unlimited Attempts"}
                                                    </span>
                                                </div>
                                                <div className="mt-1 text-[9px] text-gray-300 hidden">
                                                    Debug: {Object.keys(quiz).filter(k => k.toLowerCase().includes("attempt")).map(k => `${k}=${quiz[k]}`).join(", ")}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Actions & Score */}
                                        <div className="flex flex-row items-center justify-between lg:justify-end gap-4 lg:gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">

                                            {/* Score Display */}
                                            {quiz.status === "Completed" && quiz.scoreLabel && (
                                                <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-2xl border border-gray-100">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${quiz.scoreData?.passed !== false ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                                        <FaTrophy className={`text-base ${quiz.scoreData?.passed !== false ? 'text-emerald-500' : 'text-red-500'}`} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</p>
                                                        <p className={`text-xl font-black leading-none ${quiz.scoreData?.passed !== false ? 'text-emerald-600' : 'text-red-600'}`}>{quiz.scoreLabel}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {quiz.status === "In Progress" && (
                                                <div className="flex items-center gap-3 bg-amber-50/50 px-4 py-2 rounded-2xl border border-amber-100/50">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest">Answered</p>
                                                        <p className="text-xl font-black text-amber-600 leading-none">{quiz.scoreLabel}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                {quiz.status === "Completed" ? (
                                                    <>
                                                        {quiz.remainingAttempts > 0 && (
                                                            <ActionButton
                                                                status={quiz.status}
                                                                accent={c.accent}
                                                                light={c.light}
                                                                size="sm"
                                                                remainingAttempts={quiz.remainingAttempts}
                                                                onAttemptAgain={() => handleAttemptAgain(quiz)}
                                                            />
                                                        )}

                                                        {/* ONLY show leaderboard if attached to a course */}
                                                        {quiz.quizType === "COURSE" && (
                                                            <button
                                                                onClick={() => setLeaderboardQuiz(quiz)}
                                                                className="h-10 px-3 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
                                                            >
                                                                <FaCrown className="text-amber-400 text-sm drop-shadow-sm" />
                                                                Leaderboard
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => setAnalyticsQuiz(quiz)}
                                                            className="h-10 px-3 rounded-xl border border-gray-200 bg-white flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                                                        >
                                                            <FaChartBar className="text-sm text-gray-400" />
                                                            Report
                                                        </button>
                                                    </>
                                                ) : (
                                                    <ActionButton
                                                        status={quiz.status}
                                                        accent={c.accent}
                                                        light={c.light}
                                                        size="sm"
                                                        remainingAttempts={quiz.remainingAttempts}
                                                        onStart={() => handleStart(quiz)}
                                                        onResume={() => handleResume(quiz)}
                                                        onAttemptAgain={() => handleAttemptAgain(quiz)}
                                                    />
                                                )}

                                                <button onClick={() => setSelectedQuiz(quiz)}
                                                    className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100 hover:border-gray-200 transition flex-shrink-0 text-gray-400 hover:text-gray-600">
                                                    <FaChevronRight className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {filteredQuizzes.length > itemsPerPage && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                )}

                {/* Bottom CTA */}
                {!loading && !error && (
                    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-purple-100 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-[#043573]">🚀 Ready for a Challenge?</h2>
                            <p className="text-sm text-[#043573] mt-1">Take quizzes regularly to boost your learning.</p>
                        </div>
                        <button onClick={fetchQuizzes}
                            className="h-11 px-6 bg-gradient-to-r from-[#043573] to-indigo-600 hover:from-[#043573] hover:to-indigo-700 transition rounded-xl text-white font-semibold text-sm flex-shrink-0 shadow-md hover:shadow-lg">
                            Refresh Quizzes →
                        </button>
                    </div>
                )}
            </div>

            {/* Drawer */}
            {selectedQuiz && (
                <QuizDetailDrawer
                    quizSummary={selectedQuiz}
                    onClose={() => setSelectedQuiz(null)}
                    onStartQuiz={handleStart}
                    onResumeQuiz={handleResume}
                    onRetakeQuiz={handleAttemptAgain}
                    onViewAnalytics={q => setAnalyticsQuiz(q)}
                />
            )}

            {/* Quiz player */}
            {quizPlayerState && (
                <QuizPlayer
                    quiz={quizPlayerState.quiz}
                    mode={quizPlayerState.mode}
                    onClose={() => { setQuizPlayerState(null); fetchQuizzes(); }}
                    onComplete={() => { setQuizPlayerState(null); fetchQuizzes(); }}
                />
            )}

            {/* Analytics */}
            {analyticsQuiz && (
                <AnalyticsModal quiz={analyticsQuiz} onClose={() => setAnalyticsQuiz(null)} />
            )}

            {/* Leaderboard modal */}
            {leaderboardQuiz && (
                <LeaderboardModal
                    quiz={leaderboardQuiz}
                    onClose={() => setLeaderboardQuiz(null)}
                />
            )}

            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold ${toast.type === "error" ? "bg-red-600" : "bg-emerald-600"}`}>
                    {toast.msg}
                </div>
            )}
        </div>
    );
};

export default Quizzes;
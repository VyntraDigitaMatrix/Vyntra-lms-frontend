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

    const handleStart = async (quiz) => {
        try {
            if (quiz.canResume) {
                setQuizPlayerState({ quiz, mode: "resume" });
                return;
            }
            if (quiz.remainingAttempts > 0 || quiz.remainingAttempts === undefined) {
                setQuizPlayerState({ quiz, mode: "start" });
                return;
            }
            setLeaderboardQuiz(quiz);
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
            id: q.quizId,
            status,
            questionCount: q.totalQuestions || 0,
            scoreLabel,
            scoreData,
            attempt,
        };
    });

    const TABS = ["All", "Pending", "Upcoming", "Completed"];

    const filteredQuizzes = displayQuizzes.filter(q => {
        if (activeTab === "All") return true;
        if (activeTab === "Pending") return q.status === "Not Attempted" || q.status === "In Progress";
        if (activeTab === "Upcoming") return q.status === "Upcoming";
        if (activeTab === "Completed") return q.status === "Completed";
        return true;
    });

    const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredQuizzes.slice(startIndex, startIndex + itemsPerPage);

    const tabCounts = {
        All: displayQuizzes.length,
        Pending: displayQuizzes.filter(q => q.status === "Not Attempted" || q.status === "In Progress").length,
        Upcoming: displayQuizzes.filter(q => q.status === "Upcoming").length,
        Completed: displayQuizzes.filter(q => q.status === "Completed").length,
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
        <div className="p-3 sm:p-5 md:p-6 min-h-screen bg-gradient-to-br from-[#f7f8fc] to-[#f0f2f8]">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <p className="text-xs sm:text-sm text-gray-400 mb-1">
                        <Link to="/student/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span className="mx-2">&gt;</span>
                        <span className="text-gray-600 font-medium">Quizzes</span>
                    </p>
                    <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
                    <p className="text-sm text-gray-500 mt-1">Test your knowledge and track your progress</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Total Quizzes", val: stats.total, icon: <MdQuiz className="text-xl" />, bg: "bg-purple-50", text: "text-purple-600" },
                        { label: "Attempted", val: stats.attempted, icon: <FaClipboardCheck className="text-lg" />, bg: "bg-blue-50", text: "text-blue-600" },
                        { label: "Completed", val: stats.completed.length, icon: <FaCheckCircle className="text-lg" />, bg: "bg-emerald-50", text: "text-emerald-600" },
                        { label: "Avg. Score", val: `${avgScore}%`, icon: <FaTrophy className="text-lg" />, bg: "bg-amber-50", text: "text-amber-600" },
                    ].map(s => (
                        <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition">
                            <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.text} flex items-center justify-center flex-shrink-0`}>
                                {s.icon}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">{s.label}</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {loading ? <span className="block w-8 h-6 bg-gray-200 rounded animate-pulse mt-1" /> : s.val}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-white rounded-xl p-1 w-fit mb-6 overflow-x-auto shadow-sm border border-gray-100">
                    {TABS.map(tab => {
                        const count = tabCounts[tab];
                        const badgeActiveColor = {
                            All: "bg-blue-600 text-white",
                            Pending: "bg-amber-600 text-white",
                            Upcoming: "bg-blue-600 text-white",
                            Completed: "bg-emerald-600 text-white",
                        };
                        const badgeInactiveColor = {
                            All: "bg-blue-100 text-blue-800",
                            Pending: "bg-amber-100 text-amber-800",
                            Upcoming: "bg-blue-100 text-blue-800",
                            Completed: "bg-emerald-100 text-emerald-800",
                        };
                        return (
                            <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    }`}>
                                {tab}
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-tight ${activeTab === tab ? "bg-white/20 text-white" : badgeInactiveColor[tab]
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
                        <FaSpinner className="animate-spin text-3xl text-blue-400" />
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                        <p className="text-sm font-semibold text-red-600 mb-3">{error}</p>
                        <button onClick={fetchQuizzes}
                            className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition">
                            Retry
                        </button>
                    </div>
                )}

                {/* Quiz list */}
                {!loading && !error && (
                    <div id="quiz-list">
                        <div className="space-y-3">
                            {currentItems.length === 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                                    <MdQuiz className="text-4xl text-gray-200 mx-auto mb-3" />
                                    <p className="text-sm font-semibold text-gray-400">No quizzes found</p>
                                    <p className="text-xs text-gray-400 mt-1">Try a different tab.</p>
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
                                        className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-blue-200">

                                        {/* Left */}
                                        <div className="flex items-start sm:items-center gap-4">
                                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                                                <MdQuiz className={`text-2xl sm:text-3xl ${c.text}`} />
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="text-sm font-bold text-gray-900 leading-snug">{quiz.title}</h2>

                                                {/* Scope: Course → Module → Lesson */}
                                                {scopeParts.length > 0 && (
                                                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                                        {scopeParts.map((part, idx) => (
                                                            <React.Fragment key={idx}>
                                                                {idx > 0 && <span className="text-gray-300 text-[10px]">›</span>}
                                                                <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
                                                                    {part.icon}
                                                                    {part.label}
                                                                </span>
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-400">
                                                    <span className="capitalize">{quiz.quizType?.toLowerCase() || "Quiz"}</span>
                                                    <span>•</span>
                                                    <span>{quiz.questionCount || "—"} Questions</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><HiOutlineClock />{quiz.durationInMinutes ?? "—"} mins</span>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2 flex-wrap">
                                                    <StatusBadge status={quiz.status} />
                                                    {quiz.status === "Completed" && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                                            <FaRedo className="text-[10px]" />
                                                            {quiz.remainingAttempts ?? 0} Attempts Left
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right */}
                                        <div className="flex items-center gap-3 sm:gap-4 sm:flex-shrink-0 pl-16 sm:pl-0 flex-wrap">
                                            {quiz.status === "Completed" && quiz.scoreLabel && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                                                        <FaTrophy className="text-emerald-600 text-sm" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400">Score</p>
                                                        <p className="text-xl font-black text-emerald-600 leading-none">{quiz.scoreLabel}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {quiz.status === "In Progress" && (
                                                <div>
                                                    <p className="text-[10px] text-gray-400">Answered</p>
                                                    <p className="text-xl font-black text-amber-600 leading-none">{quiz.scoreLabel}</p>
                                                </div>
                                            )}

                                            {quiz.status === "Completed" ? (
                                                <>
                                                    {/* If attempts still available */}
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

                                                    {/* Always show leaderboard */}
                                                    <button
                                                        onClick={() => setLeaderboardQuiz(quiz)}
                                                        className="h-9 px-3 rounded-xl border border-blue-200 bg-blue-50 flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                                                    >
                                                        <FaCrown className="text-amber-400 text-[11px]" />
                                                        Leaderboard
                                                    </button>

                                                    {/* Always show report */}
                                                    <button
                                                        onClick={() => setAnalyticsQuiz(quiz)}
                                                        className="h-9 px-3 rounded-xl border border-gray-200 flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition"
                                                    >
                                                        <FaChartBar className="text-[10px]" />
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
                                                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition flex-shrink-0">
                                                <FaChevronRight className="text-gray-400 text-xs" />
                                            </button>
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
                            <h2 className="text-lg font-bold text-blue-900">🚀 Ready for a Challenge?</h2>
                            <p className="text-sm text-blue-600 mt-1">Take quizzes regularly to boost your learning.</p>
                        </div>
                        <button onClick={fetchQuizzes}
                            className="h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition rounded-xl text-white font-semibold text-sm flex-shrink-0 shadow-md hover:shadow-lg">
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
        </div>
    );
};

export default Quizzes;
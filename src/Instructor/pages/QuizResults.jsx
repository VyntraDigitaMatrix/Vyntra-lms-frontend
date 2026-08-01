import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { instructorQuizApi, instructorQuizAnalyticsApi, instructorQuizQuestionApi } from "../auth/api";
import {
    MdArrowBack, MdBarChart, MdPeople, MdQuiz, MdCheckCircle,
    MdErrorOutline, MdRefresh, MdSearch, MdClose, MdTimer,
    MdTrendingUp, MdTrendingDown, MdOutlineQuiz, MdStar,
} from "react-icons/md";
import { FaTrophy, FaChevronRight, FaCheck, FaUsers, FaPercent, FaClock } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
const extractList = (res) => {
    const body = res?.data?.data ?? res?.data;
    if (Array.isArray(body)) return body;
    if (Array.isArray(body?.content)) return body.content;
    return [];
};
const extractObj = (res) => res?.data?.data ?? res?.data ?? {};

/* ══════════════════════════════════════════════════════════
   ATTEMPT DETAIL MODAL
══════════════════════════════════════════════════════════ */
const AttemptDetailModal = ({ attemptId, onClose }) => {
    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        setLoading(true); setError("");
        instructorQuizAnalyticsApi.getAttemptDetail(attemptId)
            .then(res => { if (!cancelled) setAttempt(extractObj(res)); })
            .catch(err => { console.error(err); if (!cancelled) setError("Couldn't load this attempt."); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [attemptId]);

    const studentName = attempt?.studentName ?? attempt?.student?.name ?? "Student";
    const score = attempt?.obtainedMarks ?? attempt?.score ?? attempt?.totalScore ?? 0;
    const totalMarks = attempt?.totalMarks ?? attempt?.maxScore ?? 0;
    const pct = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
    const timeTaken = attempt?.timeTakenMinutes ?? attempt?.durationTaken ?? null;
    const submittedAt = attempt?.submittedAt ?? attempt?.completedAt ?? null;
    const answers = attempt?.questions ?? attempt?.answers ?? attempt?.responses ?? [];
    const isPassed = pct >= 60;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden">
                <div className={`flex items-center gap-3 px-6 py-4 rounded-t-2xl flex-shrink-0 ${isPassed ? "bg-gradient-to-r from-emerald-600 to-teal-600" : "bg-gradient-to-r from-rose-600 to-pink-600"}`}>
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <FaTrophy className={isPassed ? "text-amber-300" : "text-white/60"} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-black text-white truncate">{studentName}'s Attempt</h2>
                        <p className="text-[11px] text-white/70 mt-0.5">
                            {pct}% · {isPassed ? "Passed" : "Failed"}
                            {submittedAt && ` · ${new Date(submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition flex-shrink-0">
                        <MdClose />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <AiOutlineLoading3Quarters className="animate-spin text-2xl text-slate-400" />
                            <p className="text-xs text-slate-400">Loading attempt…</p>
                        </div>
                    ) : error ? (
                        <div className="py-16 text-center">
                            <MdErrorOutline className="text-3xl text-rose-400 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-rose-500">{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Score summary */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Score", value: `${score}/${totalMarks}`, color: isPassed ? "text-emerald-600" : "text-rose-500" },
                                    { label: "Percentage", value: `${pct}%`, color: isPassed ? "text-emerald-600" : "text-rose-500" },
                                    { label: "Time Taken", value: timeTaken ? `${timeTaken}m` : "—", color: "text-slate-700" },
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{item.label}</p>
                                        <p className={`text-xl font-black mt-0.5 ${item.color}`}>{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Answers */}
                            {answers.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-wide">Answers</p>
                                    {answers.map((a, idx) => {
                                        const isCorrect = a.correct ?? a.isCorrect ?? false;
                                        return (
                                            <div key={a.questionId ?? idx} className={`flex items-start gap-3 p-3 rounded-xl border ${isCorrect ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"}`}>
                                                <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}>{idx + 1}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-slate-700">{a.questionText ?? a.question ?? `Question ${idx + 1}`}</p>
                                                    <p className="text-[11px] text-slate-500 mt-0.5">Answered: <span className="font-semibold">{a.selectedOption ?? a.answer ?? "—"}</span></p>
                                                    {!isCorrect && (a.correctOption ?? a.correctAnswer) && (
                                                        <p className="text-[11px] text-emerald-600 mt-0.5">Correct: <span className="font-semibold">{a.correctOption ?? a.correctAnswer}</span></p>
                                                    )}
                                                </div>
                                                {isCorrect
                                                    ? <MdCheckCircle className="text-emerald-500 flex-shrink-0 text-base" />
                                                    : <MdClose className="text-rose-400 flex-shrink-0 text-base" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 text-center py-6">No per-question detail available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   OVERVIEW TAB
══════════════════════════════════════════════════════════ */
const OverviewTab = ({ quizId }) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetch = useCallback(() => {
        setLoading(true); setError("");
        instructorQuizAnalyticsApi.getQuizAnalytics(quizId)
            .then(res => setAnalytics(extractObj(res)))
            .catch(() => setError("Couldn't load analytics."))
            .finally(() => setLoading(false));
    }, [quizId]);

    useEffect(() => { fetch(); }, [fetch]);

    if (loading) return <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />)}</div>;
    if (error) return (
        <div className="flex items-center justify-between gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-xs font-semibold">
            <span className="flex items-center gap-2"><MdErrorOutline /> {error}</span>
            <button onClick={fetch} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 rounded-lg hover:bg-rose-100 transition"><MdRefresh /> Retry</button>
        </div>
    );

    const a = analytics || {};
    const totalAttempts = a.totalAttempts ?? a.attemptCount ?? 0;
    const avgScore = a.avgScore ?? a.averageScore ?? 0;
    const passRate = a.passRate ?? a.passPercentage ?? 0;
    const avgTime = a.avgTimeMinutes ?? a.averageDuration ?? null;
    const highestScore = a.highestScore ?? a.maxScore ?? null;
    const lowestScore = a.lowestScore ?? a.minScore ?? null;
    const completionRate = a.completionRate ?? null;

    return (
        <div className="space-y-5">
            {/* Primary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    {
                        label: "Students Attempted", value: totalAttempts, sub: "total attempts",
                        icon: <FaUsers className="text-lg" />, bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100",
                    },
                    {
                        label: "Average Score", value: typeof avgScore === 'number' ? avgScore.toFixed(1) + '%' : '0%', sub: avgScore >= 60 ? "above passing" : "below passing",
                        icon: <FaTrophy className="text-lg" />, bg: avgScore >= 60 ? "bg-emerald-50" : "bg-rose-50",
                        text: avgScore >= 60 ? "text-emerald-600" : "text-rose-500", border: avgScore >= 60 ? "border-emerald-100" : "border-rose-100",
                    },
                    {
                        label: "Pass Rate", value: `${passRate}%`, sub: `${Math.round((totalAttempts * passRate) / 100)} passed`,
                        icon: <MdCheckCircle className="text-lg" />, bg: passRate >= 60 ? "bg-emerald-50" : "bg-amber-50",
                        text: passRate >= 60 ? "text-emerald-600" : "text-amber-600", border: passRate >= 60 ? "border-emerald-100" : "border-amber-100",
                    },
                    {
                        label: "Avg Time", value: avgTime ? `${avgTime}m` : "—", sub: "per attempt",
                        icon: <FaClock className="text-base" />, bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100",
                    },
                ].map((c, i) => (
                    <div key={i} className={`bg-white border ${c.border} rounded-2xl p-4 hover:shadow-md transition`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${c.bg} ${c.text}`}>{c.icon}</div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{c.label}</p>
                        <p className={`text-2xl font-black mt-0.5 ${c.text}`}>{c.value}</p>
                        {c.sub && <p className="text-[10px] text-slate-400 mt-0.5">{c.sub}</p>}
                    </div>
                ))}
            </div>

            {/* Score range bar */}
            {(highestScore != null || lowestScore != null) && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-4">Score Range</p>
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wide">Lowest</p>
                            <p className="text-xl font-black text-rose-500">{lowestScore ?? "—"}%</p>
                        </div>
                        <div className="flex-1 relative h-3 bg-slate-100 rounded-full overflow-hidden">
                            {lowestScore != null && highestScore != null && (
                                <div
                                    className="absolute h-full bg-gradient-to-r from-rose-400 to-emerald-500 rounded-full"
                                    style={{ left: `${lowestScore}%`, width: `${highestScore - lowestScore}%` }}
                                />
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wide">Highest</p>
                            <p className="text-xl font-black text-emerald-600">{highestScore ?? "—"}%</p>
                        </div>
                    </div>
                    {completionRate != null && (
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-[11px] text-slate-500 font-medium">Completion Rate</p>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${completionRate}%` }} />
                                </div>
                                <p className="text-xs font-black text-indigo-600">{completionRate}%</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   STUDENTS TAB
══════════════════════════════════════════════════════════ */
const StudentsTab = ({ quizId, onOpenAttempt }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("percentage");
    const [sortDir, setSortDir] = useState("desc");

    const fetchStudents = useCallback(() => {
        setLoading(true); setError("");
        instructorQuizAnalyticsApi.getQuizStudents(quizId, 0, 200)
            .then(res => {
                const data = extractList(res);
                setStudents(data.map(s => {
                    const score = s.obtainedMarks ?? s.score ?? s.bestScore ?? 0;
                    const totalMarks = s.totalMarks ?? s.maxScore ?? 0;
                    const pct = s.percentage ?? (totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0);
                    return {
                        ...s,
                        studentName: s.studentName ?? s.name ?? "—",
                        email: s.email ?? "",
                        score, totalMarks,
                        attemptsUsed: s.attemptNumber ?? s.attemptsUsed ?? s.attemptCount ?? 0,
                        passed: s.passed ?? pct >= 60,
                        percentage: pct,
                        attemptId: s.attemptId ?? s.latestAttemptId ?? s.id,
                    };
                }));
            })
            .catch(err => { console.error(err); setError("Couldn't load student results."); })
            .finally(() => setLoading(false));
    }, [quizId]);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);

    const sorted = useMemo(() => {
        const arr = [...students];
        arr.sort((a, b) => {
            let av = a[sortField] ?? 0, bv = b[sortField] ?? 0;
            if (typeof av === "string") av = av.toLowerCase();
            if (typeof bv === "string") bv = bv.toLowerCase();
            return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
        });
        return arr;
    }, [students, sortField, sortDir]);

    const filtered = sorted.filter(s =>
        s.studentName.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    const passCount = students.filter(s => s.passed).length;
    const avgPct = students.length > 0 ? Math.round(students.reduce((a, b) => a + b.percentage, 0) / students.length) : 0;

    if (loading) return (
        <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-slate-50 rounded-xl animate-pulse" />)}</div>
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-white border border-slate-100 rounded-xl animate-pulse" />)}
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-between gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-xs font-semibold">
            <span className="flex items-center gap-2"><MdErrorOutline /> {error}</span>
            <button onClick={fetchStudents} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 rounded-lg hover:bg-rose-100 transition"><MdRefresh /> Retry</button>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Summary bar */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wide">Total Students</p>
                    <p className="text-2xl font-black text-violet-700">{students.length}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">Passed</p>
                    <p className="text-2xl font-black text-emerald-700">{passCount} <span className="text-sm font-bold text-emerald-400">/ {students.length}</span></p>
                </div>
                <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wide">Avg Score</p>
                    <p className="text-2xl font-black text-violet-700">{avgPct}%</p>
                </div>
            </div>

            {/* Search + sort */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[180px] max-w-xs">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…"
                        className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition w-full" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium">Sort:</span>
                    <select value={sortField} onChange={e => setSortField(e.target.value)}
                        className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium bg-white focus:outline-none">
                        <option value="studentName">Name</option>
                        <option value="percentage">Score</option>
                        <option value="attemptsUsed">Attempts</option>
                    </select>
                    <button onClick={() => setSortDir(p => p === "asc" ? "desc" : "asc")}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold transition">
                        {sortDir === "asc" ? "↑" : "↓"}
                    </button>
                </div>
                <span className="text-[11px] text-slate-400 ml-auto">{filtered.length} student{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-10 text-center">
                    <MdPeople className="text-slate-300 text-4xl mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-400">{search ? "No students match your search" : "No attempts yet"}</p>
                </div>
            ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 w-8">#</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400">Student</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 text-center">Score</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 text-center">Attempts</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 text-center">Status</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 text-right">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((s, idx) => (
                                <tr key={s.studentId ?? s.id ?? idx} className="hover:bg-indigo-50/30 transition">
                                    <td className="px-4 py-3 text-xs font-bold text-slate-300">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                                                {s.studentName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">{s.studentName}</p>
                                                {s.email && <p className="text-[10px] text-slate-400">{s.email}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={`text-sm font-black ${s.passed ? "text-emerald-600" : "text-rose-500"}`}>{s.percentage}%</span>
                                            <span className="text-[10px] text-slate-400">{s.score}/{s.totalMarks}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{s.attemptsUsed}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.passed ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-rose-700 bg-rose-50 border-rose-200"}`}>
                                            {s.passed ? <><MdCheckCircle className="text-xs" /> Passed</> : <><MdClose className="text-xs" /> Failed</>}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {s.attemptId ? (
                                            <button onClick={() => onOpenAttempt(s.attemptId)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition">
                                                View <FaChevronRight className="text-[9px]" />
                                            </button>
                                        ) : <span className="text-[11px] text-slate-300">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   QUESTION ANALYTICS TAB
══════════════════════════════════════════════════════════ */
const QuestionAnalyticsTab = ({ quizId }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = useCallback(() => {
        setLoading(true); setError("");
        instructorQuizAnalyticsApi.getQuestionAnalytics(quizId)
            .then(res => setQuestions(extractList(res)))
            .catch(() => setError("Couldn't load question analytics."))
            .finally(() => setLoading(false));
    }, [quizId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-white border border-slate-100 rounded-xl animate-pulse" />)}</div>;
    if (error) return (
        <div className="flex items-center justify-between gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-xs font-semibold">
            <span className="flex items-center gap-2"><MdErrorOutline /> {error}</span>
            <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 rounded-lg hover:bg-rose-100 transition"><MdRefresh /> Retry</button>
        </div>
    );
    if (questions.length === 0) return (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
            <MdQuiz className="text-slate-300 text-3xl mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-400">No question analytics available yet</p>
        </div>
    );

    // Sort by difficulty (lowest correct % first = hardest)
    const sorted = [...questions].sort((a, b) => (a.accuracyPercentage ?? a.correctPercentage ?? a.percentCorrect ?? 0) - (b.accuracyPercentage ?? b.correctPercentage ?? b.percentCorrect ?? 0));

    return (
        <div className="space-y-3">
            {/* Summary: hardest / easiest */}
            {sorted.length >= 2 && (
                <div className="grid grid-cols-2 gap-3 mb-2">
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wide mb-1">Hardest Question</p>
                        <p className="text-xs font-semibold text-rose-700 line-clamp-2">{sorted[0].questionText ?? sorted[0].question ?? "—"}</p>
                        <p className="text-[10px] text-rose-500 mt-1 font-bold">{sorted[0].accuracyPercentage ?? sorted[0].correctPercentage ?? sorted[0].percentCorrect ?? 0}% correct</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide mb-1">Easiest Question</p>
                        <p className="text-xs font-semibold text-emerald-700 line-clamp-2">{sorted[sorted.length - 1].questionText ?? sorted[sorted.length - 1].question ?? "—"}</p>
                        <p className="text-[10px] text-emerald-600 mt-1 font-bold">{sorted[sorted.length - 1].accuracyPercentage ?? sorted[sorted.length - 1].correctPercentage ?? sorted[sorted.length - 1].percentCorrect ?? 0}% correct</p>
                    </div>
                </div>
            )}

            {questions.map((q, idx) => {
                const correctPct = q.accuracyPercentage ?? q.correctPercentage ?? q.percentCorrect ?? 0;
                const totalAnswered = q.totalAttempts ?? q.totalAnswered ?? q.responseCount ?? 0;
                const isWeak = correctPct < 50;
                return (
                    <div key={q.questionId ?? idx} className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-indigo-200 transition">
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-start gap-2.5 min-w-0">
                                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                                <p className="text-xs font-semibold text-slate-700 leading-relaxed">{q.questionText ?? q.question ?? `Question ${idx + 1}`}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 flex items-center gap-1 ${isWeak ? "text-rose-700 bg-rose-50 border-rose-200" : "text-emerald-700 bg-emerald-50 border-emerald-200"}`}>
                                {isWeak ? <MdTrendingDown className="text-xs" /> : <MdTrendingUp className="text-xs" />}
                                {correctPct}% correct
                            </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                            <div className={`h-full rounded-full transition-all ${isWeak ? "bg-rose-400" : "bg-emerald-500"}`} style={{ width: `${correctPct}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                            <span>{totalAnswered} student{totalAnswered !== 1 ? "s" : ""} answered</span>
                            {isWeak && <span className="text-rose-500 font-bold">Needs review</span>}
                        </div>
                        {Array.isArray(q.optionBreakdown) && q.optionBreakdown.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                                {q.optionBreakdown.map((opt, oi) => (
                                    <div key={oi} className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold w-5 ${opt.isCorrect ? "text-emerald-600" : "text-slate-400"}`}>{String.fromCharCode(65 + oi)}</span>
                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${opt.isCorrect ? "bg-emerald-400" : "bg-slate-300"}`} style={{ width: `${opt.percentage ?? 0}%` }} />
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-semibold w-8 text-right">{opt.percentage ?? 0}%</span>
                                        {opt.isCorrect && <MdCheckCircle className="text-emerald-500 text-xs flex-shrink-0" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   MAIN QUIZ RESULTS PAGE
══════════════════════════════════════════════════════════ */
const QuizResults = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [quizLoading, setQuizLoading] = useState(true);
    const [quizError, setQuizError] = useState("");
    const [questionCount, setQuestionCount] = useState(0);
    const [activeTab, setActiveTab] = useState("overview");
    const [openAttemptId, setOpenAttemptId] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setQuizLoading(true); setQuizError("");
        (async () => {
            try {
                const [quizRes, qRes] = await Promise.allSettled([
                    instructorQuizApi.getQuizById(quizId),
                    instructorQuizQuestionApi.getQuizQuestions(quizId),
                ]);
                if (!cancelled) {
                    if (quizRes.status === "fulfilled") setQuiz(extractObj(quizRes.value));
                    else setQuizError("Couldn't load quiz details.");
                    if (qRes.status === "fulfilled") {
                        const b = qRes.value?.data?.data ?? qRes.value?.data;
                        setQuestionCount(Array.isArray(b) ? b.length : Array.isArray(b?.content) ? b.content.length : 0);
                    }
                }
            } finally { if (!cancelled) setQuizLoading(false); }
        })();
        return () => { cancelled = true; };
    }, [quizId]);

    const tabs = [
        { id: "overview", label: "Overview", icon: <MdBarChart className="text-base" /> },
        { id: "students", label: "Students", icon: <MdPeople className="text-base" /> },
        { id: "questions", label: "Questions", icon: <MdQuiz className="text-base" /> },
    ];

    const isPublished = quiz?.published ?? false;

    return (
        <div className="min-h-screen bg-[#f8fafc] antialiased">
            <div className="max-w-7xl mx-auto px-5 py-8 space-y-5">

                {/* Hero header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 rounded-2xl overflow-hidden shadow-lg shadow-indigo-200/50">
                    <div className="px-6 py-6">
                        <button onClick={() => navigate(-1)}
                            className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-200 hover:text-white transition mb-4 w-fit">
                            <MdArrowBack className="text-sm" /> Back to Quizzes
                        </button>

                        {quizLoading ? (
                            <div className="animate-pulse space-y-2">
                                <div className="h-7 w-56 bg-white/20 rounded" />
                                <div className="h-4 w-40 bg-white/20 rounded" />
                            </div>
                        ) : quizError ? (
                            <div className="flex items-center gap-3">
                                <MdErrorOutline className="text-2xl text-amber-300" />
                                <p className="text-sm font-semibold text-amber-200">{quizError}</p>
                            </div>
                        ) : (
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <h1 className="text-2xl font-black text-white tracking-tight">{quiz?.title ?? "Quiz Results"}</h1>
                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${isPublished ? "bg-emerald-500/30 border-emerald-400/50 text-emerald-100" : "bg-amber-500/20 border-amber-400/30 text-amber-200"}`}>
                                            {isPublished ? "Published" : "Draft"}
                                        </span>
                                        <span className="text-[11px] text-indigo-200">{quiz?.quizType ?? quiz?.type ?? "COURSE"}</span>
                                        <span className="text-[11px] text-indigo-200">•</span>
                                        <span className="text-[11px] text-indigo-200">{questionCount} Questions</span>
                                        <span className="text-[11px] text-indigo-200">•</span>
                                        <span className="text-[11px] text-indigo-200">{quiz?.totalMarks ?? 0} Marks</span>
                                        {quiz?.passingMarks && (
                                            <><span className="text-[11px] text-indigo-200">•</span>
                                            <span className="text-[11px] text-indigo-200">Pass: {quiz.passingMarks}</span></>
                                        )}
                                        {quiz?.durationInMinutes && (
                                            <><span className="text-[11px] text-indigo-200">•</span>
                                            <span className="text-[11px] text-indigo-200 flex items-center gap-1"><MdTimer />{quiz.durationInMinutes}m</span></>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tab bar inside hero */}
                    <div className="flex gap-0 border-t border-white/10">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 text-xs font-bold transition-all border-b-2 ${activeTab === tab.id ? "border-white text-white bg-white/10" : "border-transparent text-indigo-200 hover:text-white hover:bg-white/5"}`}>
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab content */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    {activeTab === "overview" && <OverviewTab quizId={quizId} />}
                    {activeTab === "students" && <StudentsTab quizId={quizId} onOpenAttempt={setOpenAttemptId} />}
                    {activeTab === "questions" && <QuestionAnalyticsTab quizId={quizId} />}
                </div>
            </div>

            {openAttemptId && (
                <AttemptDetailModal attemptId={openAttemptId} onClose={() => setOpenAttemptId(null)} />
            )}
        </div>
    );
};

export default QuizResults;
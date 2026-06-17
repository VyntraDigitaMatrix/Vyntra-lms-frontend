import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { studentQuizApi } from "./auth/api";
import {
    FaClipboardCheck, FaCheckCircle, FaTrophy, FaChevronRight,
    FaCalendarAlt, FaCheck, FaHourglassHalf, FaTimes, FaRedo,
    FaPlay, FaLock, FaChartBar, FaListUl, FaRegClock, FaAward,
    FaArrowLeft, FaArrowRight, FaMedal, FaSpinner,
} from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi";

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const colorPalette = [
    { bg: "bg-[#f3ebff]", text: "text-[#7c3aed]", accent: "#7c3aed", light: "#f3ebff" },
    { bg: "bg-[#eaf2ff]", text: "text-[#2563eb]", accent: "#2563eb", light: "#eaf2ff" },
    { bg: "bg-[#fff5e7]", text: "text-[#f59e0b]", accent: "#f59e0b", light: "#fff5e7" },
    { bg: "bg-[#edf6ff]", text: "text-[#3b82f6]", accent: "#3b82f6", light: "#edf6ff" },
    { bg: "bg-[#eafaf0]", text: "text-[#16a34a]", accent: "#16a34a", light: "#eafaf0" },
];
const gray = { bg: "bg-[#f3f4f6]", text: "text-gray-500", accent: "#6b7280", light: "#f3f4f6" };
const colorFor = (id) => colorPalette[(Number(id) || 0) % colorPalette.length] || gray;

const unwrap = (res) => res?.data?.data ?? res?.data ?? null;

const formatDate = (d) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
    catch { return d; }
};

/* Derive a UI status from quiz + attempt info returned by the API */
const deriveStatus = (quiz) => {
    const attempt = quiz.latestAttempt || quiz.attempt || null;
    if (quiz.startsAt && new Date(quiz.startsAt) > new Date()) return "Upcoming";
    if (!attempt) return "Not Attempted";
    const st = (attempt.status || "").toUpperCase();
    if (st === "IN_PROGRESS" || st === "STARTED") return "In Progress";
    if (st === "SUBMITTED" || st === "COMPLETED" || st === "GRADED") return "Completed";
    return "Not Attempted";
};

/* ═══════════════════════════════════════════════
   QUIZ PLAYER — FULLSCREEN (API driven)
═══════════════════════════════════════════════ */
const QuizPlayer = ({ quiz, mode, onClose, onComplete }) => {
    const c = colorFor(quiz.quizId || quiz.id)
    const isSubmittingRef = useRef(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [attemptId, setAttemptId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [savingAnswer, setSavingAnswer] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const timerRef = useRef(null);

    /* ── Initialize attempt ── */
    useEffect(() => {
        let active = true;
        const init = async () => {
            setLoading(true);
            setError("");
            try {
                let res;
                if (mode === "resume") {
                    res = await studentQuizApi.resumeQuiz(quiz.id);
                } else if (mode === "retake" || mode === "retry") {
                    res = await studentQuizApi.retryQuiz(quiz.id);
                } else {
                    res = await studentQuizApi.startQuiz(quiz.id);
                }
                const data = unwrap(res);
                if (!active) return;

                const aId = data?.attemptId || data?.id || data?.attempt?.id;
                let qList = data?.questions || data?.attempt?.questions || [];

                // If questions weren't included, fetch them separately
                if ((!qList || qList.length === 0) && aId) {
                    const qRes = await studentQuizApi.getAttemptQuestions(aId);
                    const qData = unwrap(qRes);
                    qList = qData?.content || qData?.questions || qData?.data?.content || [];
                }

                setAttemptId(aId);
                setQuestions(Array.isArray(qList) ? qList : []);

                // Restore previously saved answers
                const existingAnswers = {};
                (qList || []).forEach(q => {
                    const savedOptId = q.selectedOptionId || q.savedOptionId || q.answer?.optionId;
                    if (savedOptId) existingAnswers[q.id] = savedOptId;
                });
                setAnswers(existingAnswers);

                // Duration / timer
                const duration = quiz.durationInMinutes || data?.durationInMinutes;
                if (duration) setTimeLeft(duration * 60);
            } catch (err) {
                console.error("Quiz start/resume error:", err);
                if (active) setError(err?.response?.data?.message || "Failed to load quiz questions.");
            } finally {
                if (active) setLoading(false);
            }
        };
        init();
        return () => { active = false; };
    }, [quiz.id, mode]);

    /* ── Timer ── */
    useEffect(() => {
        if (submitted || timeLeft === null || timeLeft <= 0) return;
        
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    // Auto-submit only if we have attemptId
                    if (attemptId && !isSubmittingRef.current) {
                        handleSubmit();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [submitted, timeLeft, attemptId]);

    const mins = timeLeft !== null ? String(Math.floor(timeLeft / 60)).padStart(2, "0") : "--";
    const secs = timeLeft !== null ? String(timeLeft % 60).padStart(2, "0") : "--";
    const progress = questions.length ? ((current + 1) / questions.length) * 100 : 0;
    const answeredCount = Object.keys(answers).length;

    /* ── Select / save an answer ── */
    const selectOption = async (questionId, optionId) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
        if (!attemptId) return;
        setSavingAnswer(true);
        try {
            await studentQuizApi.saveAnswer(attemptId, { questionId, optionId });
        } catch (err) {
            console.error("save-answer error:", err);
        } finally {
            setSavingAnswer(false);
        }
    };

    /* ── Submit ── */
    const handleSubmit = async () => {
        // Prevent multiple submissions
        if (isSubmittingRef.current) return;
        
        // Don't submit if no attemptId
        if (!attemptId) {
            console.error("Cannot submit: No attemptId available");
            setError("Unable to submit quiz. Please try again.");
            return;
        }
        
        isSubmittingRef.current = true;
        setSubmitting(true);
        
        try {
            // Clear timer to prevent auto-submit during submission
            if (timerRef.current) clearInterval(timerRef.current);
            
            // Build answers array from the answers object
            const answersArray = Object.entries(answers).map(([questionId, optionId]) => ({
                questionId: parseInt(questionId),
                optionId: parseInt(optionId)
            }));
            
            // Send proper payload with answers array
            await studentQuizApi.submitAttempt(attemptId, { answers: answersArray });
            
            // Fetch results
            const resRes = await studentQuizApi.getAttemptResult(attemptId);
            const resData = unwrap(resRes);
            setResult(resData);
            setSubmitted(true);
            
            if (onComplete) {
                onComplete(quiz.id, resData?.percentage ?? resData?.score ?? 0);
            }
        } catch (err) {
            console.error("submit error:", err);
            setError(err?.response?.data?.message || "Failed to submit quiz.");
            isSubmittingRef.current = false;
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Clean up timer on unmount ── */
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    /* ── Loading state ── */
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3">
                    <FaSpinner className="animate-spin text-3xl text-purple-500" />
                    <p className="text-sm text-gray-400 font-medium">Loading quiz...</p>
                </div>
            </div>
        );
    }

    /* ── Error state ── */
    if (error && !submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-6">
                <div className="text-center max-w-sm">
                    <div className="text-4xl mb-3">⚠️</div>
                    <p className="text-sm font-semibold text-red-600 mb-4">{error}</p>
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-200 transition">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    /* ── RESULT SCREEN ── */
    if (submitted) {
        const pct = Math.round(result?.percentage ?? result?.score ?? 0);
        const correctCount = result?.correctCount ?? result?.correct ?? 0;
        const wrongCount = result?.wrongCount ?? result?.wrong ?? 0;
        const skippedCount = result?.skippedCount ?? result?.skipped ?? (questions.length - answeredCount);
        const reviewQuestions = result?.questions || questions;

        return (
            <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                            <MdQuiz className={`${c.text} text-lg`} />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-medium">{quiz.module || quiz.quizType}</p>
                            <p className="text-sm font-bold text-[#1d1642]">{quiz.title}</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <FaTimes className="text-gray-400 text-xs" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto flex items-start justify-center py-10 px-4">
                    <div className="w-full max-w-xl">
                        <div className="rounded-3xl overflow-hidden mb-6" style={{ background: pct >= 70 ? "linear-gradient(135deg,#eafaf0,#d1fae5)" : "linear-gradient(135deg,#fff1f2,#fecdd3)" }}>
                            <div className="px-8 pt-10 pb-6 text-center">
                                <div className="text-6xl mb-3">{pct >= 70 ? "🎉" : "📚"}</div>
                                <h2 className="text-2xl font-black text-[#1d1642]">{pct >= 70 ? "Well Done!" : "Keep Practicing!"}</h2>
                                <p className="text-sm text-gray-500 mt-1">{quiz.title}</p>
                                <div className="mt-5 inline-flex items-center justify-center">
                                    <svg width="110" height="110" viewBox="0 0 110 110">
                                        <circle cx="55" cy="55" r="44" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                        <circle cx="55" cy="55" r="44" fill="none"
                                            stroke={pct >= 70 ? "#16a34a" : "#dc2626"} strokeWidth="8"
                                            strokeDasharray={`${(pct / 100) * 276.5} 276.5`}
                                            strokeLinecap="round" transform="rotate(-90 55 55)" />
                                        <text x="55" y="61" textAnchor="middle" fontSize="22" fontWeight="900" fill={pct >= 70 ? "#16a34a" : "#dc2626"}>{pct}%</text>
                                    </svg>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-px bg-white/30">
                                {[
                                    { label: "Correct", val: correctCount, color: "#16a34a" },
                                    { label: "Wrong", val: wrongCount, color: "#dc2626" },
                                    { label: "Skipped", val: skippedCount, color: "#6b7280" },
                                ].map(s => (
                                    <div key={s.label} className="flex flex-col items-center py-5" style={{ background: "rgba(255,255,255,0.7)" }}>
                                        <span className="text-2xl font-black" style={{ color: s.color }}>{s.val}</span>
                                        <span className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Question Review</p>
                            </div>
                            <div className="px-6 py-4 space-y-2">
                                {reviewQuestions.map((q, i) => {
                                    const userOptId = answers[q.id];
                                    const correctOpt = (q.options || []).find(o => o.correct || o.isCorrect);
                                    const userOpt = (q.options || []).find(o => o.id === userOptId);
                                    const skipped = userOptId === undefined;
                                    const isCorrect = !skipped && correctOpt && userOptId === correctOpt.id;
                                    return (
                                        <div key={q.id || i} className="flex items-start gap-3 p-3 rounded-xl"
                                            style={{ background: skipped ? "#f9fafb" : isCorrect ? "#eafaf0" : "#fff1f1" }}>
                                            <span className="text-sm font-bold shrink-0 mt-0.5"
                                                style={{ color: skipped ? "#9ca3af" : isCorrect ? "#16a34a" : "#dc2626" }}>
                                                {skipped ? "–" : isCorrect ? "✓" : "✗"}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-gray-700">{i + 1}. {q.questionText || q.q}</p>
                                                {!skipped && !isCorrect && correctOpt && (
                                                    <p className="text-xs text-green-600 mt-0.5 font-medium">Correct: {correctOpt.optionText}</p>
                                                )}
                                                {!skipped && isCorrect && userOpt && (
                                                    <p className="text-xs text-gray-400 mt-0.5">Your answer: {userOpt.optionText}</p>
                                                )}
                                                {q.explanation && (
                                                    <p className="text-[11px] text-gray-400 mt-1 italic">{q.explanation}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-white">
                    <div className="max-w-xl mx-auto">
                        <button onClick={onClose}
                            className="w-full h-12 rounded-2xl text-white font-bold text-sm transition hover:opacity-90"
                            style={{ background: c.accent }}>
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ── No questions ── */
    if (!questions.length) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-6">
                <div className="text-center max-w-sm">
                    <FaListUl className="text-3xl text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-500 mb-4">No questions found for this quiz.</p>
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-200 transition">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const q = questions[current];

    /* ── PLAYER ── */
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">

            <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                        <MdQuiz className={`${c.text} text-lg`} />
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-400 font-medium">{quiz.module || quiz.quizType}</p>
                        <p className="text-sm font-bold text-[#1d1642] max-w-[260px] lg:max-w-none truncate">{quiz.title}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {timeLeft !== null && (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${timeLeft <= 30 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>
                            <FaRegClock className="text-[10px]" />
                            {mins}:{secs}
                        </div>
                    )}
                    {savingAnswer && <FaSpinner className="animate-spin text-gray-400 text-xs" />}
                    <button onClick={() => setShowConfirm(true)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <FaTimes className="text-gray-400 text-xs" />
                    </button>
                </div>
            </div>

            <div className="flex-shrink-0 h-1 bg-gray-100">
                <div className="h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%`, background: c.accent }} />
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-6 lg:px-16 py-8">
                        <div className="max-w-2xl mx-auto">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                                    style={{ background: c.light, color: c.accent }}>
                                    Question {current + 1} of {questions.length}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                    {answeredCount}/{questions.length} answered
                                </span>
                            </div>

                            <h3 className="text-xl lg:text-2xl font-bold text-[#1d1642] mb-2 leading-snug">
                                {q.questionText || q.q}
                            </h3>
                            {q.marks !== undefined && (
                                <p className="text-xs text-gray-400 font-medium mb-6">Marks: {q.marks}</p>
                            )}

                            <div className="space-y-3">
                                {(q.options || []).map((opt) => {
                                    const selected = answers[q.id] === opt.id;
                                    return (
                                        <button key={opt.id}
                                            onClick={() => selectOption(q.id, opt.id)}
                                            className="w-full text-left px-5 py-4 rounded-2xl border-2 text-sm font-medium transition-all duration-150"
                                            style={{
                                                borderColor: selected ? c.accent : "#e5e7eb",
                                                background: selected ? c.light : "#fff",
                                                color: selected ? c.accent : "#374151",
                                                transform: selected ? "scale(1.01)" : "scale(1)",
                                            }}>
                                            <span className="inline-flex items-center gap-4">
                                                <span className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0"
                                                    style={{
                                                        borderColor: selected ? c.accent : "#d1d5db",
                                                        background: selected ? c.accent : "transparent",
                                                        color: selected ? "#fff" : "#9ca3af"
                                                    }}>
                                                    {selected ? <FaCheck className="text-[10px]" /> : ""}
                                                </span>
                                                {opt.optionText}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 px-6 lg:px-16 py-4 border-t border-gray-100 bg-white">
                        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                            <button
                                onClick={() => setCurrent(p => Math.max(0, p - 1))}
                                disabled={current === 0}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed">
                                <FaArrowLeft className="text-xs" /> Previous
                            </button>

                            <div className="flex-1 flex items-center justify-center overflow-x-auto py-1">
                                <div className="flex gap-1.5">
                                    {questions.map((qq, i) => (
                                        <button key={qq.id || i} onClick={() => setCurrent(i)}
                                            className="rounded-full flex-shrink-0 transition-all duration-200"
                                            style={{
                                                width: i === current ? 22 : 8,
                                                height: 8,
                                                background: i === current ? c.accent : answers[qq.id] !== undefined ? "#d1fae5" : "#e5e7eb"
                                            }} />
                                    ))}
                                </div>
                            </div>

                            {current < questions.length - 1 ? (
                                <button onClick={() => setCurrent(p => p + 1)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                                    style={{ background: c.accent }}>
                                    Next <FaArrowRight className="text-xs" />
                                </button>
                            ) : (
                                <button onClick={handleSubmit} disabled={submitting || !attemptId}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-60"
                                    style={{ background: "#16a34a" }}>
                                    {submitting ? <FaSpinner className="animate-spin text-xs" /> : <FaCheck className="text-xs" />} Submit
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT — Sidebar */}
                <div className="hidden lg:flex flex-col w-72 border-l border-gray-100 bg-gray-50 overflow-y-auto">
                    <div className="px-5 py-5 flex-1">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Progress</p>
                        <div className="grid grid-cols-2 gap-2 mb-5">
                            {[
                                { label: "Answered", val: answeredCount, color: "#16a34a", bg: "#eafaf0" },
                                { label: "Remaining", val: questions.length - answeredCount, color: "#f59e0b", bg: "#fff7e8" },
                                { label: "Total", val: questions.length, color: "#2563eb", bg: "#eaf2ff" },
                                { label: "Time Left", val: timeLeft !== null ? `${mins}:${secs}` : "—", color: timeLeft !== null && timeLeft <= 30 ? "#dc2626" : "#6b7280", bg: timeLeft !== null && timeLeft <= 30 ? "#fff1f1" : "#f3f4f6" },
                            ].map(s => (
                                <div key={s.label} className="rounded-xl p-3 flex flex-col gap-0.5" style={{ background: s.bg }}>
                                    <span className="text-[10px] font-medium text-gray-400">{s.label}</span>
                                    <span className="text-lg font-black leading-none" style={{ color: s.color }}>{s.val}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mb-5">
                            <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
                                <span>Completion</span>
                                <span className="font-bold" style={{ color: c.accent }}>
                                    {Math.round((answeredCount / questions.length) * 100)}%
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${(answeredCount / questions.length) * 100}%`, background: c.accent }} />
                            </div>
                        </div>

                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Questions</p>
                        <div className="grid grid-cols-5 gap-1.5">
                            {questions.map((qq, i) => {
                                const isCurrent = i === current;
                                const isAnswered = answers[qq.id] !== undefined;
                                return (
                                    <button key={qq.id || i} onClick={() => setCurrent(i)}
                                        className="h-9 rounded-lg text-xs font-bold transition-all"
                                        style={{
                                            background: isCurrent ? c.accent : isAnswered ? "#d1fae5" : "#fff",
                                            color: isCurrent ? "#fff" : isAnswered ? "#059669" : "#9ca3af",
                                            border: isCurrent ? `2px solid ${c.accent}` : "1.5px solid #e5e7eb",
                                        }}>
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex-shrink-0 px-5 pb-5">
                        <button onClick={handleSubmit} disabled={submitting || !attemptId}
                            className="w-full h-11 rounded-xl text-white font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
                            style={{ background: "#16a34a" }}>
                            {submitting ? <FaSpinner className="animate-spin text-xs" /> : <FaCheck className="text-xs" />} Submit Quiz
                        </button>
                    </div>
                </div>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center" style={{ animation: "popIn .2s ease" }}>
                        <div className="text-4xl mb-3">⚠️</div>
                        <h3 className="text-base font-bold text-[#1d1642]">Exit Quiz?</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-5">Your saved answers remain, but the timer will stop.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowConfirm(false)}
                                className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                                Stay
                            </button>
                            <button onClick={onClose}
                                className="flex-1 h-10 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">
                                Exit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes popIn{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        </div>
    );
};

/* ═══════════════════════════════════════════════
   ANALYTICS MODAL (uses attempt result)
═══════════════════════════════════════════════ */
const AnalyticsModal = ({ quiz, onClose }) => {
    const c = colorFor(quiz.id);
    const [tab, setTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const attemptId = quiz.latestAttempt?.id || quiz.attempt?.id;
                if (!attemptId) throw new Error("No attempt found for this quiz.");
                const res = await studentQuizApi.getAttemptResult(attemptId);
                if (active) setResult(unwrap(res));
            } catch (err) {
                console.error("attempt result error:", err);
                if (active) setError(err?.response?.data?.message || err.message || "Failed to load analytics.");
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => { active = false; };
    }, [quiz.id]);

    const pct = Math.round(result?.percentage ?? result?.score ?? 0);
    const correctCount = result?.correctCount ?? result?.correct ?? 0;
    const wrongCount = result?.wrongCount ?? result?.wrong ?? 0;
    const skippedCount = result?.skippedCount ?? result?.skipped ?? 0;
    const timeTaken = result?.timeTaken ?? result?.durationTaken ?? "—";
    const breakdown = result?.breakdown || result?.sectionBreakdown || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" style={{ maxHeight: "90vh", animation: "popIn .3s cubic-bezier(.34,1.56,.64,1)" }}>

                <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                            <FaChartBar className={`text-base ${c.text}`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Analytics Report</p>
                            <h2 className="text-sm font-bold text-[#1d1642] max-w-[240px] truncate">{quiz.title}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <FaTimes className="text-gray-400 text-xs" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center py-16">
                        <FaSpinner className="animate-spin text-2xl text-purple-400" />
                    </div>
                ) : error ? (
                    <div className="flex-1 flex items-center justify-center py-16 px-6 text-center">
                        <p className="text-sm font-semibold text-red-500">{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="px-6 py-5" style={{ background: `linear-gradient(135deg, ${c.light}, #fff)` }}>
                            <div className="flex items-center gap-5">
                                <svg width="88" height="88" viewBox="0 0 88 88">
                                    <circle cx="44" cy="44" r="36" fill="none" stroke="#e5e7eb" strokeWidth="7" />
                                    <circle cx="44" cy="44" r="36" fill="none" stroke={c.accent} strokeWidth="7"
                                        strokeDasharray={`${(pct / 100) * 226.2} 226.2`} strokeLinecap="round" transform="rotate(-90 44 44)" />
                                    <text x="44" y="49" textAnchor="middle" fontSize="16" fontWeight="900" fill={c.accent}>{pct}%</text>
                                </svg>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium mb-1">Final Score</p>
                                    <p className="text-3xl font-black" style={{ color: c.accent }}>{pct}%</p>
                                    <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold ${pct >= (quiz.passingMarks ? (quiz.passingMarks / quiz.totalMarks) * 100 : 70) ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                        {pct >= 70 ? <><FaMedal /> Passed</> : "❌ Not Passed"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex border-b border-gray-100 px-6">
                            {["overview", "breakdown"].map(t => (
                                <button key={t} onClick={() => setTab(t)}
                                    className={`pb-3 pt-3 mr-6 text-xs font-semibold capitalize border-b-2 transition ${tab === t ? "border-[#6d28d9] text-[#6d28d9]" : "border-transparent text-gray-400"}`}>
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            {tab === "overview" && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "Correct", val: correctCount, icon: "✅", color: "#16a34a", bg: "#eafaf0" },
                                            { label: "Wrong", val: wrongCount, icon: "❌", color: "#dc2626", bg: "#fff1f1" },
                                            { label: "Skipped", val: skippedCount, icon: "⏭️", color: "#6b7280", bg: "#f3f4f6" },
                                            { label: "Time", val: timeTaken, icon: "⏱️", color: "#2563eb", bg: "#eaf2ff" },
                                        ].map(s => (
                                            <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: s.bg }}>
                                                <span className="text-xl">{s.icon}</span>
                                                <div>
                                                    <p className="text-xs text-gray-400">{s.label}</p>
                                                    <p className="text-xl font-black" style={{ color: s.color }}>{s.val}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-4">
                                        <div className="flex justify-between text-xs mb-2">
                                            <span className="font-semibold text-gray-500">Accuracy</span>
                                            <span className="font-bold" style={{ color: c.accent }}>{pct}%</span>
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${c.accent}, ${c.accent}dd)` }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tab === "breakdown" && (
                                <div className="space-y-4">
                                    {breakdown.length === 0 ? (
                                        <p className="text-xs text-gray-400 text-center py-8">No topic breakdown available.</p>
                                    ) : breakdown.map((s, i) => {
                                        const sp = Math.round((s.score / s.total) * 100);
                                        return (
                                            <div key={s.label || i} className="bg-gray-50 rounded-2xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-semibold text-[#1d1642]">{s.label}</span>
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                        style={{ background: sp >= 70 ? "#eafaf0" : "#fff1f1", color: sp >= 70 ? "#16a34a" : "#dc2626" }}>
                                                        {sp}%
                                                    </span>
                                                </div>
                                                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${sp}%`, background: sp >= 70 ? "#16a34a" : "#f59e0b" }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="px-6 py-4 border-t border-gray-100">
                    <button onClick={onClose}
                        className="w-full h-11 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
                        style={{ background: c.accent }}>
                        Close Report
                    </button>
                </div>
            </div>
            <style>{`@keyframes popIn{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        </div>
    );
};

/* ═══════════════════════════════════════════════
   DRAWER — Quiz Details (API driven)
═══════════════════════════════════════════════ */
const QuizDetailDrawer = ({ quizSummary, onClose, onStartQuiz, onResumeQuiz, onRetakeQuiz, onViewAnalytics }) => {
    const c = colorFor(quizSummary.id);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quiz, setQuiz] = useState(quizSummary);

    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await studentQuizApi.getQuizById(quizSummary.id);
                const data = unwrap(res);
                if (active && data) setQuiz({ ...quizSummary, ...data });
            } catch (err) {
                console.error("getQuizById error:", err);
                if (active) setError("Failed to load full quiz details.");
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => { active = false; };
    }, [quizSummary.id]);

    const status = deriveStatus(quiz);
    const questionCount = quiz.questions?.length ?? quiz.questionCount ?? quiz.totalQuestions ?? "—";
    const attempt = quiz.latestAttempt || quiz.attempt;

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
                style={{ animation: "slideIn .25s ease" }}>

                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                            <MdQuiz className={`text-xl ${c.text}`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">{quiz.quizType || "Quiz"}</p>
                            <h2 className="text-sm font-bold text-[#1d1642] leading-tight max-w-[240px]">{quiz.title}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <FaTimes className="text-gray-500 text-xs" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
                    <div className="flex items-center justify-between">
                        <StatusBadge status={status} />
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <FaCalendarAlt /> {formatDate(quiz.createdAt || quiz.scheduledDate)}
                        </span>
                    </div>

                    {quiz.description && (
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{quiz.description}</p>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                        <MetaPill icon={<FaListUl />} label={`${questionCount} Questions`} />
                        <MetaPill icon={<HiOutlineClock />} label={`${quiz.durationInMinutes ?? "—"} mins`} />
                        <MetaPill icon={<FaAward />} label={`Pass: ${quiz.passingMarks ?? "—"}/${quiz.totalMarks ?? "—"}`} />
                        {quiz.maxAttempts && <MetaPill icon={<FaRedo />} label={`Max attempts: ${quiz.maxAttempts}`} />}
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center py-6">
                            <FaSpinner className="animate-spin text-purple-400" />
                        </div>
                    )}
                    {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

                    {/* Questions preview */}
                    {!loading && Array.isArray(quiz.questions) && quiz.questions.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Questions</p>
                            <div className="space-y-2">
                                {quiz.questions.map((q, i) => (
                                    <div key={q.id || i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                        <p className="text-xs font-semibold text-gray-700">{i + 1}. {q.questionText}</p>
                                        {Array.isArray(q.options) && (
                                            <div className="mt-2 grid grid-cols-1 gap-1">
                                                {q.options.map(opt => (
                                                    <div key={opt.id} className="flex items-center gap-2 text-[11px] text-gray-500">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                                                        {opt.optionText}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {q.marks !== undefined && (
                                            <p className="text-[10px] text-gray-400 mt-1.5">Marks: {q.marks}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed attempt summary */}
                    {status === "Completed" && attempt && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 flex items-center gap-5 border border-green-100">
                            <ScoreRing score={Math.round(attempt.percentage ?? attempt.score ?? 0)} color="#16a34a" />
                            <div>
                                <p className="text-xs text-gray-500">Final Score</p>
                                <p className="text-3xl font-black text-green-600">{Math.round(attempt.percentage ?? attempt.score ?? 0)}%</p>
                                <p className="text-xs text-green-600 font-semibold mt-0.5">
                                    {(attempt.percentage ?? attempt.score ?? 0) >= 70 ? "✅ Passed" : "❌ Failed"}
                                </p>
                            </div>
                        </div>
                    )}

                    {status === "In Progress" && attempt && (
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Answered</span>
                                <span className="font-bold text-[#1d1642]">{attempt.answeredCount ?? "—"} / {questionCount}</span>
                            </div>
                            <p className="text-xs text-amber-600 font-medium">Resume to complete your attempt</p>
                        </div>
                    )}

                    {status === "Upcoming" && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <FaRegClock className="text-blue-500 text-xl" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-400 font-semibold uppercase tracking-wide">Starts At</p>
                                <p className="text-sm font-black text-blue-600">{formatDate(quiz.startsAt)}</p>
                            </div>
                        </div>
                    )}

                    {status === "Not Attempted" && (
                        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 text-center">
                            <FaLock className="text-gray-300 text-3xl mx-auto mb-3" />
                            <p className="text-sm font-semibold text-gray-400">Not attempted yet</p>
                            <p className="text-xs text-gray-400 mt-1">Start this quiz to track your progress.</p>
                        </div>
                    )}
                </div>

                <div className="px-5 py-4 border-t border-gray-100">
                    {status === "Completed" && (
                        <div className="flex gap-3">
                            <button onClick={() => { onClose(); onViewAnalytics(quiz); }}
                                className="flex-1 h-11 rounded-xl border-2 text-sm font-bold transition flex items-center justify-center gap-2 hover:opacity-80"
                                style={{ borderColor: c.accent, color: c.accent, background: c.light }}>
                                <FaChartBar /> Analytics
                            </button>
                            <button onClick={() => { onClose(); onRetakeQuiz(quiz); }}
                                className="flex-1 h-11 rounded-xl text-white text-sm font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                                style={{ background: c.accent }}>
                                <FaRedo /> Retake
                            </button>
                        </div>
                    )}
                    {status === "In Progress" && (
                        <button onClick={() => { onClose(); onResumeQuiz(quiz); }}
                            className="w-full h-11 rounded-xl text-white text-sm font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                            style={{ background: c.accent }}>
                            <FaPlay /> Resume Quiz
                        </button>
                    )}
                    {status === "Upcoming" && (
                        <button className="w-full h-11 rounded-xl bg-gray-100 text-gray-400 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2">
                            <FaLock /> Not Available Yet
                        </button>
                    )}
                    {status === "Not Attempted" && (
                        <button onClick={() => { onClose(); onStartQuiz(quiz); }}
                            className="w-full h-11 rounded-xl text-white text-sm font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                            style={{ background: c.accent }}>
                            <FaPlay /> Start Quiz
                        </button>
                    )}
                </div>
            </div>
            <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
        </>
    );
};

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const StatusBadge = ({ status }) => {
    const map = {
        Completed: { bg: "bg-[#eafaf0]", text: "text-[#16a34a]", icon: <FaCheck className="text-[10px]" /> },
        "In Progress": { bg: "bg-[#fff7e8]", text: "text-[#f59e0b]", icon: <FaTrophy className="text-[10px]" /> },
        Upcoming: { bg: "bg-[#edf4ff]", text: "text-[#2563eb]", icon: <FaHourglassHalf className="text-[10px]" /> },
        "Not Attempted": { bg: "bg-gray-100", text: "text-gray-500", icon: null },
    };
    const s = map[status] || map["Not Attempted"];
    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
            {s.icon}{status}
        </span>
    );
};
const MetaPill = ({ icon, label }) => (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">{icon} {label}</span>
);
const ScoreRing = ({ score, color }) => {
    const r = 28, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
    return (
        <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 36 36)" />
            <text x="36" y="41" textAnchor="middle" fontSize="13" fontWeight="800" fill={color}>{score}%</text>
        </svg>
    );
};

/* ═══════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════ */
const Quizzes = () => {
    const [activeTab, setActiveTab] = useState("All Quizzes");
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizPlayerState, setQuizPlayerState] = useState(null);
    const [analyticsQuiz, setAnalyticsQuiz] = useState(null);

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchQuizzes = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await studentQuizApi.getQuizzes();
            console.log("Quiz API Response:", res.data);
            const data = unwrap(res);
            const list = Array.isArray(data) ? data : (data?.content || []);

            console.log("Quiz Object:", JSON.stringify(list[0], null, 2));

            setQuizzes(list);
        } catch (err) {
            console.error("getQuizzes error:", err);
            setError(err?.response?.data?.message || "Failed to load quizzes.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchQuizzes(); }, [fetchQuizzes]);

    /* ── Build display rows ── */
    const displayQuizzes = quizzes.map(q => {
        const status = deriveStatus(q);
        const attempt = q.latestAttempt || q.attempt;
        let scoreLabel = "";
        if (status === "Completed") scoreLabel = `${Math.round(attempt?.percentage ?? attempt?.score ?? 0)}%`;
        else if (status === "In Progress") scoreLabel = `${attempt?.answeredCount ?? 0}/${q.questions?.length ?? q.totalQuestions ?? "?"}`;
        else if (status === "Upcoming") scoreLabel = formatDate(q.startsAt);

        return {
            ...q,
            id: q.quizId || q.id,
            status,
            scoreLabel,
            questionCount:
                q.questionCount ??
                q.totalQuestions ??
                q.numberOfQuestions ??
                q.questions?.length ??
                0,
        };
    });

    const tabFiltered = activeTab === "All Quizzes" ? displayQuizzes
        : activeTab === "Upcoming" ? displayQuizzes.filter(i => i.status === "Upcoming")
            : activeTab === "Attempted" ? displayQuizzes.filter(i => i.status === "Completed" || i.status === "In Progress")
                : activeTab === "Quiz Results" ? displayQuizzes.filter(i => i.status === "Completed")
                    : displayQuizzes;

    /* ── Quick stats ── */
    const stats = {
        total: quizzes.length,
        attempted: displayQuizzes.filter(q => q.status === "Completed" || q.status === "In Progress").length,
        completed: displayQuizzes.filter(q => q.status === "Completed"),
    };
    const avgScore = stats.completed.length
        ? Math.round(stats.completed.reduce((sum, q) => sum + Math.round(q.latestAttempt?.percentage ?? q.attempt?.percentage ?? 0), 0) / stats.completed.length)
        : 0;

    /* ── Quiz completion callback ── */
    const handleQuizComplete = () => {
        fetchQuizzes();
    };

    return (
        <div className="p-3 sm:p-5 md:p-6 min-h-screen bg-[#f7f8fc]">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">
                            <Link to="/student/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                            <span className="mx-2">&gt;</span>
                            <span className="text-gray-600 font-medium">Quizzes</span>
                        </p>
                        <h1 className="text-xl font-bold text-[#1d1642]">Quizzes</h1>
                        <p className="text-sm text-gray-500 mt-2">Test your knowledge and track your progress</p>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Quizzes", val: stats.total, icon: <MdQuiz className="text-[#7c3aed] text-[24px]" />, bg: "bg-[#f3ebff]" },
                        { label: "Attempted", val: stats.attempted, icon: <FaClipboardCheck className="text-[#2563eb] text-[22px]" />, bg: "bg-[#e9f2ff]" },
                        { label: "Completed", val: stats.completed.length, icon: <FaCheckCircle className="text-[#16a34a] text-[22px]" />, bg: "bg-[#eafaf0]" },
                        { label: "Avg. Score", val: `${avgScore}%`, icon: <FaTrophy className="text-[#f59e0b] text-[22px]" />, bg: "bg-[#fff5e7]" },
                    ].map(s => (
                        <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                            <div className={`w-[52px] h-[52px] rounded-xl ${s.bg} flex items-center justify-center`}>{s.icon}</div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                                <h2 className="text-2xl font-bold text-[#1d1642]">{s.val}</h2>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TABS */}
                <div className="flex items-center gap-8 border-b border-gray-200 overflow-x-auto mb-6">
                    {["All Quizzes", "Upcoming", "Attempted", "Quiz Results"].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`pb-4 whitespace-nowrap text-sm font-semibold border-b-[3px] transition ${activeTab === tab ? "border-[#6d28d9] text-[#6d28d9]" : "border-transparent text-gray-500"}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* LOADING / ERROR */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <FaSpinner className="animate-spin text-3xl text-purple-400" />
                    </div>
                )}
                {!loading && error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
                        <p className="text-sm font-semibold text-red-600 mb-3">{error}</p>
                        <button onClick={fetchQuizzes} className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition">
                            Retry
                        </button>
                    </div>
                )}

                {/* QUIZ LIST */}
                {!loading && !error && (
                    <div className="space-y-4">
                        {tabFiltered.length === 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                                <MdQuiz className="text-4xl text-gray-300 mx-auto mb-3" />
                                <p className="text-sm font-semibold text-gray-400">No quizzes found</p>
                            </div>
                        )}
                        {tabFiltered.map(quiz => {
                            const c = colorFor(quiz.id);
                            return (
                                <div key={quiz.quizId || quiz.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className={`w-[60px] h-[60px] rounded-full flex items-center justify-center shrink-0 ${c.bg}`}>
                                            <MdQuiz className={`text-[30px] ${c.text}`} />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold text-[#1d1642]">{quiz.title}</h2>
                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                                <span>{quiz.quizType || "Quiz"}</span><span>•</span><span>
                                                    {quiz.questionCount ||
                                                        quiz.totalQuestions ||
                                                        quiz.numberOfQuestions ||
                                                        quiz.questions?.length ||
                                                        "N/A"} Questions
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                                                <div className="flex items-center gap-2"><FaCalendarAlt /><span>{formatDate(quiz.createdAt)}</span></div>
                                                <span>•</span>
                                                <div className="flex items-center gap-2"><HiOutlineClock /><span>{quiz.durationInMinutes ?? "—"} mins</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between lg:justify-end gap-6">
                                        <div className="text-right">
                                            {quiz.status === "Completed" && <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eafaf0] text-[#16a34a] text-sm font-semibold"><FaCheck className="text-[11px]" />Completed</span>}
                                            {quiz.status === "In Progress" && <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fff7e8] text-[#f59e0b] text-sm font-semibold"><FaTrophy className="text-[11px]" />In Progress</span>}
                                            {quiz.status === "Upcoming" && <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#edf4ff] text-[#2563eb] text-sm font-semibold"><FaHourglassHalf className="text-[11px]" />Upcoming</span>}
                                            {quiz.status === "Not Attempted" && <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">Not Attempted</span>}
                                            <div className="mt-3">
                                                {quiz.status === "Completed" && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"><FaTrophy className="text-green-600 text-lg" /></div>
                                                        <div className="flex flex-col text-center">
                                                            <span className="text-xs text-gray-500">Score</span>
                                                            <span className="text-2xl font-bold text-green-600 leading-none mt-1">{quiz.scoreLabel}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {quiz.status === "In Progress" && (<><h2 className="text-2xl font-bold text-[#1d1642] text-center">{quiz.scoreLabel}</h2><p className="text-sm text-gray-500 text-center">Answered</p></>)}
                                                {quiz.status === "Upcoming" && (<><p className="text-sm text-gray-500 text-center">Starts</p><h2 className="text-sm font-bold text-[#1d1642] text-center">{quiz.scoreLabel}</h2></>)}
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedQuiz(quiz)}
                                            className="w-[40px] h-[40px] rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                                            <FaChevronRight className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* BOTTOM CTA */}
                <div className="mt-8 bg-[#f6f0ff] border border-[#ede2ff] rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div>
                        <h2 className="text-2xl font-bold text-[#4320a5]">Ready for a Challenge?</h2>
                        <p className="text-gray-600 mt-2 text-sm">Take quizzes regularly to boost your learning.</p>
                    </div>
                    <button onClick={fetchQuizzes} className="h-[50px] px-8 bg-[#6d28d9] hover:bg-[#5b21b6] transition rounded-xl text-white font-semibold text-sm">
                        Refresh Quizzes →
                    </button>
                </div>
            </div>

            {/* DRAWER */}
            {selectedQuiz && (
                <QuizDetailDrawer
                    quizSummary={selectedQuiz}
                    onClose={() => setSelectedQuiz(null)}
                    onStartQuiz={q => setQuizPlayerState({ quiz: q, mode: "start" })}
                    onResumeQuiz={q => setQuizPlayerState({ quiz: q, mode: "resume" })}
                    onRetakeQuiz={q => setQuizPlayerState({ quiz: q, mode: "retake" })}
                    onViewAnalytics={q => setAnalyticsQuiz(q)}
                />
            )}

            {/* QUIZ PLAYER — fullscreen */}
            {quizPlayerState && (
                <QuizPlayer
                    quiz={quizPlayerState.quiz}
                    mode={quizPlayerState.mode}
                    onClose={() => { setQuizPlayerState(null); fetchQuizzes(); }}
                    onComplete={handleQuizComplete}
                />
            )}

            {/* ANALYTICS */}
            {analyticsQuiz && (
                <AnalyticsModal quiz={analyticsQuiz} onClose={() => setAnalyticsQuiz(null)} />
            )}
        </div>
    );
};

export default Quizzes;
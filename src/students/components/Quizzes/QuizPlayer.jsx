// src/students/components/Quizzes/QuizPlayer.jsx

import React, { useState, useEffect, useRef } from "react";

import {
    FaSpinner,
    FaTimes,
    FaListUl,
    FaCheck,
    FaArrowLeft,
    FaArrowRight,
    FaRegClock
} from "react-icons/fa";

import { MdQuiz } from "react-icons/md";

import { studentQuizApi } from "../../auth/api";
import {
    colorFor,
    unwrap,
    mergeNonNull,
    extractScoreData
} from "./Helpers";


const QuizPlayer = ({ quiz, mode, onClose, onComplete }) => {
    const c = colorFor(quiz.quizId || quiz.id);
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

    useEffect(() => {
        // NOTE: no persistent "already initialized" ref guard here on purpose.
        // In dev, StrictMode mounts -> tears down -> remounts this effect once.
        // The first invocation's `active` flag gets set to false by its own
        // cleanup before the network call resolves (its result is correctly
        // discarded below). The second invocation gets a fresh `active = true`
        // and completes normally, calling setLoading(false). A ref-based guard
        // that blocks the *second* invocation from running at all causes the
        // component to get stuck in the loading state forever, since the only
        // invocation that ran already has active=false by the time it resolves.
        let active = true;

        const callStart = () => studentQuizApi.startQuiz(quiz.id);
        const callResume = () => studentQuizApi.resumeQuiz(quiz.id);
        const callRetry = () => studentQuizApi.retryQuiz(quiz.id);

        const plan = mode === "resume" ? [callResume, callRetry]
            : (mode === "retake" || mode === "retry") ? [callRetry, callResume]
                : [callStart, callResume, callRetry];

        const init = async () => {
            setLoading(true);
            setError("");

            let res = null;
            let firstErr = null;

            for (let i = 0; i < plan.length; i++) {
                try {
                    res = await plan[i]();
                    break;
                } catch (err) {
                    if (i === 0) firstErr = err;
                    console.warn(`[QuizPlayer] init step ${i + 1}/${plan.length} failed:`, err?.response?.status, err?.response?.data);
                }
            }

            if (!active) return;

            if (!res) {
                console.error("[QuizPlayer] all init attempts failed:", firstErr);
                setError(firstErr?.response?.data?.message || "Failed to load quiz. Please try again.");
                setLoading(false);
                return;
            }

            try {
                const data = unwrap(res);
                console.log("[QuizPlayer] init response:", data);

                const aId = data?.attemptId || data?.id || data?.attempt?.id;
                let qList = data?.questions || data?.attempt?.questions || [];

                if ((!qList || qList.length === 0) && aId) {
                    const qRes = await studentQuizApi.getAttemptQuestions(aId);
                    const qData = unwrap(qRes);
                    qList = qData?.content || qData?.questions || qData || [];
                }

                setAttemptId(aId);
                setQuestions(Array.isArray(qList) ? qList : []);

                const existing = {};
                (Array.isArray(qList) ? qList : []).forEach(q => {
                    const saved = q.selectedOptionId || q.savedOptionId || q.answer?.selectedOptionId || q.answer?.optionId;
                    if (saved) existing[q.id] = saved;
                });
                setAnswers(existing);

                const duration = quiz.durationInMinutes || data?.durationInMinutes;
                if (duration) setTimeLeft(duration * 60);
            } catch (err) {
                console.error("[QuizPlayer] post-init processing error:", err);
                if (active) setError(err?.response?.data?.message || "Failed to load quiz. Please try again.");
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
                    if (attemptId && !isSubmittingRef.current) handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [submitted, timeLeft, attemptId]);

    useEffect(() => () => clearInterval(timerRef.current), []);

    const mins = timeLeft !== null ? String(Math.floor(timeLeft / 60)).padStart(2, "0") : "--";
    const secs = timeLeft !== null ? String(timeLeft % 60).padStart(2, "0") : "--";
    const answeredCount = Object.keys(answers).length;
    const progress = questions.length ? ((current + 1) / questions.length) * 100 : 0;

    /* ── Save answer ── */
    const selectOption = async (questionId, optionId) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));

        if (!attemptId) return;

        setSavingAnswer(true);

        try {
            await studentQuizApi.saveAnswer(attemptId, {
                questionId,
                selectedOptionId: optionId
            });
        } catch (err) {
            console.error("[QuizPlayer] save-answer error:", err);
        } finally {
            setSavingAnswer(false);
        }
    };

    const handleSubmit = async () => {
        if (isSubmittingRef.current) return;
        if (!attemptId) { setError("No attempt ID. Please reload."); return; }
        isSubmittingRef.current = true;
        setSubmitting(true);
        clearInterval(timerRef.current);
        try {
            const answersArray = Object.entries(answers).map(([qId, oId]) => ({
                questionId: Number(qId),
                selectedOptionId: Number(oId),
            }));

            const submitRes = await studentQuizApi.submitAttempt(attemptId, { answers: answersArray });
            const submitData = unwrap(submitRes);
            console.log("[QuizPlayer] submit response:", submitData);

            let resultData = null;
            try {
                const resRes = await studentQuizApi.getAttemptResult(attemptId);
                resultData = unwrap(resRes);
                console.log("[QuizPlayer] result response:", resultData);
            } catch (resErr) {
                console.warn("[QuizPlayer] getAttemptResult failed, falling back to submit response only:", resErr);
            }

            const merged = mergeNonNull(resultData, submitData);
            setResult(merged);
            setSubmitted(true);

            const scoreData = extractScoreData(merged);
            if (onComplete) onComplete(quiz.id, scoreData?.percentage ?? 0);
        } catch (err) {
            console.error("[QuizPlayer] submit error:", err);
            setError(err?.response?.data?.message || "Submission failed. Please try again.");
            isSubmittingRef.current = false;
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Loading ── */
    if (loading) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-3">
                <FaSpinner className="animate-spin text-3xl text-purple-500" />
                <p className="text-sm text-gray-400 font-medium">Loading quiz…</p>
            </div>
        </div>
    );

    /* ── Error ── */
    if (error && !submitted) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-6">
            <div className="text-center max-w-sm">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-sm font-semibold text-red-600 mb-4">{error}</p>
                <button onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-200 transition">
                    Close
                </button>
            </div>
        </div>
    );

    /* ── Result screen ── */
    if (submitted) {
        const scoreData = extractScoreData(result);
        const hasScore = scoreData !== null;
        const pct = hasScore ? scoreData.percentage : null;
        const correctCount = scoreData?.correct ?? null;
        const wrongCount = scoreData?.wrong ?? null;
        const skippedCount = scoreData?.skipped ?? (questions.length - answeredCount);
        const reviewQs = result?.questions || questions;
        const passed = hasScore ? (pct >= 70) : null;

        return (
            <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                            <MdQuiz className={`${c.text} text-lg`} />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400">{quiz.quizType || "Quiz"}</p>
                            <p className="text-sm font-bold text-gray-900">{quiz.title}</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <FaTimes className="text-gray-400 text-xs" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto flex items-start justify-center py-10 px-4">
                    <div className="w-full max-w-xl space-y-5">
                        <div className="rounded-3xl overflow-hidden"
                            style={{ background: !hasScore ? "linear-gradient(135deg,#f3f4f6,#e5e7eb)" : passed ? "linear-gradient(135deg,#eafaf0,#d1fae5)" : "linear-gradient(135deg,#fff1f2,#fecdd3)" }}>
                            <div className="px-8 pt-10 pb-6 text-center">
                                {hasScore ? (
                                    <>
                                        <div className="text-5xl mb-3">{passed ? "🎉" : "📚"}</div>
                                        <h2 className="text-2xl font-black text-gray-900">
                                            {passed ? "Well Done!" : "Keep Practicing!"}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">{quiz.title}</p>
                                        <div className="mt-5 inline-flex">
                                            <svg width="110" height="110" viewBox="0 0 110 110">
                                                <circle cx="55" cy="55" r="44" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                                <circle cx="55" cy="55" r="44" fill="none"
                                                    stroke={passed ? "#16a34a" : "#dc2626"} strokeWidth="8"
                                                    strokeDasharray={`${(pct / 100) * 276.5} 276.5`}
                                                    strokeLinecap="round" transform="rotate(-90 55 55)" />
                                                <text x="55" y="61" textAnchor="middle" fontSize="22" fontWeight="900"
                                                    fill={passed ? "#16a34a" : "#dc2626"}>{pct}%</text>
                                            </svg>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-5xl mb-3">✅</div>
                                        <h2 className="text-2xl font-black text-gray-900">Quiz Submitted!</h2>
                                        <p className="text-sm text-gray-500 mt-1">{quiz.title}</p>
                                        <p className="text-xs text-gray-400 mt-4 max-w-xs mx-auto">
                                            We didn't receive a score in the response yet — check the Report from the quiz list in a moment.
                                        </p>
                                    </>
                                )}
                            </div>
                            {hasScore && (
                                <div className="grid grid-cols-3 gap-px bg-white/30">
                                    {[
                                        { label: "Correct", val: correctCount ?? "—", color: "#16a34a" },
                                        { label: "Wrong", val: scoreData.wrong ?? 0, color: "#dc2626" },
                                        { label: "Skipped", val: skippedCount ?? 0, color: "#6b7280" },
                                    ].map(s => (
                                        <div key={s.label} className="flex flex-col items-center py-5 bg-white/70">
                                            <span className="text-2xl font-black" style={{ color: s.color }}>{s.val}</span>
                                            <span className="text-xs text-gray-400 mt-0.5">{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Question Review</p>
                            </div>
                            <div className="px-6 py-4 space-y-2">
                                {reviewQs.map((q, i) => {
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
                                                    <p className="text-xs text-green-600 mt-0.5 font-medium">
                                                        Correct: {correctOpt.optionText}
                                                    </p>
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
                            className="w-full h-12 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
                            style={{ background: c.accent }}>
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ── No questions ── */
    if (!questions.length) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-6">
            <div className="text-center max-w-sm">
                <FaListUl className="text-3xl text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-500 mb-4">No questions found for this quiz.</p>
                <button onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-200 transition">
                    Close
                </button>
            </div>
        </div>
    );

    const q = questions[current];

    /* ── Player ── */
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">

            <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                        <MdQuiz className={`${c.text} text-lg`} />
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-400">{quiz.quizType || "Quiz"}</p>
                        <p className="text-sm font-bold text-gray-900 max-w-[220px] lg:max-w-none truncate">{quiz.title}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {timeLeft !== null && (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${timeLeft <= 60 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>
                            <FaRegClock className="text-[10px]" /> {mins}:{secs}
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
                                    {answeredCount} / {questions.length} answered
                                </span>
                            </div>

                            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 leading-snug">
                                {q.questionText || q.q}
                            </h3>
                            {q.marks !== undefined && (
                                <p className="text-xs text-gray-400 mb-6">Marks: {q.marks}</p>
                            )}

                            <div className="space-y-3">
                                {(q.options || []).map((opt) => {
                                    const selected = answers[q.id] === opt.id;
                                    return (
                                        <button key={opt.id} onClick={() => selectOption(q.id, opt.id)}
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
                                                        color: selected ? "#fff" : "#9ca3af",
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
                            <button onClick={() => setCurrent(p => Math.max(0, p - 1))}
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
                                                background: i === current ? c.accent
                                                    : answers[qq.id] !== undefined ? "#d1fae5"
                                                        : "#e5e7eb",
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
                                    {submitting ? <FaSpinner className="animate-spin text-xs" /> : <FaCheck className="text-xs" />}
                                    {submitting ? "Submitting…" : "Submit"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex flex-col w-72 border-l border-gray-100 bg-gray-50 overflow-y-auto">
                    <div className="px-5 py-5 flex-1">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Progress</p>
                        <div className="grid grid-cols-2 gap-2 mb-5">
                            {[
                                { label: "Answered", val: answeredCount, color: "#16a34a", bg: "#eafaf0" },
                                { label: "Remaining", val: questions.length - answeredCount, color: "#f59e0b", bg: "#fff7e8" },
                                { label: "Total", val: questions.length, color: "#2563eb", bg: "#eaf2ff" },
                                {
                                    label: "Time Left", val: timeLeft !== null ? `${mins}:${secs}` : "—",
                                    color: timeLeft !== null && timeLeft <= 60 ? "#dc2626" : "#6b7280",
                                    bg: timeLeft !== null && timeLeft <= 60 ? "#fff1f1" : "#f3f4f6"
                                },
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
                                const isCur = i === current;
                                const isAns = answers[qq.id] !== undefined;
                                return (
                                    <button key={qq.id || i} onClick={() => setCurrent(i)}
                                        className="h-9 rounded-lg text-xs font-bold transition-all"
                                        style={{
                                            background: isCur ? c.accent : isAns ? "#d1fae5" : "#fff",
                                            color: isCur ? "#fff" : isAns ? "#059669" : "#9ca3af",
                                            border: isCur ? `2px solid ${c.accent}` : "1.5px solid #e5e7eb",
                                        }}>
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex-shrink-0 px-5 pb-5">
                        <button onClick={handleSubmit} disabled={submitting || !attemptId}
                            className="w-full h-11 rounded-xl text-white font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60">
                            {submitting ? <FaSpinner className="animate-spin text-xs" /> : <FaCheck className="text-xs" />}
                            Submit Quiz
                        </button>
                    </div>
                </div>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center" style={{ animation: "popIn .2s ease" }}>
                        <div className="text-4xl mb-3">⚠️</div>
                        <h3 className="text-base font-bold text-gray-900">Exit Quiz?</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-5">
                            Your saved answers remain — you can resume right where you left off.
                        </p>
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


export default QuizPlayer;
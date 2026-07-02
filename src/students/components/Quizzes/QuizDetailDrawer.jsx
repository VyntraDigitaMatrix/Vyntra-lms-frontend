import React, { useState, useEffect } from 'react';
import { studentQuizApi } from "../../auth/api";
import { ScoreRing } from "./AnalyticsModal";
import ActionButton from "./ActionButton";
import { colorFor, deriveStatus, extractScoreData, unwrap } from "./Helpers";
import { StatusBadge, MetaPill } from '../../Quiz';
import { MdQuiz } from "react-icons/md";
import { FaTimes, FaListUl, FaAward, FaRedo, FaSpinner, FaChartBar, FaLock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { HiOutlineClock } from "react-icons/hi";


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
                if (active && data) setQuiz(prev => ({ ...prev, ...data }));
            } catch (err) {
                console.error("[QuizDetailDrawer] getQuizById error:", err);
                if (active) setError("Failed to load quiz details.");
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => { active = false; };
    }, [quizSummary.id]);

    const status = deriveStatus(quiz);
    const questionCount = quiz.questions?.length ?? quiz.questionCount ?? quiz.totalQuestions ?? "—";
    const attempt = quiz.attempt || quiz.latestAttempt;
    const scoreData = extractScoreData(attempt);

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
                style={{ animation: "slideIn .25s ease" }}>

                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                            <MdQuiz className={`text-xl ${c.text}`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">{quiz.quizType || "Quiz"}</p>
                            <h2 className="text-sm font-bold text-gray-900 max-w-[220px] leading-tight">{quiz.title}</h2>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <FaTimes className="text-gray-500 text-xs" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                    <StatusBadge status={status} />

                    {quiz.description && (
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{quiz.description}</p>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        <MetaPill icon={<FaListUl />} label={`${questionCount} Questions`} />
                        <MetaPill icon={<HiOutlineClock />} label={`${quiz.durationInMinutes ?? "—"} mins`} />
                        <MetaPill icon={<FaAward />} label={`Pass: ${quiz.passingMarks ?? "—"}/${quiz.totalMarks ?? "—"}`} />
                        {quiz.maxAttempts && <MetaPill icon={<FaRedo />} label={`Max: ${quiz.maxAttempts} attempts`} />}
                        {quiz.remainingAttempts !== undefined && (
                            <MetaPill icon={<FaRedo />} label={`${quiz.remainingAttempts} attempts left`} />
                        )}
                    </div>

                    {loading && (
                        <div className="flex justify-center py-6">
                            <FaSpinner className="animate-spin text-purple-400" />
                        </div>
                    )}
                    {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

                    {status === "Completed" && (
                        scoreData ? (
                            <div
                                className={`rounded-2xl p-5 border ${scoreData.passed
                                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-100"
                                    : "bg-gradient-to-br from-red-50 to-rose-50 border-red-100"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">
                                            Your Score
                                        </p>

                                        <p
                                            className={`text-3xl font-black ${scoreData.passed
                                                ? "text-green-600"
                                                : "text-red-600"
                                                }`}
                                        >
                                            {scoreData.percentage}%
                                        </p>

                                        <p
                                            className={`flex items-center gap-1.5 text-xs font-semibold mt-1 ${scoreData.passed
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }`}
                                        >
                                            {scoreData.passed ? (
                                                <>
                                                    <FaCheckCircle />
                                                    Passed
                                                </>
                                            ) : (
                                                <>
                                                    <FaTimesCircle />
                                                    Failed
                                                </>
                                            )}
                                        </p>
                                    </div>

                                    <div className="w-16 h-16">
                                        <ScoreRing
                                            score={scoreData.percentage}
                                            color={scoreData.passed ? "#16a34a" : "#dc2626"}
                                        />
                                    </div>

                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                                <p className="text-xs text-gray-400">Score details aren't available yet — check the Report for more.</p>
                            </div>
                        )
                    )}

                    {status === "In Progress" && attempt && (
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Answered</span>
                                <span className="font-bold text-gray-900">{attempt.answeredCount ?? "—"} / {questionCount}</span>
                            </div>
                            <p className="text-xs text-amber-600 font-medium">You left this quiz mid-way — resume to finish it.</p>
                        </div>
                    )}

                    {status === "Upcoming" && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <FaRegClock className="text-blue-500 text-xl" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-400 font-semibold uppercase tracking-wide">Not Available Yet</p>
                                <p className="text-sm font-black text-blue-600">This quiz hasn't opened yet</p>
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

                <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
                    {status === "Completed" ? (
                        <div className="flex gap-3">
                            <button onClick={() => { onClose(); onViewAnalytics(quiz); }}
                                className="flex-1 h-11 rounded-xl border-2 text-sm font-bold transition flex items-center justify-center gap-2 hover:opacity-80"
                                style={{ borderColor: c.accent, color: c.accent, background: c.light }}>
                                <FaChartBar /> Analytics
                            </button>
                            {quiz.remainingAttempts === 0 ? (
                                <button disabled
                                    className="flex-1 h-11 rounded-xl bg-gray-100 text-gray-400 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2">
                                    <FaLock /> Max Attempts Reached
                                </button>
                            ) : (
                                <button onClick={() => { onClose(); onRetakeQuiz(quiz); }}
                                    className="flex-1 h-11 rounded-xl text-white text-sm font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                                    style={{ background: c.accent }}>
                                    <FaRedo /> Attempt Again
                                </button>
                            )}
                        </div>
                    ) : (
                        <ActionButton
                            status={status}
                            accent={c.accent}
                            light={c.light}
                            remainingAttempts={quiz.remainingAttempts}
                            onStart={() => { onClose(); onStartQuiz(quiz); }}
                            onResume={() => { onClose(); onResumeQuiz(quiz); }}
                            onAttemptAgain={() => { onClose(); onRetakeQuiz(quiz); }}
                        />
                    )}
                </div>
            </div>
            <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
        </>
    );
};

export default QuizDetailDrawer;
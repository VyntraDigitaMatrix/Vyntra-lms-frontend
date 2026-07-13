import React, { useState, useEffect } from 'react';
import { studentQuizApi } from "../../auth/api";
import { colorFor, unwrap, extractScoreData, } from "./Helpers";
import { FaChartBar, FaTimes, FaSpinner, FaCheckCircle, FaTimesCircle, FaForward, FaClock, FaMedal } from "react-icons/fa"

export const ScoreRing = ({ score, color }) => {
    const r = 28, circ = 2 * Math.PI * r;
    return (
        <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
                strokeDasharray={`${(score / 100) * circ} ${circ}`}
                strokeLinecap="round" transform="rotate(-90 36 36)" />
            <text x="36" y="41" textAnchor="middle" fontSize="13" fontWeight="800" fill={color}>{score}%</text>
        </svg>
    );
};

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
                const attemptId =
                    quiz.attempt?.attemptId ||
                    quiz.attempt?.id ||
                    quiz.latestAttempt?.attemptId ||
                    quiz.latestAttempt?.id;
                if (!attemptId) throw new Error("No completed attempt found for this quiz yet.");
                const res = await studentQuizApi.getAttemptResult(attemptId);
                if (active) setResult(unwrap(res));
            } catch (err) {
                console.error("[AnalyticsModal] error:", err);
                if (active) setError(err?.response?.data?.message || err.message || "Failed to load analytics.");
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => { active = false; };
    }, [quiz.id]);

    const scoreData = extractScoreData(result);
    const reviewQs = result?.questions || [];

    const attempt = quiz?.attempt || {};

    let completionTime = "—";

    if (attempt.startedAt && attempt.submittedAt) {
        const diffMs =
            new Date(attempt.submittedAt) -
            new Date(attempt.startedAt);

        const minutes = Math.floor(diffMs / 60000);
        const seconds = Math.floor((diffMs % 60000) / 1000);

        completionTime = `${minutes}m ${seconds}s`;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
                style={{ maxHeight: "90vh", animation: "popIn .3s cubic-bezier(.34,1.56,.64,1)" }}>

                <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                            <FaChartBar className={`text-base ${c.text}`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Analytics Report</p>
                            <h2 className="text-sm font-bold text-gray-900 max-w-[220px] truncate">{quiz.title}</h2>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
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
                ) : !scoreData ? (
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <p className="text-sm text-gray-500 mb-3">
                            We couldn't find score fields in the server's response for this attempt. Here's the
                            raw data that came back — if you share this with the dev, it'll pin down the right
                            field names:
                        </p>
                        <pre className="bg-gray-50 rounded-xl p-3 text-[11px] text-gray-600 overflow-x-auto max-h-64 whitespace-pre-wrap">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                ) : (
                    <>
                        <div className="px-6 py-5 flex-shrink-0" style={{ background: scoreData.passed ? "linear-gradient(135deg,#eafaf0,#fff)" : "linear-gradient(135deg,#fff1f2,#fff)" }}>
                            <div className="flex items-center gap-5">
                                <ScoreRing score={scoreData.percentage} color={scoreData.passed ? "#16a34a" : "#dc2626"} />
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Final Score</p>
                                    <p className="text-3xl font-black" style={{ color: scoreData.passed ? "#16a34a" : "#dc2626" }}>{scoreData.percentage}%</p>
                                    <span
                                        className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold ${scoreData.passed
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {scoreData.passed ? (
                                            <>
                                                <FaMedal />
                                                Passed
                                            </>
                                        ) : (
                                            <>
                                                <FaTimesCircle />
                                                Not Passed
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex border-b border-gray-100 px-6 flex-shrink-0">
                            {["overview", "questions"].map(t => (
                                <button key={t} onClick={() => setTab(t)}
                                    className={`pb-3 pt-3 mr-6 text-xs font-semibold capitalize border-b-2 transition ${tab === t ? "text-purple-700" : "border-transparent text-gray-400"}`}
                                    style={{ borderColor: tab === t ? c.accent : "transparent" }}>
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            {tab === "overview" && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "Correct", val: scoreData.correct ?? "—", icon: <FaCheckCircle />, color: "#16a34a", bg: "#eafaf0" },
                                            { label: "Wrong", val: scoreData.wrong ?? "—", icon: <FaTimesCircle />, color: "#dc2626", bg: "#fff1f1" },
                                            { label: "Skipped", val: scoreData.skipped ?? "—", icon: <FaForward />, color: "#6b7280", bg: "#f3f4f6" },
                                            { label: "Time Taken", val: completionTime, icon: <FaClock />, color: "#2563eb", bg: "#eaf2ff" }
                                        ].map(s => (
                                            <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: s.bg }}>
                                                <span className="text-xl" style={{ color: s.color }}>{s.icon}</span>
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
                                            <span className="font-bold" style={{ color: c.accent }}>{scoreData.percentage}%</span>
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${scoreData.percentage}%`, background: c.accent }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {tab === "questions" && (
                                <div className="space-y-3">
                                    {reviewQs.length === 0 ? (
                                        <p className="text-xs text-gray-400 text-center py-8">No question details available.</p>
                                    ) : reviewQs.map((q, i) => {
                                        const skipped = !q.selectedOption;
                                        const isCorrect = q.correct;
                                        return (
                                            <div key={q.questionId || i} className="flex items-start gap-3 p-3 rounded-xl"
                                                style={{ background: skipped ? "#f9fafb" : isCorrect ? "#eafaf0" : "#fff1f1" }}>
                                                <span className="text-sm font-bold shrink-0 mt-0.5"
                                                    style={{ color: skipped ? "#9ca3af" : isCorrect ? "#16a34a" : "#dc2626" }}>
                                                    {skipped ? "–" : isCorrect ? "✓" : "✗"}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-700">{i + 1}. {q.questionText}</p>
                                                    {!skipped && !isCorrect && q.correctOption && (
                                                        <p className="text-xs text-green-600 mt-0.5 font-medium">
                                                            Correct: {q.correctOption}
                                                        </p>
                                                    )}
                                                    {!skipped && q.selectedOption && (
                                                        <p className="text-xs text-gray-400 mt-0.5">Your answer: {q.selectedOption}</p>
                                                    )}
                                                    {q.explanation && (
                                                        <p className="text-[11px] text-gray-400 mt-1 italic">{q.explanation}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
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

export default AnalyticsModal
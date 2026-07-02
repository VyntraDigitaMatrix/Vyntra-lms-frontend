import React, { useState, useEffect, useCallback } from "react";
import { studentQuizApi } from "../../auth/api";
import {
  FaCrown,
  FaMedal,
  FaSpinner,
  FaTrophy,
  FaChevronLeft,
} from "react-icons/fa";
import { FaChevronRight as FaChevronRightIcon } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi";

const LeaderboardModal = ({ quiz, onClose }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const PAGE_SIZE = 10;

    const fetchLeaderboard = useCallback(async (p = 0) => {
        setLoading(true);
        setError("");
        try {
            const quizId = quiz.quizId ?? quiz.id;
            const res = await studentQuizApi.getLeaderboard(quizId, p, PAGE_SIZE);
            const body = res?.data?.data ?? res?.data;
            const list = Array.isArray(body) ? body
                : Array.isArray(body?.content) ? body.content
                    : Array.isArray(body?.leaderboard) ? body.leaderboard
                        : [];
            const pages = body?.totalPages ?? body?.data?.totalPages ?? 1;
            setEntries(list);
            setTotalPages(pages);
            setPage(p);
        } catch (err) {
            console.error("Leaderboard fetch failed:", err);
            setError("Couldn't load the leaderboard. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [quiz]);

    useEffect(() => { fetchLeaderboard(0); }, [fetchLeaderboard]);

    const medalConfig = [
        { icon: <FaCrown className="text-amber-400 text-lg" />, bg: "bg-amber-50", border: "border-amber-200", rank: "1st" },
        { icon: <FaMedal className="text-slate-400 text-lg" />, bg: "bg-slate-50", border: "border-slate-200", rank: "2nd" },
        { icon: <FaMedal className="text-orange-400 text-lg" />, bg: "bg-orange-50", border: "border-orange-200", rank: "3rd" },
    ];

    const normEntry = (e) => ({
        rank: e.rank ?? e.position ?? null,
        name: e.studentName ?? e.name ?? e.userName ?? e.fullName ?? "Student",
        score: e.score ?? e.totalScore ?? e.marksObtained ?? 0,
        totalMarks: e.totalMarks ?? e.maxScore ?? quiz.totalMarks ?? null,
        percentage: e.percentage ?? e.scorePercentage ?? null,
        timeTaken: e.timeTaken ?? e.durationSeconds ?? null,
        avatar: e.avatar ?? e.profilePicture ?? null,
    });

    const formatTime = (seconds) => {
        if (!seconds) return null;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[88vh] overflow-hidden">

                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 rounded-t-2xl flex-shrink-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <FaCrown className="text-amber-300 text-lg" />
                            </div>
                            <div>
                                <h2 className="text-base font-black text-white">Leaderboard</h2>
                                <p className="text-[11px] text-purple-200 mt-0.5 truncate max-w-[220px]">{quiz.title}</p>
                            </div>
                        </div>
                        <button onClick={onClose}
                            className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition flex-shrink-0">
                            <MdClose />
                        </button>
                    </div>

                    {!loading && !error && entries.length >= 3 && (
                        <div className="flex items-end justify-center gap-3 mt-5 pb-1">
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm border-2 border-white/30">
                                    {normEntry(entries[1]).name.charAt(0).toUpperCase()}
                                </div>
                                <div className="bg-white/15 rounded-lg px-2 py-1 text-center min-w-[64px]">
                                    <p className="text-[9px] text-purple-200 font-bold">2nd</p>
                                    <p className="text-xs text-white font-black truncate max-w-[60px]">
                                        {normEntry(entries[1]).name.split(" ")[0]}
                                    </p>
                                    <p className="text-[10px] text-amber-300 font-bold">{normEntry(entries[1]).score}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1 -mt-3">
                                <FaCrown className="text-amber-300 text-base mb-0.5" />
                                <div className="w-11 h-11 rounded-full bg-white/25 flex items-center justify-center text-white font-black text-base border-2 border-amber-300/60">
                                    {normEntry(entries[0]).name.charAt(0).toUpperCase()}
                                </div>
                                <div className="bg-white/20 rounded-lg px-2 py-1 text-center min-w-[72px] border border-amber-300/30">
                                    <p className="text-[9px] text-amber-300 font-bold">1st</p>
                                    <p className="text-xs text-white font-black truncate max-w-[68px]">
                                        {normEntry(entries[0]).name.split(" ")[0]}
                                    </p>
                                    <p className="text-[10px] text-amber-300 font-bold">{normEntry(entries[0]).score}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm border-2 border-white/30">
                                    {normEntry(entries[2]).name.charAt(0).toUpperCase()}
                                </div>
                                <div className="bg-white/15 rounded-lg px-2 py-1 text-center min-w-[64px]">
                                    <p className="text-[9px] text-purple-200 font-bold">3rd</p>
                                    <p className="text-xs text-white font-black truncate max-w-[60px]">
                                        {normEntry(entries[2]).name.split(" ")[0]}
                                    </p>
                                    <p className="text-[10px] text-amber-300 font-bold">{normEntry(entries[2]).score}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading && (
                        <div className="flex items-center justify-center py-16">
                            <FaSpinner className="animate-spin text-2xl text-purple-400" />
                        </div>
                    )}

                    {!loading && error && (
                        <div className="p-6 text-center">
                            <p className="text-sm text-red-500 font-semibold mb-3">{error}</p>
                            <button onClick={() => fetchLeaderboard(page)}
                                className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition">
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && entries.length === 0 && (
                        <div className="py-16 text-center px-6">
                            <FaTrophy className="text-3xl text-gray-200 mx-auto mb-3" />
                            <p className="text-sm font-bold text-gray-400">No entries yet</p>
                            <p className="text-xs text-gray-400 mt-1">Be the first to complete this quiz!</p>
                        </div>
                    )}

                    {!loading && !error && entries.length > 0 && (
                        <div className="px-4 py-3 space-y-2">
                            {entries.map((raw, idx) => {
                                const e = normEntry(raw);
                                const displayRank = e.rank ?? (page * PAGE_SIZE + idx + 1);
                                const isTop3 = displayRank <= 3;
                                const rankColors = ["text-amber-500", "text-slate-400", "text-orange-400"];
                                const rankBgs = ["bg-amber-50 border-amber-100", "bg-slate-50 border-slate-100", "bg-orange-50 border-orange-100"];

                                return (
                                    <div key={idx}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition ${isTop3 ? rankBgs[displayRank - 1] : "bg-white border-gray-100 hover:border-purple-100"}`}>

                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-xs ${isTop3 ? `${rankColors[displayRank - 1]} bg-white border border-current/20` : "bg-gray-100 text-gray-500"}`}>
                                            {displayRank <= 3
                                                ? ["🥇", "🥈", "🥉"][displayRank - 1]
                                                : displayRank}
                                        </div>

                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white ${isTop3 ? "bg-gradient-to-br from-purple-500 to-indigo-600" : "bg-gradient-to-br from-gray-400 to-gray-500"}`}>
                                            {e.name.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-bold truncate ${isTop3 ? "text-gray-900" : "text-gray-700"}`}>
                                                {e.name}
                                            </p>
                                            {e.timeTaken && (
                                                <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                                    <HiOutlineClock /> {formatTime(e.timeTaken)}
                                                </p>
                                            )}
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            <p className={`text-sm font-black ${isTop3 ? "text-purple-700" : "text-gray-700"}`}>
                                                {e.score}
                                                {e.totalMarks ? <span className="text-[10px] font-medium text-gray-400">/{e.totalMarks}</span> : ""}
                                            </p>
                                            {e.percentage != null && (
                                                <p className={`text-[10px] font-bold ${e.percentage >= 80 ? "text-emerald-600" : e.percentage >= 50 ? "text-amber-600" : "text-red-500"}`}>
                                                    {Math.round(e.percentage)}%
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {!loading && !error && totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/60 flex-shrink-0">
                        <button
                            onClick={() => fetchLeaderboard(page - 1)}
                            disabled={page === 0}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 transition">
                            <FaChevronLeft className="text-[9px]" /> Prev
                        </button>
                        <span className="text-[11px] text-gray-400 font-medium">
                            Page {page + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => fetchLeaderboard(page + 1)}
                            disabled={page >= totalPages - 1}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 transition">
                            Next <FaChevronRightIcon className="text-[9px]" />
                        </button>
                    </div>
                )}

                {!loading && !error && entries.length > 0 && (
                    <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/40 flex-shrink-0 text-center">
                        <p className="text-[10px] text-gray-400">Rankings based on first attempt only · ties broken by fastest completion</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardModal;
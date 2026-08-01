import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { studentAttendanceApi } from "./auth/api";

const STATUS_STYLE = {
    IN_PROGRESS: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "In Progress" },
    COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Completed" },
    ABSENT: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Absent" },
};
function statusStyle(status) {
    return STATUS_STYLE[status] || { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", label: status || "Unknown" };
}

// ── Time / duration helpers 
function formatClock(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
function minutesToClock(totalMinutes) {
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
// Live elapsed time between punch-in and now, as HH:MM:SS
function elapsedSince(punchInIso) {
    if (!punchInIso) return "00:00:00";
    const diffSec = Math.max(0, Math.floor((Date.now() - new Date(punchInIso).getTime()) / 1000));
    const h = Math.floor(diffSec / 3600);
    const m = Math.floor((diffSec % 3600) / 60);
    const s = diffSec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ── Live Punch Clock — the signature element ────────────────────────────────
function PunchClock({ today, onPunchIn, onPunchOut, punching }) {
    const [, forceTick] = useState(0);
    const isActive = today?.status === "IN_PROGRESS";

    useEffect(() => {
        if (!isActive) return;
        const id = setInterval(() => forceTick(t => t + 1), 1000);
        return () => clearInterval(id);
    }, [isActive]);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col items-center text-center">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border mb-4
        ${isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                {isActive ? "● Session Active" : "Not Punched In"}
            </span>

            <div className="font-mono tabular-nums text-5xl sm:text-6xl font-black text-slate-900 tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
                {isActive ? elapsedSince(today.punchInTime) : "00:00:00"}
            </div>
            <p className="text-xs text-slate-400 mt-2 mb-6">
                {isActive
                    ? `Punched in at ${formatClock(today.punchInTime)}`
                    : today?.punchOutTime
                        ? `Last session ended at ${formatClock(today.punchOutTime)}`
                        : "Punch in to start tracking today's session"}
            </p>

            {isActive ? (
                <button
                    onClick={onPunchOut}
                    disabled={punching}
                    className="w-full max-w-xs py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl shadow-sm transition"
                >
                    {punching ? "Punching out…" : "Punch Out"}
                </button>
            ) : (
                <button
                    onClick={onPunchIn}
                    disabled={punching || today?.status === "COMPLETED"}
                    className="w-full max-w-xs py-3.5 bg-[#043573] hover:bg-[#043573]/90 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-sm transition"
                >
                    {punching ? "Punching in…" : today?.status === "COMPLETED" ? "Today's Session Complete" : "Punch In"}
                </button>
            )}
        </div>
    );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Attendance() {
    const [today, setToday] = useState(null);
    const [loadingToday, setLoadingToday] = useState(true);
    const [punching, setPunching] = useState(false);
    const [toast, setToast] = useState(null);

    const [history, setHistory] = useState([]);
    const [historyMeta, setHistoryMeta] = useState({ pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0, last: true });
    const [historyPage, setHistoryPage] = useState(0);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [historyError, setHistoryError] = useState("");

    function showToast(msg, type = "success") {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }

    const fetchToday = useCallback(async () => {
        setLoadingToday(true);
        try {
            const res = await studentAttendanceApi.getToday();
            setToday(res?.data?.data ?? null);
        } catch (err) {
            // A 404 here plausibly just means "no session started yet today" —
            // treat that as an empty/idle state rather than a hard error.
            if (err?.response?.status !== 404) {
                console.error("getToday failed:", err?.response?.data || err);
            }
            setToday(null);
        } finally {
            setLoadingToday(false);
        }
    }, []);

    const fetchHistory = useCallback(async (page) => {
        setLoadingHistory(true);
        setHistoryError("");
        try {
            const res = await studentAttendanceApi.getHistory(page, 10);
            const body = res?.data?.data;
            setHistory(body?.content ?? []);
            setHistoryMeta({
                pageNumber: body?.pageNumber ?? page,
                pageSize: body?.pageSize ?? 10,
                totalElements: body?.totalElements ?? 0,
                totalPages: body?.totalPages ?? 0,
                last: body?.last ?? true,
            });
        } catch (err) {
            console.error("getHistory failed:", err?.response?.data || err);
            setHistoryError("Couldn't load attendance history.");
            setHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    useEffect(() => { fetchToday(); }, [fetchToday]);
    useEffect(() => { fetchHistory(historyPage); }, [fetchHistory, historyPage]);

    const handlePunchIn = async () => {
        setPunching(true);
        try {
            const res = await studentAttendanceApi.punchIn();
            setToday(res?.data?.data ?? null);
            showToast("Punched in — have a good session!");
            fetchHistory(0);
            setHistoryPage(0);
        } catch (err) {
            console.error("punchIn failed:", err?.response?.data || err);
            showToast(err?.response?.data?.message || "Couldn't punch in. Please try again.", "error");
        } finally {
            setPunching(false);
        }
    };

    const handlePunchOut = async () => {
        setPunching(true);
        try {
            const res = await studentAttendanceApi.punchOut();
            const data = res?.data?.data;
            setToday(prev => ({ ...prev, ...data }));
            showToast(`Punched out — ${data?.totalDuration || minutesToClock(data?.totalMinutes || 0)} logged today.`);
            fetchHistory(0);
            setHistoryPage(0);
        } catch (err) {
            console.error("punchOut failed:", err?.response?.data || err);
            showToast(err?.response?.data?.message || "Couldn't punch out. Please try again.", "error");
        } finally {
            setPunching(false);
        }
    };

    // Derived stats from the currently loaded history page
    const completedSessions = history.filter(h => h.status === "COMPLETED");
    const avgMinutes = completedSessions.length
        ? Math.round(completedSessions.reduce((s, h) => s + (h.totalMinutes || 0), 0) / completedSessions.length)
        : 0;

    const stats = [
        { label: "Total Sessions Logged", value: historyMeta.totalElements, sub: "All time" },
        { label: "Completed This Page", value: completedSessions.length, sub: `Of ${history.length} shown` },
        { label: "Avg Session Length", value: avgMinutes ? minutesToClock(avgMinutes) : "—", sub: "This page" },
        { label: "Today's Status", value: statusStyle(today?.status).label, sub: today ? formatDate(today.attendanceDate) : "Not started" },
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@700;800&display=swap');
        * { font-family:'Inter',sans-serif; box-sizing:border-box; }
        .font-mono { font-family:'JetBrains Mono','Inter',monospace; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.18s ease; }
      `}</style>

            {toast && (
                <div className={`fixed top-5 right-5 z-[9999] px-4 py-3 rounded-xl text-sm font-semibold shadow-xl fade-in max-w-sm
          ${toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}>
                    {toast.msg}
                </div>
            )}

            {/* ══ PAGE HEADER ══ */}
            <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-slate-50/60 max-w-7xl mx-auto space-y-6">
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-xs">
                    <div className="flex items-center text-xs text-slate-400 font-medium mb-1 gap-1.5">
                        <Link to="/student/dashboard" className="hover:text-[#043573] transition">Dashboard</Link>
                        <span>&gt;</span>
                        <span className="text-slate-700 font-semibold">Attendance</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Attendance & Time Tracker</h1>
                    <p className="text-xs text-slate-500 mt-1">Punch in and out to track your daily learning sessions</p>
                </div>

                {/* ══ STAT CARDS ══ */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {stats.map(s => (
                        <div key={s.label} className="bg-white border border-slate-200/70 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all">
                            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">{s.value}</div>
                            <div className="text-xs font-bold text-slate-700 mt-1">{s.label}</div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">{s.sub}</div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">

                    {/* ══ PUNCH CLOCK ══ */}
                    <div className="w-full lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
                        {loadingToday ? (
                            <div className="bg-white border border-slate-200/70 rounded-2xl shadow-xs p-8 text-center text-slate-400 text-xs font-medium">
                                Loading today's status...
                            </div>
                        ) : (
                            <PunchClock today={today} onPunchIn={handlePunchIn} onPunchOut={handlePunchOut} punching={punching} />
                        )}

                        {today && (
                            <div className="bg-white border border-slate-200/70 rounded-2xl shadow-xs p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-4 bg-[#043573] rounded-full" />
                                    <span className="text-xs font-bold text-slate-800">Today's Session Details</span>
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-medium">Date</span>
                                        <span className="font-semibold text-slate-700">{formatDate(today.attendanceDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-medium">Punch In</span>
                                        <span className="font-semibold text-slate-700 font-mono">{formatClock(today.punchInTime)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-medium">Punch Out</span>
                                        <span className="font-semibold text-slate-700 font-mono">{formatClock(today.punchOutTime)}</span>
                                    </div>
                                    {today.totalDuration && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 font-medium">Total Duration</span>
                                            <span className="font-bold text-[#043573] font-mono">{today.totalDuration}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-slate-400 font-medium">Status</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusStyle(today.status).bg} ${statusStyle(today.status).text} ${statusStyle(today.status).border}`}>
                                            {statusStyle(today.status).label}
                                        </span>
                                    </div>
                                    {today.autoPunchOut && (
                                        <p className="text-[10px] text-amber-600 font-semibold pt-1">⚠ Auto punched-out — session ended automatically.</p>
                                    )}
                                    {today.remarks && (
                                        <p className="text-xs text-slate-500 pt-1 border-t border-slate-50 mt-2">{today.remarks}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ══ HISTORY TABLE ══ */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-base font-bold text-slate-800">Attendance History</span>
                            <span className="text-xs text-slate-400">{historyMeta.totalElements} total record{historyMeta.totalElements !== 1 ? "s" : ""}</span>
                        </div>

                        {historyError && (
                            <div className="mx-5 mt-4 flex items-center justify-between gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-xs font-semibold">
                                <span>{historyError}</span>
                                <button onClick={() => fetchHistory(historyPage)} className="px-3 py-1.5 bg-white border border-rose-200 rounded-lg hover:bg-rose-100 transition flex-shrink-0">Retry</button>
                            </div>
                        )}

                        {loadingHistory ? (
                            <div className="p-10 text-center text-slate-400 text-sm">Loading history…</div>
                        ) : history.length === 0 ? (
                            <div className="p-10 text-center">
                                <p className="text-sm font-semibold text-slate-600 mb-1">No attendance records yet</p>
                                <p className="text-xs text-slate-400">Punch in above to start your first session.</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                {["Date", "Punch In", "Punch Out", "Duration", "Status"].map(h => (
                                                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map(rec => {
                                                const st = statusStyle(rec.status);
                                                return (
                                                    <tr key={rec.attendanceId} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition">
                                                        <td className="px-5 py-3 font-semibold text-slate-800">{formatDate(rec.attendanceDate)}</td>
                                                        <td className="px-5 py-3 font-mono text-slate-600">{formatClock(rec.punchInTime)}</td>
                                                        <td className="px-5 py-3 font-mono text-slate-600">{formatClock(rec.punchOutTime)}</td>
                                                        <td className="px-5 py-3 font-mono text-slate-600">{rec.totalDuration || (rec.totalMinutes != null ? minutesToClock(rec.totalMinutes) : "—")}</td>
                                                        <td className="px-5 py-3">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.bg} ${st.text} ${st.border}`}>
                                                                {st.label}
                                                            </span>
                                                            {rec.autoPunchOut && <span className="ml-1.5 text-[9px] text-amber-500" title="Auto punched out">⚠</span>}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs text-slate-400">
                                        Page {historyMeta.pageNumber + 1} of {Math.max(historyMeta.totalPages, 1)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setHistoryPage(p => Math.max(0, p - 1))}
                                            disabled={historyMeta.pageNumber === 0}
                                            className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            ‹ Previous
                                        </button>
                                        <button
                                            onClick={() => setHistoryPage(p => p + 1)}
                                            disabled={historyMeta.last}
                                            className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            Next ›
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
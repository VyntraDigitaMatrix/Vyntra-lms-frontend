import { useState, useEffect } from "react";
import { adminCalendarApi } from "../auth/api";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaClock,
  FaDoorOpen,
  FaUserGraduate,
  FaBook,
  FaSchool,
  FaInfoCircle
} from "react-icons/fa";

// ── Data ────────────────────────────────────────────────────────────────────
const COLOR_MAP = {
  teal: { bg: "bg-teal-50", border: "border-teal-400", text: "text-teal-700", dot: "bg-teal-500", badge: "bg-teal-100 text-teal-700" },
  blue: { bg: "bg-blue-50", border: "border-blue-400", text: "text-blue-700", dot: "bg-blue-500", badge: "bg-blue-100 text-blue-700" },
  violet: { bg: "bg-violet-50", border: "border-violet-400", text: "text-violet-700", dot: "bg-violet-500", badge: "bg-violet-100 text-violet-700" },
  amber: { bg: "bg-amber-50", border: "border-amber-400", text: "text-amber-700", dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700" },
  rose: { bg: "bg-rose-50", border: "border-rose-400", text: "text-rose-700", dot: "bg-rose-500", badge: "bg-rose-100 text-rose-700" },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const FULL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const getWeekDates = () => {
  const curr = new Date();
  const day = curr.getDay();
  // If Sunday (0), we consider it the end of the previous week, or start of next. Let's make Monday=1.
  const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(curr.setDate(diff));
  
  return Array.from({length: 5}, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

const fmtHour = (h) => {
  if (h === 12) return "12 PM";
  if (h > 12) return `${h - 12} PM`;
  return `${h} AM`;
};



// ── Component ────────────────────────────────────────────────────────────────
export default function Schedule() {
  const [activeDay, setActiveDay] = useState(null); // null = full week
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("week"); // "week" | "list"
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const weekDates = getWeekDates();
  const weekDatesDisplay = weekDates.map(d => d.getDate());

  const visibleDays = activeDay !== null ? [activeDay] : [1, 2, 3, 4, 5];

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      const startDate = weekDates[0].toISOString().split('T')[0];
      const endDate = weekDates[4].toISOString().split('T')[0];
      const res = await adminCalendarApi.getAdminCalendar(startDate, endDate);
      if (res.data?.success && res.data.data) {
        const mapped = res.data.data.map((evt, idx) => {
          const d = new Date(evt.eventDateTime);
          let day = d.getDay(); // 1=Mon, 2=Tue...
          if (day === 0 || day === 6) day = 1; // Fallback to Monday if weekend
          const startHour = d.getHours();
          const colors = Object.keys(COLOR_MAP);
          return {
            id: evt.eventId,
            title: evt.title,
            subject: evt.eventType,
            description: evt.description,
            navigationSlug: evt.navigationSlug,
            day: day,
            startHour: startHour,
            duration: 1, // Default 1 hour
            color: colors[idx % colors.length]
          };
        });
        setClasses(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getClassesForCell = (day, hour) =>
    classes.filter(c => c.day === day && c.startHour === hour);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        .class-card:hover { filter: brightness(0.97); cursor: pointer; }
        .fade-in { animation: fadeIn 0.18s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .day-col { min-width: 140px; }
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Schedule</h1>
            <span className="bg-teal-50 text-teal-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-teal-100">
              Week of {weekDates[0]?.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {weekDates[4]?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <p className="text-sm text-slate-400 ml-4">Manage and view all events for this week</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-white border border-slate-200 rounded-lg p-1 gap-1">
            {[["week", "⊞ Week"], ["list", "≡ List"]].map(([v, label]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all
                  ${view === v ? "bg-teal-500 text-white shadow-sm" : "text-slate-500 hover:text-teal-600"}`}
              >{label}</button>
            ))}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <span className="text-base leading-none">+</span> Add Event
          </button>
        </div>
      </div>

      {/* ── Day filter tabs ── */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setActiveDay(null)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all
            ${activeDay === null ? "bg-teal-500 text-white border-teal-500 shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-600"}`}
        >All Week</button>
        {DAYS.map((d, i) => {
          const dayNum = i + 1;
          const isToday = weekDatesDisplay[i] === new Date().getDate(); // Check actual today
          return (
            <button
              key={d}
              onClick={() => setActiveDay(activeDay === dayNum ? null : dayNum)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all flex items-center gap-1.5
                ${activeDay === dayNum ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                  : isToday ? "bg-teal-50 text-teal-700 border-teal-200"
                    : "bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-600"}`}
            >
              {d}
              <span className={`text-[11px] font-normal ${activeDay === dayNum ? "text-teal-100" : "text-slate-400"}`}>
                {weekDatesDisplay[i]}
              </span>
              {isToday && <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* ── WEEK VIEW ── */}
      {view === "week" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Day headers */}
          <div className="grid border-b border-slate-100" style={{ gridTemplateColumns: `72px repeat(${visibleDays.length}, 1fr)` }}>
            <div className="px-3 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-r border-slate-100" />
            {visibleDays.map(d => {
              const idx = d - 1;
              const isToday = weekDatesDisplay[idx] === new Date().getDate();
              return (
                <div key={d} className={`px-3 py-3 text-center border-r border-slate-100 last:border-r-0 ${isToday ? "bg-teal-50" : ""}`}>
                  <div className={`text-xs font-semibold uppercase tracking-wider ${isToday ? "text-teal-600" : "text-slate-400"}`}>{DAYS[idx]}</div>
                  <div className={`text-lg font-bold mt-0.5 ${isToday ? "text-teal-600" : "text-slate-700"}`}>{weekDatesDisplay[idx]}</div>
                  {isToday && <div className="text-[10px] text-teal-500 font-semibold">Today</div>}
                </div>
              );
            })}
          </div>

          {/* Time grid */}
          <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 380px)", minHeight: 400 }}>
            {HOURS.map((hour, hi) => (
              <div
                key={hour}
                className="grid border-b border-slate-50 last:border-b-0"
                style={{ gridTemplateColumns: `72px repeat(${visibleDays.length}, 1fr)`, minHeight: 72 }}
              >
                {/* Time label */}
                <div className="px-3 py-2 border-r border-slate-100 flex items-start justify-end">
                  <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">{fmtHour(hour)}</span>
                </div>

                {/* Day cells */}
                {visibleDays.map(d => {
                  const classes = getClassesForCell(d, hour);
                  const idx = d - 1;
                  const isToday = weekDatesDisplay[idx] === new Date().getDate();
                  return (
                    <div
                      key={d}
                      className={`px-1.5 py-1.5 border-r border-slate-100 last:border-r-0 flex flex-col gap-1
                        ${isToday ? "bg-teal-50/30" : ""} ${hi % 2 === 0 ? "" : "bg-slate-50/40"}`}
                    >
                      {classes.map(cls => {
                        const c = COLOR_MAP[cls.color];
                        return (
                          <div
                            key={cls.id}
                            onClick={() => setSelectedClass(cls)}
                            className={`class-card ${c.bg} border-l-[3px] ${c.border} rounded-md px-2 py-1.5 transition-all`}
                            style={{ minHeight: `${cls.duration * 60}px` }}
                          >
                            <div className={`text-[11px] font-bold ${c.text} leading-snug`}>{cls.title}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5 leading-tight truncate">{cls.description || "No description"}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <span><FaClock /></span>
                              {fmtHour(cls.startHour)}–{fmtHour(cls.startHour + cls.duration)}
                            </div>
                            <div className={`text-[10px] ${c.badge} rounded px-1 py-0.5 mt-1 inline-block font-medium`}>
                              {cls.subject}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {view === "list" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Event", "Type", "Description", "Day & Time", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-sm text-slate-500">Loading schedule...</td></tr>
              ) : [...classes]
                .filter(c => activeDay === null || c.day === activeDay)
                .sort((a, b) => a.day - b.day || a.startHour - b.startHour)
                .map(cls => {
                  const c = COLOR_MAP[cls.color];
                  return (
                    <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${c.dot} flex-shrink-0`} />
                          <span className="text-sm font-semibold text-slate-800">{cls.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`${c.badge} text-[11px] font-semibold px-2 py-0.5 rounded-full`}>{cls.subject}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 truncate max-w-[200px]">{cls.description || "-"}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                        <span className="font-medium">{FULL_DAYS[cls.day - 1]}</span>
                        <span className="text-slate-400 ml-1">{fmtHour(cls.startHour)}–{fmtHour(cls.startHour + cls.duration)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setSelectedClass(cls)}
                            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors text-sm"
                          >👁</button>
                          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors text-sm">✎</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Class Detail Drawer ── */}
      {selectedClass && (() => {
        const cls = selectedClass;
        const c = COLOR_MAP[cls.color];
        return (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-end" onClick={() => setSelectedClass(null)}>
            <div
              onClick={e => e.stopPropagation()}
              className="fade-in bg-white w-full max-w-sm h-full shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className={`${c.bg} border-b ${c.border} px-6 py-5`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`${c.badge} text-[11px] font-semibold px-2 py-0.5 rounded-full`}>{cls.subject}</span>
                    <h2 className={`text-lg font-bold ${c.text} mt-2 leading-snug`}>{cls.title}</h2>
                  </div>
                  <button onClick={() => setSelectedClass(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none mt-1">✕</button>
                </div>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                {[
                  { icon: <FaCalendarAlt className="text-green-500 text-lg" />, label: "Day", value: FULL_DAYS[cls.day - 1] },
                  { icon: <FaClock className="text-orange-500 text-lg" />, label: "Time", value: `${fmtHour(cls.startHour)} – ${fmtHour(cls.startHour + cls.duration)} (${cls.duration}h)` },
                  { icon: <FaInfoCircle className="text-blue-500 text-lg" />, label: "Description", value: cls.description || "No description provided." },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 text-sm">{icon}</div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">{label}</div>
                      <div className="text-sm text-slate-800 font-semibold mt-0.5">{value}</div>
                    </div>
                  </div>
                ))}

                {/* Mini week indicator */}
                <div className="pt-2">
                  <div className="text-xs text-slate-400 font-medium mb-2">Week position</div>
                  <div className="flex gap-1.5">
                    {DAYS.map((d, i) => (
                      <div
                        key={d}
                        className={`flex-1 py-2 rounded-lg text-center text-xs font-bold transition-all
                          ${i + 1 === cls.day ? `${c.bg} ${c.text} border ${c.border}` : "bg-slate-100 text-slate-400"}`}
                      >{d}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
                <button className="flex-1 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm py-2.5 rounded-lg font-medium transition-colors">Edit</button>
                <button className="flex-1 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-sm py-2.5 rounded-lg font-medium transition-colors">Cancel Event</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Add Class Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} className="fade-in bg-white rounded-2xl shadow-xl border border-slate-200 p-7 w-full max-w-md border-t-4 border-t-teal-500">
            <h2 className="text-base font-bold text-slate-800 mb-5">Add New Event</h2>
            {[
              { label: "Event Title", placeholder: "e.g. Annual Tech Conference", type: "text" },
              { label: "Event Type", placeholder: "e.g. ASSIGNMENT", type: "text" },
              { label: "Description", placeholder: "e.g. Discussing the upcoming project...", type: "text" },
              { label: "Navigation Slug", placeholder: "e.g. /assignments/123", type: "text" },
              { label: "Date", placeholder: "", type: "date" },
              { label: "Time", placeholder: "", type: "time" },
            ].map(({ label, placeholder, type }) => (
              <div key={label} className="mb-3.5">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition placeholder-slate-400"
                />
              </div>
            ))}
            <div className="flex gap-2.5 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm py-2.5 rounded-lg font-medium transition-colors">Cancel</button>
              <button className="flex-[2] bg-teal-500 hover:bg-teal-600 text-white text-sm py-2.5 rounded-lg font-semibold transition-colors shadow-sm">Add Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaClock,
  FaDoorOpen,
  FaUserGraduate,
  FaBook,
  FaSchool
} from "react-icons/fa";

// ── Data ────────────────────────────────────────────────────────────────────
const CLASSES = [
  { id: 1, title: "React Fundamentals", instructor: "Dr. Priya Sharma", subject: "Frontend Dev", day: 1, startHour: 9, duration: 1.5, color: "teal", room: "Lab A-101", students: 24 },
  { id: 2, title: "Database Design", instructor: "Prof. Arjun Mehta", subject: "Backend Dev", day: 1, startHour: 11, duration: 1, color: "blue", room: "Hall B-202", students: 18 },
  { id: 3, title: "UI/UX Workshop", instructor: "Ms. Sneha Kapoor", subject: "Design", day: 2, startHour: 10, duration: 2, color: "violet", room: "Studio C", students: 30 },
  { id: 4, title: "Node.js & APIs", instructor: "Mr. Rahul Verma", subject: "Backend Dev", day: 2, startHour: 14, duration: 1.5, color: "blue", room: "Lab A-102", students: 20 },
  { id: 5, title: "ML Foundations", instructor: "Dr. Kavya Nair", subject: "Data Science", day: 3, startHour: 9, duration: 2, color: "amber", room: "Hall B-301", students: 15 },
  { id: 6, title: "Mobile App Dev", instructor: "Mr. Vikram Singh", subject: "Design", day: 3, startHour: 13, duration: 1, color: "violet", room: "Lab A-103", students: 22 },
  { id: 7, title: "DevOps & CI/CD", instructor: "Ms. Ananya Iyer", subject: "DevOps", day: 4, startHour: 10, duration: 1.5, color: "rose", room: "Lab D-201", students: 12 },
  { id: 8, title: "Cloud Architecture", instructor: "Mr. Rohan Das", subject: "DevOps", day: 4, startHour: 15, duration: 1, color: "rose", room: "Hall B-401", students: 10 },
  { id: 9, title: "Data Visualization", instructor: "Dr. Kavya Nair", subject: "Data Science", day: 5, startHour: 9, duration: 1, color: "amber", room: "Lab A-201", students: 18 },
  { id: 10, title: "System Design", instructor: "Prof. Arjun Mehta", subject: "Backend Dev", day: 5, startHour: 11, duration: 2, color: "blue", room: "Hall B-202", students: 16 },
  { id: 11, title: "React Advanced Patterns", instructor: "Dr. Priya Sharma", subject: "Frontend Dev", day: 1, startHour: 14, duration: 1, color: "teal", room: "Lab A-101", students: 20 },
  { id: 12, title: "Figma Prototyping", instructor: "Ms. Sneha Kapoor", subject: "Design", day: 3, startHour: 15, duration: 1.5, color: "violet", room: "Studio C", students: 28 },
];

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

const WEEK_DATES = (() => {
  return [23, 24, 25, 26, 27];
})();

const fmtHour = (h) => {
  if (h === 12) return "12 PM";
  if (h > 12) return `${h - 12} PM`;
  return `${h} AM`;
};

const STATS = [
  { label: "Classes this week", value: 12, icon: <FaBook className="text-teal-500 text-lg" />, color: "text-teal-600", bg: "bg-blue-50", border: "border-teal-200 border-t-2 border-t-teal-500" },
  { label: "Instructors active", value: 6, icon: <FaChalkboardTeacher className="text-blue-500 text-lg" />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200 border-t-2 border-t-blue-500" },
  { label: "Total students", value: 233, icon: <FaUserGraduate className="text-violet-600 text-lg" />, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200 border-t-2 border-t-violet-500" },
  { label: "Rooms booked", value: 8, icon: <FaSchool className="text-amber-600 text-lg" />, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200 border-t-2 border-t-amber-500" },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function Schedule() {
  const [activeDay, setActiveDay] = useState(null); // null = full week
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("week"); // "week" | "list"

  const visibleDays = activeDay !== null ? [activeDay] : [1, 2, 3, 4, 5];

  const getClassesForCell = (day, hour) =>
    CLASSES.filter(c => c.day === day && c.startHour === hour);

  const todayIdx = 3; // Thursday = index 3 (day 4, 0-indexed in WEEK_DATES as 3)

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
              Week of Jun 23–27, 2026
            </span>
          </div>
          <p className="text-sm text-slate-400 ml-4">Manage and view all class sessions for this week</p>
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
            <span className="text-base leading-none">+</span> Add Class
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {STATS.map(({ label, value, icon, color, bg, border }) => (
          <div key={label} className={`bg-white rounded-xl border ${border} p-4 flex-1 min-w-[130px] shadow-sm flex items-center gap-3`}>
            <div className={`${bg} w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0`}>{icon}</div>
            <div>
              <div className={`text-2xl font-bold ${color} leading-none`}>{value}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium leading-tight">{label}</div>
            </div>
          </div>
        ))}
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
          const isToday = WEEK_DATES[i] === 26; // June 26 = today
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
                {WEEK_DATES[i]}
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
              const isToday = WEEK_DATES[idx] === 26;
              return (
                <div key={d} className={`px-3 py-3 text-center border-r border-slate-100 last:border-r-0 ${isToday ? "bg-teal-50" : ""}`}>
                  <div className={`text-xs font-semibold uppercase tracking-wider ${isToday ? "text-teal-600" : "text-slate-400"}`}>{DAYS[idx]}</div>
                  <div className={`text-lg font-bold mt-0.5 ${isToday ? "text-teal-600" : "text-slate-700"}`}>{WEEK_DATES[idx]}</div>
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
                  const isToday = WEEK_DATES[idx] === 26;
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
                            <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{cls.instructor.split(" ").slice(-1)[0]}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <span><FaClock /></span>
                              {fmtHour(cls.startHour)}–{fmtHour(cls.startHour + cls.duration)}
                            </div>
                            <div className={`text-[10px] ${c.badge} rounded px-1 py-0.5 mt-1 inline-block font-medium`}>
                              {cls.room}
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
                {["Class", "Instructor", "Subject", "Day & Time", "Room", "Students", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[...CLASSES]
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
                      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{cls.instructor}</td>
                      <td className="px-4 py-3.5">
                        <span className={`${c.badge} text-[11px] font-semibold px-2 py-0.5 rounded-full`}>{cls.subject}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                        <span className="font-medium">{FULL_DAYS[cls.day - 1]}</span>
                        <span className="text-slate-400 ml-1">{fmtHour(cls.startHour)}–{fmtHour(cls.startHour + cls.duration)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap">{cls.room}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-slate-700 font-semibold">{cls.students}</span>
                        <span className="text-xs text-slate-400 ml-1">students</span>
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
                  { icon: <FaChalkboardTeacher className="text-blue-500 text-lg" />, label: "Instructor", value: cls.instructor },
                  { icon: <FaCalendarAlt className="text-green-500 text-lg" />, label: "Day", value: FULL_DAYS[cls.day - 1] },
                  { icon: <FaClock className="text-orange-500 text-lg" />, label: "Time", value: `${fmtHour(cls.startHour)} – ${fmtHour(cls.startHour + cls.duration)} (${cls.duration}h)` },
                  { icon: <FaDoorOpen className="text-purple-500 text-lg" />, label: "Room", value: cls.room },
                  { icon: <FaUserGraduate className="text-pink-500 text-lg" />, label: "Students", value: `${cls.students} enrolled` },
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
                <button className="flex-1 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-sm py-2.5 rounded-lg font-medium transition-colors">Cancel Class</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Add Class Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} className="fade-in bg-white rounded-2xl shadow-xl border border-slate-200 p-7 w-full max-w-md border-t-4 border-t-teal-500">
            <h2 className="text-base font-bold text-slate-800 mb-5">Add New Class</h2>
            {[
              { label: "Class Title", placeholder: "e.g. React Advanced Patterns", type: "text" },
              { label: "Instructor", placeholder: "e.g. Dr. Priya Sharma", type: "text" },
              { label: "Subject", placeholder: "e.g. Frontend Dev", type: "text" },
              { label: "Room", placeholder: "e.g. Lab A-101", type: "text" },
              { label: "Date", placeholder: "", type: "date" },
              { label: "Start Time", placeholder: "", type: "time" },
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
              <button className="flex-[2] bg-teal-500 hover:bg-teal-600 text-white text-sm py-2.5 rounded-lg font-semibold transition-colors shadow-sm">Add Class</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
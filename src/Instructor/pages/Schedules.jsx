import { useState, useRef } from "react";
import { Link } from "react-router-dom";

// ── Constants ────────────────────────────────────────────────────────────────
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7);
const WEEK_BASE = new Date(2024, 10, 24);

const TYPE_BADGE = {
  Lecture: { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-200" },
  Seminar: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  Lab: { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-200" },
  Workshop: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  "Office Hours": { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
};

const TYPE_COLORS = {
  Lecture: "#6366f1", Seminar: "#8b5cf6", Lab: "#06b6d4",
  Workshop: "#f59e0b", "Office Hours": "#64748b",
};

const initialClasses = [
  { id: 1, title: "Computer Science 101", day: 1, startHour: 14, duration: 1.5, color: "#6366f1", students: 28, room: "Lab 3", type: "Lecture" },
  { id: 2, title: "Advanced Algorithms", day: 2, startHour: 9, duration: 2, color: "#8b5cf6", students: 18, room: "Room 201", type: "Seminar" },
  { id: 3, title: "Web Development", day: 3, startHour: 11, duration: 1.5, color: "#06b6d4", students: 35, room: "Lab 1", type: "Lab" },
  { id: 4, title: "Data Structures", day: 4, startHour: 13, duration: 2, color: "#10b981", students: 24, room: "Room 305", type: "Lecture" },
  { id: 5, title: "Machine Learning", day: 5, startHour: 10, duration: 1.5, color: "#f59e0b", students: 22, room: "Lab 2", type: "Workshop" },
  { id: 6, title: "Office Hours", day: 1, startHour: 16, duration: 1, color: "#64748b", students: null, room: "Office B12", type: "Office Hours" },
  { id: 7, title: "Office Hours", day: 3, startHour: 14, duration: 1, color: "#64748b", students: null, room: "Office B12", type: "Office Hours" },
];

const initialUpcoming = [
  { id: 1, title: "CS101 Assignment Review", date: "Mon, Nov 25", time: "02:00 PM", tag: "Grading", color: "#6366f1" },
  { id: 2, title: "Curriculum Committee", date: "Tue, Nov 26", time: "11:00 AM", tag: "Meeting", color: "#f59e0b" },
  { id: 3, title: "ML Project Submissions", date: "Thu, Nov 28", time: "11:59 PM", tag: "Deadline", color: "#ef4444" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function getWeekStart(offset) {
  const d = new Date(WEEK_BASE);
  d.setDate(d.getDate() + offset * 7);
  return d;
}
function getDateForDay(weekStart, dayIndex) {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + dayIndex);
  return d;
}
function formatHour(h) {
  if (h === 12) return "12 PM";
  if (h > 12) return `${h - 12} PM`;
  return `${h} AM`;
}
function formatTime(h) {
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h;
  return `${hour}:00 ${suffix}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ── Attendance Row ───────────────────────────────────────────────────────────
function AttendanceRow({ student }) {
  const [status, setStatus] = useState("present");
  const cfg = {
    present: "bg-emerald-50 text-emerald-700 border-emerald-300",
    late: "bg-amber-50  text-amber-700  border-amber-300",
    absent: "bg-red-50    text-red-700    border-red-300",
  };
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <span className="text-sm font-medium text-slate-700">{student.name}</span>
      <div className="flex gap-1.5">
        {["present", "late", "absent"].map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold capitalize transition
              ${status === s ? cfg[s] : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"}`}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 border-t-4 border-t-violet-600"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition text-lg leading-none">&times;</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Form Input ───────────────────────────────────────────────────────────────
function FInput({ label, value, onChange, type = "text", options }) {
  const cls = "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-white placeholder-slate-400";
  return (
    <div className="mb-3.5">
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      {options
        ? <select value={value} onChange={e => onChange(e.target.value)} className={cls}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} className={cls} />
      }
    </div>
  );
}

// ── Month View ───────────────────────────────────────────────────────────────
function MonthView({ classes, weekOffset, onDayClick }) {
  const weekStart = getWeekStart(weekOffset);
  const monthDate = new Date(weekStart); monthDate.setDate(1);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="text-center font-bold text-slate-700 mb-3">
        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month]} {year}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1 tracking-wider">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const dow = new Date(year, month, day).getDay();
          const dayClasses = classes.filter(c => c.day === dow);
          const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
          return (
            <div key={day} onClick={() => dayClasses.length && onDayClick(dow)}
              className={`min-h-[52px] p-1 rounded-lg border transition
                ${isToday ? "bg-violet-50 border-violet-300" : "bg-slate-50 border-transparent"}
                ${dayClasses.length ? "cursor-pointer hover:border-violet-300" : ""}`}>
              <div className={`text-[11px] font-semibold mb-0.5 ${isToday ? "text-violet-600" : "text-slate-600"}`}>{day}</div>
              {dayClasses.slice(0, 2).map(c => (
                <div key={c.id} className="text-[9px] font-semibold truncate rounded px-1 py-0.5 mb-0.5"
                  style={{ color: c.color, background: c.color + "18" }}>
                  {c.title}
                </div>
              ))}
              {dayClasses.length > 2 && <div className="text-[9px] text-slate-400">+{dayClasses.length - 2}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Schedules() {
  const [view, setView] = useState("weekly");
  const [activeClass, setActiveClass] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [classes, setClasses] = useState(initialClasses);
  const [upcoming, setUpcoming] = useState(initialUpcoming);
  const [selectedAgendaDay, setSelectedAgendaDay] = useState(null);
  const [toast, setToast] = useState(null);
  const [gradeFilter, setGradeFilter] = useState("All");

  // Modals
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showRoster, setShowRoster] = useState(null);
  const [showAttendance, setShowAttendance] = useState(null);
  const [showGrade, setShowGrade] = useState(false);
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const nextId = useRef(10);
  const todayDow = new Date().getDay();
  const weekStart = getWeekStart(weekOffset);

  const [newClass, setNewClass] = useState({ title: "", day: "1", startHour: "9", duration: "1", room: "", type: "Lecture", students: "" });
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", tag: "Grading" });
  const [announcement, setAnnouncement] = useState({ subject: "", message: "", target: "All Classes" });

  function showToastMsg(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  function handleAddClass() {
    if (!newClass.title || !newClass.room) { showToastMsg("Fill in all required fields.", "error"); return; }
    const cls = {
      id: nextId.current++, title: newClass.title, day: +newClass.day,
      startHour: +newClass.startHour, duration: +newClass.duration,
      room: newClass.room, type: newClass.type,
      students: newClass.students ? +newClass.students : null,
      color: TYPE_COLORS[newClass.type] || "#6366f1",
    };
    setClasses(p => [...p, cls]);
    setNewClass({ title: "", day: "1", startHour: "9", duration: "1", room: "", type: "Lecture", students: "" });
    setShowAddClass(false);
    showToastMsg("Class added to schedule!");
  }

  function handleAddEvent() {
    if (!newEvent.title || !newEvent.date) { showToastMsg("Fill event title and date.", "error"); return; }
    const tagColors = { Grading: "#6366f1", Meeting: "#f59e0b", Deadline: "#ef4444", Other: "#10b981" };
    setUpcoming(p => [...p, { id: nextId.current++, ...newEvent, color: tagColors[newEvent.tag] || "#64748b" }]);
    setNewEvent({ title: "", date: "", time: "", tag: "Grading" });
    setShowAddEvent(false);
    showToastMsg("Event added!");
  }

  function handleDeleteClass(id) {
    setClasses(p => p.filter(c => c.id !== id));
    if (activeClass?.id === id) setActiveClass(null);
    showToastMsg("Class removed.");
  }

  function handleDeleteEvent(id) {
    setUpcoming(p => p.filter(e => e.id !== id));
  }

  function handleSendAnnouncement() {
    if (!announcement.message) { showToastMsg("Message cannot be empty.", "error"); return; }
    setShowAnnounce(false);
    setAnnouncement({ subject: "", message: "", target: "All Classes" });
    showToastMsg("Announcement sent!");
  }

  function handleExport() {
    const rows = [["Title", "Day", "Start Time", "Duration", "Room", "Type", "Students"]];
    classes.forEach(c => rows.push([c.title, DAYS[c.day], formatTime(c.startHour), `${c.duration}h`, c.room, c.type, c.students ?? "N/A"]));
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "schedule.csv"; a.click();
    showToastMsg("Schedule exported!");
  }

  const weekLabel = (() => {
    const s = getWeekStart(weekOffset);
    const e = new Date(s); e.setDate(e.getDate() + 6);
    return `${MONTHS[s.getMonth()]} ${s.getDate()} – ${e.getDate()}, ${e.getFullYear()}`;
  })();

  const agendaDay = selectedAgendaDay !== null ? selectedAgendaDay : todayDow;
  const agendaDayLabel = (() => {
    const d = getDateForDay(weekStart, agendaDay);
    return `${DAYS[agendaDay][0] + DAYS[agendaDay].slice(1).toLowerCase()}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
  })();

  const stats = [
    { label: "Classes This Week", value: classes.length, sub: `${classes.filter(c => c.type !== "Office Hours").length} courses, ${classes.filter(c => c.type === "Office Hours").length} office hours` },
    { label: "Total Students", value: classes.reduce((a, c) => a + (c.students || 0), 0), sub: `Across ${classes.filter(c => c.students).length} courses` },
    { label: "Pending Grading", value: 38, sub: "Assignments" },
    { label: "Office Hours", value: `${classes.filter(c => c.type === "Office Hours").reduce((a, c) => a + c.duration, 0)}h`, sub: "This week" },
  ];

  const mockStudents = (cls) => Array.from({ length: Math.min(cls?.students || 0, 8) }, (_, i) => ({
    id: i + 1,
    name: ["Alice Chen", "Bob Kumar", "Clara Smith", "David Lee", "Eva Patel", "Frank Wong", "Grace Kim", "Henry Park"][i],
    grade: ["A", "B+", "A-", "B", "A", "C+", "B+", "A-"][i],
    attendance: [95, 88, 92, 79, 100, 72, 85, 91][i],
  }));

  const tagIcon = { Grading: "📝", Meeting: "🤝", Deadline: "⏰", Other: "📌" };

  return (
    <div className="min-h-screen bg-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family:'Inter',sans-serif; box-sizing:border-box; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.18s ease; }
        .slot-hover:hover { filter: brightness(0.96); cursor: pointer; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] px-4 py-3 rounded-xl text-sm font-semibold shadow-xl fade-in
          ${toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}>
          {toast.msg}
        </div>
      )}

      {/* ══ MODALS ══ */}

      {showAddClass && (
        <Modal title="Add New Class" onClose={() => setShowAddClass(false)}>
          <FInput label="Class Title *" value={newClass.title} onChange={v => setNewClass(p => ({ ...p, title: v }))} />
          <FInput label="Day" value={newClass.day} onChange={v => setNewClass(p => ({ ...p, day: v }))} options={DAYS.map((_, i) => i.toString())} />
          <div className="grid grid-cols-2 gap-3">
            <FInput label="Start Hour (7–19)" type="number" value={newClass.startHour} onChange={v => setNewClass(p => ({ ...p, startHour: v }))} />
            <FInput label="Duration (hrs)" type="number" value={newClass.duration} onChange={v => setNewClass(p => ({ ...p, duration: v }))} />
          </div>
          <FInput label="Room *" value={newClass.room} onChange={v => setNewClass(p => ({ ...p, room: v }))} />
          <FInput label="Type" value={newClass.type} onChange={v => setNewClass(p => ({ ...p, type: v }))} options={Object.keys(TYPE_BADGE)} />
          <FInput label="Students" type="number" value={newClass.students} onChange={v => setNewClass(p => ({ ...p, students: v }))} />
          <div className="flex gap-2.5 mt-2">
            <button onClick={() => setShowAddClass(false)} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition">Cancel</button>
            <button onClick={handleAddClass} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-lg transition">Add Class</button>
          </div>
        </Modal>
      )}

      {showAddEvent && (
        <Modal title="Add Event" onClose={() => setShowAddEvent(false)}>
          <FInput label="Event Title *" value={newEvent.title} onChange={v => setNewEvent(p => ({ ...p, title: v }))} />
          <FInput label="Date *" type="date" value={newEvent.date} onChange={v => setNewEvent(p => ({ ...p, date: v }))} />
          <FInput label="Time" type="time" value={newEvent.time} onChange={v => setNewEvent(p => ({ ...p, time: v }))} />
          <FInput label="Tag" value={newEvent.tag} onChange={v => setNewEvent(p => ({ ...p, tag: v }))} options={["Grading", "Meeting", "Deadline", "Other"]} />
          <div className="flex gap-2.5 mt-2">
            <button onClick={() => setShowAddEvent(false)} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition">Cancel</button>
            <button onClick={handleAddEvent} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-lg transition">Add Event</button>
          </div>
        </Modal>
      )}

      {showRoster && (
        <Modal title={`Roster — ${showRoster.title}`} onClose={() => setShowRoster(null)}>
          <p className="text-xs text-slate-400 mb-3">{showRoster.students} students enrolled · {showRoster.room}</p>
          <div className="max-h-72 overflow-y-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50">
                {["#", "Name", "Grade", "Attendance"].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {mockStudents(showRoster).map(s => (
                  <tr key={s.id} className="border-b border-slate-50">
                    <td className="px-3 py-2 text-xs text-slate-400">{s.id}</td>
                    <td className="px-3 py-2 font-medium text-slate-700">{s.name}</td>
                    <td className="px-3 py-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                        ${s.grade.startsWith("A") ? "bg-emerald-100 text-emerald-700" : s.grade.startsWith("B") ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                        {s.grade}
                      </span>
                    </td>
                    <td className={`px-3 py-2 text-xs font-semibold ${s.attendance >= 90 ? "text-emerald-600" : s.attendance >= 75 ? "text-amber-600" : "text-red-600"}`}>{s.attendance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => setShowRoster(null)} className="mt-4 w-full py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition">Close</button>
        </Modal>
      )}

      {showAttendance && (
        <Modal title={`Attendance — ${showAttendance.title}`} onClose={() => setShowAttendance(null)}>
          <p className="text-xs text-slate-400 mb-3">Mark attendance for today's session</p>
          {mockStudents(showAttendance).map(s => <AttendanceRow key={s.id} student={s} />)}
          <button onClick={() => { setShowAttendance(null); showToastMsg("Attendance saved!"); }}
            className="mt-4 w-full py-2.5 text-white text-sm font-bold rounded-lg transition"
            style={{ background: showAttendance.color }}>Save Attendance</button>
        </Modal>
      )}

      {showGrade && (
        <Modal title="Grade Work" onClose={() => setShowGrade(false)}>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {["All", ...classes.filter(c => c.students).map(c => c.title)].map(t => (
              <button key={t} onClick={() => setGradeFilter(t)}
                className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold transition
                  ${gradeFilter === t ? "bg-violet-100 text-violet-700 border-violet-300" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                {t.length > 16 ? t.slice(0, 16) + "…" : t}
              </button>
            ))}
          </div>
          {[
            { id: 1, title: "CS101 - Assignment 3", due: "Nov 22", pending: 12, course: "Computer Science 101" },
            { id: 2, title: "ML - Project Proposal", due: "Nov 24", pending: 8, course: "Machine Learning" },
            { id: 3, title: "Algo - Problem Set 5", due: "Nov 20", pending: 18, course: "Advanced Algorithms" },
          ].filter(a => gradeFilter === "All" || a.course === gradeFilter).map(a => (
            <div key={a.id} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
              <div>
                <div className="text-sm font-semibold text-slate-800">{a.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">Due {a.due} · {a.pending} pending</div>
              </div>
              <button onClick={() => showToastMsg(`Opened ${a.title}`)}
                className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition">Grade</button>
            </div>
          ))}
          <button onClick={() => setShowGrade(false)} className="mt-4 w-full py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition">Close</button>
        </Modal>
      )}

      {showAnnounce && (
        <Modal title="Send Announcement" onClose={() => setShowAnnounce(false)}>
          <FInput label="Target Audience" value={announcement.target} onChange={v => setAnnouncement(p => ({ ...p, target: v }))}
            options={["All Classes", ...classes.filter(c => c.students).map(c => c.title)]} />
          <FInput label="Subject" value={announcement.subject} onChange={v => setAnnouncement(p => ({ ...p, subject: v }))} />
          <div className="mb-3.5">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message *</label>
            <textarea value={announcement.message} onChange={e => setAnnouncement(p => ({ ...p, message: e.target.value }))} rows={4}
              placeholder="Type your message here..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition resize-none" />
          </div>
          <div className="flex gap-2.5">
            <button onClick={() => setShowAnnounce(false)} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition">Cancel</button>
            <button onClick={handleSendAnnouncement} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-lg transition">Send</button>
          </div>
        </Modal>
      )}

      {showMaterials && (
        <Modal title="Course Materials" onClose={() => setShowMaterials(false)}>
          {[
            { name: "CS101_Week8_Slides.pdf", course: "Computer Science 101", size: "2.4 MB", icon: "📄" },
            { name: "Algorithms_ProblemSet5.pdf", course: "Advanced Algorithms", size: "1.1 MB", icon: "📄" },
            { name: "WebDev_Lab4_Starter.zip", course: "Web Development", size: "840 KB", icon: "📦" },
            { name: "ML_Dataset_Nov.csv", course: "Machine Learning", size: "5.2 MB", icon: "📊" },
          ].map(f => (
            <div key={f.name} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
              <span className="text-xl">{f.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">{f.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{f.course} · {f.size}</div>
              </div>
              <button onClick={() => showToastMsg(`Downloading ${f.name}`)}
                className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition">↓</button>
            </div>
          ))}
          <button onClick={() => showToastMsg("Upload opened!")}
            className="mt-3 w-full py-2.5 border-2 border-dashed border-violet-200 bg-violet-50 text-violet-600 text-sm font-semibold rounded-lg hover:bg-violet-100 transition">
            + Upload Material
          </button>
        </Modal>
      )}

      {showAnalytics && (
        <Modal title="Class Analytics" onClose={() => setShowAnalytics(false)}>
          {classes.filter(c => c.students).map((cls, ci) => (
            <div key={cls.id} className="mb-4 last:mb-0">
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-semibold text-slate-700">{cls.title}</span>
                <span className="text-xs text-slate-400">{cls.students} students</span>
              </div>
              <div className="flex gap-2 mb-2">
                {["Avg Grade", "Attendance", "Submissions"].map((label, i) => {
                  const vals = [[84, 91, 78], [88, 95, 82], [92, 97, 86]];
                  const v = vals[i % 3][ci % 3];
                  return (
                    <div key={label} className="flex-1 bg-slate-50 rounded-lg p-2 text-center">
                      <div className="text-base font-bold" style={{ color: cls.color }}>{v}%</div>
                      <div className="text-[10px] text-slate-400">{label}</div>
                    </div>
                  );
                })}
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${84 + ci * 3}%`, background: cls.color }} />
              </div>
            </div>
          ))}
          <button onClick={() => setShowAnalytics(false)} className="mt-4 w-full py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition">Close</button>
        </Modal>
      )}

      {/* ══ PAGE HEADER ══ */}
      <div className="bg-white px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center text-xs text-slate-400 mb-2">
              <Link to="/instructor/dashboard" className="hover:text-violet-600 transition text-sm">Dashboard</Link>
              <span className="mx-2 text-sm">&gt;</span>
              <span className="text-gray-600 font-medium text-sm">Schedules</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Instructor Timeline</h1>
            <p className="text-sm text-slate-500 mt-0.5">Your teaching schedule & class overview</p>
          </div>
          <div className="flex gap-2.5">
            <button onClick={() => setShowAddClass(true)}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition">
              + Add Class
            </button>
            <button onClick={handleExport}
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl shadow-sm transition">
              Export Schedule
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* ══ STAT CARDS ══ */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map(s => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl font-black text-slate-900 tracking-tight">{s.value}</div>
              <div className="text-sm font-semibold text-slate-700 mt-1">{s.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 320px" }}>

          {/* ══ CALENDAR PANEL ══ */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Calendar header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <span className="text-base font-bold text-slate-800">
                📅 {view === "weekly" ? "Weekly" : "Monthly"} Schedule
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {/* View toggle */}
                <div className="flex bg-slate-100 rounded-lg p-0.5">
                  {["weekly", "monthly"].map(v => (
                    <button key={v} onClick={() => setView(v)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition capitalize
                        ${view === v ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>
                {/* Week nav */}
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
                  <button onClick={() => setWeekOffset(p => p - 1)} className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 transition text-lg leading-none">‹</button>
                  <span className="text-xs font-semibold text-slate-700 px-1 whitespace-nowrap">{weekLabel}</span>
                  <button onClick={() => setWeekOffset(p => p + 1)} className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 transition text-lg leading-none">›</button>
                </div>
                <button onClick={() => setWeekOffset(0)}
                  className="px-3 py-1.5 border border-violet-300 text-violet-600 text-xs font-bold rounded-lg hover:bg-violet-50 transition">
                  Today
                </button>
              </div>
            </div>

            {/* Monthly view */}
            {view === "monthly" ? (
              <div className="p-5">
                <MonthView classes={classes} weekOffset={weekOffset} onDayClick={dow => { setSelectedAgendaDay(dow); setView("weekly"); }} />
              </div>
            ) : (
              <>
                {/* Day headers */}
                <div className="grid border-b border-slate-100" style={{ gridTemplateColumns: "56px repeat(7,1fr)" }}>
                  <div className="bg-slate-50" />
                  {DAYS.map((d, i) => {
                    const dateObj = getDateForDay(weekStart, i);
                    const isToday = i === todayDow;
                    return (
                      <div key={d} className={`bg-slate-50 border-l border-slate-100 py-3 text-center ${isToday ? "bg-violet-50" : ""}`}>
                        <div className={`text-[10px] font-bold tracking-wider ${isToday ? "text-violet-500" : "text-slate-400"}`}>{d}</div>
                        <div className={`text-lg font-black mt-1 mx-auto w-8 h-8 flex items-center justify-center rounded-full
                          ${isToday ? "bg-violet-600 text-white" : "text-slate-800"}`}>
                          {dateObj.getDate()}
                        </div>
                        {isToday && <div className="text-[9px] text-violet-500 font-bold mt-0.5">Today</div>}
                      </div>
                    );
                  })}
                </div>

                {/* Time grid */}
                <div className="overflow-y-auto" style={{ maxHeight: "480px" }}>
                  {HOURS.map(hour => (
                    <div key={hour} className="grid" style={{ gridTemplateColumns: "56px repeat(7,1fr)", minHeight: "64px" }}>
                      <div className="border-b border-slate-50 flex items-start justify-end px-2 pt-1.5">
                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{formatHour(hour)}</span>
                      </div>
                      {DAYS.map((_, dayIdx) => {
                        const slotClasses = classes.filter(c => c.day === dayIdx && c.startHour === hour);
                        const isToday = dayIdx === todayDow;
                        return (
                          <div key={dayIdx}
                            className={`border-l border-b border-slate-50 relative px-1 py-1
                              ${isToday ? "bg-violet-50/30" : ""}`}>
                            {slotClasses.map(cls => (
                              <div key={cls.id}
                                onClick={() => setActiveClass(activeClass?.id === cls.id ? null : cls)}
                                className="slot-hover absolute inset-x-1 top-1 rounded-lg px-2 py-1.5 transition"
                                style={{
                                  height: `${cls.duration * 64 - 8}px`,
                                  background: cls.color + "18",
                                  borderLeft: `3px solid ${cls.color}`,
                                  boxShadow: activeClass?.id === cls.id ? `0 0 0 2px ${cls.color}` : "none",
                                }}>
                                <div className="text-[11px] font-bold truncate" style={{ color: cls.color }}>{cls.title}</div>
                                {cls.students && <div className="text-[10px] text-slate-500 mt-0.5">{formatTime(cls.startHour)} · {cls.students} stu</div>}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap gap-4">
                  {Object.entries(TYPE_BADGE).map(([type, cfg]) => (
                    <div key={type} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-sm ${cfg.bg}`} />
                      <span className="text-xs text-slate-500">{type}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ══ RIGHT PANEL ══ */}
          <div className="flex flex-col gap-4">

            {/* Class detail OR Daily Agenda */}
            {activeClass ? (
              <div className="bg-white border rounded-2xl shadow-sm p-5 fade-in"
                style={{ borderColor: activeClass.color + "40", boxShadow: `0 4px 16px ${activeClass.color}18` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                      ${TYPE_BADGE[activeClass.type]?.bg} ${TYPE_BADGE[activeClass.type]?.text}`}>
                      {activeClass.type}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">{activeClass.title}</h3>
                  </div>
                  <button onClick={() => setActiveClass(null)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition text-lg">✕</button>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    ["🕐", `${formatTime(activeClass.startHour)} · ${activeClass.duration}h`],
                    ["📍", activeClass.room],
                    activeClass.students ? ["👥", `${activeClass.students} enrolled`] : null,
                  ].filter(Boolean).map(([icon, text]) => (
                    <div key={text} className="flex items-center gap-2 text-sm text-slate-600">
                      <span>{icon}</span><span>{text}</span>
                    </div>
                  ))}
                </div>
                {activeClass.students && (
                  <div className="flex gap-2 mb-2">
                    <button onClick={() => setShowAttendance(activeClass)}
                      className="flex-1 py-2 text-white text-xs font-bold rounded-lg transition"
                      style={{ background: activeClass.color }}>Take Attendance</button>
                    <button onClick={() => setShowRoster(activeClass)}
                      className="flex-1 py-2 text-xs font-bold rounded-lg border transition"
                      style={{ color: activeClass.color, borderColor: activeClass.color, background: "transparent" }}>View Roster</button>
                  </div>
                )}
                <button onClick={() => handleDeleteClass(activeClass.id)}
                  className="w-full py-2 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition">
                  Remove Class
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-violet-600 rounded-full" />
                    <span className="text-sm font-bold text-slate-800">Daily Agenda</span>
                  </div>
                  <span className="text-xs text-slate-400">{agendaDayLabel}</span>
                </div>
                {/* Day pills */}
                <div className="flex gap-1 flex-wrap mb-3">
                  {DAYS.map((d, i) => (
                    <button key={d} onClick={() => setSelectedAgendaDay(i)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition
                        ${agendaDay === i ? "bg-violet-600 text-white border-violet-600" : "bg-slate-50 border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600"}`}>
                      {d}
                    </button>
                  ))}
                </div>
                {classes.filter(c => c.day === agendaDay).length === 0
                  ? <p className="text-sm text-slate-400 text-center py-4">No classes scheduled.</p>
                  : classes.filter(c => c.day === agendaDay).map(cls => (
                    <div key={cls.id} onClick={() => setActiveClass(cls)}
                      className="flex gap-3 py-2.5 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50 rounded-lg px-1 transition">
                      <div className="w-1 rounded-full self-stretch" style={{ background: cls.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">{cls.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{formatTime(cls.startHour)} · {cls.room}</div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full self-center whitespace-nowrap
                        ${TYPE_BADGE[cls.type]?.bg} ${TYPE_BADGE[cls.type]?.text}`}>
                        {cls.type}
                      </span>
                    </div>
                  ))
                }
                <p className="text-xs text-slate-400 mt-2">Click any class on the calendar for details</p>
              </div>
            )}

            {/* Upcoming Events */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-purple-500 rounded-full" />
                  <span className="text-sm font-bold text-slate-800">Upcoming</span>
                </div>
                <button onClick={() => setShowAddEvent(true)} className="text-xs font-semibold text-violet-600 hover:text-violet-700 transition">+ Add →</button>
              </div>
              {upcoming.length === 0 && <p className="text-sm text-slate-400 text-center py-3">No upcoming events.</p>}
              {upcoming.map(ev => (
                <div key={ev.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: ev.color + "18" }}>
                    {tagIcon[ev.tag] || "📌"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{ev.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{ev.date}{ev.time ? ` · ${ev.time}` : ""}</div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ background: ev.color + "18", color: ev.color }}>{ev.tag}</span>
                  <button onClick={() => handleDeleteEvent(ev.id)} className="text-slate-300 hover:text-slate-500 transition text-sm leading-none">✕</button>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                <span className="text-sm font-bold text-slate-800">Quick Actions</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["📋", "Grade Work", () => setShowGrade(true)],
                  ["📢", "Announce", () => setShowAnnounce(true)],
                  ["📁", "Materials", () => setShowMaterials(true)],
                  ["📊", "Analytics", () => setShowAnalytics(true)],
                ].map(([icon, label, action]) => (
                  <button key={label} onClick={action}
                    className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition">
                    <span>{icon}</span>{label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
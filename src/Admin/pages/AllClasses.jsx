import React, { useState, useMemo } from 'react';
import {
  MdSearch, MdAdd, MdFilterList, MdVideoCall, MdPeople,
  MdCalendarToday, MdAccessTime, MdMoreVert, MdEdit,
  MdDelete, MdContentCopy, MdPlayCircle, MdCheckCircle,
  MdCancel, MdSchedule, MdTrendingUp, MdClass,
  MdChevronLeft, MdChevronRight, MdOpenInNew, MdRefresh,
  MdVisibility, MdLink, MdOutlineVideoCall,
} from 'react-icons/md';
import { FaChevronDown } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

/* ── Mock data ─────────────────────────────────────────── */
const INSTRUCTORS = ["All Instructors", "Hitesh Choudhary", "Piyush Garg", "Anurag Tiwari", "Harshit Vashistha"];
const COURSES     = ["All Courses", "Full Stack Web Dev", "Digital Marketing", "Data Science", "React Masterclass"];
const STATUSES    = ["All", "Scheduled", "Live", "Completed", "Cancelled"];

const MOCK_CLASSES = [
  { id:1,  title:"React Hooks Deep Dive",        instructor:"Hitesh Choudhary", course:"Full Stack Web Dev",    scheduledAt:"2026-06-28T10:00:00", duration:90,  enrolled:142, attended:98,  status:"Scheduled", recording:false, meetLink:"https://meet.google.com/abc" },
  { id:2,  title:"CSS Grid & Flexbox Mastery",   instructor:"Piyush Garg",      course:"Full Stack Web Dev",    scheduledAt:"2026-06-27T14:00:00", duration:60,  enrolled:87,  attended:71,  status:"Completed", recording:true,  meetLink:"https://meet.google.com/def" },
  { id:3,  title:"SEO Fundamentals",             instructor:"Anurag Tiwari",    course:"Digital Marketing",     scheduledAt:"2026-06-29T11:00:00", duration:75,  enrolled:63,  attended:0,   status:"Scheduled", recording:false, meetLink:"https://meet.google.com/ghi" },
  { id:4,  title:"Python for Data Science",      instructor:"Harshit Vashistha",course:"Data Science",          scheduledAt:"2026-06-27T09:00:00", duration:120, enrolled:201, attended:187, status:"Completed", recording:true,  meetLink:"https://meet.google.com/jkl" },
  { id:5,  title:"Node.js REST APIs",            instructor:"Hitesh Choudhary", course:"Full Stack Web Dev",    scheduledAt:"2026-06-26T16:00:00", duration:90,  enrolled:118, attended:0,   status:"Live",      recording:false, meetLink:"https://meet.google.com/mno" },
  { id:6,  title:"React State Management",       instructor:"Piyush Garg",      course:"React Masterclass",     scheduledAt:"2026-06-30T10:00:00", duration:60,  enrolled:94,  attended:0,   status:"Scheduled", recording:false, meetLink:"https://meet.google.com/pqr" },
  { id:7,  title:"Google Ads Campaign Setup",    instructor:"Anurag Tiwari",    course:"Digital Marketing",     scheduledAt:"2026-06-25T13:00:00", duration:45,  enrolled:55,  attended:48,  status:"Cancelled", recording:false, meetLink:"" },
  { id:8,  title:"Machine Learning Basics",      instructor:"Harshit Vashistha",course:"Data Science",          scheduledAt:"2026-07-01T15:00:00", duration:90,  enrolled:176, attended:0,   status:"Scheduled", recording:false, meetLink:"https://meet.google.com/stu" },
  { id:9,  title:"TypeScript Essentials",        instructor:"Hitesh Choudhary", course:"Full Stack Web Dev",    scheduledAt:"2026-06-28T15:00:00", duration:75,  enrolled:103, attended:0,   status:"Scheduled", recording:false, meetLink:"https://meet.google.com/vwx" },
  { id:10, title:"Redux Toolkit Patterns",       instructor:"Piyush Garg",      course:"React Masterclass",     scheduledAt:"2026-06-24T11:00:00", duration:60,  enrolled:89,  attended:79,  status:"Completed", recording:true,  meetLink:"https://meet.google.com/yza" },
];

/* ── Helpers ───────────────────────────────────────────── */
const fmt = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
};
const fmtTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });
};

const STATUS_META = {
  Scheduled: { bg:"bg-blue-50",   text:"text-blue-700",   dot:"bg-blue-500",   label:"Scheduled"  },
  Live:      { bg:"bg-red-50",    text:"text-red-600",    dot:"bg-red-500",    label:"● Live"      },
  Completed: { bg:"bg-green-50",  text:"text-green-700",  dot:"bg-green-500",  label:"Completed"  },
  Cancelled: { bg:"bg-gray-100",  text:"text-gray-500",   dot:"bg-gray-400",   label:"Cancelled"  },
};

/* ── Stat card ─────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="text-xl text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-none mt-0.5">{value}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ── Row action menu ───────────────────────────────────── */
function ActionMenu({ cls, onEdit, onDelete, onCopy }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
      >
        <MdMoreVert className="text-lg" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 w-44 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <button onClick={() => { onEdit(cls); setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 text-left transition">
              <MdEdit className="text-base text-blue-400" /> Edit Class
            </button>
            {cls.meetLink && (
              <button onClick={() => { window.open(cls.meetLink, '_blank'); setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 text-left transition">
                <MdLink className="text-base text-teal-400" /> Join / Copy Link
              </button>
            )}
            {cls.recording && (
              <button onClick={() => setOpen(false)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 text-left transition">
                <MdPlayCircle className="text-base text-violet-400" /> View Recording
              </button>
            )}
            <button onClick={() => { onCopy(cls); setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 text-left transition">
              <MdContentCopy className="text-base text-gray-400" /> Duplicate
            </button>
            <div className="border-t border-gray-100" />
            <button onClick={() => { onDelete(cls); setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 text-left transition">
              <MdDelete className="text-base" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Create / Edit Modal ───────────────────────────────── */
function ClassModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || {
    title:"", instructor: INSTRUCTORS[1], course: COURSES[1],
    scheduledAt:"", duration:60, meetLink:"", status:"Scheduled",
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handle = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    onSave(form);
  };

  const inp = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition bg-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-500 to-emerald-500">
          <div className="flex items-center gap-2.5">
            <MdVideoCall className="text-white text-xl" />
            <h2 className="text-sm font-bold text-white">{initial ? "Edit Class" : "Schedule New Class"}</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition">
            <MdCancel className="text-base" />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Class Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. React Hooks Deep Dive" className={inp} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Instructor</label>
              <select value={form.instructor} onChange={e => set("instructor", e.target.value)} className={inp}>
                {INSTRUCTORS.slice(1).map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Course</label>
              <select value={form.course} onChange={e => set("course", e.target.value)} className={inp}>
                {COURSES.slice(1).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Date & Time</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={e => set("scheduledAt", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Duration (mins)</label>
              <input type="number" value={form.duration} onChange={e => set("duration", e.target.value)} min={15} max={300} className={inp} />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Meet Link</label>
            <input value={form.meetLink} onChange={e => set("meetLink", e.target.value)} placeholder="https://meet.google.com/..." className={inp} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Status</label>
            <select value={form.status} onChange={e => set("status", e.target.value)} className={inp}>
              {["Scheduled","Live","Completed","Cancelled"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={handle} disabled={saving || !form.title.trim()} className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2">
            {saving && <AiOutlineLoading3Quarters className="animate-spin text-sm" />}
            {saving ? "Saving…" : initial ? "Save Changes" : "Schedule Class"}
          </button>
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 bg-white text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm ────────────────────────────────────── */
function DeleteModal({ cls, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const handle = async () => {
    setDeleting(true);
    await new Promise(r => setTimeout(r, 600));
    onConfirm();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
          <MdDelete className="text-red-500 text-2xl" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Delete Class</h3>
        <p className="text-xs text-gray-500 mb-1">This will permanently delete</p>
        <p className="text-sm font-semibold text-gray-800 mb-4">"{cls?.title}"</p>
        <p className="text-[11px] text-gray-400 mb-5">Recordings and attendance data will also be removed.</p>
        <div className="flex gap-2">
          <button onClick={onClose} disabled={deleting} className="flex-1 py-2.5 text-xs font-bold border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">Cancel</button>
          <button onClick={handle} disabled={deleting} className="flex-1 py-2.5 text-xs font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-1.5">
            {deleting && <AiOutlineLoading3Quarters className="animate-spin text-xs" />}
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Toast ─────────────────────────────────────────────── */
function Toast({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed top-5 right-5 z-[9999] bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl min-w-[260px]">
      <MdCheckCircle className="text-teal-500 text-xl flex-shrink-0" />
      <span className="text-sm font-medium text-gray-800 flex-1">{msg}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function AllClasses() {
  const [classes, setClasses]     = useState(MOCK_CLASSES);
  const [search, setSearch]       = useState("");
  const [statusF, setStatusF]     = useState("All");
  const [instructorF, setInstrF]  = useState("All Instructors");
  const [courseF, setCourseF]     = useState("All Courses");
  const [modal, setModal]         = useState(null);   // null | "create" | { type:"edit"|"delete", cls }
  const [toast, setToast]         = useState(null);
  const [page, setPage]           = useState(1);
  const PER_PAGE = 8;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  /* derived stats */
  const totalScheduled = classes.filter(c => c.status === "Scheduled").length;
  const totalLive      = classes.filter(c => c.status === "Live").length;
  const totalCompleted = classes.filter(c => c.status === "Completed").length;
  const totalEnrolled  = classes.reduce((s, c) => s + c.enrolled, 0);

  /* filtered list */
  const filtered = useMemo(() => classes.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q) || c.course.toLowerCase().includes(q);
    const matchS = statusF === "All" || c.status === statusF;
    const matchI = instructorF === "All Instructors" || c.instructor === instructorF;
    const matchC = courseF === "All Courses" || c.course === courseF;
    return matchQ && matchS && matchI && matchC;
  }), [classes, search, statusF, instructorF, courseF]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSave = (form) => {
    if (modal?.type === "edit") {
      setClasses(prev => prev.map(c => c.id === modal.cls.id ? { ...modal.cls, ...form } : c));
      showToast("Class updated successfully!");
    } else {
      setClasses(prev => [...prev, { ...form, id: Date.now(), enrolled: 0, attended: 0, recording: false }]);
      showToast("Class scheduled successfully!");
    }
    setModal(null);
    setPage(1);
  };

  const handleDelete = () => {
    setClasses(prev => prev.filter(c => c.id !== modal.cls.id));
    showToast("Class deleted.");
    setModal(null);
  };

  const handleDuplicate = (cls) => {
    setClasses(prev => [...prev, { ...cls, id: Date.now(), title: `${cls.title} (Copy)`, status: "Scheduled", attended: 0, recording: false }]);
    showToast("Class duplicated!");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Toast msg={toast} onClose={() => setToast(null)} />

      {/* ── Modals ── */}
      {modal === "create" && (
        <ClassModal onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {modal?.type === "edit" && (
        <ClassModal initial={modal.cls} onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {modal?.type === "delete" && (
        <DeleteModal cls={modal.cls} onClose={() => setModal(null)} onConfirm={handleDelete} />
      )}

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span>Dashboard</span>
            <MdChevronRight className="text-base" />
            <span className="text-gray-700 font-semibold">All Classes</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">All Classes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and track all live and scheduled classes</p>
        </div>
        <button
          onClick={() => setModal("create")}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold rounded-xl transition shadow-sm"
        >
          <MdAdd className="text-lg" /> Schedule Class
        </button>
      </div>

      <div className="px-6 py-6 max-w-[1400px] mx-auto space-y-5">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={MdClass}       label="Total Classes"      value={classes.length}   sub={`${filtered.length} matching filters`} color="bg-teal-500"   />
          <StatCard icon={MdSchedule}    label="Scheduled"          value={totalScheduled}   sub="Upcoming classes"                      color="bg-blue-500"   />
          <StatCard icon={MdOutlineVideoCall} label="Live Now"       value={totalLive}        sub={totalLive > 0 ? "In progress" : "None ongoing"} color="bg-red-500"    />
          <StatCard icon={MdCheckCircle} label="Completed"          value={totalCompleted}   sub={`${totalEnrolled.toLocaleString()} enrolled`} color="bg-emerald-500" />
        </div>

        {/* ── Filters ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search classes, instructors…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
            />
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => { setStatusF(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${statusF === s ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {s === "Live" ? <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />{s}</span> : s}
              </button>
            ))}
          </div>

          {/* Instructor filter */}
          <div className="relative">
            <select
              value={instructorF}
              onChange={e => { setInstrF(e.target.value); setPage(1); }}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-teal-400 transition bg-white"
            >
              {INSTRUCTORS.map(i => <option key={i}>{i}</option>)}
            </select>
            <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
          </div>

          {/* Course filter */}
          <div className="relative">
            <select
              value={courseF}
              onChange={e => { setCourseF(e.target.value); setPage(1); }}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-teal-400 transition bg-white"
            >
              {COURSES.map(c => <option key={c}>{c}</option>)}
            </select>
            <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
          </div>

          <button
            onClick={() => { setSearch(""); setStatusF("All"); setInstrF("All Instructors"); setCourseF("All Courses"); setPage(1); }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            <MdRefresh className="text-sm" /> Reset
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {paged.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <MdVideoCall className="text-4xl text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-600 mb-1">No classes found</p>
              <p className="text-xs text-gray-400 mb-5">Try adjusting your filters or search term</p>
              <button onClick={() => setModal("create")} className="flex items-center gap-1.5 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition">
                <MdAdd /> Schedule First Class
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {["Class", "Instructor", "Course", "Date & Time", "Duration", "Enrolled", "Attendance", "Status", ""].map(h => (
                      <th key={h} className={`px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap ${h === "" ? "w-10" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paged.map(cls => {
                    const sm = STATUS_META[cls.status] || STATUS_META.Scheduled;
                    const attPct = cls.enrolled > 0 && cls.attended > 0 ? Math.round((cls.attended / cls.enrolled) * 100) : null;
                    return (
                      <tr key={cls.id} className="hover:bg-gray-50/60 transition group">
                        {/* Class */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cls.status === "Live" ? "bg-red-50" : cls.status === "Completed" ? "bg-emerald-50" : "bg-teal-50"}`}>
                              <MdVideoCall className={`text-lg ${cls.status === "Live" ? "text-red-500" : cls.status === "Completed" ? "text-emerald-500" : "text-teal-500"}`} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">{cls.title}</p>
                              {cls.recording && (
                                <span className="flex items-center gap-1 text-[10px] text-violet-600 font-semibold mt-0.5">
                                  <MdPlayCircle className="text-xs" /> Recording available
                                </span>
                              )}
                              {cls.status === "Live" && (
                                <span className="flex items-center gap-1 text-[10px] text-red-600 font-bold mt-0.5 animate-pulse">
                                  ● In progress
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Instructor */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                              {cls.instructor.split(" ").map(w => w[0]).join("").slice(0, 2)}
                            </div>
                            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{cls.instructor.split(" ")[0]}</span>
                          </div>
                        </td>

                        {/* Course */}
                        <td className="px-4 py-3.5">
                          <span className="text-xs text-gray-500 truncate max-w-[120px] block">{cls.course}</span>
                        </td>

                        {/* Date & Time */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <p className="text-xs font-semibold text-gray-800">{fmt(cls.scheduledAt)}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{fmtTime(cls.scheduledAt)}</p>
                        </td>

                        {/* Duration */}
                        <td className="px-4 py-3.5">
                          <span className="text-xs text-gray-600 font-medium">{cls.duration} min</span>
                        </td>

                        {/* Enrolled */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1 text-xs text-gray-700 font-semibold">
                            <MdPeople className="text-gray-400 text-base" /> {cls.enrolled}
                          </div>
                        </td>

                        {/* Attendance */}
                        <td className="px-4 py-3.5">
                          {attPct !== null ? (
                            <div>
                              <p className="text-xs font-semibold text-gray-800">{cls.attended}/{cls.enrolled}</p>
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1">
                                <div className={`h-full rounded-full ${attPct >= 80 ? "bg-emerald-500" : attPct >= 50 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${attPct}%` }} />
                              </div>
                              <p className="text-[10px] text-gray-400 mt-0.5">{attPct}%</p>
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-400">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${sm.bg} ${sm.text}`}>
                            {cls.status === "Live" ? <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" /> : <span className={`w-1.5 h-1.5 rounded-full ${sm.dot} inline-block`} />}
                            {cls.status}
                          </span>
                          {cls.meetLink && cls.status !== "Cancelled" && cls.status !== "Completed" && (
                            <a href={cls.meetLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-teal-600 hover:text-teal-700 font-semibold mt-1">
                              <MdOpenInNew className="text-xs" /> Join
                            </a>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <ActionMenu
                            cls={cls}
                            onEdit={c => setModal({ type: "edit", cls: c })}
                            onDelete={c => setModal({ type: "delete", cls: c })}
                            onCopy={handleDuplicate}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > PER_PAGE && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-gray-500">
                Showing <span className="font-semibold text-gray-700">{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-gray-700">{filtered.length}</span> classes
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition">
                  <MdChevronLeft className="text-lg" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-bold transition ${page === p ? "bg-teal-500 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-100"}`}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition">
                  <MdChevronRight className="text-lg" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
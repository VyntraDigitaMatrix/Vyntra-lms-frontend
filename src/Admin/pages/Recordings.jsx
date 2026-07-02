import React, { useState, useMemo, useRef } from 'react';
import {
  MdSearch, MdMoreVert, MdPlayCircle, MdDelete, MdDownload,
  MdContentCopy, MdChevronLeft, MdChevronRight, MdVideocam,
  MdCheckCircle, MdPeople, MdCalendarToday, MdAccessTime,
  MdVisibility, MdClose, MdShare, MdPause, MdVolumeUp,
  MdFullscreen, MdLink, MdSort, MdFilterList,
  MdFolder, MdOutlineVideoLibrary, MdSchedule,
  MdTrendingUp, MdStar, MdRefresh,
} from 'react-icons/md';
import { FaChevronDown, FaPlay } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

/* ══════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════ */
const COURSES = ["All Courses", "Full Stack Web Dev", "Digital Marketing", "React Masterclass", "Data Science"];
const INSTRUCTORS = ["All Instructors", "Hitesh Choudhary", "Piyush Garg", "Anurag Tiwari", "Harshit Vashistha"];

const MOCK_RECORDINGS = [
  { id: 1,  title: "React Hooks Deep Dive",          course: "Full Stack Web Dev",    instructor: "Hitesh Choudhary",  date: "2026-06-26", duration: "1:32:14", size: "1.2 GB", views: 312, students: 142, thumbnail: null, status: "Published", quality: "1080p", type: "Live Class" },
  { id: 2,  title: "CSS Grid & Flexbox Mastery",     course: "Full Stack Web Dev",    instructor: "Piyush Garg",       date: "2026-06-25", duration: "58:40",  size: "780 MB", views: 198, students: 87,  thumbnail: null, status: "Published", quality: "720p",  type: "Live Class" },
  { id: 3,  title: "SEO Fundamentals & Strategies",  course: "Digital Marketing",     instructor: "Anurag Tiwari",     date: "2026-06-24", duration: "1:14:22", size: "960 MB", views: 145, students: 63,  thumbnail: null, status: "Published", quality: "1080p", type: "Live Class" },
  { id: 4,  title: "Python for Data Science Intro",  course: "Data Science",          instructor: "Harshit Vashistha", date: "2026-06-23", duration: "2:01:05", size: "1.8 GB", views: 421, students: 201, thumbnail: null, status: "Published", quality: "1080p", type: "Live Class" },
  { id: 5,  title: "Node.js REST APIs — Part 1",     course: "Full Stack Web Dev",    instructor: "Hitesh Choudhary",  date: "2026-06-22", duration: "1:28:33", size: "1.1 GB", views: 267, students: 118, thumbnail: null, status: "Processing", quality: "—",    type: "Live Class" },
  { id: 6,  title: "Redux Toolkit Patterns",         course: "React Masterclass",     instructor: "Piyush Garg",       date: "2026-06-21", duration: "59:18",  size: "820 MB", views: 189, students: 94,  thumbnail: null, status: "Published", quality: "720p",  type: "Recorded" },
  { id: 7,  title: "Google Ads Campaign Setup",      course: "Digital Marketing",     instructor: "Anurag Tiwari",     date: "2026-06-20", duration: "44:52",  size: "620 MB", views: 98,  students: 55,  thumbnail: null, status: "Published", quality: "1080p", type: "Recorded" },
  { id: 8,  title: "Machine Learning Basics",        course: "Data Science",          instructor: "Harshit Vashistha", date: "2026-06-19", duration: "1:45:09", size: "1.5 GB", views: 356, students: 176, thumbnail: null, status: "Published", quality: "1080p", type: "Live Class" },
  { id: 9,  title: "TypeScript Essentials",          course: "Full Stack Web Dev",    instructor: "Hitesh Choudhary",  date: "2026-06-18", duration: "1:15:44", size: "1.0 GB", views: 234, students: 103, thumbnail: null, status: "Published", quality: "720p",  type: "Recorded" },
  { id: 10, title: "State Management Patterns",      course: "React Masterclass",     instructor: "Piyush Garg",       date: "2026-06-17", duration: "1:02:30", size: "890 MB", views: 167, students: 89,  thumbnail: null, status: "Failed",   quality: "—",    type: "Live Class" },
  { id: 11, title: "Pandas & NumPy Deep Dive",       course: "Data Science",          instructor: "Harshit Vashistha", date: "2026-06-16", duration: "1:55:22", size: "1.7 GB", views: 289, students: 156, thumbnail: null, status: "Published", quality: "1080p", type: "Live Class" },
  { id: 12, title: "Social Media Marketing",         course: "Digital Marketing",     instructor: "Anurag Tiwari",     date: "2026-06-15", duration: "50:10",  size: "700 MB", views: 122, students: 72,  thumbnail: null, status: "Published", quality: "720p",  type: "Recorded" },
];

/* ── Helpers ─────────────────────────────────────────── */
const STATUS_META = {
  Published:  { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Published"  },
  Processing: { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400",   label: "Processing" },
  Failed:     { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500",     label: "Failed"     },
};

const COURSE_COLORS = {
  "Full Stack Web Dev": "from-violet-500 to-indigo-600",
  "Digital Marketing":  "from-teal-500 to-emerald-600",
  "React Masterclass":  "from-blue-500 to-cyan-600",
  "Data Science":       "from-orange-500 to-rose-600",
};

const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

/* ── Thumbnail placeholder ───────────────────────────── */
function Thumb({ rec, size = "h-36" }) {
  const grad = COURSE_COLORS[rec.course] || "from-gray-500 to-gray-600";
  return (
    <div className={`${size} w-full bg-gradient-to-br ${grad} rounded-xl flex flex-col items-center justify-center relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_30%,white,transparent)]" />
      <MdOutlineVideoLibrary className="text-white/60 text-4xl mb-1" />
      <span className="text-white/80 text-[10px] font-semibold tracking-wide">{rec.quality !== "—" ? rec.quality : "Processing"}</span>
      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{rec.duration}</span>
    </div>
  );
}

/* ── Toast ───────────────────────────────────────────── */
function Toast({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed top-5 right-5 z-[9999] bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl min-w-[260px]">
      <MdCheckCircle className="text-teal-500 text-xl flex-shrink-0" />
      <span className="text-sm font-medium text-gray-800 flex-1">{msg}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
    </div>
  );
}

/* ── Action menu ─────────────────────────────────────── */
function ActionMenu({ rec, onDelete, onShare, onCopyLink, showToast }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition">
        <MdMoreVert className="text-lg" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 w-48 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <button onClick={() => { onShare(rec); setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 text-left transition">
              <MdShare className="text-teal-400 text-base" /> Share Recording
            </button>
            <button onClick={() => { onCopyLink(rec); setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 text-left transition">
              <MdLink className="text-blue-400 text-base" /> Copy Link
            </button>
            <button onClick={() => { showToast("Downloading…"); setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 text-left transition">
              <MdDownload className="text-violet-400 text-base" /> Download
            </button>
            <div className="border-t border-gray-100" />
            <button onClick={() => { onDelete(rec.id); setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 text-left transition">
              <MdDelete className="text-base" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Video Player Modal ──────────────────────────────── */
function PlayerModal({ rec, onClose }) {
  const grad = COURSE_COLORS[rec.course] || "from-gray-500 to-gray-600";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-black rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-900">
          <div className="min-w-0">
            <p className="text-white text-sm font-bold truncate">{rec.title}</p>
            <p className="text-gray-400 text-xs">{rec.course} · {rec.instructor}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition flex-shrink-0">
            <MdClose className="text-base" />
          </button>
        </div>
        {/* Video area */}
        <div className={`aspect-video bg-gradient-to-br ${grad} flex items-center justify-center relative`}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,white,transparent)]" />
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
              <FaPlay className="text-white text-2xl ml-1" />
            </div>
            <p className="text-white/80 text-sm font-medium">Click to play · {rec.duration}</p>
          </div>
        </div>
        {/* Controls bar */}
        <div className="bg-gray-900 px-5 py-3 flex items-center gap-4">
          <button className="text-white hover:text-teal-400 transition"><MdPlayCircle className="text-2xl" /></button>
          <div className="flex-1 h-1.5 bg-gray-700 rounded-full cursor-pointer">
            <div className="h-full w-1/3 bg-teal-400 rounded-full" />
          </div>
          <span className="text-gray-400 text-xs font-mono">0:00 / {rec.duration}</span>
          <button className="text-white hover:text-teal-400 transition"><MdVolumeUp className="text-xl" /></button>
          <button className="text-white hover:text-teal-400 transition"><MdFullscreen className="text-xl" /></button>
        </div>
        {/* Info row */}
        <div className="bg-gray-900 border-t border-gray-800 px-5 py-3 flex items-center gap-6">
          {[
            { icon: MdVisibility, val: rec.views, label: "Views" },
            { icon: MdPeople,     val: rec.students, label: "Students" },
            { icon: MdFolder,     val: rec.size,  label: "Size" },
            { icon: MdCalendarToday, val: fmtDate(rec.date), label: "Date" },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <s.icon className="text-gray-500 text-base" />
              <div>
                <p className="text-white text-xs font-bold">{s.val}</p>
                <p className="text-gray-500 text-[10px]">{s.label}</p>
              </div>
            </div>
          ))}
          <div className="ml-auto flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-lg transition">
              <MdDownload className="text-sm" /> Download
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-lg transition">
              <MdShare className="text-sm" /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Recording Card (Grid) ───────────────────────────── */
function RecordingCard({ rec, onPlay, onDelete, onShare, onCopyLink, showToast }) {
  const sm = STATUS_META[rec.status] || STATUS_META.Published;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Thumbnail */}
      <div className="relative cursor-pointer" onClick={() => rec.status === "Published" && onPlay(rec)}>
        <Thumb rec={rec} size="h-40" />
        {rec.status === "Published" && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all rounded-xl">
            <div className="w-12 h-12 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all scale-0 group-hover:scale-100">
              <FaPlay className="text-gray-800 text-sm ml-0.5" />
            </div>
          </div>
        )}
        {rec.status === "Processing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
            <div className="flex flex-col items-center gap-2">
              <AiOutlineLoading3Quarters className="text-white text-2xl animate-spin" />
              <span className="text-white text-xs font-bold">Processing…</span>
            </div>
          </div>
        )}
        {rec.status === "Failed" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
            <span className="text-red-400 text-xs font-bold bg-black/60 px-3 py-1.5 rounded-lg">Processing Failed</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 flex-1">{rec.title}</h3>
          <ActionMenu rec={rec} onDelete={onDelete} onShare={onShare} onCopyLink={onCopyLink} showToast={showToast} />
        </div>

        <p className="text-xs text-gray-500 mb-3 truncate">{rec.course}</p>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { icon: MdVisibility, val: rec.views },
            { icon: MdPeople,     val: `${rec.students} students` },
            { icon: MdAccessTime, val: rec.duration },
            { icon: MdFolder,     val: rec.size },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <m.icon className="text-gray-400 text-sm flex-shrink-0" />
              <span className="truncate">{m.val}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${sm.bg} ${sm.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sm.dot} inline-block`} />
            {sm.label}
          </span>
          <span className="text-[11px] text-gray-400">{fmtDate(rec.date)}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Recording Row (List) ────────────────────────────── */
function RecordingRow({ rec, onPlay, onDelete, onShare, onCopyLink, showToast }) {
  const sm = STATUS_META[rec.status] || STATUS_META.Published;
  return (
    <tr className="hover:bg-gray-50/60 transition group">
      {/* Title + thumb */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer relative"
            onClick={() => rec.status === "Published" && onPlay(rec)}
          >
            <Thumb rec={rec} size="h-full" />
            {rec.status === "Published" && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all">
                <FaPlay className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{rec.title}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{rec.type}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 text-xs text-gray-600 max-w-[140px] truncate">{rec.course}</td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
            {rec.instructor.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </div>
          <span className="text-xs text-gray-600 whitespace-nowrap">{rec.instructor.split(" ")[0]}</span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-xs text-gray-600 whitespace-nowrap">{fmtDate(rec.date)}</td>
      <td className="px-4 py-3.5 text-xs text-gray-600 whitespace-nowrap">{rec.duration}</td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1 text-xs text-gray-700 font-semibold">
          <MdVisibility className="text-gray-400 text-sm" /> {rec.views}
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1 text-xs text-gray-700 font-semibold">
          <MdPeople className="text-gray-400 text-sm" /> {rec.students}
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${sm.bg} ${sm.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sm.dot} ${rec.status === "Processing" ? "animate-pulse" : ""} inline-block`} />
          {sm.label}
        </span>
      </td>
      <td className="px-4 py-3.5 text-xs text-gray-500">{rec.quality}</td>
      <td className="px-4 py-3.5">
        <ActionMenu rec={rec} onDelete={onDelete} onShare={onShare} onCopyLink={onCopyLink} showToast={showToast} />
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════ */
export default function Recordings() {
  const [recordings, setRecordings] = useState(MOCK_RECORDINGS);
  const [search, setSearch]       = useState("");
  const [courseF, setCourseF]     = useState("All Courses");
  const [instrF, setInstrF]       = useState("All Instructors");
  const [statusF, setStatusF]     = useState("All");
  const [sortBy, setSortBy]       = useState("newest");
  const [viewMode, setViewMode]   = useState("grid"); // grid | list
  const [playRec, setPlayRec]     = useState(null);
  const [toast, setToast]         = useState(null);
  const [page, setPage]           = useState(1);
  const PER_PAGE = viewMode === "grid" ? 8 : 10;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  /* stats */
  const totalViews    = recordings.reduce((s, r) => s + r.views, 0);
  const totalStudents = [...new Set(recordings.map(r => r.course))].length;
  const published     = recordings.filter(r => r.status === "Published").length;
  const processing    = recordings.filter(r => r.status === "Processing").length;

  /* filter */
  const filtered = useMemo(() => {
    let list = recordings.filter(r => {
      const q = search.toLowerCase();
      const mQ = !q || r.title.toLowerCase().includes(q) || r.course.toLowerCase().includes(q) || r.instructor.toLowerCase().includes(q);
      const mC = courseF === "All Courses" || r.course === courseF;
      const mI = instrF === "All Instructors" || r.instructor === instrF;
      const mS = statusF === "All" || r.status === statusF;
      return mQ && mC && mI && mS;
    });
    if (sortBy === "newest")  list = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === "oldest")  list = [...list].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === "popular") list = [...list].sort((a, b) => b.views - a.views);
    if (sortBy === "students")list = [...list].sort((a, b) => b.students - a.students);
    return list;
  }, [recordings, search, courseF, instrF, statusF, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete  = (id) => { setRecordings(p => p.filter(r => r.id !== id)); showToast("Recording deleted."); };
  const handleShare   = (rec) => { showToast(`Share link generated for "${rec.title}"`); };
  const handleCopyLink= (rec) => { navigator.clipboard?.writeText(`https://vyntra.com/recordings/${rec.id}`).catch(()=>{}); showToast("Link copied to clipboard!"); };

  const sel = (v, fn) => { fn(v); setPage(1); };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Toast msg={toast} onClose={() => setToast(null)} />
      {playRec && <PlayerModal rec={playRec} onClose={() => setPlayRec(null)} />}

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span>Dashboard</span>
            <MdChevronRight className="text-base" />
            <span className="text-gray-700 font-semibold">Recordings</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Recordings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and share all class recordings</p>
        </div>
        <button onClick={() => showToast("Upload started…")} className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold rounded-xl transition shadow-sm">
          <MdVideocam className="text-lg" /> Upload Recording
        </button>
      </div>

      <div className="px-6 py-6 max-w-[1400px] mx-auto space-y-5">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Recordings",  value: recordings.length, sub: `${filtered.length} matching filters`, color: "bg-teal-500",    Icon: MdOutlineVideoLibrary },
            { label: "Published",         value: published,         sub: `${processing} processing`,            color: "bg-emerald-500", Icon: MdCheckCircle         },
            { label: "Total Views",       value: totalViews.toLocaleString(), sub: "Across all recordings",     color: "bg-violet-500",  Icon: MdVisibility          },
            { label: "Courses",           value: totalStudents,     sub: "With recordings",                     color: "bg-blue-500",    Icon: MdFolder              },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <s.Icon className="text-xl text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                <p className="text-2xl font-black text-gray-900 leading-none mt-0.5">{s.value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input value={search} onChange={e => sel(e.target.value, setSearch)} placeholder="Search recordings…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {["All","Published","Processing","Failed"].map(s => (
              <button key={s} onClick={() => sel(s, setStatusF)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${statusF === s ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {s}
              </button>
            ))}
          </div>

          {/* Course */}
          <div className="relative">
            <select value={courseF} onChange={e => sel(e.target.value, setCourseF)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-teal-400 transition bg-white">
              {COURSES.map(c => <option key={c}>{c}</option>)}
            </select>
            <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
          </div>

          {/* Instructor */}
          <div className="relative">
            <select value={instrF} onChange={e => sel(e.target.value, setInstrF)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-teal-400 transition bg-white">
              {INSTRUCTORS.map(i => <option key={i}>{i}</option>)}
            </select>
            <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-teal-400 transition bg-white">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="popular">Most viewed</option>
              <option value="students">Most students</option>
            </select>
            <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
          </div>

          {/* View mode */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 ml-auto">
            {[
              { id: "grid", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg> },
              { id: "list", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><rect x="1" y="2" width="14" height="2" rx="1"/><rect x="1" y="7" width="14" height="2" rx="1"/><rect x="1" y="12" width="14" height="2" rx="1"/></svg> },
            ].map(v => (
              <button key={v.id} onClick={() => { setViewMode(v.id); setPage(1); }}
                className={`p-2 rounded-lg transition ${viewMode === v.id ? "bg-white text-teal-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                {v.icon}
              </button>
            ))}
          </div>

          <button onClick={() => { setSearch(""); setCourseF("All Courses"); setInstrF("All Instructors"); setStatusF("All"); setPage(1); }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <MdRefresh className="text-sm" /> Reset
          </button>
        </div>

        {/* ── Content ── */}
        {paged.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MdOutlineVideoLibrary className="text-4xl text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-600 mb-1">No recordings found</p>
            <p className="text-xs text-gray-400 mb-5">Try adjusting your filters or search term</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paged.map(rec => (
              <RecordingCard key={rec.id} rec={rec} onPlay={setPlayRec} onDelete={handleDelete} onShare={handleShare} onCopyLink={handleCopyLink} showToast={showToast} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {["Recording","Course","Instructor","Date","Duration","Views","Students","Status","Quality",""].map(h => (
                      <th key={h} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-left whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paged.map(rec => (
                    <RecordingRow key={rec.id} rec={rec} onPlay={setPlayRec} onDelete={handleDelete} onShare={handleShare} onCopyLink={handleCopyLink} showToast={showToast} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Pagination ── */}
        {filtered.length > PER_PAGE && (
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-3.5">
            <p className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-700">{(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)}</span> of <span className="font-semibold text-gray-700">{filtered.length}</span> recordings
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition">
                <MdChevronLeft className="text-lg" />
              </button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                <button key={p} onClick={()=>setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-bold transition ${page===p?"bg-teal-500 text-white":"border border-gray-200 text-gray-600 hover:bg-gray-100"}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition">
                <MdChevronRight className="text-lg" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
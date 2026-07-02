import React, { useState } from 'react';
import {
  Search, Filter, MoreVertical, Play, Download, Trash2,
  Edit, Clock, Calendar, Users, Video, Plus, ChevronDown,
  Share2, Copy, Eye, LayoutGrid, List, X, Check,
  TrendingUp, BookOpen, Bookmark, AlertCircle
} from 'lucide-react';

/* ─── DATA ─────────────────────────────────────────────── */
const RECORDINGS = [
  {
    id: '1',
    title: 'Advanced React Patterns — Session 4',
    course: 'Advanced React Development',
    date: 'Jun 25, 2026',
    time: '10:30 AM – 12:00 PM',
    duration: '1h 30m',
    students: 24,
    size: '1.2 GB',
    status: 'Published',
    views: 156,
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&h=340&fit=crop',
  },
  {
    id: '2',
    title: 'Building RESTful APIs with Node.js',
    course: 'Backend Development Masterclass',
    date: 'Jun 24, 2026',
    time: '2:00 PM – 3:30 PM',
    duration: '1h 30m',
    students: 18,
    size: '980 MB',
    status: 'Draft',
    views: 89,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=340&fit=crop',
  },
  {
    id: '3',
    title: 'CSS Animations & Transitions Workshop',
    course: 'Modern Frontend Development',
    date: 'Jun 23, 2026',
    time: '9:00 AM – 10:30 AM',
    duration: '1h 30m',
    students: 31,
    size: '750 MB',
    status: 'Published',
    views: 203,
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&h=340&fit=crop',
  },
  {
    id: '4',
    title: 'Database Design & Optimisation',
    course: 'Full Stack Development',
    date: 'Jun 22, 2026',
    time: '11:00 AM – 12:30 PM',
    duration: '1h 30m',
    students: 27,
    size: '1.5 GB',
    status: 'Processing',
    views: 45,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=340&fit=crop',
  },
  {
    id: '5',
    title: 'Introduction to Machine Learning',
    course: 'AI & Data Science Fundamentals',
    date: 'Jun 21, 2026',
    time: '3:00 PM – 4:30 PM',
    duration: '1h 30m',
    students: 42,
    size: '2.1 GB',
    status: 'Published',
    views: 312,
    thumbnail: 'https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?w=600&h=340&fit=crop',
  },
  {
    id: '6',
    title: 'TypeScript Deep Dive — Generics',
    course: 'Advanced React Development',
    date: 'Jun 20, 2026',
    time: '10:00 AM – 11:30 AM',
    duration: '1h 30m',
    students: 19,
    size: '870 MB',
    status: 'Archived',
    views: 74,
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=340&fit=crop',
  },
];

/* ─── HELPERS ───────────────────────────────────────────── */
const STATUS = {
  Published: { pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
  Draft:     { pill: 'bg-amber-50 text-amber-700 border border-amber-200',       dot: 'bg-amber-400'  },
  Processing:{ pill: 'bg-blue-50 text-blue-700 border border-blue-200',          dot: 'bg-blue-500 animate-pulse' },
  Archived:  { pill: 'bg-gray-100 text-gray-500 border border-gray-200',         dot: 'bg-gray-400'   },
};

/* ─── STAT CARD ─────────────────────────────────────────── */
function StatCard({ label, value, Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5 leading-none">{value}</p>
      </div>
    </div>
  );
}

/* ─── CARD VIEW ITEM ────────────────────────────────────── */
function RecordingCard({ rec, selected, onSelect, onPlay, onDelete }) {
  const [menu, setMenu] = useState(false);
  const s = STATUS[rec.status] || STATUS.Archived;

  return (
    <div className={`group bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${selected ? 'border-violet-400 ring-2 ring-violet-100' : 'border-gray-100 hover:border-gray-200'}`}>
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden cursor-pointer" onClick={() => onPlay(rec)}>
        <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <Play size={18} className="text-violet-600 ml-0.5" />
          </div>
        </div>
        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md font-medium">
          {rec.duration}
        </span>
        {/* Checkbox */}
        <div className="absolute top-2 left-2">
          <div
            onClick={e => { e.stopPropagation(); onSelect(rec.id); }}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-colors ${selected ? 'bg-violet-500 border-violet-500' : 'bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100'}`}
          >
            {selected && <Check size={11} className="text-white" />}
          </div>
        </div>
        {/* Status */}
        <span className={`absolute top-2 right-2 flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.pill}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {rec.status}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1 line-clamp-2">{rec.title}</h3>
        <p className="text-xs text-violet-600 font-medium mb-3 truncate">{rec.course}</p>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 flex-wrap">
          <span className="flex items-center gap-1"><Calendar size={12} />{rec.date}</span>
          <span className="flex items-center gap-1"><Users size={12} />{rec.students}</span>
          <span className="flex items-center gap-1"><Eye size={12} />{rec.views} views</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">{rec.size}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => onPlay(rec)} className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-colors" title="Play">
              <Play size={14} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Download">
              <Download size={14} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors" title="Edit">
              <Edit size={14} />
            </button>
            <button onClick={() => onDelete(rec.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── LIST VIEW ROW ─────────────────────────────────────── */
function RecordingRow({ rec, selected, onSelect, onPlay, onDelete }) {
  const [menu, setMenu] = useState(false);
  const s = STATUS[rec.status] || STATUS.Archived;

  return (
    <tr className={`border-b border-gray-100 hover:bg-gray-50/60 transition-colors ${selected ? 'bg-violet-50/50' : ''}`}>
      <td className="pl-4 pr-2 py-3">
        <div
          onClick={() => onSelect(rec.id)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-colors ${selected ? 'bg-violet-500 border-violet-500' : 'border-gray-300 hover:border-violet-400'}`}
        >
          {selected && <Check size={11} className="text-white" />}
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="relative w-[72px] h-[40px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 cursor-pointer" onClick={() => onPlay(rec)}>
            <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center transition-colors">
              <Play size={12} className="text-white opacity-0 hover:opacity-100" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate max-w-[180px]">{rec.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{rec.size}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 hidden md:table-cell">
        <p className="text-sm text-violet-600 font-medium truncate max-w-[140px]">{rec.course}</p>
      </td>
      <td className="px-3 py-3 hidden lg:table-cell">
        <p className="text-sm text-gray-700">{rec.date}</p>
        <p className="text-xs text-gray-400">{rec.time}</p>
      </td>
      <td className="px-3 py-3 hidden sm:table-cell">
        <span className="flex items-center gap-1.5 text-sm text-gray-600">
          <Clock size={13} className="text-gray-400" />{rec.duration}
        </span>
      </td>
      <td className="px-3 py-3 hidden md:table-cell">
        <span className="flex items-center gap-1.5 text-sm text-gray-600">
          <Users size={13} className="text-gray-400" />{rec.students}
        </span>
      </td>
      <td className="px-3 py-3 hidden lg:table-cell">
        <span className="flex items-center gap-1.5 text-sm text-gray-600">
          <Eye size={13} className="text-gray-400" />{rec.views}
        </span>
      </td>
      <td className="px-3 py-3">
        <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit ${s.pill}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {rec.status}
        </span>
      </td>
      <td className="pl-3 pr-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => onPlay(rec)} className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-colors" title="Play"><Play size={14} /></button>
          <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Download"><Download size={14} /></button>
          <button className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors" title="Edit"><Edit size={14} /></button>
          <button onClick={() => onDelete(rec.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={14} /></button>
        </div>
      </td>
    </tr>
  );
}

/* ─── VIDEO MODAL ────────────────────────────────────────── */
function VideoModal({ rec, onClose }) {
  if (!rec) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-800 text-sm truncate">{rec.title}</h3>
            <p className="text-xs text-violet-600 mt-0.5">{rec.course}</p>
          </div>
          <button onClick={onClose} className="ml-4 p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>
        {/* Thumbnail placeholder (no real video src) */}
        <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
          <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center backdrop-blur-sm">
              <Play size={28} className="text-white ml-1" />
            </div>
            <p className="text-white/80 text-sm">Preview not available in demo</p>
          </div>
          {/* Duration */}
          <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md">{rec.duration}</span>
        </div>
        {/* Meta */}
        <div className="px-5 py-4 flex items-center gap-6 flex-wrap">
          <span className="flex items-center gap-1.5 text-sm text-gray-500"><Calendar size={14} className="text-gray-400" />{rec.date}</span>
          <span className="flex items-center gap-1.5 text-sm text-gray-500"><Clock size={14} className="text-gray-400" />{rec.duration}</span>
          <span className="flex items-center gap-1.5 text-sm text-gray-500"><Users size={14} className="text-gray-400" />{rec.students} students</span>
          <span className="flex items-center gap-1.5 text-sm text-gray-500"><Eye size={14} className="text-gray-400" />{rec.views} views</span>
          <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS[rec.status]?.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS[rec.status]?.dot}`} />
            {rec.status}
          </span>
        </div>
        {/* Actions */}
        <div className="px-5 pb-5 flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors">
            <Download size={15} /> Download
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Share2 size={15} /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Edit size={15} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────────────── */
export default function Recordings() {
  const [data, setData]             = useState(RECORDINGS);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [view, setView]             = useState('grid'); // 'grid' | 'list'
  const [selected, setSelected]     = useState([]);
  const [playing, setPlaying]       = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const FILTERS = ['All', 'Published', 'Draft', 'Processing', 'Archived'];

  const filtered = data.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.course.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll   = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(r => r.id));
  const deleteRec   = id => { setData(d => d.filter(r => r.id !== id)); setSelected(s => s.filter(x => x !== id)); };
  const deleteBulk  = () => { setData(d => d.filter(r => !selected.includes(r.id))); setSelected([]); };

  const totalViews   = data.reduce((a, r) => a + r.views, 0);
  const totalStudents= data.reduce((a, r) => a + r.students, 0);
  const published    = data.filter(r => r.status === 'Published').length;

  return (
    <div className="min-h-screen bg-gray-50 p-5 font-sans">
      <VideoModal rec={playing} onClose={() => setPlaying(null)} />

      <div className="max-w-7xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recordings</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage and share your course session recordings</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
              <Download size={15} /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors shadow-sm shadow-violet-200">
              <Plus size={16} /> New Recording
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Total Recordings" value={data.length}      Icon={Video}      color="bg-violet-50 text-violet-600" />
          <StatCard label="Published"         value={published}        Icon={BookOpen}    color="bg-emerald-50 text-emerald-600" />
          <StatCard label="Total Views"       value={totalViews.toLocaleString()} Icon={TrendingUp} color="bg-blue-50 text-blue-600" />
          <StatCard label="Students Enrolled" value={totalStudents}    Icon={Users}       color="bg-amber-50 text-amber-600" />
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full sm:w-auto">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search recordings or courses…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status filter */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Filter size={14} />
                {statusFilter === 'All' ? 'Filter' : statusFilter}
                <ChevronDown size={13} />
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-10 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-40 z-20">
                  {FILTERS.map(f => (
                    <button
                      key={f}
                      onClick={() => { setStatusFilter(f); setFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${statusFilter === f ? 'text-violet-600 bg-violet-50 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {statusFilter === f && <Check size={12} />}
                      {statusFilter !== f && <span className="w-3" />}
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-0.5 gap-0.5">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white shadow-sm text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Bulk action bar ── */}
        {selected.length > 0 && (
          <div className="bg-violet-600 text-white rounded-2xl px-5 py-3 flex items-center gap-4 shadow-md shadow-violet-200">
            <span className="text-sm font-medium">{selected.length} recording{selected.length > 1 ? 's' : ''} selected</span>
            <div className="flex gap-2 ml-auto">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors">
                <Download size={13} /> Download
              </button>
              <button onClick={deleteBulk} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-red-500 rounded-lg text-sm transition-colors">
                <Trash2 size={13} /> Delete
              </button>
              <button onClick={() => setSelected([])} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── Content ── */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Video size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium text-sm">No recordings found</p>
            <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(rec => (
              <RecordingCard
                key={rec.id}
                rec={rec}
                selected={selected.includes(rec.id)}
                onSelect={toggleSelect}
                onPlay={setPlaying}
                onDelete={deleteRec}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="pl-4 pr-2 py-3">
                      <div
                        onClick={toggleAll}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-colors ${selected.length === filtered.length && filtered.length > 0 ? 'bg-violet-500 border-violet-500' : 'border-gray-300 hover:border-violet-400'}`}
                      >
                        {selected.length === filtered.length && filtered.length > 0 && <Check size={11} className="text-white" />}
                      </div>
                    </th>
                    {['Recording','Course','Date & Time','Duration','Students','Views','Status','Actions'].map(h => (
                      <th key={h} className={`px-3 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider ${h === 'Course' ? 'hidden md:table-cell' : h === 'Date & Time' ? 'hidden lg:table-cell' : h === 'Duration' ? 'hidden sm:table-cell' : h === 'Students' ? 'hidden md:table-cell' : h === 'Views' ? 'hidden lg:table-cell' : ''} ${h === 'Actions' ? 'text-right' : ''}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(rec => (
                    <RecordingRow
                      key={rec.id}
                      rec={rec}
                      selected={selected.includes(rec.id)}
                      onSelect={toggleSelect}
                      onPlay={setPlaying}
                      onDelete={deleteRec}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">Showing {filtered.length} of {data.length} recordings</p>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">Previous</button>
                <button className="px-3 py-1 text-xs bg-violet-600 text-white rounded-lg">1</button>
                <button className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">2</button>
                <button className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">Next</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
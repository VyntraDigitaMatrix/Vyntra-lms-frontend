import { useState } from "react";

// ── Sample Data ──────────────────────────────────────────────────────────────
const DISCUSSIONS = [
  { id: 1,  title: "How to implement useEffect correctly?",         author: "Priya Sharma",   avatar: "PS", course: "React Fundamentals",      category: "Question",      replies: 12, views: 145, likes: 8,  status: "open",     pinned: true,  createdAt: "2h ago",    lastReply: "15m ago",  tags: ["react","hooks"]         },
  { id: 2,  title: "Best practices for REST API design",            author: "Arjun Mehta",    avatar: "AM", course: "Backend Development",       category: "Discussion",    replies: 7,  views: 98,  likes: 14, status: "open",     pinned: false, createdAt: "4h ago",    lastReply: "1h ago",   tags: ["api","backend"]         },
  { id: 3,  title: "Assignment 3 deadline extended?",               author: "Sneha Kapoor",   avatar: "SK", course: "UI/UX Design",              category: "Announcement",  replies: 3,  views: 210, likes: 22, status: "resolved", pinned: true,  createdAt: "1d ago",    lastReply: "3h ago",   tags: ["deadline"]              },
  { id: 4,  title: "Confusion about normalization in databases",    author: "Rahul Verma",    avatar: "RV", course: "Database Engineering",      category: "Question",      replies: 5,  views: 67,  likes: 3,  status: "open",     pinned: false, createdAt: "1d ago",    lastReply: "5h ago",   tags: ["sql","database"]        },
  { id: 5,  title: "ML model accuracy dropping after epoch 10",    author: "Kavya Nair",     avatar: "KN", course: "Machine Learning",          category: "Question",      replies: 9,  views: 134, likes: 6,  status: "open",     pinned: false, createdAt: "2d ago",    lastReply: "8h ago",   tags: ["ml","python"]           },
  { id: 6,  title: "Week 5 resources and reading list",             author: "Vikram Singh",   avatar: "VS", course: "Cloud Architecture",        category: "Resource",      replies: 2,  views: 89,  likes: 18, status: "resolved", pinned: false, createdAt: "2d ago",    lastReply: "1d ago",   tags: ["resources"]             },
  { id: 7,  title: "Docker container networking explained",         author: "Ananya Iyer",    avatar: "AI", course: "DevOps & CI/CD",            category: "Discussion",    replies: 15, views: 203, likes: 11, status: "open",     pinned: false, createdAt: "3d ago",    lastReply: "2h ago",   tags: ["docker","devops"]       },
  { id: 8,  title: "Figma auto-layout tips & tricks",               author: "Rohan Das",      avatar: "RD", course: "UI/UX Design",              category: "Resource",      replies: 6,  views: 77,  likes: 9,  status: "open",     pinned: false, createdAt: "3d ago",    lastReply: "1d ago",   tags: ["figma","design"]        },
  { id: 9,  title: "Node.js vs Deno — which to learn in 2026?",    author: "Priya Sharma",   avatar: "PS", course: "Backend Development",       category: "Discussion",    replies: 21, views: 312, likes: 27, status: "open",     pinned: false, createdAt: "4d ago",    lastReply: "30m ago",  tags: ["nodejs","javascript"]   },
  { id: 10, title: "How to center a div (seriously though)",        author: "Arjun Mehta",    avatar: "AM", course: "React Fundamentals",        category: "Question",      replies: 4,  views: 55,  likes: 35, status: "resolved", pinned: false, createdAt: "5d ago",    lastReply: "3d ago",   tags: ["css","html"]            },
];

const CATEGORIES = ["All", "Question", "Discussion", "Announcement", "Resource"];
const STATUS_TABS = ["all", "open", "resolved", "pinned"];

const CATEGORY_CONFIG = {
  Question:     { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500"    },
  Discussion:   { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200",  dot: "bg-violet-500"  },
  Announcement: { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500"   },
  Resource:     { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700","bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700","bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700","bg-cyan-100 text-cyan-700",
];

function Avatar({ initials, size = "w-8 h-8 text-xs" }) {
  const idx = (initials.charCodeAt(0) + initials.charCodeAt(1)) % AVATAR_COLORS.length;
  return (
    <div className={`${size} ${AVATAR_COLORS[idx]} rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ── Add Discussion Modal ─────────────────────────────────────────────────────
function AddModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: "", course: "", category: "Question", tags: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const cls = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition bg-white placeholder-slate-400";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 border-t-4 border-t-teal-500">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Start a Discussion</h2>
            <p className="text-xs text-slate-500 mt-0.5">Post a question, discussion, or resource</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 text-lg transition">&times;</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Ask a question or start a discussion..." className={cls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Course</label>
            <input value={form.course} onChange={e => set("course", e.target.value)} placeholder="e.g. React Fundamentals" className={cls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className={cls}>
                {["Question", "Discussion", "Announcement", "Resource"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tags</label>
              <input value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="react, hooks..." className={cls} />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition">Cancel</button>
          <button onClick={() => { if (form.title) onAdd(form); }}
            className="flex-[2] py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold rounded-lg transition shadow-sm">
            Post Discussion
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Detail Drawer ────────────────────────────────────────────────────────────
function DetailDrawer({ disc, onClose, onResolve, onPin, onDelete }) {
  const [reply, setReply] = useState("");
  const cc = CATEGORY_CONFIG[disc.category];

  const mockReplies = [
    { id: 1, author: "Admin",        avatar: "AD", time: "1h ago",  text: "Great question! The key is to understand dependency arrays. When you pass an empty array [], the effect runs only once after mount.",  isAdmin: true  },
    { id: 2, author: disc.author,    avatar: disc.avatar, time: "45m ago", text: "That makes sense! So if I add a variable to the array, it re-runs when that variable changes?", isAdmin: false },
    { id: 3, author: "Priya Sharma", avatar: "PS", time: "20m ago", text: "Exactly right! And be careful about adding functions — make sure to wrap them in useCallback to avoid infinite loops.", isAdmin: false },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex justify-end" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer header */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cc.bg} ${cc.text} ${cc.border}`}>
                  {disc.category}
                </span>
                {disc.pinned && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">📌 Pinned</span>}
                {disc.status === "resolved" && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">✓ Resolved</span>}
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{disc.title}</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 flex-shrink-0 transition text-lg">&times;</button>
          </div>
          <div className="flex items-center gap-3 mt-2.5">
            <Avatar initials={disc.avatar} />
            <div>
              <div className="text-xs font-semibold text-slate-700">{disc.author}</div>
              <div className="text-[10px] text-slate-400">{disc.course} · {disc.createdAt}</div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex gap-5">
          {[["💬", disc.replies, "replies"], ["👁", disc.views, "views"], ["❤️", disc.likes, "likes"]].map(([icon, val, label]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-sm">{icon}</span>
              <span className="text-sm font-bold text-slate-700">{val}</span>
              <span className="text-xs text-slate-400">{label}</span>
            </div>
          ))}
          <div className="ml-auto flex flex-wrap gap-1">
            {disc.tags.map(t => (
              <span key={t} className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">#{t}</span>
            ))}
          </div>
        </div>

        {/* Replies */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{disc.replies} Replies</p>
          {mockReplies.map(r => (
            <div key={r.id} className={`flex gap-3 ${r.isAdmin ? "flex-row-reverse" : ""}`}>
              <Avatar initials={r.avatar} />
              <div className={`flex-1 ${r.isAdmin ? "items-end" : ""} flex flex-col`}>
                <div className={`rounded-xl px-3.5 py-2.5 text-sm text-slate-800 leading-relaxed max-w-[90%]
                  ${r.isAdmin ? "bg-teal-50 border border-teal-100 self-end" : "bg-slate-50 border border-slate-100"}`}>
                  {r.text}
                </div>
                <div className={`flex items-center gap-2 mt-1 text-[10px] text-slate-400 ${r.isAdmin ? "flex-row-reverse" : ""}`}>
                  <span className="font-semibold">{r.author}</span>
                  <span>·</span><span>{r.time}</span>
                  {r.isAdmin && <span className="bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-bold">Admin</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply box */}
        <div className="px-5 py-4 border-t border-slate-100">
          <div className="flex gap-2.5">
            <Avatar initials="AD" />
            <div className="flex-1 flex gap-2">
              <input value={reply} onChange={e => setReply(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition" />
              <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold rounded-lg transition">Send</button>
            </div>
          </div>
        </div>

        {/* Admin actions */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex gap-2">
          <button onClick={() => onResolve(disc.id)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition
              ${disc.status === "resolved"
                ? "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"}`}>
            {disc.status === "resolved" ? "Mark Open" : "✓ Resolve"}
          </button>
          <button onClick={() => onPin(disc.id)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition
              ${disc.pinned ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
            {disc.pinned ? "📌 Unpin" : "📌 Pin"}
          </button>
          <button onClick={() => { onDelete(disc.id); onClose(); }}
            className="flex-1 py-2 text-xs font-bold bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-lg transition">
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Discussions() {
  const [discussions, setDiscussions] = useState(DISCUSSIONS);
  const [search, setSearch]           = useState("");
  const [statusTab, setStatusTab]     = useState("all");
  const [category, setCategory]       = useState("All");
  const [selected, setSelected]       = useState(new Set());
  const [showAdd, setShowAdd]         = useState(false);
  const [activeDisc, setActiveDisc]   = useState(null);
  const [toast, setToast]             = useState(null);
  const [sortBy, setSortBy]           = useState("latest");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // ── Stats ──
  const stats = [
    { label: "Total",    value: discussions.length,                                    icon: "💬", bg: "bg-teal-50",    text: "text-teal-600",    border: "border-t-teal-500"    },
    { label: "Open",     value: discussions.filter(d => d.status === "open").length,   icon: "🔓", bg: "bg-blue-50",    text: "text-blue-600",    border: "border-t-blue-500"    },
    { label: "Resolved", value: discussions.filter(d => d.status === "resolved").length,icon:"✅", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-t-emerald-500" },
    { label: "Pinned",   value: discussions.filter(d => d.pinned).length,              icon: "📌", bg: "bg-amber-50",   text: "text-amber-600",   border: "border-t-amber-500"   },
  ];

  // ── Filters ──
  const filtered = discussions
    .filter(d => {
      const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
                          d.author.toLowerCase().includes(search.toLowerCase()) ||
                          d.course.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusTab === "all" || (statusTab === "pinned" ? d.pinned : d.status === statusTab);
      const matchCat    = category === "All" || d.category === category;
      return matchSearch && matchStatus && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "latest")  return 0;
      if (sortBy === "popular") return b.views - a.views;
      if (sortBy === "replies") return b.replies - a.replies;
      if (sortBy === "likes")   return b.likes - a.likes;
      return 0;
    });

  // ── Actions ──
  const handleAdd = (form) => {
    setDiscussions(prev => [{
      id: Date.now(), title: form.title, author: "Admin", avatar: "AD",
      course: form.course || "General", category: form.category,
      replies: 0, views: 0, likes: 0, status: "open", pinned: false,
      createdAt: "just now", lastReply: "—",
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    }, ...prev]);
    setShowAdd(false);
    showToast("Discussion posted!");
  };

  const handleResolve = (id) => {
    setDiscussions(prev => prev.map(d => d.id === id ? { ...d, status: d.status === "resolved" ? "open" : "resolved" } : d));
    showToast("Status updated!");
  };

  const handlePin = (id) => {
    setDiscussions(prev => prev.map(d => d.id === id ? { ...d, pinned: !d.pinned } : d));
    showToast("Pin status updated!");
  };

  const handleDelete = (id) => {
    setDiscussions(prev => prev.filter(d => d.id !== id));
    setSelected(prev => { const s = new Set(prev); s.delete(id); return s; });
    showToast("Discussion deleted.");
  };

  const toggleSelect  = (id) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll     = () => setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(d => d.id)));

  const statusCounts = {
    all:      discussions.length,
    open:     discussions.filter(d => d.status === "open").length,
    resolved: discussions.filter(d => d.status === "resolved").length,
    pinned:   discussions.filter(d => d.pinned).length,
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.18s ease; }
        .row-hover:hover { background-color: #f0fdfa; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-xl fade-in">
          {toast}
        </div>
      )}

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}

      {activeDisc && (
        <DetailDrawer
          disc={activeDisc}
          onClose={() => setActiveDisc(null)}
          onResolve={(id) => { handleResolve(id); setActiveDisc(prev => prev ? { ...prev, status: prev.status === "resolved" ? "open" : "resolved" } : null); }}
          onPin={(id)     => { handlePin(id);     setActiveDisc(prev => prev ? { ...prev, pinned: !prev.pinned } : null); }}
          onDelete={handleDelete}
        />
      )}

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-100 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <span>Dashboard</span><span>›</span>
              <span className="text-slate-700 font-semibold">Discussions</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Discussions</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage student discussions, questions and announcements</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm transition">
            <span className="text-base leading-none">+</span> New Discussion
          </button>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map(({ label, value, icon, bg, text, border }) => (
            <div key={label} className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow border-t-2 ${border}`}>
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center text-xl flex-shrink-0`}>{icon}</div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
                <div className={`text-2xl font-black mt-0.5 leading-none ${text}`}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Card ── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Category filter row */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition
                  ${category === cat
                    ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-600"}`}>
                {cat}
                {cat !== "All" && (
                  <span className={`ml-1.5 text-[10px] font-bold ${category === cat ? "text-teal-100" : "text-slate-400"}`}>
                    {discussions.filter(d => d.category === cat).length}
                  </span>
                )}
              </button>
            ))}

            {/* Sort */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Sort:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-400 bg-white transition">
                <option value="latest">Latest</option>
                <option value="popular">Most Viewed</option>
                <option value="replies">Most Replies</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>
          </div>

          {/* Status tabs + Search */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              {STATUS_TABS.map(tab => (
                <button key={tab} onClick={() => setStatusTab(tab)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition capitalize
                    ${statusTab === tab ? "bg-teal-500 text-white shadow-sm" : "text-slate-500 hover:text-teal-600 hover:bg-teal-50"}`}>
                  {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className={`text-[10px] font-bold ${statusTab === tab ? "text-teal-100" : "text-slate-400"}`}>
                    {statusCounts[tab]}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search discussions..."
                className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition w-56" />
            </div>
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 && (
            <div className="fade-in px-5 py-2.5 bg-teal-50 border-b border-teal-100 flex items-center gap-3">
              <span className="text-sm text-teal-700 font-semibold">{selected.size} selected</span>
              <div className="w-px h-4 bg-teal-200" />
              <button onClick={() => { selected.forEach(id => handleResolve(id)); setSelected(new Set()); }}
                className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md hover:bg-emerald-100 transition">
                Resolve All
              </button>
              <button onClick={() => { selected.forEach(id => handleDelete(id)); setSelected(new Set()); }}
                className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-md hover:bg-red-100 transition">
                Delete All
              </button>
              <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-slate-400 hover:text-slate-600 transition">Clear</button>
            </div>
          )}

          {/* Discussion list */}
          {filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">💬</div>
              <p className="text-sm font-semibold text-slate-500">No discussions found</p>
              <p className="text-xs text-slate-400">{search ? `No results for "${search}"` : "Start the first discussion!"}</p>
              {!search && (
                <button onClick={() => setShowAdd(true)}
                  className="mt-1 text-xs font-bold text-teal-600 hover:text-teal-700 transition">+ New Discussion</button>
              )}
            </div>
          ) : (
            <div>
              {/* Table header */}
              <div className="grid items-center bg-slate-50 border-b border-slate-100 px-4 py-2.5 gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider"
                style={{ gridTemplateColumns: "40px 1fr 160px 110px 80px 80px 80px 100px" }}>
                <div>
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll}
                    className="w-4 h-4 rounded border-slate-300 cursor-pointer" style={{ accentColor: "#14b8a6" }} />
                </div>
                <div>Discussion</div>
                <div>Course</div>
                <div>Category</div>
                <div>Replies</div>
                <div>Views</div>
                <div>Likes</div>
                <div>Actions</div>
              </div>

              {filtered.map(d => {
                const cc  = CATEGORY_CONFIG[d.category];
                const isSel = selected.has(d.id);
                return (
                  <div key={d.id}
                    className={`row-hover grid items-center px-4 py-3.5 border-b border-slate-50 last:border-0 gap-4 transition-colors
                      ${isSel ? "bg-teal-50/60" : ""}`}
                    style={{ gridTemplateColumns: "40px 1fr 160px 110px 80px 80px 80px 100px", borderLeft: isSel ? "3px solid #14b8a6" : "3px solid transparent" }}>

                    {/* Checkbox */}
                    <div>
                      <input type="checkbox" checked={isSel} onChange={() => toggleSelect(d.id)}
                        className="w-4 h-4 rounded border-slate-300 cursor-pointer" style={{ accentColor: "#14b8a6" }} />
                    </div>

                    {/* Title + meta */}
                    <div className="min-w-0 cursor-pointer" onClick={() => setActiveDisc(d)}>
                      <div className="flex items-center gap-2 mb-0.5">
                        {d.pinned && <span className="text-amber-500 text-xs">📌</span>}
                        {d.status === "resolved" && <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />}
                        <span className="text-sm font-bold text-slate-900 truncate hover:text-teal-600 transition">{d.title}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar initials={d.avatar} size="w-5 h-5 text-[9px]" />
                        <span className="text-xs text-slate-500">{d.author}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-400">{d.createdAt}</span>
                        {d.tags.slice(0, 2).map(t => (
                          <span key={t} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">#{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* Course */}
                    <div className="text-xs text-slate-500 truncate font-medium">{d.course}</div>

                    {/* Category */}
                    <div>
                      <span className={`inline-flex items-center gap-1.5 ${cc.bg} ${cc.text} border ${cc.border} text-[11px] font-semibold px-2 py-1 rounded-full`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cc.dot}`} />
                        {d.category}
                      </span>
                    </div>

                    {/* Replies */}
                    <div className="flex items-center gap-1">
                      <span className="text-sm">💬</span>
                      <span className="text-sm font-bold text-slate-700">{d.replies}</span>
                    </div>

                    {/* Views */}
                    <div className="flex items-center gap-1">
                      <span className="text-sm">👁</span>
                      <span className="text-sm font-bold text-slate-700">{d.views}</span>
                    </div>

                    {/* Likes */}
                    <div className="flex items-center gap-1">
                      <span className="text-sm">❤️</span>
                      <span className="text-sm font-bold text-slate-700">{d.likes}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button onClick={() => setActiveDisc(d)} title="View"
                        className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition text-sm">
                        👁
                      </button>
                      <button onClick={() => handlePin(d.id)} title={d.pinned ? "Unpin" : "Pin"}
                        className={`w-7 h-7 flex items-center justify-center rounded-md border transition text-sm
                          ${d.pinned ? "bg-amber-50 border-amber-200 text-amber-600" : "border-slate-200 text-slate-400 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600"}`}>
                        📌
                      </button>
                      <button onClick={() => handleResolve(d.id)} title={d.status === "resolved" ? "Reopen" : "Resolve"}
                        className={`w-7 h-7 flex items-center justify-center rounded-md border transition text-sm
                          ${d.status === "resolved" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "border-slate-200 text-slate-400 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600"}`}>
                        ✓
                      </button>
                      <button onClick={() => handleDelete(d.id)} title="Delete"
                        className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition text-sm">
                        🗑
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of <span className="font-semibold text-slate-600">{discussions.length}</span> discussions
            </span>
            <div className="flex gap-1">
              {["←", "1", "2", "→"].map((p, i) => (
                <button key={i} className={`min-w-[28px] h-7 px-1.5 rounded-md border text-xs transition
                  ${p === "1" ? "bg-teal-500 text-white border-teal-500" : "bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-600"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
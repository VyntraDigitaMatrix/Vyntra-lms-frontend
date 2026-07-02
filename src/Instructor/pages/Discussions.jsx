import React, { useState, useMemo, useRef } from 'react';
import { Link } from "react-router-dom";
import {
  MdSearch, MdAdd, MdMoreVert, MdEdit, MdDelete,
  MdThumbUp, MdThumbUpOffAlt, MdReply, MdClose,
  MdCheckCircle, MdFilterList, MdSort, MdForum,
  MdChevronLeft, MdChevronRight, MdSend, MdPerson,
  MdVisibility, MdPushPin, MdLock, MdLockOpen,
  MdBookmark, MdBookmarkBorder, MdExpandMore, MdExpandLess,
  MdFlag, MdCheck,
} from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaChevronDown } from 'react-icons/fa';

/* ══════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════ */
const COURSES = ["All Courses", "Full Stack Web Dev", "Digital Marketing", "React Masterclass", "Data Science"];
const STATUSES = ["All", "Open", "Answered", "Pinned", "Locked"];

const MOCK_DISCUSSIONS = [
  {
    id: 1, courseId: 1, course: "Full Stack Web Dev",
    title: "Difference between var, let and const in JavaScript?",
    body: "I'm confused about when to use var vs let vs const. Can someone explain the scope differences and best practices?",
    author: { name: "Arjun Sharma", avatar: "AS", role: "Student" },
    createdAt: "2026-06-26T09:15:00",
    likes: 14, liked: false, views: 132, pinned: true, locked: false,
    status: "Answered", bookmarked: false,
    tags: ["JavaScript", "ES6"],
    replies: [
      { id: 101, author: { name: "Hitesh Choudhary", avatar: "HC", role: "Instructor" }, body: "Great question! `var` is function-scoped and hoisted, `let` is block-scoped and not hoisted in the same way, and `const` is also block-scoped but the binding can't be reassigned. In modern JS, prefer `const` by default, use `let` when you need to reassign, and avoid `var` entirely.", createdAt: "2026-06-26T10:00:00", likes: 22, liked: true },
      { id: 102, author: { name: "Priya Nair", avatar: "PN", role: "Student" }, body: "Also worth noting that `const` doesn't make objects immutable — only the reference is constant. You can still mutate object properties.", createdAt: "2026-06-26T10:30:00", likes: 8, liked: false },
    ],
  },
  {
    id: 2, courseId: 1, course: "Full Stack Web Dev",
    title: "How does useEffect cleanup work?",
    body: "I see examples with return functions inside useEffect. When exactly does the cleanup run? Is it always before re-render?",
    author: { name: "Sneha Patel", avatar: "SP", role: "Student" },
    createdAt: "2026-06-25T14:30:00",
    likes: 9, liked: false, views: 87, pinned: false, locked: false,
    status: "Open", bookmarked: true,
    tags: ["React", "Hooks"],
    replies: [],
  },
  {
    id: 3, courseId: 2, course: "Digital Marketing",
    title: "Best tools for keyword research in 2026?",
    body: "The instructor mentioned SEMrush and Ahrefs. Are there any free alternatives that work well for beginners?",
    author: { name: "Rahul Verma", avatar: "RV", role: "Student" },
    createdAt: "2026-06-24T11:00:00",
    likes: 6, liked: false, views: 54, pinned: false, locked: false,
    status: "Answered", bookmarked: false,
    tags: ["SEO", "Tools"],
    replies: [
      { id: 201, author: { name: "Anurag Tiwari", avatar: "AT", role: "Instructor" }, body: "Google Keyword Planner is completely free and quite powerful. Ubersuggest also has a generous free tier. For backlink analysis, Moz offers 10 free queries per month.", createdAt: "2026-06-24T13:00:00", likes: 11, liked: false },
    ],
  },
  {
    id: 4, courseId: 3, course: "React Masterclass",
    title: "Redux vs Context API — which should I use?",
    body: "For a mid-sized app with about 10 components sharing state, is Redux overkill? The Context API seems simpler.",
    author: { name: "Karthik Rao", avatar: "KR", role: "Student" },
    createdAt: "2026-06-23T16:45:00",
    likes: 18, liked: true, views: 210, pinned: true, locked: false,
    status: "Answered", bookmarked: false,
    tags: ["Redux", "Context"],
    replies: [
      { id: 301, author: { name: "Piyush Garg", avatar: "PG", role: "Instructor" }, body: "For 10 components, Context API is absolutely fine. Use Redux when you need time-travel debugging, complex middleware (like async thunks/sagas at scale), or when multiple teams need a predictable state contract.", createdAt: "2026-06-23T17:30:00", likes: 25, liked: false },
    ],
  },
  {
    id: 5, courseId: 4, course: "Data Science",
    title: "Understanding gradient descent intuitively",
    body: "The math makes sense but I'm struggling to build an intuition for why gradient descent works the way it does. Any analogies?",
    author: { name: "Meera Iyer", avatar: "MI", role: "Student" },
    createdAt: "2026-06-22T10:20:00",
    likes: 21, liked: false, views: 178, pinned: false, locked: true,
    status: "Locked", bookmarked: true,
    tags: ["ML", "Math"],
    replies: [
      { id: 401, author: { name: "Harshit Vashistha", avatar: "HV", role: "Instructor" }, body: "Think of a blindfolded hiker trying to reach the lowest point of a hilly valley. At each step, they feel the slope under their feet and take a step in the steepest downhill direction. The learning rate controls how large each step is — too big and you overshoot the valley, too small and it takes forever.", createdAt: "2026-06-22T11:00:00", likes: 34, liked: true },
    ],
  },
  {
    id: 6, courseId: 1, course: "Full Stack Web Dev",
    title: "CORS error when connecting React to Node backend",
    body: "I keep getting 'Access-Control-Allow-Origin' errors. I've tried adding cors middleware but it still fails on POST requests.",
    author: { name: "Dev Chopra", avatar: "DC", role: "Student" },
    createdAt: "2026-06-21T08:00:00",
    likes: 7, liked: false, views: 94, pinned: false, locked: false,
    status: "Open", bookmarked: false,
    tags: ["Node.js", "CORS"],
    replies: [],
  },
];

/* ── Helpers ─────────────────────────────────────────── */
const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const STATUS_META = {
  Open: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Answered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Pinned: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Locked: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
};

const AVATAR_COLORS = ["bg-violet-500", "bg-teal-500", "bg-blue-500", "bg-rose-500", "bg-amber-500", "bg-emerald-500", "bg-indigo-500", "bg-pink-500"];
const avatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

/* ── Avatar ──────────────────────────────────────────── */
function Avatar({ name, avatar, size = "w-9 h-9", textSize = "text-xs", role }) {
  return (
    <div className={`${size} ${avatarColor(name)} rounded-full flex items-center justify-center font-bold ${textSize} text-white flex-shrink-0`}>
      {avatar || name?.slice(0, 2).toUpperCase()}
    </div>
  );
}

/* ── Tag pill ────────────────────────────────────────── */
function Tag({ label }) {
  return (
    <span className="px-2 py-0.5 bg-violet-50 border border-violet-100 text-violet-600 text-[10px] font-semibold rounded-full">{label}</span>
  );
}

/* ── Toast ───────────────────────────────────────────── */
function Toast({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed top-5 right-5 z-[9999] bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl min-w-[260px]">
      <MdCheckCircle className="text-violet-500 text-xl flex-shrink-0" />
      <span className="text-sm font-medium text-gray-800 flex-1">{msg}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
    </div>
  );
}

/* ── Reply composer ──────────────────────────────────── */
function ReplyComposer({ onSubmit, loading }) {
  const [text, setText] = useState("");
  const ta = useRef(null);
  const handle = () => {
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  };
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">H</div>
      <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition">
        <textarea
          ref={ta}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handle(); }}
          placeholder="Write a reply… (Ctrl+Enter to send)"
          rows={3}
          className="w-full px-4 py-3 text-sm text-gray-800 resize-none outline-none placeholder-gray-400"
        />
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50">
          <span className="text-[11px] text-gray-400">Ctrl+Enter to send</span>
          <button
            onClick={handle}
            disabled={!text.trim() || loading}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition"
          >
            {loading ? <AiOutlineLoading3Quarters className="animate-spin text-xs" /> : <MdSend className="text-sm" />}
            {loading ? "Sending…" : "Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Single Reply ────────────────────────────────────── */
function ReplyItem({ reply, onLike }) {
  return (
    <div className="flex gap-3">
      <Avatar name={reply.author.name} avatar={reply.author.avatar} size="w-8 h-8" textSize="text-[10px]" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold text-gray-900">{reply.author.name}</span>
          {reply.author.role === "Instructor" && (
            <span className="px-1.5 py-0.5 bg-violet-100 text-violet-700 text-[9px] font-black rounded uppercase tracking-wide">Instructor</span>
          )}
          <span className="text-xs text-gray-400">{timeAgo(reply.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{reply.body}</p>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => onLike(reply.id)}
            className={`flex items-center gap-1 text-xs font-semibold transition ${reply.liked ? "text-violet-600" : "text-gray-400 hover:text-gray-600"}`}
          >
            {reply.liked ? <MdThumbUp className="text-sm" /> : <MdThumbUpOffAlt className="text-sm" />}
            {reply.likes}
          </button>
          <button className="text-xs text-gray-400 hover:text-gray-600 font-semibold transition flex items-center gap-1">
            <MdFlag className="text-sm" /> Report
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Discussion Card ─────────────────────────────────── */
function DiscussionCard({ disc, onLike, onBookmark, onPin, onLock, onDelete, onReply, onLikeReply, showToast }) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [replying, setReplying] = useState(false);
  const sm = STATUS_META[disc.pinned && !disc.locked ? "Pinned" : disc.locked ? "Locked" : disc.status] || STATUS_META.Open;
  const displayStatus = disc.locked ? "Locked" : disc.pinned ? "Pinned" : disc.status;

  const handleReply = (text) => {
    onReply(disc.id, text);
    setReplying(false);
    if (!expanded) setExpanded(true);
    showToast("Reply posted!");
  };

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all ${disc.pinned ? "border-amber-200" : "border-gray-200"} hover:shadow-md`}>
      {disc.pinned && !disc.locked && (
        <div className="flex items-center gap-1.5 px-5 py-2 bg-amber-50 border-b border-amber-100">
          <MdPushPin className="text-amber-500 text-sm" />
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Pinned by instructor</span>
        </div>
      )}

      <div className="px-5 py-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Avatar name={disc.author.name} avatar={disc.author.avatar} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-sm font-bold text-gray-900">{disc.author.name}</span>
                <span className="text-[10px] font-semibold text-gray-400">{timeAgo(disc.createdAt)}</span>
                <span className="text-[10px] text-gray-300">·</span>
                <span className="text-[10px] text-gray-400">{disc.course}</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 leading-snug">{disc.title}</h3>
            </div>
          </div>

          {/* Right badges + menu */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${sm.bg} ${sm.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sm.dot} inline-block`} />
              {displayStatus}
            </span>
            {disc.locked && <MdLock className="text-gray-400 text-sm" />}

            {/* Menu */}
            <div className="relative">
              <button onClick={() => setMenuOpen(o => !o)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition">
                <MdMoreVert />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-9 z-20 w-48 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                    <button onClick={() => { onPin(disc.id); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 text-left transition">
                      <MdPushPin className="text-amber-400 text-base" /> {disc.pinned ? "Unpin" : "Pin discussion"}
                    </button>
                    <button onClick={() => { onLock(disc.id); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 text-left transition">
                      {disc.locked ? <MdLockOpen className="text-teal-400 text-base" /> : <MdLock className="text-teal-400 text-base" />}
                      {disc.locked ? "Unlock discussion" : "Lock discussion"}
                    </button>
                    <button onClick={() => { onBookmark(disc.id); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 text-left transition">
                      {disc.bookmarked ? <MdBookmark className="text-violet-400 text-base" /> : <MdBookmarkBorder className="text-violet-400 text-base" />}
                      {disc.bookmarked ? "Remove bookmark" : "Bookmark"}
                    </button>
                    <div className="border-t border-gray-100" />
                    <button onClick={() => { onDelete(disc.id); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 text-left transition">
                      <MdDelete className="text-base" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-2">{disc.body}</p>

        {/* Tags */}
        {disc.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {disc.tags.map(t => <Tag key={t} label={t} />)}
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
          {/* Like */}
          <button
            onClick={() => onLike(disc.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold transition ${disc.liked ? "text-violet-600" : "text-gray-400 hover:text-gray-700"}`}
          >
            {disc.liked ? <MdThumbUp className="text-base" /> : <MdThumbUpOffAlt className="text-base" />}
            {disc.likes}
          </button>

          {/* Views */}
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <MdVisibility className="text-base" /> {disc.views}
          </span>

          {/* Replies expand */}
          <button
            onClick={() => setExpanded(e => !e)}
            className={`flex items-center gap-1.5 text-xs font-semibold transition ml-auto ${disc.replies.length > 0 ? "text-violet-600 hover:text-violet-700" : "text-gray-400 hover:text-gray-600"}`}
          >
            <MdForum className="text-base" />
            {disc.replies.length} {disc.replies.length === 1 ? "reply" : "replies"}
            {expanded ? <MdExpandLess className="text-sm" /> : <MdExpandMore className="text-sm" />}
          </button>

          {/* Bookmark */}
          <button onClick={() => onBookmark(disc.id)} className={`transition ${disc.bookmarked ? "text-violet-500" : "text-gray-400 hover:text-gray-600"}`}>
            {disc.bookmarked ? <MdBookmark className="text-base" /> : <MdBookmarkBorder className="text-base" />}
          </button>

          {/* Reply btn */}
          {!disc.locked && (
            <button
              onClick={() => setReplying(r => !r)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition"
            >
              <MdReply className="text-sm" /> Reply
            </button>
          )}
        </div>
      </div>

      {/* Replies section */}
      {(expanded || replying) && (
        <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 space-y-4">
          {expanded && disc.replies.map(r => (
            <ReplyItem key={r.id} reply={r} onLike={rid => onLikeReply(disc.id, rid)} />
          ))}
          {expanded && disc.replies.length === 0 && !replying && (
            <p className="text-sm text-gray-400 text-center py-4">No replies yet. Be the first to respond!</p>
          )}
          {replying && (
            <ReplyComposer onSubmit={handleReply} loading={false} />
          )}
        </div>
      )}
    </div>
  );
}

/* ── New Discussion Modal ────────────────────────────── */
function NewDiscModal({ onClose, onSave, courses }) {
  const [form, setForm] = useState({ title: "", body: "", course: courses[1] || "", tags: "" });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handle = async () => {
    if (!form.title.trim() || !form.body.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    onSave(form);
  };
  const inp = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-600 to-indigo-600">
          <div className="flex items-center gap-2.5">
            <MdForum className="text-white text-xl" />
            <h2 className="text-sm font-black text-white">Start a Discussion</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition">
            <MdClose className="text-base" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="What's your question or topic?" className={inp} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Description *</label>
            <textarea value={form.body} onChange={e => set("body", e.target.value)} placeholder="Provide more context…" rows={5} className={inp + " resize-none"} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Course</label>
            <select value={form.course} onChange={e => set("course", e.target.value)} className={inp + " bg-white"}>
              {courses.slice(1).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Tags (comma separated)</label>
            <input value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="e.g. JavaScript, React, Hooks" className={inp} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={handle} disabled={saving || !form.title.trim() || !form.body.trim()} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2">
            {saving && <AiOutlineLoading3Quarters className="animate-spin text-sm" />}
            {saving ? "Posting…" : "Post Discussion"}
          </button>
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 bg-white text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════ */
export default function Discussions() {
  const [discussions, setDiscussions] = useState(MOCK_DISCUSSIONS);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [courseF, setCourseF] = useState("All Courses");
  const [sortBy, setSortBy] = useState("newest");
  const [showModal, setModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  /* Stats */
  const totalOpen = discussions.filter(d => d.status === "Open" && !d.locked).length;
  const totalAnswered = discussions.filter(d => d.status === "Answered").length;
  const totalReplies = discussions.reduce((s, d) => s + d.replies.length, 0);
  const unanswered = discussions.filter(d => d.status === "Open" && !d.locked && d.replies.length === 0).length;

  /* Filter + sort */
  const filtered = useMemo(() => {
    let list = discussions.filter(d => {
      const q = search.toLowerCase();
      const matchQ = !q || d.title.toLowerCase().includes(q) || d.author.name.toLowerCase().includes(q) || d.body.toLowerCase().includes(q);
      const matchC = courseF === "All Courses" || d.course === courseF;
      const matchS = statusF === "All" || (statusF === "Pinned" ? d.pinned : statusF === "Locked" ? d.locked : d.status === statusF);
      return matchQ && matchC && matchS;
    });
    if (sortBy === "newest") list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "popular") list = [...list].sort((a, b) => b.likes - a.likes);
    if (sortBy === "replies") list = [...list].sort((a, b) => b.replies.length - a.replies.length);
    // pinned always first
    list = [...list.filter(d => d.pinned), ...list.filter(d => !d.pinned)];
    return list;
  }, [discussions, search, courseF, statusF, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* Actions */
  const handleLike = (id) => setDiscussions(prev => prev.map(d => d.id === id ? { ...d, liked: !d.liked, likes: d.liked ? d.likes - 1 : d.likes + 1 } : d));
  const handleBookmark = (id) => { setDiscussions(prev => prev.map(d => d.id === id ? { ...d, bookmarked: !d.bookmarked } : d)); showToast(discussions.find(d => d.id === id)?.bookmarked ? "Bookmark removed" : "Discussion bookmarked!"); };
  const handlePin = (id) => { setDiscussions(prev => prev.map(d => d.id === id ? { ...d, pinned: !d.pinned } : d)); showToast("Updated!"); };
  const handleLock = (id) => { setDiscussions(prev => prev.map(d => d.id === id ? { ...d, locked: !d.locked, status: d.locked ? "Open" : d.status } : d)); showToast("Updated!"); };
  const handleDelete = (id) => { setDiscussions(prev => prev.filter(d => d.id !== id)); showToast("Discussion deleted."); };
  const handleReply = (discId, text) => {
    const newReply = { id: Date.now(), author: { name: "Harika (You)", avatar: "H", role: "Instructor" }, body: text, createdAt: new Date().toISOString(), likes: 0, liked: false };
    setDiscussions(prev => prev.map(d => d.id === discId ? { ...d, replies: [...d.replies, newReply], status: "Answered" } : d));
  };
  const handleLikeReply = (discId, replyId) => {
    setDiscussions(prev => prev.map(d => d.id !== discId ? d : { ...d, replies: d.replies.map(r => r.id !== replyId ? r : { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }) }));
  };
  const handleNew = (form) => {
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const nd = { id: Date.now(), course: form.course, courseId: Date.now(), title: form.title, body: form.body, author: { name: "Harika (You)", avatar: "H", role: "Instructor" }, createdAt: new Date().toISOString(), likes: 0, liked: false, views: 1, pinned: false, locked: false, status: "Open", bookmarked: false, tags, replies: [] };
    setDiscussions(prev => [nd, ...prev]);
    setModal(false);
    setPage(1);
    showToast("Discussion posted!");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      <div className="px-6 py-6 max-w-[1200px] mx-auto space-y-5">
        <Toast msg={toast} onClose={() => setToast(null)} />
        {showModal && <NewDiscModal onClose={() => setModal(false)} onSave={handleNew} courses={COURSES} />}

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 text-gray-400">
          <div>
            <Link to="/instructor/dashboard" className="hover:text-violet-600 transition text-sm">Dashboard</Link>
            <span className="mx-2 text-sm">&gt;</span>
            <span className="text-gray-600 font-medium text-sm">Discussions</span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-3">Discussions</h1>
            <p className="text-sm text-slate-500 mt-0.5">Engage with students and answer their questions</p>
          </div>
           <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition shadow-sm"
        >
          <MdAdd className="text-lg" /> Start Discussion
        </button>
        </div>


        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Discussions", value: discussions.length, sub: "Across all courses", color: "bg-violet-500", Icon: MdForum },
            { label: "Open", value: totalOpen, sub: `${unanswered} need reply`, color: "bg-blue-500", Icon: MdForum },
            { label: "Answered", value: totalAnswered, sub: "Resolved discussions", color: "bg-emerald-500", Icon: MdCheck },
            { label: "Total Replies", value: totalReplies, sub: "From instructors & students", color: "bg-indigo-500", Icon: MdReply },
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
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search discussions…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
            />
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {STATUSES.map(s => (
              <button key={s} onClick={() => { setStatusF(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${statusF === s ? "bg-white text-violet-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {s}
              </button>
            ))}
          </div>

          {/* Course */}
          <div className="relative">
            <select value={courseF} onChange={e => { setCourseF(e.target.value); setPage(1); }}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-violet-400 transition bg-white">
              {COURSES.map(c => <option key={c}>{c}</option>)}
            </select>
            <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-violet-400 transition bg-white">
              <option value="newest">Newest first</option>
              <option value="popular">Most liked</option>
              <option value="replies">Most replies</option>
            </select>
            <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
          </div>
        </div>

        {/* ── List ── */}
        {paged.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MdForum className="text-4xl text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-600 mb-1">No discussions found</p>
            <p className="text-xs text-gray-400 mb-5">Try different filters or start a new discussion</p>
            <button onClick={() => setModal(true)} className="flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition">
              <MdAdd /> Start Discussion
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {paged.map(disc => (
              <DiscussionCard
                key={disc.id}
                disc={disc}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onPin={handlePin}
                onLock={handleLock}
                onDelete={handleDelete}
                onReply={handleReply}
                onLikeReply={handleLikeReply}
                showToast={showToast}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {filtered.length > PER_PAGE && (
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-3.5">
            <p className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-700">{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-gray-700">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition">
                <MdChevronLeft className="text-lg" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-bold transition ${page === p ? "bg-violet-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-100"}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition">
                <MdChevronRight className="text-lg" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
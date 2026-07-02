import { useState, useMemo } from "react";

const ASSIGNMENTS = [
  { id: "ASN-001", title: "React Component Library", subject: "Frontend Dev", assignee: "Priya Sharma", assigneeAvatar: "PS", due: "2026-06-28", status: "overdue", priority: "high", submissions: 18, total: 24 },
  { id: "ASN-002", title: "Database Schema Design", subject: "Backend Dev", assignee: "Arjun Mehta", assigneeAvatar: "AM", due: "2026-07-02", status: "active", priority: "high", submissions: 9, total: 15 },
  { id: "ASN-003", title: "UI/UX Case Study", subject: "Design", assignee: "Sneha Kapoor", assigneeAvatar: "SK", due: "2026-07-05", status: "active", priority: "medium", submissions: 22, total: 30 },
  { id: "ASN-004", title: "REST API Integration", subject: "Backend Dev", assignee: "Rahul Verma", assigneeAvatar: "RV", due: "2026-07-08", status: "draft", priority: "low", submissions: 0, total: 20 },
  { id: "ASN-005", title: "Machine Learning Model", subject: "Data Science", assignee: "Kavya Nair", assigneeAvatar: "KN", due: "2026-06-30", status: "overdue", priority: "high", submissions: 5, total: 12 },
  { id: "ASN-006", title: "Mobile App Prototype", subject: "Design", assignee: "Vikram Singh", assigneeAvatar: "VS", due: "2026-07-10", status: "active", priority: "medium", submissions: 14, total: 18 },
  { id: "ASN-007", title: "Security Audit Report", subject: "DevOps", assignee: "Ananya Iyer", assigneeAvatar: "AI", due: "2026-07-15", status: "draft", priority: "high", submissions: 0, total: 8 },
  { id: "ASN-008", title: "Cloud Architecture Plan", subject: "DevOps", assignee: "Rohan Das", assigneeAvatar: "RD", due: "2026-07-12", status: "active", priority: "medium", submissions: 3, total: 10 },
];

const STATUS_CONFIG = {
  active:  { label: "Active",  text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
  overdue: { label: "Overdue", text: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",     dot: "bg-red-500" },
  draft:   { label: "Draft",   text: "text-slate-600",   bg: "bg-slate-100",  border: "border-slate-200",   dot: "bg-slate-400" },
  pending: { label: "Pending", text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   dot: "bg-amber-500" },
};

const PRIORITY_CONFIG = {
  high:   { label: "High",   text: "text-red-600",     bg: "bg-red-50",    border: "border-red-200" },
  medium: { label: "Medium", text: "text-amber-600",   bg: "bg-amber-50",  border: "border-amber-200" },
  low:    { label: "Low",    text: "text-emerald-600", bg: "bg-emerald-50",border: "border-emerald-200" },
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function Avatar({ initials, size = "w-8 h-8" }) {
  const idx = (initials.charCodeAt(0) + initials.charCodeAt(1)) % AVATAR_COLORS.length;
  return (
    <div className={`${size} ${AVATAR_COLORS[idx]} rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function ProgressBar({ value, total, status }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const barColor = status === "overdue" ? "bg-red-400" : status === "active" ? "bg-teal-500" : "bg-slate-300";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-400 font-mono min-w-[32px]">{value}/{total}</span>
    </div>
  );
}

function StatCard({ label, value, sub, colorClass, borderClass }) {
  return (
    <div className={`bg-white rounded-xl border ${borderClass} p-5 flex-1 min-w-[130px] shadow-sm`}>
      <div className={`text-3xl font-bold ${colorClass} leading-none`}>{value}</div>
      <div className="text-sm text-slate-500 mt-1.5 font-medium">{label}</div>
      {sub && <div className={`text-xs ${colorClass} mt-1.5 font-mono opacity-80`}>{sub}</div>}
    </div>
  );
}

const STAT_CARDS = [
  { key: "total",   label: "Total",   sub: "all assignments", colorClass: "text-blue-600",    borderClass: "border-blue-200 border-t-2 border-t-blue-500" },
  { key: "active",  label: "Active",  sub: "in progress",     colorClass: "text-emerald-600", borderClass: "border-emerald-200 border-t-2 border-t-emerald-500" },
  { key: "overdue", label: "Overdue", sub: "needs attention",  colorClass: "text-red-600",     borderClass: "border-red-200 border-t-2 border-t-red-500" },
  { key: "draft",   label: "Draft",   sub: "not published",   colorClass: "text-slate-500",   borderClass: "border-slate-200 border-t-2 border-t-slate-400" },
];

export default function AllAssignments() {
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortKey, setSortKey] = useState("due");
  const [sortDir, setSortDir] = useState("asc");
  const [showModal, setShowModal] = useState(false);

  const stats = useMemo(() => ({
    total:   ASSIGNMENTS.length,
    active:  ASSIGNMENTS.filter(a => a.status === "active").length,
    overdue: ASSIGNMENTS.filter(a => a.status === "overdue").length,
    draft:   ASSIGNMENTS.filter(a => a.status === "draft").length,
  }), []);

  const filtered = useMemo(() => {
    let list = ASSIGNMENTS.filter(a => {
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.assignee.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus   = filterStatus === "all"   || a.status === filterStatus;
      const matchPriority = filterPriority === "all" || a.priority === filterPriority;
      return matchSearch && matchStatus && matchPriority;
    });
    return [...list].sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === "submissions") { va = a.submissions / a.total; vb = b.submissions / b.total; }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [search, filterStatus, filterPriority, sortKey, sortDir]);

  const toggleSelect = (id) =>
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const toggleAll = () =>
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(a => a.id)));

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }) => (
    <span className={`ml-1 text-[10px] ${sortKey === col ? "opacity-100" : "opacity-30"}`}>
      {sortKey === col ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  const STATUS_FILTERS = ["all", "active", "overdue", "draft"];
  const PRIORITY_FILTERS = ["all", "high", "medium", "low"];

  const TABLE_COLS = [
    { label: "Assignment", key: "title" },
    { label: "Assignee",   key: "assignee" },
    { label: "Subject",    key: "subject" },
    { label: "Due Date",   key: "due" },
    { label: "Status",     key: "status" },
    { label: "Priority",   key: "priority" },
    { label: "Progress",   key: "submissions" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-7 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .fade-in { animation: fadeIn 0.18s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-dot { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
        .pulse-dot { animation: pulse-dot 2s infinite; }
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Assignments</h1>
            <span className="bg-teal-50 text-teal-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-teal-100 font-mono">
              {ASSIGNMENTS.length}
            </span>
          </div>
          <p className="text-sm text-slate-400 ml-4">Manage and track all student assignments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors duration-150"
        >
          <span className="text-base leading-none">+</span> New Assignment
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {STAT_CARDS.map(({ key, label, sub, colorClass, borderClass }) => (
          <StatCard key={key} label={label} value={stats[key]} sub={sub} colorClass={colorClass} borderClass={borderClass} />
        ))}
      </div>

      {/* ── Main Table Card ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Filters */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">⌕</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, assignee, ID..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            />
          </div>

          {/* Status pills */}
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 capitalize
                  ${filterStatus === s
                    ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-500"}`}
              >{s === "all" ? "All Status" : s}</button>
            ))}
          </div>

          {/* Priority pills */}
          <div className="flex gap-1.5 flex-wrap">
            {PRIORITY_FILTERS.map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 capitalize
                  ${filterPriority === p
                    ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-500"}`}
              >{p === "all" ? "All Priority" : p}</button>
            ))}
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="fade-in px-5 py-2.5 bg-teal-50 border-b border-teal-100 flex items-center gap-3">
            <span className="text-sm text-teal-500 font-semibold">{selected.size} selected</span>
            <div className="w-px h-4 bg-teal-200" />
            {[
              { label: "Publish", cls: "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100" },
              { label: "Archive", cls: "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100" },
              { label: "Delete",  cls: "text-red-700 bg-red-50 border-red-200 hover:bg-red-100" },
            ].map(({ label, cls }) => (
              <button key={label} className={`${cls} border text-xs font-semibold px-3 py-1 rounded-md transition-colors`}>{label}</button>
            ))}
            <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-slate-400 hover:text-slate-600 transition-colors">Clear</button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="accent-teal-500 cursor-pointer rounded"
                  />
                </th>
                {TABLE_COLS.map(({ label, key }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-teal-500 select-none transition-colors whitespace-nowrap"
                  >
                    {label}<SortIcon col={key} />
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-14 text-center text-sm text-slate-400">
                    No assignments match your filters.
                  </td>
                </tr>
              ) : filtered.map(a => {
                const sc = STATUS_CONFIG[a.status];
                const pc = PRIORITY_CONFIG[a.priority];
                const isSel = selected.has(a.id);
                return (
                  <tr
                    key={a.id}
                    className={`transition-colors duration-100 hover:bg-slate-50 ${isSel ? "bg-teal-50/60 border-l-2 border-l-teal-500" : ""}`}
                  >
                    <td className="px-4 py-3.5">
                      <input type="checkbox" checked={isSel} onChange={() => toggleSelect(a.id)} className="accent-teal-500 cursor-pointer" />
                    </td>

                    {/* Assignment */}
                    <td className="px-4 py-3.5">
                      <div className="text-sm font-semibold text-slate-800 leading-snug">{a.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{a.id}</div>
                    </td>

                    {/* Assignee */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Avatar initials={a.assigneeAvatar} />
                        <span className="text-sm text-slate-600 whitespace-nowrap">{a.assignee}</span>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="px-4 py-3.5">
                      <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs px-2 py-1 rounded-md whitespace-nowrap font-medium">
                        {a.subject}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-mono font-medium ${a.status === "overdue" ? "text-red-600" : "text-slate-500"}`}>
                        {new Date(a.due).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 ${sc.text} ${sc.bg} border ${sc.border} text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${a.status === "active" ? "pulse-dot" : ""}`} />
                        {sc.label}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3.5">
                      <span className={`${pc.text} ${pc.bg} border ${pc.border} text-[11px] font-semibold px-2.5 py-1 rounded-md`}>
                        {pc.label}
                      </span>
                    </td>

                    {/* Progress */}
                    <td className="px-4 py-3.5 min-w-[120px]">
                      <ProgressBar value={a.submissions} total={a.total} status={a.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5">
                        <button className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600 hover:border-slate-300 transition-colors text-sm">✎</button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600 hover:border-slate-300 transition-colors text-sm">⋯</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Showing <span className="text-slate-600 font-medium">{filtered.length}</span> of <span className="text-slate-600 font-medium">{ASSIGNMENTS.length}</span> assignments
          </span>
          <div className="flex gap-1">
            {["←", "1", "2", "→"].map((p, i) => (
              <button
                key={i}
                className={`min-w-[28px] h-7 px-1.5 text-xs rounded-md border transition-colors
                  ${p === "1"
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-600"}`}
              >{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Create Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 p-7 w-full max-w-md border-t-4 border-t-teal-500 fade-in"
          >
            <h2 className="text-base font-bold text-slate-800 mb-5">New Assignment</h2>
            {[
              { label: "Title",    placeholder: "e.g. React Hooks Deep Dive",    type: "text" },
              { label: "Subject",  placeholder: "e.g. Frontend Development",      type: "text" },
              { label: "Assignee", placeholder: "e.g. Priya Sharma",              type: "text" },
              { label: "Due Date", placeholder: "",                               type: "date" },
            ].map(({ label, placeholder, type }) => (
              <div key={label} className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition placeholder-slate-400"
                />
              </div>
            ))}
            <div className="flex gap-2.5 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm py-2.5 rounded-lg font-medium transition-colors"
              >Cancel</button>
              <button className="flex-[2] bg-teal-500 hover:bg-teal-600 text-white text-sm py-2.5 rounded-lg font-semibold transition-colors shadow-sm">
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
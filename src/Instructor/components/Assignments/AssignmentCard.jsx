import React, { useState } from "react";
import { MdOutlineAssignment, MdFilterList, MdEdit, MdVisibility, MdPublish, MdArchive, MdDelete } from "react-icons/md";
import { STATUS_STYLE, fmt, fmtType } from "./utils";

export default function AssignmentCard({ a, onEdit, onDelete, onPublish, onArchive, onViewSubmissions }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = a.assignmentStatus || "DRAFT";
  
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <MdOutlineAssignment className="text-[#043573] text-xl" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-900 transition">{a.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{a.lessonName || a.lessonSlug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[status] || STATUS_STYLE.DRAFT}`}>{status}</span>
          <div className="relative">
            <button onClick={() => setMenuOpen(p => !p)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
              <MdFilterList size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 bg-white border border-slate-100 rounded-xl shadow-xl min-w-[170px] py-1 text-sm">
                <button onClick={() => { onEdit(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-50 text-slate-700 hover:text-blue-900 transition"><MdEdit size={15} /> Edit</button>
                <button onClick={() => { onViewSubmissions(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-50 text-slate-700 hover:text-blue-900 transition"><MdVisibility size={15} /> Submissions</button>
                {(status === "DRAFT" || status === "ARCHIVED") && <button onClick={() => { onPublish(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-emerald-50 text-emerald-700 transition"><MdPublish size={15} /> Publish</button>}
                {status === "PUBLISHED" && <button onClick={() => { onArchive(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-50 text-slate-600 transition"><MdArchive size={15} /> Archive</button>}
                <button onClick={() => { onDelete(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50 text-red-600 transition"><MdDelete size={15} /> Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-50 rounded-lg py-2"><p className="text-xs text-slate-400">Type</p><p className="text-xs font-semibold text-slate-700 truncate px-1">{fmtType(a.assignmentType)}</p></div>
        <div className="bg-slate-50 rounded-lg py-2"><p className="text-xs text-slate-400">Max Marks</p><p className="text-sm font-bold text-slate-900">{a.maxMarks ?? "—"}</p></div>
        <div className="bg-slate-50 rounded-lg py-2"><p className="text-xs text-slate-400">Due</p><p className="text-xs font-semibold text-slate-700">{fmt(a.dueDate)}</p></div>
      </div>

      <div className="mt-3 flex gap-2 flex-wrap">
        {a.allowLateSubmission && <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">Late OK</span>}
        {a.allowResubmission && <span className="text-xs px-2 py-0.5 bg-blue-50 text-[#043573] rounded-full border border-blue-100">Resubmit OK</span>}
        {!a.active && <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200">Inactive</span>}
      </div>
      <p className="mt-3 text-xs text-slate-400 truncate">{[a.courseName, a.moduleName].filter(Boolean).join(" › ")}</p>
    </div>
  );
}

import React, { useState } from "react";
import { MdOutlineAssignment, MdFilterList, MdEdit, MdVisibility, MdPublish, MdArchive, MdDelete } from "react-icons/md";
import { STATUS_STYLE, fmt, fmtType } from "./utils";

export default function AssignmentCard({ a, onEdit, onDelete, onPublish, onArchive, onViewSubmissions }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = a.assignmentStatus || "DRAFT";
  
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
            <MdOutlineAssignment className="text-violet-600 text-xl" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-violet-700 transition">{a.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{a.lessonName || a.lessonSlug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[status] || STATUS_STYLE.DRAFT}`}>{status}</span>
          <div className="relative">
            <button onClick={() => setMenuOpen(p => !p)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
              <MdFilterList size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 bg-white border border-gray-100 rounded-xl shadow-xl min-w-[170px] py-1 text-sm">
                <button onClick={() => { onEdit(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-violet-50 text-gray-700 hover:text-violet-700 transition"><MdEdit size={15} /> Edit</button>
                <button onClick={() => { onViewSubmissions(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-violet-50 text-gray-700 hover:text-violet-700 transition"><MdVisibility size={15} /> Submissions</button>
                {(status === "DRAFT" || status === "ARCHIVED") && <button onClick={() => { onPublish(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-emerald-50 text-emerald-700 transition"><MdPublish size={15} /> Publish</button>}
                {status === "PUBLISHED" && <button onClick={() => { onArchive(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-50 text-slate-600 transition"><MdArchive size={15} /> Archive</button>}
                <button onClick={() => { onDelete(a); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50 text-red-600 transition"><MdDelete size={15} /> Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 rounded-lg py-2"><p className="text-xs text-gray-400">Type</p><p className="text-xs font-semibold text-gray-700 truncate px-1">{fmtType(a.assignmentType)}</p></div>
        <div className="bg-gray-50 rounded-lg py-2"><p className="text-xs text-gray-400">Max Marks</p><p className="text-sm font-bold text-gray-900">{a.maxMarks ?? "—"}</p></div>
        <div className="bg-gray-50 rounded-lg py-2"><p className="text-xs text-gray-400">Due</p><p className="text-xs font-semibold text-gray-700">{fmt(a.dueDate)}</p></div>
      </div>

      <div className="mt-3 flex gap-2 flex-wrap">
        {a.allowLateSubmission && <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">Late OK</span>}
        {a.allowResubmission && <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full border border-purple-100">Resubmit OK</span>}
        {!a.active && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full border border-gray-200">Inactive</span>}
      </div>
      <p className="mt-3 text-xs text-gray-400 truncate">{[a.courseName, a.moduleName].filter(Boolean).join(" › ")}</p>
    </div>
  );
}

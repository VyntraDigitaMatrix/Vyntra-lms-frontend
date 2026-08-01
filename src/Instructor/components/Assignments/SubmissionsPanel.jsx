import React, { useState, useEffect } from "react";
import { MdArrowBack, MdOutlineAssignment, MdGrade, MdClose, MdVisibility } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { instructorAssignmentApi } from "../../auth/api";
import { extractList, fmt } from "./utils";

export default function SubmissionsPanel({ assignment, onClose }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(null);
  const [gradeVal, setGradeVal] = useState("");

  useEffect(() => {
    if (!assignment?.slug) return;
    instructorAssignmentApi.getSubmissions(assignment.slug)
      .then(res => setSubmissions(extractList(res))).catch(console.error)
      .finally(() => setLoading(false));
  }, [assignment]);

  const handleGrade = async (subId) => {
    if (!gradeVal) return;
    try {
      await instructorAssignmentApi.grade(subId, { obtainedMarks: Number(gradeVal) });
      setGrading(null); setGradeVal("");
      const res = await instructorAssignmentApi.getSubmissions(assignment.slug);
      setSubmissions(extractList(res));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-100 bg-white">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition"><MdArrowBack size={20} /></button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Submissions</h2>
            <p className="text-sm text-slate-500">{assignment.title}</p>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-slate-50/50">
          {loading ? (
            <div className="flex justify-center py-12"><AiOutlineLoading3Quarters className="animate-spin text-[#043573] text-2xl" /></div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <MdOutlineAssignment className="text-slate-300 text-5xl mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map(sub => {
                const subId = sub.submissionId || sub.id;
                const hasMarks = sub.obtainedMarks != null || sub.score != null || sub.marks != null;
                const marksVal = sub.obtainedMarks ?? sub.score ?? sub.marks;
                return (
                  <div key={subId} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{sub.studentName || sub.studentId || "Student"}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Submitted: {fmt(sub.submittedAt || sub.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {hasMarks ? (
                          <span className="text-sm font-bold text-emerald-600">{marksVal}/{assignment.maxMarks}</span>
                        ) : grading === subId ? (
                          <div className="flex items-center gap-2">
                            <input type="number" min="0" max={assignment.maxMarks} value={gradeVal} onChange={e => setGradeVal(e.target.value)}
                              className="w-20 px-2 py-1 border border-slate-200 rounded-lg text-sm" placeholder="Marks" />
                            <button onClick={() => handleGrade(subId)} className="px-3 py-1 bg-[#043573] text-white text-xs rounded-lg hover:bg-blue-900">Save</button>
                            <button onClick={() => setGrading(null)} className="text-slate-400 hover:text-slate-600"><MdClose /></button>
                          </div>
                        ) : (
                          <button onClick={() => { setGrading(subId); setGradeVal(""); }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-900 text-xs font-semibold rounded-lg hover:bg-blue-100 transition">
                            <MdGrade size={14} /> Grade
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Submission Content Viewer */}
                    <div className="mt-4 bg-white rounded-lg p-3 border border-slate-200">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Submission Details</h4>
                      <div className="text-sm text-slate-800 whitespace-pre-wrap">
                        {sub.submissionText || sub.content || sub.answer || <span className="text-slate-400 italic">No text provided.</span>}
                      </div>

                      {(sub.fileUrl || sub.file || sub.attachmentUrl || sub.attachment) && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500">Attachment:</span>
                          <a href={sub.fileUrl || sub.file || sub.attachmentUrl || sub.attachment} target="_blank" rel="noreferrer"
                            className="text-sm text-[#043573] hover:text-blue-900 font-semibold flex items-center gap-1 hover:underline">
                            <MdVisibility size={14} /> View Attached File
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

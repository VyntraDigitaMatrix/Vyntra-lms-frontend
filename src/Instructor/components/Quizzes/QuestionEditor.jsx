import React from "react";
import { MdHelpOutline, MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const QuestionEditor = ({ question, onChange, onCancel, onSave, saving, label, saveLabel }) => {
    const inp = "w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition bg-white placeholder-slate-400";
    const up = (k, v) => onChange({ ...question, [k]: v });

    return (
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/60 to-white p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center">
                        <MdHelpOutline className="text-[#043573] text-xs" />
                    </div>
                    <p className="text-xs font-black text-blue-900 uppercase tracking-wide">{label ?? "New Question"}</p>
                </div>
                {onCancel && (
                    <button onClick={onCancel} className="w-6 h-6 rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 flex items-center justify-center transition">
                        <MdClose className="text-xs" />
                    </button>
                )}
            </div>

            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Question *</label>
                <textarea className={inp + " resize-none"} rows={2} placeholder="Type your question here…"
                    value={question.question} onChange={e => up("question", e.target.value)} />
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Explanation (optional)</label>
                    <input className={inp} placeholder="Why is this the correct answer?"
                        value={question.explanation} onChange={e => up("explanation", e.target.value)} />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Marks</label>
                    <input type="number" min={1} className={inp} placeholder="1"
                        value={question.marks} onChange={e => up("marks", Number(e.target.value))} />
                </div>
            </div>

            {onSave && (
                <button onClick={onSave} disabled={saving || !question.question.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition">
                    {saving ? <AiOutlineLoading3Quarters className="animate-spin text-xs" /> : <FaCheck className="text-[9px]" />}
                    {saving ? "Saving…" : (saveLabel ?? "Save Question")}
                </button>
            )}
        </div>
    );
};

export default QuestionEditor;

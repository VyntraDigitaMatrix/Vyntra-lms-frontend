import React, { useState, useEffect } from "react";
import { MdClose, MdEdit } from "react-icons/md";
import { FaCheck, FaTrash } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const OptionRow = ({ option, isCorrect, onSave, onDelete }) => {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(option.optionText ?? option.text ?? "");
    const [correct, setCorrect] = useState(isCorrect);
    const [sortOrder, setSortOrder] = useState(option.sortOrder ?? 1);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        setText(option.optionText ?? option.text ?? "");
        setCorrect(isCorrect);
        setSortOrder(option.sortOrder ?? 1);
    }, [option, isCorrect]);

    const handleSave = async () => {
        if (!text.trim()) return;
        setSaving(true);
        try {
            await onSave(text.trim(), correct, Number(sortOrder) || 1);
            setEditing(false);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this option?")) return;
        setDeleting(true);
        try {
            await onDelete();
        } finally {
            setDeleting(false);
        }
    };

    if (editing) {
        return (
            <div className="flex items-center gap-2 p-2 bg-white border border-violet-200 rounded-xl">
                <input
                    autoFocus
                    className="flex-1 text-xs text-slate-700 bg-transparent border-0 focus:outline-none focus:ring-0"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSave()}
                />
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Order</span>
                    <input
                        type="number"
                        className="w-12 text-xs text-center border border-slate-200 rounded p-1"
                        value={sortOrder}
                        onChange={e => setSortOrder(e.target.value)}
                        min="1"
                    />
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer flex-shrink-0 ml-2">
                    <input type="checkbox" checked={correct} onChange={e => setCorrect(e.target.checked)}
                        className="w-3.5 h-3.5 accent-emerald-500 rounded-sm cursor-pointer" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Correct</span>
                </label>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button disabled={saving || !text.trim()} onClick={handleSave}
                    className="px-3 py-1.5 text-[10px] font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg disabled:opacity-50 transition">
                    {saving ? "Saving…" : "Save"}
                </button>
                <button disabled={saving} onClick={() => setEditing(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                    <MdClose className="text-sm" />
                </button>
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border transition ${isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex items-center gap-2 min-w-0">
                <span className="flex-shrink-0 text-[10px] font-bold text-slate-400 w-4 text-center">
                    {option.sortOrder ?? 1}
                </span>
                <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5 min-w-0">
                    {isCorrect && <FaCheck className="text-emerald-500 text-[9px] flex-shrink-0" />}
                    <span className="truncate">{option.optionText ?? option.text}</span>
                </span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setEditing(true)}
                    className="w-6 h-6 rounded-lg bg-violet-50 text-violet-500 hover:bg-violet-100 flex items-center justify-center transition">
                    <MdEdit className="text-xs" />
                </button>
                <button onClick={handleDelete} disabled={deleting}
                    className="w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition disabled:opacity-50">
                    {deleting ? <AiOutlineLoading3Quarters className="animate-spin text-[9px]" /> : <FaTrash className="text-[9px]" />}
                </button>
            </div>
        </div>
    );
};

export default OptionRow;

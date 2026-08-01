import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { instructorQuizOptionApi } from "../../auth/api";

const InlineOptionEditor = ({ questionId, existingOptions, sortOrder: initialSortOrder, onSaveSuccess, onCancel }) => {
    const [optText, setOptText] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [sortOrder, setSortOrder] = useState(initialSortOrder || 1);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!optText.trim()) return;

        const targetSortOrder = Number(sortOrder) || 1;
        if (existingOptions?.some(o => o.sortOrder === targetSortOrder)) {
            alert(`Sort order ${targetSortOrder} already exists for another option!`);
            return;
        }

        setSaving(true);
        try {
            await instructorQuizOptionApi.bulkCreateOptions(questionId, [{
                optionText: optText.trim(),
                correct: isCorrect,
                sortOrder: targetSortOrder,
            }]);
            onSaveSuccess();
        } catch (err) {
            console.error("Save option failed", err);
            alert("Failed to save option.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex items-center gap-2 p-2 bg-blue-50/50 border border-blue-200 border-dashed rounded-xl mt-2">
            <input
                autoFocus
                placeholder="Option text..."
                className="flex-1 text-xs text-slate-700 bg-transparent border-0 focus:outline-none focus:ring-0"
                value={optText}
                onChange={e => setOptText(e.target.value)}
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
                <input type="checkbox" checked={isCorrect} onChange={e => setIsCorrect(e.target.checked)}
                    className="w-3.5 h-3.5 accent-emerald-500 rounded-sm" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Correct</span>
            </label>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button disabled={saving || !optText.trim()} onClick={handleSave}
                className="px-3 py-1.5 text-[10px] font-bold text-white bg-[#043573] hover:bg-blue-900 rounded-lg disabled:opacity-50 transition">
                {saving ? "Saving..." : "Save"}
            </button>
            <button disabled={saving} onClick={onCancel}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                <MdClose className="text-sm" />
            </button>
        </div>
    );
};

export default InlineOptionEditor;

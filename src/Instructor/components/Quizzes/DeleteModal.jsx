import React from "react";
import { FaTrash } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const DeleteModal = ({ quiz, deleting, onClose, onConfirm }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-red-500 text-lg" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">Delete Quiz</h3>
            <p className="text-xs text-slate-500 mb-1">This will permanently delete</p>
            <p className="text-sm font-bold text-slate-800 mb-4">"{quiz?.title}"</p>
            <p className="text-[11px] text-slate-400 mb-5">All student attempts and scores will be removed. This cannot be undone.</p>
            <div className="flex gap-2">
                <button onClick={onClose} disabled={deleting}
                    className="flex-1 py-2.5 text-xs font-bold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition disabled:opacity-50">Cancel</button>
                <button onClick={onConfirm} disabled={deleting}
                    className="flex-1 py-2.5 text-xs font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-1.5">
                    {deleting && <AiOutlineLoading3Quarters className="animate-spin text-xs" />}
                    {deleting ? "Deleting…" : "Yes, Delete"}
                </button>
            </div>
        </div>
    </div>
);

export default DeleteModal;

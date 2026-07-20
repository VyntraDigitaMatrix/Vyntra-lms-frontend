import React from "react";
import { MdClose } from 'react-icons/md';

function RightPanel({ title, subtitle, onClose, children, onSave, saveLabel = "SAVE", saveDisabled }) {
    return (
        <div className="w-[420px] flex-shrink-0 border-l border-gray-200 bg-white flex flex-col h-full overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition flex-shrink-0"
                    >
                        <MdClose className="text-lg" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
                {children}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <button
                    onClick={onSave}
                    disabled={saveDisabled}
                    className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition"
                >
                    {saveLabel}
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 py-2.5 border border-gray-200 bg-white text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                    CANCEL
                </button>
            </div>
        </div>
    );
}

export default RightPanel;

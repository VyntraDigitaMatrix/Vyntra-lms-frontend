import React from "react";
import { FaTimes, FaExclamationCircle } from "react-icons/fa";

export default function DeleteCourseModal({ course, onClose }) {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-in">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FaExclamationCircle className="text-amber-500" />
            Delete Course
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FaTimes />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700 font-medium text-center">
            Course deletion is disabled. Please contact an administrator.
          </p>
        </div>
        <div className="p-5 border-t border-gray-100 flex justify-center bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

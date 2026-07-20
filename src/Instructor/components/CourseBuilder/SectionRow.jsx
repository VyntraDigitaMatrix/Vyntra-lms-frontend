import React, { useState } from 'react';
import {
    MdSettings, MdExpandMore, MdExpandLess,
    MdDeleteOutline, MdDragIndicator, MdOpenInFull, MdAdd
} from 'react-icons/md';
import { LESSON_TYPES } from "./utils";

function SectionRow({ section, sectionIdx, onDelete, onAddLesson, onDeleteLesson, onOpenLesson, onEditSection }) {
    const [expanded, setExpanded] = useState(true);
    const quizCount = section.lessons?.filter(l => l.lessonType === "QUIZ").length || 0;

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div
                className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 cursor-pointer hover:bg-gray-100/70 transition select-none"
                onClick={() => setExpanded(e => !e)}
            >
                <MdDragIndicator className="text-gray-300 text-lg flex-shrink-0" />
                {expanded
                    ? <MdExpandLess className="text-gray-400 text-xl flex-shrink-0" />
                    : <MdExpandMore className="text-gray-400 text-xl flex-shrink-0" />
                }
                <span className="w-7 h-7 rounded-md bg-violet-100 text-violet-700 text-xs font-black flex items-center justify-center flex-shrink-0">
                    {sectionIdx + 1}
                </span>
                <span className="flex-1 text-sm font-bold text-gray-800 truncate">{section.title}</span>
                <span className="text-xs text-gray-400 mr-1 hidden sm:inline">
                    {section.lessons?.length || 0} Lessons • {quizCount} Quizzes
                </span>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => onEditSection(sectionIdx)}
                        className="w-7 h-7 rounded-md hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-violet-600 transition"
                    >
                        <MdSettings className="text-sm" />
                    </button>
                    <button
                        onClick={() => onDelete(sectionIdx)}
                        className="w-7 h-7 rounded-md hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition"
                    >
                        <MdDeleteOutline className="text-sm" />
                    </button>
                </div>
            </div>

            {expanded && (
                <div>
                    {(!section.lessons || section.lessons.length === 0) && (
                        <div className="px-5 py-7 text-center text-sm text-gray-400">
                            No lessons yet — add your first one below.
                        </div>
                    )}
                    {section.lessons?.map((lesson, li) => {
                        const typeInfo = LESSON_TYPES.find(t => t.id === lesson.lessonType) || LESSON_TYPES[0];
                        return (
                            <div
                                key={li}
                                className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 hover:bg-gray-50/60 cursor-pointer group transition"
                                onClick={() => onOpenLesson(sectionIdx, li)}
                            >
                                <MdDragIndicator className="text-gray-200 group-hover:text-gray-300 text-lg flex-shrink-0" />
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: typeInfo.bg }}>
                                    <typeInfo.Icon className="text-sm" style={{ color: typeInfo.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{lesson.title}</p>
                                    <p className="text-xs text-gray-400">{typeInfo.label}</p>
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full hidden sm:inline" style={{ background: typeInfo.bg, color: typeInfo.color }}>
                                    {typeInfo.label}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteLesson(sectionIdx, li);
                                    }}
                                    className="w-7 h-7 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-red-500 transition"
                                >
                                    <MdDeleteOutline className="text-sm" />
                                </button>
                                <MdOpenInFull className="text-gray-300 group-hover:text-gray-400 text-sm transition" />
                            </div>
                        );
                    })}

                    <div className="px-4 py-3 border-t border-gray-100">
                        <button
                            onClick={() => onAddLesson(sectionIdx)}
                            className="w-full py-2.5 border-2 border-dashed border-gray-200 hover:border-violet-300 rounded-xl text-sm font-semibold text-gray-400 hover:text-violet-600 hover:bg-violet-50/30 transition flex items-center justify-center gap-2"
                        >
                            <MdAdd className="text-base" /> Add Lesson
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SectionRow;

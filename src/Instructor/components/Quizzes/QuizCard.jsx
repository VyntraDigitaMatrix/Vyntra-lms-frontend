import React, { useState } from "react";
import { MdOutlineQuiz, MdMoreVert, MdTimer, MdPeople, MdBarChart, MdListAlt, MdCheckCircle } from "react-icons/md";
import { FaTrophy, FaEdit, FaLock, FaTrash } from "react-icons/fa";

const QuizCard = ({ quiz, onEditDetails, onManageQuestions, onDelete, onViewResults, onPublish, onArchive }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const s = quiz.status === "archived"
        ? { label: "Archived", color: "text-slate-600 bg-slate-100 border-slate-300" }
        : (quiz.status === "active" || quiz.published)
            ? { label: "Published", color: "text-emerald-700 bg-emerald-50 border-emerald-200" }
            : { label: "Draft", color: "text-amber-700 bg-amber-50 border-amber-200" };
    const typeColor = {
        LESSON: "bg-blue-50 text-blue-900 border-blue-200",
        COURSE: "bg-blue-50 text-blue-900 border-blue-200",
        MODULE: "bg-blue-50 text-blue-900 border-blue-200",
    };
    const attemptRate = quiz.totalStudents > 0 ? Math.round((quiz.attempts / quiz.totalStudents) * 100) : 0;
    const scopeLabel = quiz.type === "MODULE" && quiz.moduleName ? quiz.moduleName
        : quiz.type === "LESSON" && quiz.lessonName ? quiz.lessonName : null;
    const qCount = quiz.questions ?? 0;

    const stop = (fn) => (e) => { e.stopPropagation(); fn(); };

    return (
        <div onClick={() => onManageQuestions(quiz)}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
            <div className="flex items-start gap-4 p-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${s.label === "Published" ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-slate-200"}`}>
                    <MdOutlineQuiz className={`text-2xl ${s.label === "Published" ? "text-[#043573]" : "text-slate-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="text-sm font-black text-slate-900 leading-tight truncate">{quiz.title}</h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeColor[quiz.type] ?? typeColor.COURSE}`}>{quiz.type}</span>
                                <span className="text-[10px] text-slate-400">•</span>
                                <span className="text-[11px] text-slate-500 font-medium truncate">{quiz.course}</span>
                                {scopeLabel && (<><span className="text-[10px] text-slate-300">/</span><span className="text-[11px] text-slate-400 font-medium truncate">{scopeLabel}</span></>)}
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-medium flex-wrap">
                                <span className="flex items-center gap-1"><MdOutlineQuiz className="text-slate-400" />{qCount} Question{qCount !== 1 ? "s" : ""}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><MdTimer className="text-slate-400" />{quiz.duration > 0 ? `${quiz.duration} mins` : "—"}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.color}`}>{s.label}</span>
                            <div className="relative">
                                <button onClick={stop(() => setMenuOpen(v => !v))}
                                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
                                    <MdMoreVert />
                                </button>
                                {menuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={stop(() => setMenuOpen(false))} />
                                        <div className="absolute right-0 top-9 z-20 w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                                            <button onClick={stop(() => { onEditDetails(quiz); setMenuOpen(false); })}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-left">
                                                <FaEdit className="text-blue-400 w-3 h-3" /> Edit Details
                                            </button>
                                            <button onClick={stop(() => { onManageQuestions(quiz); setMenuOpen(false); })}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-left">
                                                <MdListAlt className="text-blue-400 w-3.5 h-3.5" /> Manage Questions
                                            </button>
                                            <button onClick={stop(() => { onPublish(quiz); setMenuOpen(false); })}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-left">
                                                <MdCheckCircle className="text-emerald-400 w-3.5 h-3.5" /> Publish Quiz
                                            </button>
                                            <button onClick={stop(() => { onArchive(quiz); setMenuOpen(false); })}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition text-left">
                                                <FaLock className="text-amber-400 w-3 h-3" /> Archive Quiz
                                            </button>
                                            <div className="border-t border-slate-100" />
                                            <button onClick={stop(() => { onDelete(quiz); setMenuOpen(false); })}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition text-left">
                                                <FaTrash className="w-3 h-3" /> Delete Quiz
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-100 px-5 py-3 flex items-center gap-4 bg-slate-50/50 rounded-b-2xl">
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-400 font-medium">Total Marks</p>
                    <p className="text-sm font-black text-slate-700">{quiz.totalMarks}</p>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-400 font-medium">Passing Marks</p>
                    <p className="text-sm font-black text-slate-700">{quiz.passingScore}</p>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-400 font-medium">Max Attempts</p>
                    <p className="text-sm font-black text-slate-700">{quiz.maxAttempts === 0 ? "Unlimited" : quiz.maxAttempts}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={stop(() => onViewResults(quiz))}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-blue-900 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition">
                        <MdBarChart className="text-sm" /> Results
                    </button>
                    <button onClick={stop(() => onManageQuestions(quiz))}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-blue-900 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition">
                        <MdListAlt className="text-[11px]" /> Questions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizCard;

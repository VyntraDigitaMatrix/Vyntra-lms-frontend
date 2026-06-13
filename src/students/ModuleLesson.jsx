import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { studentEnrolledCourseApi } from "./auth/api";
import {
    FaPlay, FaCheckCircle, FaChevronLeft, FaChevronRight,
    FaChevronDown, FaChevronUp, FaClock, FaBook, FaTrophy,
    FaDownload, FaListUl, FaUpload, FaStar, FaPaperclip,
    FaCheck, FaTimes, FaRedo, FaHourglassHalf, FaStickyNote,
    FaTrash, FaPlus, FaPen, FaHighlighter, FaBold, FaItalic,
    FaUnderline, FaListOl, FaSave, FaExpand, FaCompress,
    FaThumbtack, FaEdit
} from "react-icons/fa";
import { AiOutlinePlaySquare } from "react-icons/ai";
import { MdOutlineQuiz, MdAssignment, MdInfoOutline, MdCloudUpload } from "react-icons/md";

/* ══════════════════════════════════════════════════════════════
   NOTE COLORS CONFIG
══════════════════════════════════════════════════════════════ */
const NOTE_COLORS = [
    { bg: "bg-yellow-50", border: "border-yellow-200", dot: "bg-yellow-400", label: "Yellow" },
    { bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400", label: "Blue" },
    { bg: "bg-green-50", border: "border-green-200", dot: "bg-green-400", label: "Green" },
    { bg: "bg-pink-50", border: "border-pink-200", dot: "bg-pink-400", label: "Pink" },
    { bg: "bg-purple-50", border: "border-purple-200", dot: "bg-purple-400", label: "Purple" },
];

/* ══════════════════════════════════════════════════════════════
   TAKE NOTES PANEL COMPONENT
══════════════════════════════════════════════════════════════ */
const TakeNotesPanel = ({ lessonId, lessonTitle, onClose }) => {
    const [notes, setNotes] = useState(() => {
        try { return JSON.parse(localStorage.getItem(`notes_${lessonId}`) || "[]"); } catch { return []; }
    });
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [draftText, setDraftText] = useState("");
    const [draftColor, setDraftColor] = useState(0);
    const [draftTitle, setDraftTitle] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [savedFlash, setSavedFlash] = useState(false);
    const textareaRef = useRef(null);

    const activeNote = notes.find(n => n.id === activeNoteId);

    useEffect(() => {
        try { localStorage.setItem(`notes_${lessonId}`, JSON.stringify(notes)); } catch { }
    }, [notes, lessonId]);

    useEffect(() => {
        if (textareaRef.current) textareaRef.current.focus();
    }, [activeNoteId]);

    const createNote = () => {
        const newNote = {
            id: Date.now(),
            title: `Note ${notes.length + 1}`,
            text: "",
            color: 0,
            createdAt: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
            pinned: false,
        };
        setNotes(prev => [newNote, ...prev]);
        setActiveNoteId(newNote.id);
        setDraftText("");
        setDraftTitle(newNote.title);
        setDraftColor(0);
    };

    const openNote = (note) => {
        setActiveNoteId(note.id);
        setDraftText(note.text);
        setDraftTitle(note.title);
        setDraftColor(note.color);
    };

    const saveNote = () => {
        if (!activeNoteId) return;
        setNotes(prev => prev.map(n => n.id === activeNoteId
            ? { ...n, text: draftText, title: draftTitle || n.title, color: draftColor }
            : n));
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1500);
    };

    const deleteNote = (id) => {
        setNotes(prev => prev.filter(n => n.id !== id));
        if (activeNoteId === id) { setActiveNoteId(null); setDraftText(""); setDraftTitle(""); }
    };

    const togglePin = (id) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
    };

    const insertFormat = (type) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart, end = ta.selectionEnd;
        const sel = draftText.slice(start, end);
        let ins = "";
        if (type === "bold") ins = `**${sel || "bold text"}**`;
        if (type === "italic") ins = `_${sel || "italic text"}_`;
        if (type === "underline") ins = `__${sel || "underline text"}__`;
        if (type === "bullet") ins = `\n• ${sel || "item"}`;
        if (type === "number") ins = `\n1. ${sel || "item"}`;
        if (type === "highlight") ins = `==${sel || "highlighted"}==`;
        const newText = draftText.slice(0, start) + ins + draftText.slice(end);
        setDraftText(newText);
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + ins.length; ta.focus(); }, 0);
    };

    const sortedNotes = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    const panelClass = isExpanded
        ? "fixed inset-4 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
        : "fixed bottom-0 right-0 w-full sm:w-[420px] h-[70vh] sm:h-[75vh] z-50 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 sm:bottom-4 sm:right-4 flex flex-col overflow-hidden";

    return (
        <>
            <div className="fixed inset-0 bg-black/20 z-40 sm:hidden" onClick={onClose} />
            <div className={panelClass}>
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl flex-shrink-0">
                    <FaStickyNote className="text-white text-sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-white leading-none">My Notes</p>
                        <p className="text-[10px] text-blue-200 truncate mt-0.5">{lessonTitle}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setIsExpanded(v => !v)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition text-xs">
                            {isExpanded ? <FaCompress /> : <FaExpand />}
                        </button>
                        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition text-xs">
                            <FaTimes />
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Notes List Sidebar */}
                    <div className="w-36 sm:w-44 border-r border-gray-100 flex flex-col bg-gray-50 flex-shrink-0">
                        <div className="px-2.5 py-2 border-b border-gray-100">
                            <button onClick={createNote} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition">
                                <FaPlus className="text-[9px]" /> New Note
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto py-1.5 space-y-1 px-1.5">
                            {sortedNotes.length === 0 && (
                                <div className="text-center py-8 px-2">
                                    <FaStickyNote className="text-gray-200 text-2xl mx-auto mb-2" />
                                    <p className="text-[10px] text-gray-400">No notes yet</p>
                                </div>
                            )}
                            {sortedNotes.map(note => {
                                const c = NOTE_COLORS[note.color];
                                return (
                                    <div key={note.id} onClick={() => openNote(note)}
                                        className={`relative rounded-lg p-2 cursor-pointer border transition group ${activeNoteId === note.id ? "border-blue-400 bg-blue-50 shadow-sm" : `${c.border} ${c.bg} hover:shadow-sm`}`}>
                                        {note.pinned && <FaThumbtack className="absolute top-1.5 right-1.5 text-[8px] text-amber-400" />}
                                        <p className="text-[11px] font-bold text-gray-800 truncate leading-tight">{note.title}</p>
                                        <p className="text-[9px] text-gray-400 mt-0.5 line-clamp-2 leading-tight">{note.text || "Empty note"}</p>
                                        <p className="text-[8px] text-gray-300 mt-1">{note.createdAt}</p>
                                        <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                                            className="absolute bottom-1.5 right-1.5 hidden group-hover:flex items-center justify-center w-4 h-4 rounded bg-red-100 hover:bg-red-200 text-red-400 transition">
                                            <FaTrash className="text-[7px]" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="px-2.5 py-2 border-t border-gray-100">
                            <p className="text-[9px] text-gray-400 text-center">{notes.length} note{notes.length !== 1 ? "s" : ""}</p>
                        </div>
                    </div>

                    {/* Note Editor */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {!activeNoteId ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center">
                                    <FaEdit className="text-blue-300 text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-700 mb-1">Start taking notes</p>
                                    <p className="text-xs text-gray-400">Create a new note or select one from the list.</p>
                                </div>
                                <button onClick={createNote} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition">
                                    <FaPlus className="text-[9px]" /> Create First Note
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="px-3 py-2.5 border-b border-gray-100 flex items-center gap-2">
                                    <input value={draftTitle} onChange={e => setDraftTitle(e.target.value)}
                                        className="flex-1 text-sm font-bold text-gray-800 border-none outline-none bg-transparent placeholder-gray-300 min-w-0"
                                        placeholder="Note title..." />
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {NOTE_COLORS.map((c, i) => (
                                            <button key={i} onClick={() => setDraftColor(i)} title={c.label}
                                                className={`w-4 h-4 rounded-full ${c.dot} transition-transform ${draftColor === i ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : "hover:scale-110"}`} />
                                        ))}
                                        <button onClick={() => togglePin(activeNoteId)} title="Pin note"
                                            className={`ml-1 w-6 h-6 flex items-center justify-center rounded-lg text-[10px] transition ${activeNote?.pinned ? "text-amber-500 bg-amber-50" : "text-gray-300 hover:text-amber-400"}`}>
                                            <FaThumbtack />
                                        </button>
                                    </div>
                                </div>
                                <div className="px-3 py-1.5 border-b border-gray-100 flex items-center gap-1 flex-wrap bg-gray-50">
                                    {[
                                        { icon: <FaBold />, action: "bold", tip: "Bold" },
                                        { icon: <FaItalic />, action: "italic", tip: "Italic" },
                                        { icon: <FaUnderline />, action: "underline", tip: "Underline" },
                                        { icon: <FaHighlighter />, action: "highlight", tip: "Highlight" },
                                        { icon: <FaListUl />, action: "bullet", tip: "Bullet list" },
                                        { icon: <FaListOl />, action: "number", tip: "Numbered list" },
                                    ].map(({ icon, action, tip }) => (
                                        <button key={action} onClick={() => insertFormat(action)} title={tip}
                                            className="w-6 h-6 flex items-center justify-center rounded text-[10px] text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition">
                                            {icon}
                                        </button>
                                    ))}
                                    <div className="flex-1" />
                                    <button onClick={saveNote}
                                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${savedFlash ? "bg-green-100 text-green-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                                        {savedFlash ? <><FaCheck className="text-[8px]" /> Saved!</> : <><FaSave className="text-[8px]" /> Save</>}
                                    </button>
                                </div>
                                <div className={`flex-1 overflow-hidden ${NOTE_COLORS[draftColor].bg}`}>
                                    <textarea ref={textareaRef} value={draftText} onChange={e => setDraftText(e.target.value)}
                                        onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); saveNote(); } }}
                                        placeholder={"Start writing your notes here...\n\nTip: Use the toolbar above to format text, or press Ctrl+S to save."}
                                        className={`w-full h-full resize-none border-none outline-none px-4 py-3 text-xs sm:text-sm text-gray-700 leading-relaxed bg-transparent placeholder-gray-300 font-mono`} />
                                </div>
                                <div className="px-3 py-1.5 border-t border-gray-100 bg-white flex items-center justify-between">
                                    <p className="text-[9px] text-gray-400">{draftText.length} chars · {draftText.split(/\s+/).filter(Boolean).length} words</p>
                                    <p className="text-[9px] text-gray-300">{activeNote?.createdAt}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

/* ══════════════════════════════════════════════════════════════
   QUIZ COMPONENT
══════════════════════════════════════════════════════════════ */
const QuizView = ({ moduleColor, onComplete, isCompleted }) => {
    // Placeholder quiz when no real quiz data is available from API
    const quiz = {
        title: "Module Quiz",
        questions: [
            { id: 1, question: "Quiz questions will be loaded from the server.", options: ["Option A", "Option B", "Option C", "Option D"], correct: 0, explanation: "This is a placeholder. Real questions come from your course content." },
        ],
    };

    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answers, setAnswers] = useState({});
    const [showExplanation, setShowExplanation] = useState(false);
    const [finished, setFinished] = useState(isCompleted);
    const [score, setScore] = useState(0);
    const [requestSent, setRequestSent] = useState(false);

    const q = quiz.questions[current];
    const totalQ = quiz.questions.length;
    const isAnswered = selected !== null;
    const isCorrect = selected === q.correct;

    const handleSelect = (idx) => {
        if (isAnswered) return;
        setSelected(idx);
        setShowExplanation(true);
        setAnswers(prev => ({ ...prev, [current]: idx }));
    };

    const handleNext = () => {
        if (current < totalQ - 1) {
            setCurrent(current + 1);
            setSelected(answers[current + 1] ?? null);
            setShowExplanation(answers[current + 1] !== undefined);
        } else {
            const s = quiz.questions.filter((q2, i) => answers[i] === q2.correct).length;
            setScore(s);
            setFinished(true);
            onComplete();
        }
    };

    const handleRetry = () => {
        setCurrent(0); setSelected(null); setAnswers({});
        setShowExplanation(false); setFinished(false); setScore(0);
    };

    if (finished) {
        const pct = Math.round((score / totalQ) * 100);
        const passed = pct >= 60;
        return (
            <div className="w-full min-h-[460px] flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-white">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-4xl border-2 shadow-2xl animate-bounce ${passed ? "border-emerald-500/30 bg-emerald-500/10" : "border-rose-500/30 bg-rose-500/10"}`}>
                    {passed ? "🎉" : "📚"}
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">{passed ? "Module Assessment Cleared!" : "Review Material & Retry"}</h2>
                <p className="text-slate-400 text-sm max-w-sm mb-6">
                    You achieved a score of <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-800" style={{ color: moduleColor }}>{score} out of {totalQ}</span> ({pct}%)
                </p>
                <div className="flex gap-2.5 flex-wrap justify-center mb-8 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50">
                    {quiz.questions.map((qq, i) => (
                        <div key={i} className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold text-xs shadow-sm ${answers[i] === qq.correct ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
                            <span className="text-[9px] opacity-60 font-medium">Q{i + 1}</span>
                            {answers[i] === qq.correct ? "✓" : "✕"}
                        </div>
                    ))}
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 border ${passed ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"}`}>
                    <div className={`w-2 h-2 rounded-full ${passed ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}></div>
                    {passed ? "Minimum Passing Criteria Met (60%)" : "Requires 60% Passing Grade"}
                </div>
                <div className="mb-6 flex flex-col items-center">
                    {requestSent ? (
                        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                            <FaCheckCircle className="text-blue-400" /> Quiz request already sent
                        </div>
                    ) : (
                        <button onClick={() => setRequestSent(true)}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition shadow-md cursor-pointer">
                            Send Quiz Request
                        </button>
                    )}
                </div>
                {!passed && (
                    <button onClick={handleRetry} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]" style={{ background: moduleColor }}>
                        <FaRedo className="w-3 h-3" /> Re-attempt Assessment
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col overflow-hidden bg-slate-900 border border-slate-800 text-white rounded-2xl">
            <div className="px-6 py-5 bg-slate-950/40 border-b border-slate-800/60">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold tracking-wider uppercase text-slate-400">Progress Map</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">{current + 1} / {totalQ} Questions</span>
                </div>
                <div className="flex gap-1.5 w-full">
                    {quiz.questions.map((_, idx) => (
                        <div key={idx} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${idx === current ? "bg-indigo-500" : idx < current ? "bg-slate-700" : "bg-slate-800"}`} />
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 min-h-[280px]">
                <div className="bg-slate-950/20 border border-slate-800/40 rounded-xl p-4">
                    <h3 className="text-base font-bold text-slate-100 leading-relaxed">{q.question}</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {q.options.map((opt, i) => {
                        let itemStyles = "w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group outline-none ";
                        let prefixStyles = "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all border shadow-inner ";
                        if (!isAnswered) {
                            itemStyles += "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300";
                            prefixStyles += "border-slate-800 bg-slate-900 text-slate-400 group-hover:bg-slate-700 group-hover:text-white";
                        } else if (i === q.correct) {
                            itemStyles += "border-emerald-500/40 bg-emerald-500/10 text-emerald-200 font-medium";
                            prefixStyles += "border-emerald-400/30 bg-emerald-500 text-white";
                        } else if (i === selected && selected !== q.correct) {
                            itemStyles += "border-rose-500/40 bg-rose-500/10 text-rose-200";
                            prefixStyles += "border-rose-400/30 bg-rose-500 text-white";
                        } else {
                            itemStyles += "border-slate-800/40 bg-slate-950/10 text-slate-500 cursor-not-allowed";
                            prefixStyles += "border-slate-800/40 bg-slate-900/40 text-slate-600";
                        }
                        return (
                            <button key={i} className={itemStyles} onClick={() => handleSelect(i)} disabled={isAnswered}>
                                <span className="flex items-center gap-3.5 pr-2">
                                    <span className={prefixStyles}>{String.fromCharCode(65 + i)}</span>
                                    <span className="text-sm leading-tight font-medium">{opt}</span>
                                </span>
                                {isAnswered && i === q.correct && <FaCheckCircle className="text-emerald-400 w-4 h-4 flex-shrink-0" />}
                                {isAnswered && i === selected && selected !== q.correct && <FaTimes className="text-rose-400 w-4 h-4 flex-shrink-0" />}
                            </button>
                        );
                    })}
                </div>
                {showExplanation && (
                    <div className={`p-4 rounded-xl border ${isCorrect ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" : "bg-amber-500/5 border-amber-500/20 text-amber-300"}`}>
                        <div className="flex items-center gap-2 mb-1.5 font-bold text-xs tracking-wider uppercase">
                            <MdInfoOutline className="text-sm" />
                            <span>{isCorrect ? "Correct!" : "Explanation"}</span>
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">{q.explanation}</p>
                    </div>
                )}
            </div>
            <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800/60 flex justify-between items-center">
                <button onClick={() => { if (current > 0) { setCurrent(current - 1); setSelected(answers[current - 1] ?? null); setShowExplanation(answers[current - 1] !== undefined); } }}
                    disabled={current === 0}
                    className="text-xs font-bold text-slate-400 disabled:opacity-20 hover:text-white flex items-center gap-1.5 transition px-3 py-1.5 rounded-lg hover:bg-slate-800/60">
                    <FaChevronLeft className="w-2.5 h-2.5" /> Back
                </button>
                <button onClick={handleNext} disabled={!isAnswered}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                    style={{ background: isAnswered ? moduleColor : "#334155" }}>
                    {current === totalQ - 1 ? "Finish Assessment" : "Next"} <FaChevronRight className="w-2.5 h-2.5" />
                </button>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════
   ASSIGNMENT COMPONENT
══════════════════════════════════════════════════════════════ */
const AssignmentView = ({ lessonData, moduleColor, onSubmit, isSubmitted }) => {
    const [files, setFiles] = useState([]);
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(isSubmitted);
    const [dragActive, setDragActive] = useState(false);

    const handleSubmit = () => {
        if (files.length === 0) return;
        setSubmitted(true);
        onSubmit();
    };

    const handleDrag = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(false);
        if (e.dataTransfer.files?.[0]) setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    };

    if (submitted) {
        return (
            <div className="w-full min-h-[460px] flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-5 shadow-xl shadow-emerald-500/20">
                    <FaCheck className="text-xl" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Assignment Submitted</h2>
                <p className="text-slate-500 text-xs max-w-xs mb-6">Your submission is pending review by your course coordinator.</p>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-slate-200/80 shadow-sm text-left max-w-sm">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <FaHourglassHalf className="text-sm" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-800">Grading In Progress</p>
                        <p className="text-[11px] text-slate-400">Expected within 3–5 business days</p>
                    </div>
                </div>
            </div>
        );
    }

    const title = lessonData?.title || "Module Assignment";
    const description = lessonData?.description || "Complete and submit your assignment for this module.";

    return (
        <div className="w-full flex flex-col overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: moduleColor }}>
                    <MdAssignment className="text-base" />
                </div>
                <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Practical Assessment</span>
                    <h2 className="text-sm font-black text-slate-800 tracking-tight leading-none mt-0.5">{title}</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 min-h-[300px] space-y-5">
                {description && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Brief</h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{description}</p>
                    </div>
                )}

                {/* File Upload */}
                <div>
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Submit Your Work</h4>
                    <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                        onClick={() => document.getElementById("assign-file-upload").click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${dragActive ? "border-indigo-500 bg-indigo-50/40" : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"}`}>
                        <MdCloudUpload className="text-slate-400 text-3xl mx-auto mb-1.5" />
                        <p className="text-xs font-bold text-slate-700">Drop files here or click to browse</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Max 20MB per file</p>
                        <input id="assign-file-upload" type="file" multiple className="hidden"
                            onChange={(e) => setFiles(prev => [...prev, ...Array.from(e.target.files)])} />
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="grid grid-cols-1 gap-1.5">
                        {files.map((f, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 border border-slate-200/60">
                                <div className="flex items-center gap-2 min-w-0 pr-2">
                                    <FaPaperclip className="text-slate-400 w-3 h-3 flex-shrink-0" />
                                    <span className="text-xs font-semibold text-slate-600 truncate">{f.name}</span>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); setFiles(files.filter((_, j) => j !== i)); }}
                                    className="text-slate-400 hover:text-rose-500 p-1 text-[11px] transition">✕</button>
                            </div>
                        ))}
                    </div>
                )}

                <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-slate-100 placeholder-slate-400"
                    rows={3} placeholder="Add notes or comments for your reviewer..."
                    value={notes} onChange={(e) => setNotes(e.target.value)} />

                <button onClick={handleSubmit} disabled={files.length === 0}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95"
                    style={{ background: files.length > 0 ? moduleColor : "#CBD5E1" }}>
                    <FaUpload className="w-3 h-3" /> Submit Assignment
                </button>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════
   LESSON TYPE HELPERS
══════════════════════════════════════════════════════════════ */
const getLessonIcon = (type) => {
    const t = (type || "").toLowerCase();
    if (t === "quiz") return "quiz";
    if (t === "assignment") return "assignment";
    if (t === "text" || t === "article") return "text";
    return "video";
};

const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
};

/* ══════════════════════════════════════════════════════════════
   MAIN MODULE LESSON COMPONENT
══════════════════════════════════════════════════════════════ */
const ModuleLesson = () => {
    const { courseId, moduleId, lessonId } = useParams();
    const navigate = useNavigate();

    /* ══════════════════════════════════════════
       STATE
    ══════════════════════════════════════════ */
    // Modules + lessons (sidebar)
    const [allModules, setAllModules] = useState([]);
    const [modulesLoading, setModulesLoading] = useState(true);

    // Current lesson content
    const [lessonData, setLessonData] = useState(null);
    const [lessonLoading, setLessonLoading] = useState(true);
    const [lessonError, setLessonError] = useState("");

    // Lessons per module (lazy cache: moduleId → lessons[])
    const [moduleLessonsCache, setModuleLessonsCache] = useState({});
    const [loadingModuleLessons, setLoadingModuleLessons] = useState({});

    // UI
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [expandedModules, setExpandedModules] = useState(new Set([moduleId]));
    const [sidebarOpen, setSidebarOpen] = useState(true);

    /* ══════════════════════════════════════════
       FETCH MODULES (sidebar)
       GET /api/v1/student/my-courses/{courseId}/modules
    ══════════════════════════════════════════ */
    const fetchModules = useCallback(async () => {
        if (!courseId) return;
        setModulesLoading(true);
        try {
            const res = await studentEnrolledCourseApi.getCourseModules(courseId);
            const mods = res.data?.data || res.data || [];
            setAllModules(Array.isArray(mods) ? mods : []);
            // Pre-seed cache with any lessons nested inside module response
            const cache = {};
            mods.forEach(m => {
                if (Array.isArray(m.lessons) && m.lessons.length > 0) {
                    cache[String(m.id)] = m.lessons;
                }
            });
            if (Object.keys(cache).length > 0) {
                setModuleLessonsCache(prev => ({ ...cache, ...prev }));
            }
        } catch (err) {
            console.error("fetchModules error:", err);
        } finally {
            setModulesLoading(false);
        }
    }, [courseId]);

    /* ══════════════════════════════════════════
       FETCH LESSONS FOR A MODULE (lazy, on accordion expand)
       GET /api/v1/student/my-courses/{courseId}/modules/{moduleId}/lessons
    ══════════════════════════════════════════ */
    const fetchModuleLessons = useCallback(async (mId) => {
        const key = String(mId);
        if (moduleLessonsCache[key] || loadingModuleLessons[key]) return;
        setLoadingModuleLessons(prev => ({ ...prev, [key]: true }));
        try {
            const res = await studentEnrolledCourseApi.getModuleLessons(courseId, mId, 0, 100);
            const lessons = res.data?.data?.content || res.data?.content || res.data?.data || res.data || [];
            setModuleLessonsCache(prev => ({ ...prev, [key]: Array.isArray(lessons) ? lessons : [] }));
        } catch (err) {
            console.error(`fetchModuleLessons(${mId}) error:`, err);
            setModuleLessonsCache(prev => ({ ...prev, [key]: [] }));
        } finally {
            setLoadingModuleLessons(prev => ({ ...prev, [key]: false }));
        }
    }, [courseId, moduleLessonsCache, loadingModuleLessons]);

    /* ══════════════════════════════════════════
       FETCH CURRENT LESSON
       GET /api/v1/student/my-courses/{courseId}/lessons/{lessonId}
    ══════════════════════════════════════════ */
    const fetchLesson = useCallback(async () => {
        if (!courseId || !lessonId) return;
        setLessonLoading(true);
        setLessonError("");
        try {
            const res = await studentEnrolledCourseApi.getLessonById(courseId, lessonId);
            setLessonData(res.data?.data || res.data || null);
        } catch (err) {
            console.error("fetchLesson error:", err);
            setLessonError("Could not load lesson content. Please try again.");
        } finally {
            setLessonLoading(false);
        }
    }, [courseId, lessonId]);

    /* ══════════════════════════════════════════
       EFFECTS
    ══════════════════════════════════════════ */
    useEffect(() => { fetchModules(); }, [fetchModules]);
    useEffect(() => { fetchLesson(); }, [fetchLesson]);

    // Auto-expand current module + fetch its lessons
    useEffect(() => {
        if (moduleId) {
            setExpandedModules(prev => new Set([...prev, moduleId]));
            fetchModuleLessons(moduleId);
        }
    }, [moduleId]);

    // When a module is expanded, fetch its lessons
    const handleToggleModule = (mId) => {
        const key = String(mId);
        setExpandedModules(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
                fetchModuleLessons(mId);
            }
            return next;
        });
    };

    /* ══════════════════════════════════════════
       DERIVED DATA
    ══════════════════════════════════════════ */
    // Lesson type detection — prefer API data, fall back to URL param context
    const lessonType = getLessonIcon(lessonData?.lessonType || lessonData?.type);
    const isQuiz = lessonType === "quiz";
    const isAssignment = lessonType === "assignment";
    const isText = lessonType === "text";
    const isVideo = lessonType === "video";

    const content = {
        title: lessonData?.title || "Loading…",
        description: lessonData?.description || "",
        body: lessonData?.content || null,
        videoUrl: lessonData?.videoUrl || lessonData?.video_url || null,
        resourceUrl: lessonData?.resourceUrl || null,
        duration: lessonData?.durationInMinutes ? `${lessonData.durationInMinutes} min` : (lessonData?.duration || ""),
    };

    // Build flat lesson list for prev/next navigation
    // Uses cache; falls back to module-level lessons array
    const flatLessons = allModules.flatMap(m => {
        const key = String(m.id);
        const lessons = moduleLessonsCache[key] || m.lessons || [];
        return lessons.map(l => ({ moduleId: String(m.id), lessonId: String(l.id), lesson: l }));
    });

    const currentFlatIdx = flatLessons.findIndex(
        f => f.moduleId === String(moduleId) && f.lessonId === String(lessonId)
    );
    const prevEntry = flatLessons[currentFlatIdx - 1];
    const nextEntry = flatLessons[currentFlatIdx + 1];

    const goTo = (mId, lId) => navigate(`/student/course/${courseId}/module/${mId}/lesson/${lId}`);

    // Progress
    const totalLessons = flatLessons.length;
    const completedCount = completedLessons.size;
    const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const lessonKey = `${moduleId}-${lessonId}`;
    const isDone = completedLessons.has(lessonKey);
    const markComplete = () => setCompletedLessons(prev => new Set(prev).add(lessonKey));

    // Find current module color for theming
    const currentModuleData = allModules.find(m => String(m.id) === String(moduleId));
    const moduleColor = currentModuleData?.color || "#2563EB";
    const moduleName = currentModuleData?.title || `Module ${moduleId}`;

    // Note count badge
    const noteCount = (() => {
        try { return JSON.parse(localStorage.getItem(`notes_${courseId}-${moduleId}-${lessonId}`) || "[]").length; } catch { return 0; }
    })();

    /* ══════════════════════════════════════════
       RENDER
    ══════════════════════════════════════════ */
    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col antialiased selection:bg-indigo-500/20">

            {/* ── Top Bar ── */}
            <div className="bg-white border-b border-slate-200/80 px-5 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                <div className="flex items-center gap-3">
                    <Link to={`/student/continue-learning/${courseId}`}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition">
                        <FaChevronLeft className="w-2.5 h-2.5" /> Course
                    </Link>
                    <span className="text-slate-200 font-light">|</span>
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[180px] sm:max-w-xs opacity-80">
                        {lessonLoading ? "Loading…" : content.title}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-3 py-1.5 border border-slate-200/60 rounded-xl">
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                        </div>
                        <span className="text-[11px] text-blue-500 font-extrabold tracking-wide uppercase">{progressPct}% Done</span>
                    </div>
                    <button onClick={() => {
                        localStorage.setItem("openNoteEditor", "true");
                        localStorage.setItem("notesCourseId", courseId);
                        navigate(`/student/notes`);
                    }}
                        className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex-shrink-0 bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50">
                        <FaStickyNote className="text-[11px]" />
                        <span className="hidden sm:inline">Notes</span>
                        {noteCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center bg-blue-600 text-white">
                                {noteCount}
                            </span>
                        )}
                    </button>
                    <button onClick={() => setSidebarOpen(v => !v)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 hover:bg-slate-50 transition">
                        <FaListUl className="w-3 h-3 text-slate-400" />
                        <span className="hidden sm:inline">{sidebarOpen ? "Hide Outline" : "Show Outline"}</span>
                    </button>
                </div>
            </div>

            {/* ── Workspace Body ── */}
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto p-5 space-y-5">

                        {/* Breadcrumb */}
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] tracking-wide text-blue-400 font-bold uppercase flex items-center flex-wrap gap-x-1">
                                <Link to={`/student/continue-learning/${courseId}`} className="hover:text-blue-700 transition">Course</Link>
                                <span className="font-normal text-blue-300">/</span>
                                <span className="text-blue-500">{moduleName}</span>
                                <span className="font-normal text-blue-300">/</span>
                                <span className="text-blue-600 font-extrabold truncate max-w-[200px]">{content.title}</span>
                            </p>
                            <button onClick={() => {
                                localStorage.setItem("openNoteEditor", "true");
                                localStorage.setItem("notesCourseId", String(courseId));
                                navigate(`/student/notes`);
                            }}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition flex-shrink-0 border bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600">
                                <FaStickyNote className="w-3 h-3" />
                                Take Notes
                                {noteCount > 0 && (
                                    <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{noteCount}</span>
                                )}
                            </button>
                        </div>

                        {/* Main Content Stage */}
                        {lessonLoading ? (
                            <div className="rounded-2xl bg-slate-100 aspect-video flex items-center justify-center animate-pulse">
                                <p className="text-slate-400 text-sm font-semibold">Loading lesson…</p>
                            </div>
                        ) : lessonError ? (
                            <div className="rounded-2xl bg-red-50 border border-red-100 aspect-video flex flex-col items-center justify-center gap-3">
                                <p className="text-xs text-red-500 font-semibold">{lessonError}</p>
                                <button onClick={fetchLesson} className="text-xs bg-red-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-red-600 transition">Retry</button>
                            </div>
                        ) : (
                            <div className={`rounded-2xl overflow-hidden ${isQuiz || isAssignment ? "bg-transparent" : "bg-black aspect-video shadow-md border border-slate-200"}`}>
                                {isQuiz ? (
                                    <QuizView moduleColor={moduleColor} onComplete={markComplete} isCompleted={isDone} />
                                ) : isAssignment ? (
                                    <AssignmentView lessonData={lessonData} moduleColor={moduleColor} onSubmit={markComplete} isSubmitted={isDone} />
                                ) : content.videoUrl ? (
                                    <video className="w-full h-full object-cover" controls key={content.videoUrl}>
                                        <source src={content.videoUrl} />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : isText && content.body ? (
                                    <div className="w-full h-full bg-white p-6 overflow-y-auto text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {content.body}
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 gap-3">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                                            <FaPlay className="text-blue-400 text-2xl" />
                                        </div>
                                        <p className="text-white/60 text-xs font-semibold">No video available for this lesson</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Lesson Metadata Bar */}
                        {!lessonLoading && !lessonError && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 border border-slate-200/80 rounded-2xl shadow-2xs">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase text-white shadow-2xs"
                                            style={{ backgroundColor: moduleColor }}>
                                            {moduleName.split(": ")[0] || moduleName}
                                        </span>
                                        {isDone && (
                                            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-md">
                                                ✓ {isAssignment ? "Submitted" : "Complete"}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-lg font-black text-black tracking-tight">{content.title}</h1>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 font-medium">
                                        {content.duration && (
                                            <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 border border-slate-100 rounded-md">
                                                <FaClock className="w-2.5 h-2.5 text-slate-400" /> {content.duration}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 border border-slate-100 rounded-md">
                                            {isQuiz ? <MdOutlineQuiz className="w-3 h-3 text-slate-400" />
                                                : isAssignment ? <MdAssignment className="w-3 h-3 text-slate-400" />
                                                    : <AiOutlinePlaySquare className="w-3 h-3 text-slate-400" />}
                                            {isQuiz ? "Quiz" : isAssignment ? "Assignment" : isText ? "Article" : "Video"}
                                        </span>
                                    </div>
                                </div>
                                {!isDone && !isQuiz && !isAssignment && (
                                    <button onClick={markComplete}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex-shrink-0">
                                        <FaCheckCircle className="w-3.5 h-3.5" /> Mark as Complete
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Lesson Description / Body */}
                        {!isQuiz && !isAssignment && !lessonLoading && !lessonError && (
                            <div className="space-y-4">
                                {content.description && (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">
            About this Lesson
        </h3>

        <p className="text-sm text-slate-700 leading-relaxed">
            {stripHtml(content.description)}
        </p>
    </div>
)}
                                {content.body && isText && (
                                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Lesson Content</h3>
                                        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{content.body}</div>
                                    </div>
                                )}
                                {content.resourceUrl && (
                                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Resources</h3>
                                        <a href={content.resourceUrl} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200/40 rounded-xl hover:bg-slate-100/60 transition group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center">
                                                    <FaBook className="text-slate-400 w-3 h-3" />
                                                </div>
                                                <p className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition">
                                                    {content.title} — Resource
                                                </p>
                                            </div>
                                            <FaDownload className="text-slate-400 group-hover:text-slate-800 w-3.5 h-3.5 transition" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Prev / Next Navigation */}
                        <div className="flex justify-between gap-3 pt-2 pb-8">
                            <button
                                onClick={() => prevEntry && goTo(prevEntry.moduleId, prevEntry.lessonId)}
                                disabled={!prevEntry}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition ${prevEntry ? "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 shadow-2xs" : "border-slate-100 text-slate-300 bg-slate-50/50 cursor-not-allowed"}`}>
                                <FaChevronLeft className="w-2.5 h-2.5" /> Previous
                            </button>
                            <button
                                onClick={() => nextEntry && goTo(nextEntry.moduleId, nextEntry.lessonId)}
                                disabled={!nextEntry}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${nextEntry ? "bg-blue-600 text-white shadow-xs hover:bg-blue-500" : "border-slate-100 text-slate-300 bg-slate-50/50 cursor-not-allowed"}`}>
                                Next <FaChevronRight className="w-2.5 h-2.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Right Sidebar ── */}
                {sidebarOpen && (
                    <div className="w-80 bg-white border-l border-slate-200 flex-shrink-0 overflow-y-auto hidden lg:block shadow-sm">
                        <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-4 z-10">
                            <h2 className="text-xs font-black text-blue-600 uppercase tracking-wider">Course Outline</h2>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">
                                {completedCount} of {totalLessons} Lessons Done
                            </p>
                            <div className="w-full h-1 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                            </div>
                        </div>

                        <div className="py-1">
                            {modulesLoading ? (
                                <div className="p-4 space-y-2">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                allModules.map(mod => {
                                    const key = String(mod.id);
                                    const isExpandedMod = expandedModules.has(key);
                                    const isActiveMod = String(mod.id) === String(moduleId);
                                    const lessons = moduleLessonsCache[key] || mod.lessons || [];
                                    const modCompleted = lessons.filter(l => completedLessons.has(`${mod.id}-${l.id}`)).length;

                                    return (
                                        <div key={mod.id} className="border-b border-slate-50">
                                            <button onClick={() => handleToggleModule(mod.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${isActiveMod ? "bg-slate-50/80" : "hover:bg-slate-50/40"}`}>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-800 truncate leading-tight">{mod.title}</p>
                                                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                                                        {loadingModuleLessons[key] ? "Loading…" : `${modCompleted}/${lessons.length} done`}
                                                    </p>
                                                </div>
                                                {isExpandedMod
                                                    ? <FaChevronUp className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                                                    : <FaChevronDown className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />}
                                            </button>

                                            {isExpandedMod && (
                                                <div className="bg-slate-50/30 border-t border-slate-100/60 py-0.5">
                                                    {loadingModuleLessons[key] ? (
                                                        <div className="px-4 py-3 space-y-2">
                                                            {Array.from({ length: 3 }).map((_, i) => (
                                                                <div key={i} className="h-6 bg-slate-100 rounded animate-pulse" />
                                                            ))}
                                                        </div>
                                                    ) : lessons.length === 0 ? (
                                                        <div className="px-5 py-3 text-[10px] text-slate-400">No lessons found.</div>
                                                    ) : (
                                                        lessons.map(lesson => {
                                                            const isActive = String(mod.id) === String(moduleId) && String(lesson.id) === String(lessonId);
                                                            const isDoneLesson = completedLessons.has(`${mod.id}-${lesson.id}`);
                                                            const lType = getLessonIcon(lesson.lessonType || lesson.type);
                                                            const isAssignLesson = lType === "assignment";
                                                            const isQuizLesson = lType === "quiz";

                                                            let itemClass = "w-full flex items-center gap-3 px-4 py-2.5 text-left border-l-2 border-transparent transition-all ";
                                                            if (isActive) itemClass += "bg-blue-600 text-white font-semibold border-l-blue-600";
                                                            else if (isAssignLesson) itemClass += "hover:bg-amber-50/50 text-slate-700 hover:border-l-amber-300";
                                                            else itemClass += "hover:bg-slate-100/50 text-slate-600 hover:border-l-slate-300";

                                                            return (
                                                                <button key={lesson.id} onClick={() => goTo(mod.id, lesson.id)} className={itemClass}>
                                                                    <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                                                                        {isDoneLesson ? (
                                                                            <FaCheckCircle className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-emerald-500"}`} />
                                                                        ) : isAssignLesson ? (
                                                                            <MdAssignment className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-amber-500"}`} />
                                                                        ) : isQuizLesson ? (
                                                                            <MdOutlineQuiz className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-indigo-400"}`} />
                                                                        ) : (
                                                                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isActive ? "border-white/40" : "border-slate-300 bg-white"}`}>
                                                                                <FaPlay className={`w-1.5 h-1.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className={`text-xs truncate leading-tight ${isActive ? "text-white" : isAssignLesson ? "text-amber-800 font-semibold" : "text-slate-700 font-medium"}`}>
                                                                            {lesson.title}
                                                                        </p>
                                                                        <p className={`text-[10px] mt-0.5 ${isActive ? "text-blue-100" : isAssignLesson ? "text-amber-500" : "text-slate-400"}`}>
                                                                            {isAssignLesson ? "Assignment" : isQuizLesson ? "Quiz"
                                                                                : lesson.durationInMinutes ? `${lesson.durationInMinutes} min` : lesson.duration || ""}
                                                                        </p>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {progressPct === 100 && (
                            <div className="m-4 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-center shadow-lg">
                                <FaTrophy className="w-7 h-7 mx-auto mb-2 text-amber-400" />
                                <p className="font-black text-xs tracking-wide uppercase">Course Complete!</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">You've finished all lessons.</p>
                                <button className="mt-3 w-full bg-white text-slate-900 text-xs font-bold py-2 rounded-xl hover:bg-slate-50 transition shadow-sm">
                                    Claim Certificate
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModuleLesson;
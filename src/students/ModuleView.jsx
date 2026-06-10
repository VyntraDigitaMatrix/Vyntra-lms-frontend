import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    FaPlay, FaLock, FaCheckCircle, FaChevronDown, FaChevronLeft,
    FaStar, FaClock, FaBook, FaDownload, FaQuestion,
    FaFileAlt, FaBars, FaTimes, FaCheck, FaChevronRight,
    FaBullhorn, FaSearch, FaInstagram, FaPenNib, FaEnvelope, FaChartLine,
    FaStickyNote, FaTrash, FaPlus, FaPen, FaHighlighter, FaBold,
    FaItalic, FaUnderline, FaListUl, FaListOl, FaSave, FaExpand,
    FaCompress, FaThumbtack, FaEdit
} from "react-icons/fa";

/* ── Data ── */
const curriculum = [
    {
        id: 1, title: "Introduction to Digital Marketing", color: "#7C3AED", icon: <FaBullhorn className="text-purple-600 text-base sm:text-lg" />,
        lessons: [
            { id: 1, title: "What is Digital Marketing?", duration: "8:32", type: "video", free: true },
            { id: 2, title: "Traditional vs Digital Marketing", duration: "6:14", type: "video", free: true },
            { id: 3, title: "Key Channels Overview", duration: "9:45", type: "video", free: false },
            { id: 4, title: "Setting Marketing Goals", duration: "7:20", type: "video", free: false },
            { id: 5, title: "Module 1 Quiz", duration: "5 Qs", type: "quiz", free: false },
        ],
    },
    {
        id: 2, title: "Search Engine Optimization (SEO)", color: "#EA580C", icon: <FaSearch className="text-orange-600 text-base sm:text-lg" />,
        lessons: [
            { id: 6, title: "How Search Engines Work", duration: "10:15", type: "video", free: false },
            { id: 7, title: "Keyword Research Fundamentals", duration: "12:40", type: "video", free: false },
            { id: 8, title: "On-Page SEO Techniques", duration: "11:22", type: "video", free: false },
            { id: 9, title: "Off-Page SEO & Link Building", duration: "9:55", type: "video", free: false },
            { id: 10, title: "Technical SEO Basics", duration: "8:30", type: "video", free: false },
            { id: 11, title: "SEO Audit Assignment", duration: "PDF", type: "resource", free: false },
        ],
    },
    {
        id: 3, title: "Social Media Marketing", color: "#059669", icon: <FaInstagram className="text-green-600 text-base sm:text-lg" />,
        lessons: [
            { id: 12, title: "Social Media Landscape 2024", duration: "7:45", type: "video", free: false },
            { id: 13, title: "Building a Brand on Instagram", duration: "14:10", type: "video", free: false },
            { id: 14, title: "Facebook Marketing Strategy", duration: "13:25", type: "video", free: false },
            { id: 15, title: "LinkedIn for B2B Marketing", duration: "10:50", type: "video", free: false },
            { id: 16, title: "Content Calendar Planning", duration: "8:15", type: "video", free: false },
            { id: 17, title: "Social Media Quiz", duration: "8 Qs", type: "quiz", free: false },
        ],
    },
    {
        id: 4, title: "Content Marketing", color: "#2563EB", icon: <FaPenNib className="text-blue-600 text-base sm:text-lg" />,
        lessons: [
            { id: 18, title: "Content Marketing Strategy", duration: "9:30", type: "video", free: false },
            { id: 19, title: "Blog Writing for SEO", duration: "11:15", type: "video", free: false },
            { id: 20, title: "Video Content Creation", duration: "13:40", type: "video", free: false },
            { id: 21, title: "Content Distribution", duration: "7:55", type: "video", free: false },
        ],
    },
    {
        id: 5, title: "Email Marketing", color: "#DB2777", icon: <FaEnvelope className="text-pink-600 text-base sm:text-lg" />,
        lessons: [
            { id: 22, title: "Email Marketing Fundamentals", duration: "8:20", type: "video", free: false },
            { id: 23, title: "Building Your Email List", duration: "10:35", type: "video", free: false },
            { id: 24, title: "Writing Effective Email Copy", duration: "12:10", type: "video", free: false },
            { id: 25, title: "Email Automation Workflows", duration: "9:45", type: "video", free: false },
        ],
    },
    {
        id: 6, title: "Google Ads & Analytics", color: "#D97706", icon: <FaChartLine className="text-amber-600 text-base sm:text-lg" />,
        lessons: [
            { id: 26, title: "Google Ads Overview", duration: "11:20", type: "video", free: false },
            { id: 27, title: "Creating Your First Campaign", duration: "15:30", type: "video", free: false },
            { id: 28, title: "Google Analytics Setup", duration: "10:45", type: "video", free: false },
        ],
    },
];

const allLessons = curriculum.flatMap(m => m.lessons);

const lessonContent = {
    1: {
        description: "In this lesson, we dive deep into what digital marketing really means in today's landscape. You'll understand the core definition, why it matters, and how it differs from traditional marketing approaches.",
        keyPoints: [
            "Digital marketing encompasses all marketing efforts using digital channels",
            "It includes SEO, social media, email, PPC, content marketing, and more",
            "Measurable, targeted, and cost-effective compared to traditional marketing",
            "Allows real-time interaction with your target audience",
        ],
        resources: [
            { name: "Digital Marketing Overview PDF", size: "2.4 MB", type: "pdf" },
            { name: "Course Workbook - Chapter 1", size: "1.1 MB", type: "pdf" },
        ],
        notes: "Digital marketing is any marketing that uses electronic devices or the internet. Businesses leverage digital channels such as search engines, social media, email, and websites to connect with current and prospective customers.",
    },
    2: {
        description: "Compare traditional marketing methods with digital approaches. Understand where each excels and how businesses are shifting budgets from offline to online channels.",
        keyPoints: [
            "Traditional: TV, radio, print, billboards — broad reach, harder to measure",
            "Digital: Search, social, email — precise targeting, fully trackable",
            "Cost comparison: digital offers better ROI for most businesses",
            "Hybrid strategies combine both for maximum impact",
        ],
        resources: [{ name: "Comparison Chart PDF", size: "0.8 MB", type: "pdf" }],
        notes: "While traditional marketing still has its place, digital marketing offers unprecedented targeting capabilities and measurability.",
    },
};

const defaultContent = {
    description: "This lesson covers important concepts that will help you advance your digital marketing skills. Watch the video carefully and take notes on the key points.",
    keyPoints: [
        "Core concepts explained with real-world examples",
        "Step-by-step implementation guide",
        "Industry best practices and tips",
        "Common mistakes to avoid",
    ],
    resources: [
        { name: "Lesson Slides PDF", size: "1.8 MB", type: "pdf" },
        { name: "Reference Guide", size: "0.9 MB", type: "pdf" },
    ],
    notes: "Take your time with this lesson. Practice the concepts with your own projects for best results.",
};

const qaData = [
    { q: "How long does it take to see results from digital marketing?", a: "Results vary by channel. SEO typically takes 3–6 months, while paid ads can show results immediately.", user: "Arjun S.", time: "2 days ago" },
    { q: "What tools should I start with as a beginner?", a: "Start with Google Analytics, Google Search Console, and a free social media scheduler like Buffer.", user: "Priya M.", time: "1 week ago" },
];

const NOTE_COLORS = [
    { bg: "bg-yellow-50", border: "border-yellow-200", dot: "bg-yellow-400", label: "Yellow" },
    { bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400", label: "Blue" },
    { bg: "bg-green-50", border: "border-green-200", dot: "bg-green-400", label: "Green" },
    { bg: "bg-pink-50", border: "border-pink-200", dot: "bg-pink-400", label: "Pink" },
    { bg: "bg-purple-50", border: "border-purple-200", dot: "bg-purple-400", label: "Purple" },
];

/* ── Lesson icon ── */
const LessonTypeIcon = ({ type, completed, free }) => {
    if (completed) return <FaCheckCircle className="text-green-500 w-3 h-3 flex-shrink-0" />;
    if (!free) return <FaLock className="text-gray-300 w-3 h-3 flex-shrink-0" />;
    if (type === "quiz") return <FaQuestion className="text-amber-400 w-3 h-3 flex-shrink-0" />;
    if (type === "resource") return <FaFileAlt className="text-blue-400 w-3 h-3 flex-shrink-0" />;
    return <FaPlay className="text-blue-600 w-3 h-3 flex-shrink-0" />;
};

/* ══════════════════════════════════════════════════════════════
   TAKE NOTES PANEL
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
        setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, text: draftText, title: draftTitle || n.title, color: draftColor } : n));
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
            {/* Backdrop */}
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
                            <button onClick={createNote}
                                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition">
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
                                    <div key={note.id}
                                        onClick={() => openNote(note)}
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
                                    <p className="text-xs text-gray-400">Create a new note or select one from the list to begin editing.</p>
                                </div>
                                <button onClick={createNote} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition">
                                    <FaPlus className="text-[9px]" /> Create First Note
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Note Title + Color Picker */}
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

                                {/* Formatting Toolbar */}
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

                                {/* Textarea */}
                                <div className={`flex-1 overflow-hidden ${NOTE_COLORS[draftColor].bg}`}>
                                    <textarea
                                        ref={textareaRef}
                                        value={draftText}
                                        onChange={e => setDraftText(e.target.value)}
                                        onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); saveNote(); } }}
                                        placeholder="Start writing your notes here...&#10;&#10;Tip: Use the toolbar above to format text, or press Ctrl+S to save."
                                        className={`w-full h-full resize-none border-none outline-none px-4 py-3 text-xs sm:text-sm text-gray-700 leading-relaxed bg-transparent placeholder-gray-300 font-mono`}
                                    />
                                </div>

                                {/* Footer */}
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
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const ModuleView = () => {
    const { moduleId, lessonId } = useParams();
    const module = curriculum.find(m => m.id === Number(moduleId)) || curriculum[0];
    const currentLessonId = Number(lessonId) || 1;
    const currentLesson = allLessons.find(l => l.id === currentLessonId) || allLessons[0];
    const currentModule = curriculum.find(m => m.lessons.some(l => l.id === currentLessonId));
    const content = lessonContent[currentLessonId] || defaultContent;

    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    const [openModules, setOpenModules] = useState({ [currentModule?.id]: true });
    const [activeTab, setActiveTab] = useState("overview");
    const [completedLessons, setCompletedLessons] = useState(new Set([1, 2]));
    const [noteText, setNoteText] = useState("");
    const [question, setQuestion] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notesOpen, setNotesOpen] = useState(false);

    // Count notes for badge
    const [noteCount, setNoteCount] = useState(() => {
        try { return JSON.parse(localStorage.getItem(`notes_${currentLessonId}`) || "[]").length; } catch { return 0; }
    });

    const toggleModule = (id) => setOpenModules(p => ({ ...p, [id]: !p[id] }));
    const markComplete = () => setCompletedLessons(p => { const n = new Set(p); n.add(currentLessonId); return n; });

    const totalLessons = allLessons.length;
    const completedCount = completedLessons.size;
    const progressPct = Math.round((completedCount / totalLessons) * 100);

    const tabs = [
        { key: "overview", label: "Overview", icon: <FaBook className="text-[10px] sm:text-[11px]" /> },
        { key: "notes", label: "Notes", icon: <FaFileAlt className="text-[10px] sm:text-[11px]" /> },
        { key: "resources", label: "Resources", icon: <FaDownload className="text-[10px] sm:text-[11px]" /> },
        { key: "qa", label: "Q&A", icon: <FaQuestion className="text-[10px] sm:text-[11px]" /> },
    ];

    const videoUrls = {
        1: "https://www.w3schools.com/html/mov_bbb.mp4",
        2: "https://www.w3schools.com/html/mov_bbb.mp4",
        3: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        4: "https://media.w3.org/2010/05/sintel/trailer.mp4",
        5: "https://www.w3schools.com/html/mov_bbb.mp4",
        6: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    };

    const currentVideo = videoUrls[currentLessonId] || "https://www.w3schools.com/html/mov_bbb.mp4";

    return (
        <div className="min-h-screen bg-[#F6F7FB] flex flex-col">

            {/* ══ TOP NAV ══ */}
            <nav className="bg-white border-b border-gray-200 px-3 sm:px-5 py-2 sm:py-0 h-auto sm:h-18 flex items-center gap-2 sm:gap-4 sticky top-0 z-40 shadow-sm flex-wrap sm:flex-nowrap">
                <Link to={`/student/course-preview/${moduleId}`} className="flex items-center gap-1.5 text-gray-500 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1.5 rounded-lg bg-[#F6F7FB] border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all no-underline shrink-0">
                    <FaChevronLeft className="text-[8px] sm:text-[10px]" />
                    <span>Back</span>
                </Link>
                <div className="hidden sm:block w-px h-6 bg-gray-200" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{currentLesson.title}</p>
                    <p className="text-[9px] sm:text-[11px] text-gray-400 mt-0.5 truncate">{currentModule?.title}</p>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <div className="w-20 sm:w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-500 whitespace-nowrap">{completedCount}/{totalLessons}</span>
                </div>
                <button onClick={() => setSidebarOpen(p => !p)} className="lg:hidden flex items-center justify-center p-1.5 sm:p-2 bg-[#F6F7FB] border border-gray-200 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-400 transition-all">
                    {sidebarOpen ? <FaTimes className="text-xs sm:text-sm" /> : <FaBars className="text-xs sm:text-sm" />}
                </button>
            </nav>

            <div className="flex flex-1 overflow-hidden relative">
                {/* ══ MAIN CONTENT ══ */}
                <main className="flex-1 overflow-y-auto bg-[#F6F7FB] px-3 sm:px-6 py-4 sm:py-6">
                    <div className="bg-black rounded-xl overflow-hidden shadow-sm">
                        <video key={currentVideo} src={videoUrls[currentLessonId] || currentVideo} controls className="w-full h-auto max-h-[250px] sm:max-h-[400px] bg-black" />
                    </div>

                    <div className="px-2 sm:px-6 py-4 sm:py-6 pb-8 sm:pb-12">
                        {/* Lesson Header */}
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                    <span className="text-[9px] sm:text-[11px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                                        {currentModule?.title}
                                    </span>
                                    {currentLesson.free && (
                                        <span className="text-[9px] sm:text-[11px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-green-50 text-green-700 border border-green-200">FREE</span>
                                    )}
                                </div>
                                <h1 className="text-base sm:text-xl font-extrabold text-gray-900 leading-tight">{currentLesson.title}</h1>
                            </div>
                            {!completedLessons.has(currentLessonId) ? (
                                <button onClick={markComplete} className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-[0_2px_12px_rgba(124,58,237,0.3)] hover:bg-blue-700 transition-all">
                                    <FaCheck className="text-[8px] sm:text-[10px]" /> Mark Complete
                                </button>
                            ) : (
                                <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-green-50 text-green-700 text-xs sm:text-sm font-bold border border-green-200">
                                    <FaCheckCircle className="text-[10px] sm:text-xs" /> Completed
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 mb-5 sm:mb-6 overflow-x-auto">
                            {tabs.map(t => (
                                <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-5 py-2 sm:py-3 text-[11px] sm:text-sm font-semibold whitespace-nowrap border-none cursor-pointer transition-colors -mb-px ${activeTab === t.key ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 border-b-2 border-transparent hover:text-gray-700"}`}>
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>

                        {/* OVERVIEW */}
                        {activeTab === "overview" && (
                            <div className="space-y-4 sm:space-y-5">
                                <div className="p-3 sm:p-5 bg-white rounded-xl border border-gray-200">
                                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2">About this lesson</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{content.description}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3">What you'll learn</h3>
                                    <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
                                        {content.keyPoints.map((pt, i) => (
                                            <div key={i} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-xl border border-gray-200">
                                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <FaCheck className="text-blue-600 text-[6px] sm:text-[8px]" />
                                                </div>
                                                <p className="text-[11px] sm:text-sm text-gray-700 leading-snug">{pt}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Note CTA inside overview */}
                                <div
                                    onClick={() => setNotesOpen(true)}
                                    className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group">
                                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                        <FaStickyNote className="text-white text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs sm:text-sm font-bold text-blue-800">Take Notes on This Lesson</p>
                                        <p className="text-[10px] sm:text-xs text-blue-500 mt-0.5">Create colour-coded notes, format text and save your key takeaways</p>
                                    </div>
                                    <FaChevronRight className="text-blue-300 group-hover:text-blue-500 text-xs transition-colors flex-shrink-0" />
                                </div>
                            </div>
                        )}

                        {/* NOTES TAB */}
                        {activeTab === "notes" && (
                            <div className="space-y-4 sm:space-y-5">
                                <div className="p-3 sm:p-5 bg-white rounded-xl border border-gray-200 border-l-4 border-l-blue-500">
                                    <p className="text-[10px] sm:text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">Instructor Notes</p>
                                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{content.notes}</p>
                                </div>

                                {/* Open notes panel CTA */}
                                <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl text-white">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                            <FaPen className="text-white text-sm" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black mb-1">Your Personal Notes</p>
                                            <p className="text-xs text-blue-200 leading-relaxed mb-3">Use the Notes panel to write, format and organise your thoughts. Notes are saved per lesson and support bold, italic, highlights and lists.</p>
                                            <button onClick={() => setNotesOpen(true)}
                                                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-50 transition">
                                                <FaStickyNote className="text-sm" />
                                                {notesOpen ? "Notes Open ✓" : "Open Notes Panel"}
                                                {noteCount > 0 && <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{noteCount} saved</span>}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Simple inline notes textarea */}
                                <div>
                                    <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-2">Quick scratch pad</p>
                                    <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Jot something quickly here..." rows={4} className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none resize-none focus:border-blue-500 transition-colors" />
                                    <button className="mt-2 px-4 sm:px-5 py-1.5 sm:py-2.5 bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors">Save Notes</button>
                                </div>
                            </div>
                        )}

                        {/* RESOURCES */}
                        {activeTab === "resources" && (
                            <div>
                                <p className="text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4">Downloadable Resources</p>
                                <div className="space-y-2 sm:space-y-3">
                                    {content.resources.map((r, i) => (
                                        <div key={i} className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-all">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                                <FaFileAlt className="text-blue-500 text-xs sm:text-sm" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{r.name}</p>
                                                <p className="text-[9px] sm:text-[11px] text-gray-400 mt-0.5">{r.size} · {r.type.toUpperCase()}</p>
                                            </div>
                                            <button className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#F6F7FB] border border-gray-200 rounded-lg text-[10px] sm:text-xs font-semibold text-gray-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all flex-shrink-0">
                                                <FaDownload className="text-[8px] sm:text-[10px]" /> Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Q&A */}
                        {activeTab === "qa" && (
                            <div>
                                <p className="text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4">Questions & Answers</p>
                                <div className="space-y-3 mb-5 sm:mb-6">
                                    {qaData.map((qa, i) => (
                                        <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-blue-700 flex-shrink-0">{qa.user[0]}</div>
                                                <span className="text-[10px] sm:text-xs font-semibold text-gray-700">{qa.user}</span>
                                                <span className="text-[9px] sm:text-[11px] text-gray-400">{qa.time}</span>
                                            </div>
                                            <p className="text-[11px] sm:text-sm font-semibold text-gray-900 mb-2">{qa.q}</p>
                                            <div className="border-l-2 border-blue-500 pl-2 sm:pl-3">
                                                <p className="text-[11px] sm:text-sm text-gray-600 leading-relaxed">{qa.a}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask a question about this lesson..." rows={3} className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none resize-none focus:border-blue-500 transition-colors" />
                                    <button className="mt-2 px-4 sm:px-5 py-1.5 sm:py-2.5 bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors">Post Question</button>
                                </div>
                            </div>
                        )}

                        {/* Prev / Next Navigation */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-gray-200">
                            {prevLesson ? (
                                <Link to={`/student/module/${moduleId}/lesson/${prevLesson.id}`} className="w-full sm:w-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-400 transition-all group">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#F6F7FB] border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-blue-300">
                                        <FaChevronLeft className="text-gray-400 text-[8px] sm:text-[10px]" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Previous</p>
                                        <p className="text-[10px] sm:text-xs font-semibold text-gray-700 truncate">{prevLesson.title}</p>
                                    </div>
                                </Link>
                            ) : <div className="hidden sm:block" />}
                            {nextLesson ? (
                                <Link to={`/student/module/${moduleId}/lesson/${nextLesson.id}`} className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 rounded-xl shadow-[0_3px_14px_rgba(124,58,237,0.3)] hover:bg-blue-700 transition-all ml-auto">
                                    <div className="min-w-0 flex-1 text-right">
                                        <p className="text-[9px] sm:text-[10px] text-blue-300 uppercase tracking-wider mb-0.5">Next Lesson</p>
                                        <p className="text-[10px] sm:text-xs font-semibold text-white truncate">{nextLesson.title}</p>
                                    </div>
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <FaChevronRight className="text-white text-[8px] sm:text-[10px]" />
                                    </div>
                                </Link>
                            ) : (
                                <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-green-50 border border-green-200 rounded-xl ml-auto">
                                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                                    <span className="text-[11px] sm:text-sm font-bold text-green-700">Course Complete! 🎉</span>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Mobile overlay for sidebar */}
                {sidebarOpen && (<div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />)}

                {/* ══ RIGHT SIDEBAR ══ */}
                <aside className={`fixed top-14 right-0 h-[calc(100vh-56px)] z-30 w-80 sm:w-72 bg-white border-l border-gray-200 overflow-y-auto flex flex-col transition-transform duration-300 lg:static lg:top-auto lg:h-auto lg:translate-x-0 lg:flex-shrink-0 lg:z-auto ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
                    <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                        <p className="text-xs sm:text-sm font-extrabold text-gray-900 mb-2">Course Content</p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                            </div>
                            <span className="text-[10px] sm:text-xs font-bold text-blue-600 whitespace-nowrap">{progressPct}%</span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1.5">{completedCount} of {totalLessons} completed</p>
                    </div>
                    <div className="flex-1 bg-[#F6F7FB]">
                        {curriculum.map((mod) => (
                            <div key={mod.id} className="border-b border-gray-100">
                                <button onClick={() => toggleModule(mod.id)} className="w-full flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-none cursor-pointer text-left hover:bg-gray-50 transition-colors">
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs sm:text-sm flex-shrink-0" style={{ backgroundColor: mod.color + "18" }}>{mod.icon}</div>
                                    <span className="flex-1 text-[10px] sm:text-[11px] font-semibold text-gray-700 leading-snug text-left">{mod.title}</span>
                                    <FaChevronDown className={`text-gray-400 text-[8px] sm:text-[9px] flex-shrink-0 transition-transform duration-200 ${openModules[mod.id] ? "rotate-180" : ""}`} />
                                </button>
                                {openModules[mod.id] && (
                                    <div className="bg-[#F6F7FB]">
                                        {mod.lessons.map((lesson) => {
                                            const isActive = lesson.id === currentLessonId;
                                            const isDone = completedLessons.has(lesson.id);
                                            return (
                                                <Link key={lesson.id} to={`/student/module/${moduleId}/lesson/${lesson.id}`} onClick={() => setSidebarOpen(false)} className={`flex items-start gap-2 pl-8 sm:pl-12 pr-3 py-2 no-underline transition-colors duration-150 ${isActive ? "bg-blue-50 border-r-[3px] border-blue-600" : "border-r-[3px] border-transparent hover:bg-blue-50/50"}`}>
                                                    <div className="mt-0.5 flex-shrink-0"><LessonTypeIcon type={lesson.type} completed={isDone} free={lesson.free || isDone} /></div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-[10px] sm:text-[11px] leading-snug truncate mb-0.5 ${isActive ? "font-bold text-blue-700" : isDone ? "font-medium text-gray-400" : "font-medium text-gray-600"}`}>{lesson.title}</p>
                                                        <p className="text-[9px] sm:text-[10px] text-gray-400 flex items-center gap-1">{lesson.type === "video" && <FaClock className="text-[7px] sm:text-[8px]" />}{lesson.duration}</p>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ModuleView;
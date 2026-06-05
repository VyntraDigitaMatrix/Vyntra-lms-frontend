import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    FaPlay, FaLock, FaCheckCircle, FaChevronDown, FaChevronLeft,
    FaStar, FaClock, FaBook, FaDownload, FaQuestion,
    FaFileAlt, FaBars, FaTimes, FaCheck, FaChevronRight,
    FaBullhorn, FaSearch, FaInstagram, FaPenNib, FaEnvelope, FaChartLine
} from "react-icons/fa";

/* ── Data ── */
const curriculum = [
    {
        id: 1, title: "Introduction to Digital Marketing", color: "#7C3AED", icon: <FaBullhorn className="text-purple-600 text-l" />,
        lessons: [
            { id: 1, title: "What is Digital Marketing?", duration: "8:32", type: "video", free: true },
            { id: 2, title: "Traditional vs Digital Marketing", duration: "6:14", type: "video", free: true },
            { id: 3, title: "Key Channels Overview", duration: "9:45", type: "video", free: false },
            { id: 4, title: "Setting Marketing Goals", duration: "7:20", type: "video", free: false },
            { id: 5, title: "Module 1 Quiz", duration: "5 Qs", type: "quiz", free: false },
        ],
    },
    {
        id: 2, title: "Search Engine Optimization (SEO)", color: "#EA580C", icon: <FaSearch className="text-orange-600 text-lg" />,
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
        id: 3, title: "Social Media Marketing", color: "#059669", icon: <FaInstagram className="text-green-600 text-lg" />,
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
        id: 4, title: "Content Marketing", color: "#2563EB", icon: <FaPenNib className="text-blue-600 text-lg" />,
        lessons: [
            { id: 18, title: "Content Marketing Strategy", duration: "9:30", type: "video", free: false },
            { id: 19, title: "Blog Writing for SEO", duration: "11:15", type: "video", free: false },
            { id: 20, title: "Video Content Creation", duration: "13:40", type: "video", free: false },
            { id: 21, title: "Content Distribution", duration: "7:55", type: "video", free: false },
        ],
    },
    {
        id: 5, title: "Email Marketing", color: "#DB2777", icon: <FaEnvelope className="text-pink-600 text-lg" />,
        lessons: [
            { id: 22, title: "Email Marketing Fundamentals", duration: "8:20", type: "video", free: false },
            { id: 23, title: "Building Your Email List", duration: "10:35", type: "video", free: false },
            { id: 24, title: "Writing Effective Email Copy", duration: "12:10", type: "video", free: false },
            { id: 25, title: "Email Automation Workflows", duration: "9:45", type: "video", free: false },
        ],
    },
    {
        id: 6, title: "Google Ads & Analytics", color: "#D97706", icon: <FaChartLine className="text-amber-600 text-lg" />,
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

/* ── Lesson icon ── */
const LessonTypeIcon = ({ type, completed, free }) => {
    if (completed) return <FaCheckCircle className="text-green-500 w-3 h-3 flex-shrink-0" />;
    if (!free) return <FaLock className="text-gray-300 w-3 h-3 flex-shrink-0" />;
    if (type === "quiz") return <FaQuestion className="text-amber-400 w-3 h-3 flex-shrink-0" />;
    if (type === "resource") return <FaFileAlt className="text-blue-400 w-3 h-3 flex-shrink-0" />;
    return <FaPlay className="text-blue-600 w-3 h-3 flex-shrink-0" />;
};

/* ── Main Component ── */
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

    const toggleModule = (id) => setOpenModules(p => ({ ...p, [id]: !p[id] }));
    const markComplete = () => setCompletedLessons(p => { const n = new Set(p); n.add(currentLessonId); return n; });

    const totalLessons = allLessons.length;
    const completedCount = completedLessons.size;
    const progressPct = Math.round((completedCount / totalLessons) * 100);

    const tabs = [
        { key: "overview", label: "Overview", icon: <FaBook className="text-[11px]" /> },
        { key: "notes", label: "Notes", icon: <FaFileAlt className="text-[11px]" /> },
        { key: "resources", label: "Resources", icon: <FaDownload className="text-[11px]" /> },
        { key: "qa", label: "Q&A", icon: <FaQuestion className="text-[11px]" /> },
    ];

    const videoUrls = {
        1: "https://www.w3schools.com/html/mov_bbb.mp4",
        2: "https://www.w3schools.com/html/mov_bbb.mp4",
        3: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        4: "https://media.w3.org/2010/05/sintel/trailer.mp4",
        5: "https://www.w3schools.com/html/mov_bbb.mp4",
        6: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    };

    const currentVideo =
        videoUrls[currentLessonId] ||
        "https://www.w3schools.com/html/mov_bbb.mp4";

    return (
        <div className="min-h-screen bg-[#F6F7FB] flex flex-col">

            {/* ══ TOP NAV ══ */}
            <nav className="bg-white border-b border-gray-200 px-5 h-18 flex items-center gap-4 sticky top-0 z-40 shadow-sm">

                <Link
                    to={`/student/course-preview/${moduleId}`}
                    className="flex items-center gap-1.5 text-gray-500 text-sm font-semibold px-3 py-1.5 rounded-lg bg-[#F6F7FB] border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all no-underline"
                >
                    <FaChevronLeft className="text-[10px]" />
                    <span>Back to Course</span>
                </Link>

                <div className="w-px h-6 bg-gray-200" />

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{currentLesson.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{currentModule?.title}</p>
                </div>

                {/* Progress */}
                <div className="hidden md:flex items-center gap-2.5">
                    <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">{completedCount}/{totalLessons}</span>
                </div>

                {/* Mobile sidebar toggle */}
                <button
                    onClick={() => setSidebarOpen(p => !p)}
                    className="lg:hidden flex items-center justify-center p-2 bg-[#F6F7FB] border border-gray-200 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-400 transition-all"
                >
                    {sidebarOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
                </button>
            </nav>

            <div className="flex flex-1 overflow-hidden relative">

                {/* ══ MAIN CONTENT ══ */}
                <main className="flex-1 overflow-y-auto bg-[#F6F7FB] px-6 py-6">

                    {/* Video Player — kept dark intentionally (standard LMS pattern) */}

                    <div className="bg-black rounded-xl overflow-hidden shadow-sm">
                        <video
                            key={currentVideo}
                            src={videoUrls[currentLessonId] || currentVideo}
                            controls
                            className="w-full h-auto max-h-[400px] bg-black"
                        />
                    </div>

                    {/* ── Content Below Video ── */}
                    <div className="max-w-4xl mx-auto px-6 py-6 pb-12">

                        {/* Lesson Header */}
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                                        {currentModule?.icon} {currentModule?.title}
                                    </span>
                                    {currentLesson.free && (
                                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">FREE</span>
                                    )}
                                </div>
                                <h1 className="text-xl font-extrabold text-gray-900 leading-tight">{currentLesson.title}</h1>
                            </div>

                            {!completedLessons.has(currentLessonId) ? (
                                <button
                                    onClick={markComplete}
                                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-[0_2px_12px_rgba(124,58,237,0.3)] hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap border-none cursor-pointer"
                                >
                                    <FaCheck className="text-[10px]" /> Mark Complete
                                </button>
                            ) : (
                                <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 text-green-700 text-sm font-bold border border-green-200">
                                    <FaCheckCircle className="text-xs" /> Completed
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                            {tabs.map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key)}
                                    className={`flex items-center gap-1.5 px-5 py-3 text-sm font-semibold whitespace-nowrap border-none cursor-pointer transition-colors duration-150 -mb-px
                    ${activeTab === t.key
                                            ? "text-blue-600 border-b-2 border-blue-600 bg-transparent"
                                            : "text-gray-500 border-b-2 border-transparent bg-transparent hover:text-gray-700"
                                        }`}
                                >
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>

                        {/* ── OVERVIEW ── */}
                        {activeTab === "overview" && (
                            <div className="space-y-5">
                                <div className="p-5 bg-white rounded-xl border border-gray-200">
                                    <h3 className="text-sm font-bold text-gray-900 mb-2">About this lesson</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{content.description}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">What you'll learn</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {content.keyPoints.map((pt, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <FaCheck className="text-blue-600 text-[8px]" />
                                                </div>
                                                <p className="text-sm text-gray-700 leading-snug">{pt}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── NOTES ── */}
                        {activeTab === "notes" && (
                            <div className="space-y-5">
                                <div className="p-5 bg-white rounded-xl border border-gray-200 border-l-4 border-l-blue-500">
                                    <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">Instructor Notes</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{content.notes}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2">Your personal notes</p>
                                    <textarea
                                        value={noteText}
                                        onChange={e => setNoteText(e.target.value)}
                                        placeholder="Type your notes here..."
                                        rows={7}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none resize-none focus:border-blue-500 transition-colors"
                                    />
                                    <button className="mt-2.5 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors border-none cursor-pointer">
                                        Save Notes
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── RESOURCES ── */}
                        {activeTab === "resources" && (
                            <div>
                                <p className="text-sm font-bold text-gray-900 mb-4">Downloadable Resources</p>
                                <div className="space-y-3">
                                    {content.resources.map((r, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all group">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                                <FaFileAlt className="text-blue-500 text-sm" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{r.name}</p>
                                                <p className="text-[11px] text-gray-400 mt-0.5">{r.size} · {r.type.toUpperCase()}</p>
                                            </div>
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F6F7FB] border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all flex-shrink-0 cursor-pointer">
                                                <FaDownload className="text-[10px]" /> Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Q&A ── */}
                        {activeTab === "qa" && (
                            <div>
                                <p className="text-sm font-bold text-gray-900 mb-4">Questions & Answers</p>
                                <div className="space-y-3 mb-6">
                                    {qaData.map((qa, i) => (
                                        <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2.5 mb-2">
                                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-bold text-blue-700 flex-shrink-0">
                                                    {qa.user[0]}
                                                </div>
                                                <span className="text-xs font-semibold text-gray-700">{qa.user}</span>
                                                <span className="text-[11px] text-gray-400">{qa.time}</span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900 mb-2">{qa.q}</p>
                                            <div className="border-l-2 border-blue-500 pl-3">
                                                <p className="text-sm text-gray-600 leading-relaxed">{qa.a}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <textarea
                                        value={question}
                                        onChange={e => setQuestion(e.target.value)}
                                        placeholder="Ask a question about this lesson..."
                                        rows={3}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none resize-none focus:border-blue-500 transition-colors"
                                    />
                                    <button className="mt-2.5 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors border-none cursor-pointer">
                                        Post Question
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Prev / Next Navigation ── */}
                        <div className="flex items-center justify-between gap-3 mt-10 pt-6 border-t border-gray-200">
                            {prevLesson ? (
                                <Link
                                    to={`/student/module/${moduleId}/lesson/${prevLesson.id}`}
                                    className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl no-underline max-w-[46%] hover:border-blue-400 hover:shadow-sm transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[#F6F7FB] border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-blue-300 transition-colors">
                                        <FaChevronLeft className="text-gray-400 text-[10px]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Previous</p>
                                        <p className="text-xs font-semibold text-gray-700 truncate">{prevLesson.title}</p>
                                    </div>
                                </Link>
                            ) : <div />}

                            {nextLesson ? (
                                <Link
                                    to={`/student/module/${moduleId}/lesson/${nextLesson.id}`}
                                    className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-xl no-underline max-w-[46%] ml-auto shadow-[0_3px_14px_rgba(124,58,237,0.3)] hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                                >
                                    <div className="min-w-0 text-right">
                                        <p className="text-[10px] text-blue-300 uppercase tracking-wider mb-0.5">Next Lesson</p>
                                        <p className="text-xs font-semibold text-white truncate">{nextLesson.title}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <FaChevronRight className="text-white text-[10px]" />
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2.5 px-4 py-3 bg-green-50 border border-green-200 rounded-xl ml-auto">
                                    <FaStar className="text-yellow-400 text-sm" />
                                    <span className="text-sm font-bold text-green-700">Course Complete! 🎉</span>
                                </div>
                            )}
                        </div>

                    </div>
                </main>

                {/* ══ RIGHT SIDEBAR ══ */}
                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                <aside className={`
          fixed top-14 right-0 h-[calc(100vh-56px)] z-30 w-72
          bg-white border-l border-gray-200 overflow-y-auto flex flex-col
          transition-transform duration-300
          lg:static lg:top-auto lg:h-auto lg:translate-x-0 lg:flex-shrink-0 lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}>

                    {/* Sidebar Header */}
                    <div className="px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                        <p className="text-sm font-extrabold text-gray-900 mb-2.5">Course Content</p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-blue-600 whitespace-nowrap">{progressPct}%</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1.5">{completedCount} of {totalLessons} completed</p>
                    </div>

                    {/* Modules */}
                    <div className="flex-1 bg-[#F6F7FB]">
                        {curriculum.map((mod) => (
                            <div key={mod.id} className="border-b border-gray-100">

                                {/* Module Header */}
                                <button
                                    onClick={() => toggleModule(mod.id)}
                                    className="w-full flex items-center gap-2.5 px-4 py-3 bg-white border-none cursor-pointer text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
                                >
                                    <div
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                                        style={{ backgroundColor: mod.color + "18" }}
                                    >
                                        {mod.icon}
                                    </div>
                                    <span className="flex-1 text-[11px] font-semibold text-gray-700 leading-snug text-left">{mod.title}</span>
                                    <FaChevronDown
                                        className={`text-gray-400 text-[9px] flex-shrink-0 transition-transform duration-200 ${openModules[mod.id] ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {/* Lessons */}
                                {openModules[mod.id] && (
                                    <div className="bg-[#F6F7FB]">
                                        {mod.lessons.map((lesson) => {
                                            const isActive = lesson.id === currentLessonId;
                                            const isDone = completedLessons.has(lesson.id);
                                            return (
                                                <Link
                                                    key={lesson.id}
                                                    to={`/student/module/${moduleId}/lesson/${lesson.id}`}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={`flex items-start gap-2.5 pl-12 pr-3 py-2.5 no-underline transition-colors duration-150
                            ${isActive
                                                            ? "bg-blue-50 border-r-[3px] border-blue-600"
                                                            : "border-r-[3px] border-transparent hover:bg-blue-50/50"
                                                        }`}
                                                >
                                                    <div className="mt-0.5 flex-shrink-0">
                                                        <LessonTypeIcon type={lesson.type} completed={isDone} free={lesson.free || isDone} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-[11px] leading-snug truncate mb-0.5
                              ${isActive ? "font-bold text-blue-700" : isDone ? "font-medium text-gray-400" : "font-medium text-gray-600"}`}
                                                        >
                                                            {lesson.title}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                                            {lesson.type === "video" && <FaClock className="text-[8px]" />}
                                                            {lesson.duration}
                                                        </p>
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
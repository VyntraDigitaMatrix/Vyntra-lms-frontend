import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    FaPlay, FaLock, FaCheckCircle, FaChevronDown, FaChevronLeft,
    FaStar, FaClock, FaBook, FaDownload, FaQuestion,
    FaFileAlt, FaBars, FaTimes, FaCheck, FaChevronRight, FaVideo, FaFilePdf, FaLink
} from "react-icons/fa";
import { instructorModuleApi, instructorLessonApi } from "../auth/api";

/* ── Lesson icon ── */
const LessonTypeIcon = ({ type, completed }) => {
    if (completed) return <FaCheckCircle className="text-green-500 w-3 h-3 flex-shrink-0" />;
    if (type === "PDF") return <FaFilePdf className="text-amber-500 w-3 h-3 flex-shrink-0" />;
    if (type === "LIVE_CLASS") return <FaLink className="text-green-500 w-3 h-3 flex-shrink-0" />;
    return <FaPlay className="text-violet-600 w-3 h-3 flex-shrink-0" />;
};

const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube
    const ytRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[2].length === 11) {
        return {
            type: "youtube",
            url: `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=0&rel=0`
        };
    }
    
    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:video\/)?([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
        return {
            type: "vimeo",
            url: `https://player.vimeo.com/video/${vimeoMatch[1]}`
        };
    }
    
    return {
        type: "direct",
        url: url
    };
};

const qaData = [
    { q: "How long does it take to see results from digital marketing?", a: "Results vary by channel. SEO typically takes 3–6 months, while paid ads can show results immediately.", user: "Arjun S.", time: "2 days ago" },
    { q: "What tools should I start with as a beginner?", a: "Start with Google Analytics, Google Search Console, and a free social media scheduler like Buffer.", user: "Priya M.", time: "1 week ago" },
];

/* ── Main Component ── */
const LessonView = () => {
    const { courseId, lessonId } = useParams();
    const [curriculum, setCurriculum] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [openModules, setOpenModules] = useState({});
    const [activeTab, setActiveTab] = useState("overview");
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [noteText, setNoteText] = useState("");
    const [question, setQuestion] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fetch modules and lessons
    useEffect(() => {
        let isMounted = true;
        
        const fetchCurriculum = async () => {
            setLoading(true);
            setError("");
            try {
                // Fetch modules
                const modulesRes = await instructorModuleApi.getCourseModules(courseId, 0, 100);
                const fetchedModules = modulesRes.data?.data?.content || [];
                fetchedModules.sort((a, b) => a.sortOrder - b.sortOrder);
                
                // Fetch lessons for all modules in parallel
                const curriculumWithLessons = await Promise.all(
                    fetchedModules.map(async (mod) => {
                        try {
                            const lessonsRes = await instructorLessonApi.getModuleLessons(mod.id, 0, 100);
                            const lessons = lessonsRes.data?.data?.content || [];
                            lessons.sort((a, b) => a.sortOrder - b.sortOrder);
                            return { ...mod, lessons };
                        } catch (err) {
                            console.error(`Error fetching lessons for module ${mod.id}:`, err);
                            return { ...mod, lessons: [] };
                        }
                    })
                );
                
                if (isMounted) {
                    setCurriculum(curriculumWithLessons);
                }
            } catch (err) {
                console.error("Error loading curriculum:", err);
                if (isMounted) {
                    setError("Failed to load course contents from server.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (courseId) {
            fetchCurriculum();
        }
        
        return () => {
            isMounted = false;
        };
    }, [courseId]);

    // Derived values
    const allLessons = curriculum.flatMap(m => m.lessons || []);
    
    // Find current lesson. Fallback to first lesson if not found.
    const currentLesson = allLessons.find(l => String(l.id) === String(lessonId)) || allLessons[0];
    
    // Index mapping for prev / next navigation
    const currentIndex = allLessons.findIndex(l => String(l.id) === String(currentLesson?.id));
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    // Module index logic for colors & icons
    const getModuleIndex = (modId) => {
        return curriculum.findIndex(m => m.id === modId);
    };

    const colors = ["#7C3AED", "#EA580C", "#059669", "#2563EB", "#DB2777", "#D97706"];
    const icons = ["📚", "🔍", "📱", "✏️", "✉️", "📊"];
    
    const currentModule = curriculum.find(m => (m.lessons || []).some(l => String(l.id) === String(currentLesson?.id)));
    const currentModuleIdx = currentModule ? getModuleIndex(currentModule.id) : 0;
    const currentModuleColor = colors[currentModuleIdx % colors.length];
    const currentModuleIcon = icons[currentModuleIdx % icons.length];

    // Auto-open current module accordion on load/selection
    useEffect(() => {
        if (currentModule?.id) {
            setOpenModules(prev => ({ ...prev, [currentModule.id]: true }));
        }
    }, [currentModule?.id]);

    const toggleModule = (id) => setOpenModules(p => ({ ...p, [id]: !p[id] }));
    const markComplete = () => {
        if (currentLesson?.id) {
            setCompletedLessons(p => { 
                const n = new Set(p); 
                n.add(currentLesson.id); 
                return n; 
            });
        }
    };

    const totalLessons = allLessons.length;
    const completedCount = completedLessons.size;
    const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const tabs = [
        { key: "overview", label: "Overview", icon: <FaBook className="text-[11px]" /> },
        { key: "notes", label: "Notes", icon: <FaFileAlt className="text-[11px]" /> },
        { key: "resources", label: "Resources", icon: <FaDownload className="text-[11px]" /> },
        { key: "qa", label: "Q&A", icon: <FaQuestion className="text-[11px]" /> },
    ];

    // Compute active content properties dynamically
    const content = {
        description: currentLesson?.description || "This lesson covers important concepts. Watch the video/review resources carefully and take notes.",
        keyPoints: currentLesson?.content && currentLesson.content.includes('\n')
            ? currentLesson.content.split('\n').map(l => l.trim()).filter(l => l.length > 0)
            : [
                "Core concepts explained with real-world examples",
                "Step-by-step implementation guide",
                "Industry best practices and tips",
                "Common mistakes to avoid"
            ],
        resources: currentLesson?.resourceUrl
            ? [
                { 
                    name: currentLesson.resourceUrl.substring(currentLesson.resourceUrl.lastIndexOf('/') + 1) || "Lesson File Resource", 
                    size: "Attachment Link", 
                    type: currentLesson.lessonType || "Resource",
                    url: currentLesson.resourceUrl
                }
            ]
            : [],
        notes: currentLesson?.content || "Take your time with this lesson. Practice the concepts with your own projects for best results."
    };

    // Parse the video URL
    const videoEmbed = getEmbedUrl(currentLesson?.videoUrl);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center justify-center p-5">
                <div className="w-10 h-10 border-4 border-t-violet-600 border-gray-200 rounded-full animate-spin mb-4"></div>
                <span className="text-sm text-gray-500 font-semibold">Loading lesson view...</span>
            </div>
        );
    }

    if (error && curriculum.length === 0) {
        return (
            <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center justify-center p-5">
                <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100 max-w-md text-center">
                    <p className="text-sm font-bold mb-2">⚠️ Error Loading Lesson</p>
                    <p className="text-xs text-gray-600 mb-4">{error}</p>
                    <Link
                        to={`/instructor/course-preview/${courseId}`}
                        className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition no-underline"
                    >
                        Back to Course Preview
                    </Link>
                </div>
            </div>
        );
    }

    if (allLessons.length === 0) {
        return (
            <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center justify-center p-5">
                <div className="bg-amber-50 text-amber-800 p-6 rounded-2xl border border-amber-100 max-w-md text-center">
                    <p className="text-sm font-bold mb-2">📚 No Lessons Found</p>
                    <p className="text-xs text-gray-600 mb-4">There are no lessons created for this course yet.</p>
                    <Link
                        to={`/instructor/course-preview/${courseId}`}
                        className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition no-underline"
                    >
                        Back to Course Preview
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F6F7FB] flex flex-col">

            {/* ══ TOP NAV ══ */}
            <nav className="bg-white border-b border-gray-200 px-5 h-18 flex items-center gap-4 sticky top-0 z-40 shadow-sm">
                <Link
                    to={`/instructor/course-preview/${courseId}`}
                    className="flex items-center gap-1.5 text-gray-500 text-sm font-semibold px-3 py-1.5 rounded-lg bg-[#F6F7FB] border border-gray-200 hover:border-violet-500 hover:text-violet-600 transition-all no-underline"
                >
                    <FaChevronLeft className="text-[10px]" />
                    <span>Back to Course</span>
                </Link>

                <div className="w-px h-6 bg-gray-200" />

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{currentLesson?.title || "Loading Lesson..."}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{currentModule?.title || "Module Details"}</p>
                </div>

                {/* Progress */}
                <div className="hidden md:flex items-center gap-2.5">
                    <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-violet-600 rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">{completedCount}/{totalLessons}</span>
                </div>

                {/* Mobile sidebar toggle */}
                <button
                    onClick={() => setSidebarOpen(p => !p)}
                    className="lg:hidden flex items-center justify-center p-2 bg-[#F6F7FB] border border-gray-200 rounded-lg text-gray-500 hover:text-violet-600 hover:border-violet-400 transition-all"
                >
                    {sidebarOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
                </button>
            </nav>

            <div className="flex flex-1 overflow-hidden relative">

                {/* ══ MAIN CONTENT ══ */}
                <main className="flex-1 overflow-y-auto bg-[#F6F7FB] px-6 py-6">

                    {/* Professional Video Player Container */}
                    <div className="max-w-4xl mx-auto">
                        {videoEmbed ? (
                            videoEmbed.type === "youtube" || videoEmbed.type === "vimeo" ? (
                                <div className="bg-black rounded-xl overflow-hidden shadow-sm aspect-video w-full max-h-[480px]">
                                    <iframe
                                        key={videoEmbed.url}
                                        src={videoEmbed.url}
                                        title={currentLesson?.title || "Lesson Video"}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                </div>
                            ) : (
                                <div className="bg-black rounded-xl overflow-hidden shadow-sm w-full max-h-[480px] flex items-center justify-center">
                                    <video
                                        key={videoEmbed.url}
                                        src={videoEmbed.url}
                                        controls
                                        className="w-full h-auto max-h-[480px] bg-black"
                                    />
                                </div>
                            )
                        ) : (
                            /* Premium Dark Placeholder for non-video lessons */
                            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-sm aspect-video w-full max-h-[480px] flex flex-col items-center justify-center p-6 text-center text-white border border-slate-800">
                                {currentLesson?.lessonType === "PDF" ? (
                                    <>
                                        <FaFilePdf className="text-amber-500 w-14 h-14 mb-4 animate-pulse" />
                                        <h3 className="text-lg font-bold">PDF Reading Assignment</h3>
                                        <p className="text-sm text-slate-400 mt-2 max-w-md">This lesson is a document study/reading session. Access the attachment below in the Resources tab.</p>
                                        {currentLesson?.resourceUrl && (
                                            <a
                                                href={currentLesson.resourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-all no-underline"
                                            >
                                                <FaDownload /> View / Download PDF
                                            </a>
                                        )}
                                    </>
                                ) : currentLesson?.lessonType === "LIVE_CLASS" ? (
                                    <>
                                        <FaLink className="text-green-500 w-14 h-14 mb-4" />
                                        <h3 className="text-lg font-bold">Scheduled Live Class</h3>
                                        <p className="text-sm text-slate-400 mt-2 max-w-md">This lesson takes place live. Join using the access link below.</p>
                                        {currentLesson?.resourceUrl && (
                                            <a
                                                href={currentLesson.resourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-slate-950 text-xs font-bold rounded-lg transition-all no-underline"
                                            >
                                                <FaPlay /> Join Live Session
                                            </a>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <FaFileAlt className="text-violet-500 w-14 h-14 mb-4" />
                                        <h3 className="text-lg font-bold">Text-based Lesson</h3>
                                        <p className="text-sm text-slate-400 mt-2 max-w-md">This lesson is a written guide. Please read the lesson description and overview contents below.</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Content Below Video ── */}
                    <div className="max-w-4xl mx-auto px-6 py-6 pb-12">

                        {/* Lesson Header */}
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                                        {currentModuleIcon} {currentModule?.title || "Module"}
                                    </span>
                                    {currentLesson?.previewAllowed && (
                                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">FREE PREVIEW</span>
                                    )}
                                </div>
                                <h1 className="text-xl font-extrabold text-gray-900 leading-tight">{currentLesson?.title}</h1>
                            </div>

                            {currentLesson?.id && (
                                !completedLessons.has(currentLesson.id) ? (
                                    <button
                                        onClick={markComplete}
                                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold shadow-[0_2px_12px_rgba(124,58,237,0.3)] hover:bg-violet-700 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap border-none cursor-pointer"
                                    >
                                        <FaCheck className="text-[10px]" /> Mark Complete
                                    </button>
                                ) : (
                                    <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 text-green-700 text-sm font-bold border border-green-200">
                                        <FaCheckCircle className="text-xs" /> Completed
                                    </div>
                                )
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
                                        ? "text-violet-600 border-b-2 border-violet-600 bg-transparent"
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
                                <style>{`
                                    .rich-content-view ul {
                                        list-style-type: disc;
                                        padding-left: 1.5rem;
                                        margin: 0.5rem 0;
                                    }
                                    .rich-content-view ol {
                                        list-style-type: decimal;
                                        padding-left: 1.5rem;
                                        margin: 0.5rem 0;
                                    }
                                    .rich-content-view a {
                                        color: #7c3aed;
                                        text-decoration: underline;
                                    }
                                    .rich-content-view strong, .rich-content-view b {
                                        font-weight: bold;
                                    }
                                    .rich-content-view em, .rich-content-view i {
                                        font-style: italic;
                                    }
                                    .rich-content-view u {
                                        text-decoration: underline;
                                    }
                                `}</style>
                                <div className="p-5 bg-white rounded-xl border border-gray-200">
                                    <h3 className="text-sm font-bold text-gray-900 mb-2">About this lesson</h3>
                                    <div 
                                        className="text-sm text-gray-600 leading-relaxed rich-content-view"
                                        dangerouslySetInnerHTML={{ __html: content.description }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">What you'll learn</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {content.keyPoints.map((pt, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200">
                                                <div className="w-5 h-5 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <FaCheck className="text-violet-600 text-[8px]" />
                                                </div>
                                                <div 
                                                    className="text-sm text-gray-700 leading-snug rich-content-view"
                                                    dangerouslySetInnerHTML={{ __html: pt }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── NOTES ── */}
                        {activeTab === "notes" && (
                            <div className="space-y-5">
                                <div className="p-5 bg-white rounded-xl border border-gray-200 border-l-4 border-l-violet-500">
                                    <p className="text-[11px] font-bold text-violet-600 uppercase tracking-wider mb-2">Instructor Notes</p>
                                    <div 
                                        className="text-sm text-gray-700 leading-relaxed rich-content-view"
                                        dangerouslySetInnerHTML={{ __html: content.notes }}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-2">Your personal notes</p>
                                    <textarea
                                        value={noteText}
                                        onChange={e => setNoteText(e.target.value)}
                                        placeholder="Type your notes here..."
                                        rows={7}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none resize-none focus:border-violet-500 transition-colors"
                                    />
                                    <button className="mt-2.5 px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-lg hover:bg-violet-700 transition-colors border-none cursor-pointer">
                                        Save Notes
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── RESOURCES ── */}
                        {activeTab === "resources" && (
                            <div>
                                <p className="text-sm font-bold text-gray-900 mb-4">Downloadable Resources</p>
                                {content.resources.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic py-2">No resource files attached to this lesson.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {content.resources.map((r, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-violet-200 hover:shadow-sm transition-all group">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <FaFileAlt className="text-blue-500 text-sm" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{r.name}</p>
                                                    <p className="text-[11px] text-gray-400 mt-0.5">{r.size} · {r.type.toUpperCase()}</p>
                                                </div>
                                                <a 
                                                    href={r.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F6F7FB] border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-violet-50 hover:border-violet-400 hover:text-violet-700 transition-all flex-shrink-0 cursor-pointer no-underline"
                                                >
                                                    <FaDownload className="text-[10px]" /> Download
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                                <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-[11px] font-bold text-violet-700 flex-shrink-0">
                                                    {qa.user[0]}
                                                </div>
                                                <span className="text-xs font-semibold text-gray-700">{qa.user}</span>
                                                <span className="text-[11px] text-gray-400">{qa.time}</span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900 mb-2">{qa.q}</p>
                                            <div className="border-l-2 border-violet-500 pl-3">
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
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none resize-none focus:border-violet-500 transition-colors"
                                    />
                                    <button className="mt-2.5 px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-lg hover:bg-violet-700 transition-colors border-none cursor-pointer">
                                        Post Question
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Prev / Next Navigation ── */}
                        <div className="flex items-center justify-between gap-3 mt-10 pt-6 border-t border-gray-200">
                            {prevLesson ? (
                                <Link
                                    to={`/instructor/course/${courseId}/lesson/${prevLesson.id}`}
                                    className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl no-underline max-w-[46%] hover:border-violet-400 hover:shadow-sm transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[#F6F7FB] border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-violet-300 transition-colors">
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
                                    to={`/instructor/course/${courseId}/lesson/${nextLesson.id}`}
                                    className="flex items-center gap-3 px-4 py-3 bg-violet-600 rounded-xl no-underline max-w-[46%] ml-auto shadow-[0_3px_14px_rgba(124,58,237,0.3)] hover:bg-violet-700 hover:-translate-y-0.5 transition-all"
                                >
                                    <div className="min-w-0 text-right">
                                        <p className="text-[10px] text-violet-300 uppercase tracking-wider mb-0.5">Next Lesson</p>
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
                                    className="h-full bg-violet-600 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-violet-600 whitespace-nowrap">{progressPct}%</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1.5">{completedCount} of {totalLessons} completed</p>
                    </div>

                    {/* Modules */}
                    <div className="flex-1 bg-[#F6F7FB]">
                        {curriculum.map((mod, idx) => {
                            const modColor = colors[idx % colors.length];
                            const modIcon = icons[idx % icons.length];
                            const lessons = mod.lessons || [];
                            
                            return (
                                <div key={mod.id} className="border-b border-gray-100">

                                    {/* Module Header */}
                                    <button
                                        onClick={() => toggleModule(mod.id)}
                                        className="w-full flex items-center gap-2.5 px-4 py-3 bg-white border-none cursor-pointer text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
                                    >
                                        <div
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                                            style={{ backgroundColor: modColor + "18" }}
                                        >
                                            {modIcon}
                                        </div>
                                        <span className="flex-1 text-[11px] font-semibold text-gray-700 leading-snug text-left">{mod.title}</span>
                                        <FaChevronDown
                                            className={`text-gray-400 text-[9px] flex-shrink-0 transition-transform duration-200 ${openModules[mod.id] ? "rotate-180" : ""}`}
                                        />
                                    </button>

                                    {/* Lessons */}
                                    {openModules[mod.id] && (
                                        <div className="bg-[#F6F7FB]">
                                            {lessons.length === 0 ? (
                                                <p className="text-[10px] text-gray-400 pl-12 py-2 italic">No lessons</p>
                                            ) : (
                                                lessons.map((lesson) => {
                                                    const isActive = String(lesson.id) === String(currentLesson?.id);
                                                    const isDone = completedLessons.has(lesson.id);
                                                    return (
                                                        <Link
                                                            key={lesson.id}
                                                            to={`/instructor/course/${courseId}/lesson/${lesson.id}`}
                                                            onClick={() => setSidebarOpen(false)}
                                                            className={`flex items-start gap-2.5 pl-12 pr-3 py-2.5 no-underline transition-colors duration-150
                                                            ${isActive
                                                                ? "bg-violet-50 border-r-[3px] border-violet-600"
                                                                : "border-r-[3px] border-transparent hover:bg-violet-50/50"
                                                            }`}
                                                        >
                                                            <div className="mt-0.5 flex-shrink-0">
                                                                <LessonTypeIcon type={lesson.lessonType} completed={isDone} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-[11px] leading-snug truncate mb-0.5
                                                                ${isActive ? "font-bold text-violet-700" : isDone ? "font-medium text-gray-400" : "font-medium text-gray-600"}`}
                                                                >
                                                                    {lesson.title}
                                                                </p>
                                                                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                                                    {lesson.lessonType === "VIDEO" && <FaClock className="text-[8px]" />}
                                                                    {lesson.durationInMinutes ? `${lesson.durationInMinutes} mins` : (lesson.lessonType || "Read")}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default LessonView;
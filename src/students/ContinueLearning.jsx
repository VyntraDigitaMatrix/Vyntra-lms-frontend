import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { studentLearningApi } from "./auth/api";

import {
    FaStar, FaUser, FaBook, FaClock, FaTrophy,
    FaCheckCircle, FaPlay,
    FaChevronDown,
    FaChevronUp,
    FaPlayCircle,
    FaGlobe
} from "react-icons/fa";
import { AiOutlinePlaySquare } from "react-icons/ai";

/* ── helpers ── */
const getLessonTypeIcon = (type) => {
    if (!type) return "▶";
    const t = type.toLowerCase();
    if (t === "video") return "▶";
    if (t === "text" || t === "article") return "📄";
    if (t === "quiz") return "❓";
    if (t === "assignment") return "📝";
    return "▶";
};

/* ══════════════════════════════════════════════
   MODULE ACCORDION ITEM
   ══════════════════════════════════════════════ */
const ModuleAccordionItem = ({
    mod,
    courseId,
    navigate,
    activeLesson,
    setActiveLesson,
    onFetchLessons,
}) => {
    const [open, setOpen] = useState(false);
    const [lessons, setLessons] = useState(mod.lessons || []);
    const [lessonsLoading, setLessonsLoading] = useState(false);
    const [lessonsLoaded, setLessonsLoaded] = useState(
        (mod.lessons || []).length > 0
    );

    const handleToggle = async () => {
        const next = !open;
        setOpen(next);

        // Lazy-load lessons only on first expand if not already loaded
        if (next && !lessonsLoaded) {
            setLessonsLoading(true);
            try {
                const fetched = await onFetchLessons(mod.id);
                setLessons(fetched);
                setLessonsLoaded(true);
            } catch (_) {
                // keep empty
            } finally {
                setLessonsLoading(false);
            }
        }
    };

    const handleLessonClick = (lesson) => {
        const mId = mod.slug ?? mod.moduleId ?? mod.id;
        const lId = lesson.slug ?? lesson.lessonId ?? lesson.id;
        const lessonKey = `${mId}-${lId}`;
        setActiveLesson(lessonKey);
        navigate(`/student/course/${courseId}/module/${mId}/lesson/${lId}`);
    };

    return (
        <div
            className={`border rounded-xl overflow-hidden transition-all duration-200 ${open ? "border-blue-200 shadow-sm" : "border-gray-100"
                } bg-white`}
        >
            <button
                onClick={handleToggle}
                className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 hover:bg-gray-50 transition text-left"
            >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 bg-blue-50">
                    <FaPlayCircle className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-gray-800 block truncate">
                        {mod.title}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-400">
                        {lessons.length} Lessons
                    </span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-600 px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0">
                    Enrolled
                </span>
                <span className="ml-1 sm:ml-2 text-gray-400 flex-shrink-0">
                    {open ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                </span>
            </button>

            {open && (
                <div className="border-t border-gray-100">
                    {lessonsLoading ? (
                        <div className="px-5 py-4 space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-7 bg-gray-100 rounded-lg animate-pulse"
                                />
                            ))}
                        </div>
                    ) : lessons.length === 0 ? (
                        <div className="px-5 py-3 text-xs text-gray-400">
                            No lessons in this module.
                        </div>
                    ) : (
                        lessons.map((lesson, li) => {
                            const lessonKey = `${mod.id}-${lesson.id}`;
                            const isActive = activeLesson === lessonKey;
                            const duration = lesson.durationInMinutes
                                ? `${lesson.durationInMinutes} min`
                                : "";
                            return (
                                <div
                                    key={lesson.id}
                                    onClick={() => handleLessonClick(lesson)}
                                    className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 cursor-pointer transition-colors group
                    ${isActive
                                            ? "bg-blue-50 border-l-2 border-blue-500"
                                            : "hover:bg-blue-50"
                                        }
                    ${li !== lessons.length - 1 ? "border-b border-gray-50" : ""}`}
                                >
                                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-xs">
                                        {getLessonTypeIcon(lesson.lessonType)}
                                    </div>
                                    <span
                                        className={`flex-1 text-[11px] sm:text-xs truncate font-medium ${isActive
                                            ? "text-blue-700 font-semibold"
                                            : "text-gray-700 group-hover:text-blue-700"
                                            }`}
                                    >
                                        {li + 1}. {lesson.title}
                                    </span>
                                    {lesson.previewAllowed && (
                                        <span className="text-[9px] font-bold bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded flex-shrink-0">
                                            Preview
                                        </span>
                                    )}
                                    {duration && (
                                        <span
                                            className={`text-[10px] flex-shrink-0 ml-1 ${isActive ? "text-blue-500" : "text-gray-400"
                                                }`}
                                        >
                                            {duration}
                                        </span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

/* ══════════════════════════════════════════════
   CURRICULUM SECTION
   ══════════════════════════════════════════════ */
const CurriculumSection = ({ moduleList, courseId, navigate, onFetchLessons }) => {
    const [activeLesson, setActiveLesson] = useState(null);

    const totalLessons = moduleList.reduce(
        (s, m) => s + (m.lessons || []).length,
        0
    );

    return (
        <div>
            <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 mb-4">
                <FaPlayCircle
                    className="text-emerald-500 mt-0.5 flex-shrink-0"
                    size={13}
                />
                <p className="text-[11px] sm:text-xs text-emerald-700">
                    <span className="font-bold">Enrolled: </span>
                    You have full access to all {moduleList.length} modules
                    {totalLessons > 0 && ` and ${totalLessons} lessons`}.
                </p>
            </div>
            <div className="space-y-2">
                {moduleList.map((mod) => (
                    <ModuleAccordionItem
                        key={mod.id}
                        mod={mod}
                        courseId={courseId}
                        navigate={navigate}
                        activeLesson={activeLesson}
                        setActiveLesson={setActiveLesson}
                        onFetchLessons={onFetchLessons}
                    />
                ))}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
const ContinueLearning = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();

    /* ── Course detail ── */
    const [courseDetails, setCourseDetails] = useState(null);
    const [courseLoading, setCourseLoading] = useState(true);

    /* ── Modules ── */
    const [courseModules, setCourseModules] = useState([]);
    const [modulesLoading, setModulesLoading] = useState(true);
    const [modulesError, setModulesError] = useState("");

    /* ── UI ── */
    const [activeTab, setActiveTab] = useState("overview");
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([
        {
            name: "Rajesh Kumar",
            initial: "R",
            rating: 5,
            time: "2 weeks ago",
            text: "Excellent course! Very detailed and practical examples.",
        },
        {
            name: "Priya Sharma",
            initial: "P",
            rating: 4,
            time: "1 month ago",
            text: "Great content, very helpful for my career.",
        },
        {
            name: "Amit Patel",
            initial: "A",
            rating: 5,
            time: "2 months ago",
            text: "Best course I've taken! Highly recommend.",
        },
    ]);
    const [newReview, setNewReview] = useState({ name: "", rating: 5, text: "" });

    /* ══════════════════════════════════════════
       FETCH MODULES  (with nested lessons)
       GET /api/v1/student/my-courses/{courseId}/modules
    ══════════════════════════════════════════ */
    const fetchModules = useCallback(async (targetSlug) => {
        if (!targetSlug) return;
        setModulesLoading(true);
        setModulesError("");
        try {
            const res = await studentLearningApi.getCourseModules(targetSlug);
            // API returns { data: { data: [...] } }  OR  { data: [...] }
            const modules =
                res.data?.data ||
                res.data ||
                [];
            setCourseModules(Array.isArray(modules) ? modules : []);
        } catch (err) {
            console.error("fetchModules error:", err);
            setModulesError("Failed to load course content.");
        } finally {
            setModulesLoading(false);
        }
    }, []);

    /* ══════════════════════════════════════════
       FETCH COURSE DETAIL
       Uses getMyCourseById — falls back to list search
    ══════════════════════════════════════════ */
    const fetchCourseDetails = useCallback(async () => {
        if (!courseId) return;
        setCourseLoading(true);
        try {
            // Primary: dedicated endpoint
            const res = await studentLearningApi.getCourseBySlug(courseId);
            const data = res.data?.data || res.data || null;
            setCourseDetails(data);
            if (data?.slug) fetchModules(data.slug);
            else fetchModules(courseId);
        } catch (err) {
            // Fallback: search inside paginated list
            try {
                const listRes = await studentLearningApi.getMyEnrolledCourses(0, 100);
                const content =
                    listRes.data?.data?.content ||
                    listRes.data?.content ||
                    [];
                const found = content.find(
                    (c) =>
                        String(c.courseId) === String(courseId) ||
                        String(c.id) === String(courseId) ||
                        String(c.slug) === String(courseId)
                );
                setCourseDetails(found || null);
                if (found?.slug) fetchModules(found.slug);
                else fetchModules(courseId);
            } catch (fallbackErr) {
                console.error("fetchCourseDetails fallback error:", fallbackErr);
            }
        } finally {
            setCourseLoading(false);
        }
    }, [courseId, fetchModules]);

    /* ══════════════════════════════════════════
       FETCH LESSONS for a module (lazy, on expand)
       GET /api/v1/student/my-courses/{courseId}/modules/{moduleId}/lessons
    ══════════════════════════════════════════ */
    const fetchLessonsForModule = useCallback(
        async (moduleId) => {
            const res = await studentLearningApi.getModuleLessons(moduleId);
            return (
                res.data?.data?.content ||
                res.data?.content ||
                res.data?.data ||
                res.data ||
                []
            );
        },
        []
    );

    useEffect(() => {
        fetchCourseDetails();
    }, [fetchCourseDetails]);

    /* ── Derived ── */
    const totalLessons = courseModules.reduce(
        (s, m) => s + (m.lessons || []).length,
        0
    );

    const handleRatingSubmit = (r) => {
        alert(`Thank you for rating ${r} stars!`);
    };

    const handleReviewSubmit = () => {
        if (!newReview.name || !newReview.text) return;
        setReviews([
            {
                name: newReview.name,
                initial: newReview.name.charAt(0).toUpperCase(),
                rating: newReview.rating,
                time: "Just now",
                text: newReview.text,
            },
            ...reviews,
        ]);
        setNewReview({ name: "", rating: 5, text: "" });
    };

    const tabs = [
        { key: "overview", label: "Overview" },
        { key: "curriculum", label: `Curriculum (${courseModules.length})` },
        { key: "instructor", label: "Instructor" },
        { key: "reviews", label: `Reviews (${courseDetails?.reviews || 0})` },
        { key: "faqs", label: "FAQs" },
    ];

    const totalDuration = courseModules.reduce((total, module) => {
        const moduleDuration = (module.lessons || []).reduce(
            (sum, lesson) => sum + (lesson.durationInMinutes || 0),
            0
        );
        return total + moduleDuration;
    }, 0);

    /* ══════════════════════════════════════════
       RENDER
    ══════════════════════════════════════════ */
    return (
        <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-5">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrumb */}
                <div className="mb-4 sm:mb-5">
                    <p className="text-xs sm:text-sm text-gray-400">
                        <Link
                            to="/student/courses"
                            className="hover:text-blue-600 transition-colors"
                        >
                            My Courses
                        </Link>
                        <span className="text-gray-300"> &gt; </span>
                        <span className="text-gray-700 font-medium text-xs sm:text-sm">
                            {courseDetails?.courseTitle || courseDetails?.title || "Loading…"}
                        </span>
                    </p>
                </div>

                {/* Hero Section */}
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Thumbnail */}
                    <div className="relative w-full md:w-64 lg:w-72 h-48 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
                        {courseDetails?.thumbnailUrl && (
                            <img
                                src={courseDetails.thumbnailUrl}
                                alt={courseDetails?.courseTitle || courseDetails?.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <FaPlay className="text-white w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                            ✓ Enrolled
                        </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-3 sm:space-y-4">
                        {courseLoading ? (
                            <div className="space-y-2">
                                <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-2/3" />
                                <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-full" />
                                <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-3/4" />
                            </div>
                        ) : (
                            <>
                                <div>
                                    <span className="inline-block text-[10px] sm:text-xs font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full mb-2">
                                        {courseDetails?.badge || "Enrolled"}
                                    </span>
                                    <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight mb-1 sm:mb-2">
                                        {courseDetails?.courseTitle || courseDetails?.title}
                                    </h1>
                                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                                        {courseDetails?.courseDescription || courseDetails?.shortDescription}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <FaStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                                        <span className="font-bold text-gray-900">
                                            {courseDetails?.averageRating || courseDetails?.rating || 0}
                                        </span>
                                        <span className="text-gray-400 text-[10px] sm:text-xs">
                                            ({courseDetails?.totalRatings ?? courseDetails?.reviews ?? courseDetails?.reviewCount ?? 0} ratings)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <FaUser className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="text-[11px] sm:text-xs">
                                            {courseDetails?.totalEnrollments ?? courseDetails?.students ?? courseDetails?.studentCount ?? 0} Students
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                        <span className="text-[11px] sm:text-xs font-medium">
                                            {courseDetails?.level || "Beginner"} Level
                                        </span>
                                    </div>
                                    {courseDetails?.language && (
                                        <div className="flex items-center gap-1.5 text-gray-500">
                                            <FaGlobe className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="text-[11px] sm:text-xs uppercase font-medium">
                                                {courseDetails.language}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {[
                                        { Icon: FaBook, text: `${totalLessons} Lessons` },
                                        { Icon: AiOutlinePlaySquare, text: `${courseModules.length} Modules` },
                                        { Icon: FaClock, text: totalDuration > 0 ? `${totalDuration} min` : "N/A" },
                                        { Icon: FaTrophy, text: "Certificate" },
                                    ].map(({ Icon, text }, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-1 sm:gap-1.5 border border-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-gray-600 bg-white"
                                        >
                                            <Icon className="text-gray-400" size={12} />
                                            {text}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-5 sm:mb-6 overflow-x-auto">
                    <div className="flex gap-1 sm:gap-2 min-w-max">
                        {tabs.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`relative px-3 sm:px-5 pb-2 sm:pb-3 pt-1 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === key
                                    ? "text-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {label}
                                {activeTab === key && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Panels */}
                <div>
                    {/* ── OVERVIEW ── */}
                    {activeTab === "overview" && (
                        <div className="space-y-5 sm:space-y-6">
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
                                    About this course
                                </h3>
                                <div
                                    className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-5 prose prose-sm max-w-none prose-blue"
                                    dangerouslySetInnerHTML={{ __html: courseDetails?.desc || courseDetails?.courseDescription || courseDetails?.description || "" }}
                                />
                            </div>

                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                                    Course Curriculum
                                </h3>
                                {modulesLoading ? (
                                    <div className="space-y-2">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="h-14 bg-white rounded-xl border border-gray-100 animate-pulse"
                                            />
                                        ))}
                                    </div>
                                ) : modulesError ? (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                                        {modulesError}
                                    </div>
                                ) : (
                                    <CurriculumSection
                                        moduleList={courseModules}
                                        courseId={courseId}
                                        navigate={navigate}
                                        onFetchLessons={fetchLessonsForModule}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── CURRICULUM ── */}
                    {activeTab === "curriculum" && (
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                                Course Curriculum
                            </h3>
                            {modulesLoading ? (
                                <div className="space-y-2">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-14 bg-white rounded-xl border border-gray-100 animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : modulesError ? (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-center justify-between">
                                    <span>{modulesError}</span>
                                    <button
                                        onClick={fetchModules}
                                        className="text-red-600 font-bold underline"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                <CurriculumSection
                                    moduleList={courseModules}
                                    courseId={courseId}
                                    navigate={navigate}
                                    onFetchLessons={fetchLessonsForModule}
                                />
                            )}
                        </div>
                    )}

                    {/* ── INSTRUCTOR ── */}
                    {activeTab === "instructor" && (
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                                About the Instructor
                            </h3>
                            {courseDetails?.instructors?.length > 0 ? (
                                <div className="space-y-4">
                                    {courseDetails.instructors.map((instructor, idx) => (
                                        <div key={instructor.instructorId || idx} className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-blue-50 rounded-xl sm:rounded-2xl">
                                            {instructor.profileImage ? (
                                                <img
                                                    src={instructor.profileImage}
                                                    alt={instructor.fullName}
                                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0 mx-auto sm:mx-0 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0 mx-auto sm:mx-0 shadow-sm">
                                                    {instructor.fullName?.charAt(0) || "I"}
                                                </div>
                                            )}
                                            <div className="text-center sm:text-left">
                                                <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                                                    {instructor.fullName}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-blue-600 mb-2 sm:mb-3">
                                                    {instructor.headline}
                                                </p>
                                                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-gray-500 mb-2 sm:mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <FaStar className="w-3 h-3 text-yellow-400" />
                                                        {instructor.averageRating || 0} Rating
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FaUser className="w-3 h-3" />
                                                        {instructor.totalStudents || 0} Students
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FaBook className="w-3 h-3" />
                                                        {instructor.totalCourses || 0} Courses
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                                    {instructor.shortBio}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400">No instructor info available.</p>
                            )}
                        </div>
                    )}

                    {/* ── REVIEWS ── */}
                    {activeTab === "reviews" && (
                        <div>
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-4 sm:p-5 bg-amber-50 border border-amber-100 rounded-xl sm:rounded-2xl mb-5 sm:mb-6">
                                <div className="text-center">
                                    <div className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-none">
                                        {courseDetails?.rating || 0}
                                    </div>
                                    <div className="flex justify-center mt-1 sm:mt-2 mb-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <FaStar key={s} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                                        ))}
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-gray-400">Course Rating</div>
                                </div>
                                <div className="flex-1 space-y-1.5 w-full">
                                    {[5, 4, 3, 2, 1].map((s) => (
                                        <div key={s} className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-yellow-400 rounded-full"
                                                    style={{
                                                        width:
                                                            s === 5
                                                                ? "70%"
                                                                : s === 4
                                                                    ? "20%"
                                                                    : s === 3
                                                                        ? "6%"
                                                                        : "3%",
                                                    }}
                                                />
                                            </div>
                                            <div className="flex gap-0.5 w-12 sm:w-16 justify-end">
                                                {Array(s)
                                                    .fill(0)
                                                    .map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400"
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rate this course */}
                            <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-5 sm:mb-6">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                                    Rate this Course
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-5">
                                    How would you rate your learning experience?
                                </p>
                                <div className="flex items-center gap-1 sm:gap-2 mb-4 sm:mb-5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <FaStar
                                                size={24}
                                                className={`sm:text-3xl ${star <= rating ? "text-yellow-400" : "text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleRatingSubmit(rating)}
                                    disabled={!rating}
                                    className="bg-blue-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm hover:bg-blue-700 disabled:bg-gray-300"
                                >
                                    Submit Rating
                                </button>
                            </div>

                            {/* Review list */}
                            <div className="divide-y divide-gray-100">
                                {reviews.map((r, i) => (
                                    <div key={i} className="py-4 sm:py-5">
                                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs sm:text-sm flex-shrink-0">
                                                {r.initial}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-xs sm:text-sm text-gray-900">
                                                    {r.name}
                                                </div>
                                                <div className="flex items-center gap-1 sm:gap-2 mt-0.5">
                                                    <div className="flex gap-0.5">
                                                        {Array(5)
                                                            .fill(0)
                                                            .map((_, j) => (
                                                                <FaStar
                                                                    key={j}
                                                                    className={`w-2 h-2 sm:w-3 sm:h-3 ${j < r.rating ? "text-yellow-400" : "text-gray-200"
                                                                        }`}
                                                                />
                                                            ))}
                                                    </div>
                                                    <span className="text-[10px] sm:text-xs text-gray-400">
                                                        {r.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-600 pl-10 sm:pl-12">
                                            {r.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── FAQs ── */}
                    {activeTab === "faqs" && (
                        <div className="space-y-2 sm:space-y-3">
                            {(courseDetails?.faqs || []).length === 0 ? (
                                <p className="text-xs text-gray-400">No FAQs available.</p>
                            ) : (
                                (courseDetails?.faqs || []).map((faq, i) => (
                                    <div
                                        key={i}
                                        className="border border-gray-200 rounded-xl p-3 sm:p-4 bg-white"
                                    >
                                        <div className="font-semibold text-xs sm:text-sm text-gray-900 mb-1.5">
                                            {faq.q || faq.question}
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                            {faq.a || faq.answer}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContinueLearning;
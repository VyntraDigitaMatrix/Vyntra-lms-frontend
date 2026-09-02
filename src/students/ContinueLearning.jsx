import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { studentLearningApi } from "./auth/api";
import { useAuth } from "./auth/AuthContext";

import {
    FaStar, FaUser, FaBook, FaClock, FaTrophy,
    FaCheckCircle, FaPlay,
    FaChevronDown,
    FaChevronUp,
    FaPlayCircle,
    FaGlobe
} from "react-icons/fa";
import { AiOutlinePlaySquare } from "react-icons/ai";
import InstructorRating from "./components/InstructorRating";

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
const ModuleAccordionItem = ({ mod, navigate, activeLesson, setActiveLesson, courseSlug }) => {
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
                const mId = mod.slug ?? mod.moduleId ?? mod.id;
                const fetched = await onFetchLessons(mId);
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
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 hover:bg-gray-50 transition text-left"
            >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 bg-blue-50">
                    <FaPlayCircle className="text-[#043573]" />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-gray-800 block truncate">
                        {mod.title}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-400">
                        {mod.totalLessons ?? lessons.length} Lessons
                        {mod.totalDurationInMinutes ? ` · ${mod.totalDurationInMinutes} min` : ""}
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
                    {lessons.length === 0 ? (
                        <div className="px-5 py-3 text-xs text-gray-400">
                            No lessons in this module.
                        </div>
                    ) : (
                        lessons.map((lesson, li) => {
                            const lessonKey = `${mod.moduleId || mod.slug || mod.id}-${lesson.lessonId || lesson.slug || lesson.id}`;
                            const isActive = activeLesson === lessonKey;
                            const duration = lesson.durationInMinutes
                                ? `${lesson.durationInMinutes} min`
                                : "";
                            return (
                                <div
                                    key={lesson.slug || lesson.lessonId || lesson.id || li}
                                    onClick={() => handleLessonClick(lesson)}
                                    className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 cursor-pointer transition-colors group
                    ${isActive
                                            ? "bg-blue-50 border-l-2 border-[#043573]"
                                            : "hover:bg-blue-50"
                                        }
                    ${li !== lessons.length - 1 ? "border-b border-gray-50" : ""}`}
                                >
                                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-xs">
                                        {getLessonTypeIcon(lesson.lessonType)}
                                    </div>
                                    <span
                                        className={`flex-1 text-[11px] sm:text-xs truncate font-medium ${isActive
                                            ? "text-[#043573]/90 font-semibold"
                                            : "text-gray-700 group-hover:text-[#043573]"
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
const CurriculumSection = ({ moduleList, navigate, totalLessons, courseSlug }) => {
    const [activeLesson, setActiveLesson] = useState(null);

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
                {moduleList.map((mod, idx) => (
                    <ModuleAccordionItem
                        key={mod.slug || mod.moduleId || mod.id || idx}
                        mod={mod}
                        navigate={navigate}
                        activeLesson={activeLesson}
                        setActiveLesson={setActiveLesson}
                        courseSlug={courseSlug}
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
    const { student } = useAuth();

    /* ── Course detail ── */
    const [courseDetails, setCourseDetails] = useState(null);
    const [courseLoading, setCourseLoading] = useState(true);
    const [courseError, setCourseError] = useState("");

    /* ── UI ── */
    const [activeTab, setActiveTab] = useState("overview");
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 0, text: "" });
    const [hasReviewed, setHasReviewed] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");

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
            // API returns { data: { data: [...] } } OR { data: { content: [...] } }
            const modules =
                res.data?.data?.content ||
                res.data?.content ||
                res.data?.data ||
                res.data ||
                [];
            setCourseModules(Array.isArray(modules) ? modules : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingReviews(false);
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
            if (data?.modules && Array.isArray(data.modules) && data.modules.length > 0) {
                setCourseModules(data.modules);
                setModulesLoading(false);
            } else if (data?.slug) {
                fetchModules(data.slug);
            } else {
                fetchModules(courseId);
            }
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
                if (found?.modules && Array.isArray(found.modules) && found.modules.length > 0) {
                    setCourseModules(found.modules);
                    setModulesLoading(false);
                } else if (found?.slug) {
                    fetchModules(found.slug);
                } else {
                    fetchModules(courseId);
                }
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

    /* ── Derived values ── */
    const courseModules = courseDetails?.modules || [];
    const instructor = courseDetails?.instructors?.[0];

    useEffect(() => {
        const slug = courseDetails?.slug;
        if (!slug) return;

        const loadReviews = async () => {
            let fetchedList = [];
            try {
                const res = await studentLearningApi.getCourseReviews(slug);
                fetchedList = res.data?.data?.content || res.data?.content || [];
                setReviews(fetchedList);
            } catch (err) { console.error(err); }

            try {
                const myRatingRes = await studentLearningApi.getMyRating(slug);
                const data = myRatingRes.data?.data;
                if (data && data.rating) {
                    setHasReviewed(true);
                    setNewReview({ rating: data.rating, text: data.review || data.comment || data.reviewText || data.text || "" });
                    setRating(data.rating);
                    
                    // Make sure our review is in the list, or update it if it's there
                    setReviews(prev => {
                        const existsIndex = prev.findIndex(r => r.id === data.id || r.studentId === data.studentId);
                        if (existsIndex >= 0) {
                            const newList = [...prev];
                            newList[existsIndex] = { ...newList[existsIndex], ...data };
                            return newList;
                        } else {
                            return [{ ...data, studentName: data.studentName || student?.fullName || "You" }, ...prev];
                        }
                    });
                }
            } catch (err) { }
        };
        loadReviews();
    }, [courseDetails?.slug]);

    const handleRatingSubmit = async () => {
        const slug = courseDetails?.slug;
        if (!slug || rating === 0) return;
        setIsSubmittingReview(true);
        setSubmitError("");
        setSubmitSuccess("");
        try {
            const payload = { rating, review: newReview.text };
            let updatedReview;
            if (hasReviewed) {
                const updateRes = await studentLearningApi.updateCourseReview(slug, payload);
                updatedReview = updateRes.data?.data;
            } else {
                const submitRes = await studentLearningApi.submitCourseReview(slug, payload);
                updatedReview = submitRes.data?.data;
                setHasReviewed(true);
            }
            setSubmitSuccess("Review submitted successfully!");
            
            // Re-fetch the public reviews just in case
            const res = await studentLearningApi.getCourseReviews(slug);
            let list = res.data?.data?.content || res.data?.content || [];
            
            // If our updated review is not in the list (e.g., it's pending), or we just want to ensure it has the latest text
            if (updatedReview) {
                const existsIndex = list.findIndex(r => r.id === updatedReview.id || r.studentId === updatedReview.studentId);
                if (existsIndex >= 0) {
                    list[existsIndex] = { ...list[existsIndex], ...updatedReview };
                } else {
                    list = [updatedReview, ...list];
                }
            }
            setReviews(list);
            setTimeout(() => setSubmitSuccess(""), 3000);
        } catch (err) {
            setSubmitError("Failed to submit review.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const tabs = [
        { key: "overview", label: "Overview" },
        { key: "curriculum", label: `Curriculum (${totalModules})` },
        { key: "instructor", label: "Instructor" },
        { key: "reviews", label: `Reviews (${displayReviewCount})` },
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
        <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrumb */}
                <div className="mb-4 sm:mb-5">
                    <p className="text-xs sm:text-sm text-gray-400">
                        <Link to="/student/courses" className="hover:text-[#043573] transition-colors">
                            My Courses
                        </Link>
                        <span className="text-gray-300"> &gt; </span>
                        <span className="text-gray-700 font-medium text-xs sm:text-sm">
                            {courseDetails?.title || "Loading…"}
                        </span>
                    </p>
                </div>

                {/* Error state */}
                {courseError && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-5 flex items-center justify-between">
                        <p className="text-xs text-red-600 font-semibold">{courseError}</p>
                        <button onClick={fetchCourseDetails} className="text-xs text-red-600 font-bold underline">
                            Retry
                        </button>
                    </div>
                )}

                {/* Hero Section */}
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="relative w-full md:w-64 lg:w-72 h-48 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
                        {courseDetails?.thumbnailUrl && (
                            <img
                                src={courseDetails.thumbnailUrl}
                                alt={courseDetails?.title}
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
                                    <span className="inline-block text-[10px] sm:text-xs font-bold bg-blue-100 text-[#043573] px-2 py-0.5 rounded-full mb-2">
                                        {courseDetails?.free ? "Free" : courseDetails?.pricingType || "Premium"}
                                    </span>
                                    <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight mb-1 sm:mb-2">
                                        {courseDetails?.title}
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
                                        { Icon: AiOutlinePlaySquare, text: `${totalModules} Modules` },
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
                                className={`relative px-3 sm:px-5 pb-2 sm:pb-3 pt-1 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === key ? "text-[#043573]" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {label}
                                {activeTab === key && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#043573] rounded-full" />
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
                                {courseLoading ? (
                                    <div className="space-y-2">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="h-14 bg-white rounded-xl border border-gray-100 animate-pulse" />
                                        ))}
                                    </div>
                                ) : (
                                    <CurriculumSection
                                        moduleList={courseModules}
                                        navigate={navigate}
                                        totalLessons={totalLessons}
                                        courseSlug={courseSlug}
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
                            {courseLoading ? (
                                <div className="space-y-2">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="h-14 bg-white rounded-xl border border-gray-100 animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <CurriculumSection
                                    moduleList={courseModules}
                                    navigate={navigate}
                                    totalLessons={totalLessons}
                                    courseSlug={courseSlug}
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
                                    {instructors.map((instructorItem, idx) => (
                                        <div key={instructorItem.instructorId || idx} className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-blue-50 rounded-xl sm:rounded-2xl">
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#043573] flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0 mx-auto sm:mx-0 overflow-hidden shadow-sm">
                                                {instructorItem.profileImage ? (
                                                    <img
                                                        src={instructorItem.profileImage}
                                                        alt={instructorItem.fullName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    instructorItem.fullName?.charAt(0) || "I"
                                                )}
                                            </div>
                                            <div className="text-center sm:text-left flex-1">
                                                <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                                                    {instructorItem.fullName}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-[#043573] mb-2 sm:mb-3">
                                                    {instructorItem.headline}
                                                </p>
                                                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-gray-500 mb-2 sm:mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <FaStar className="w-3 h-3 text-yellow-400" />
                                                        {instructorItem.averageRating || 0} Rating
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FaUser className="w-3 h-3" />
                                                        {instructorItem.totalStudents || 0} Students
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FaBook className="w-3 h-3" />
                                                        {instructorItem.totalCourses || instructorItem.courses?.length || 0} Courses
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                                                    {instructorItem.shortBio}
                                                </p>

                                                {instructorItem.courses && instructorItem.courses.length > 0 && (
                                                    <div className="mb-4">
                                                        <h5 className="text-xs font-bold text-gray-800 mb-2">Other Courses</h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            {instructorItem.courses.map((c) => (
                                                                <Link
                                                                    key={c.courseId || c.id}
                                                                    to={`/student/continue-learning/${c.slug || c.courseId || c.id}`}
                                                                    className="text-[10px] sm:text-xs bg-white border border-blue-100 text-[#043573] px-2 py-1 rounded-md hover:bg-blue-50 transition"
                                                                >
                                                                    {c.title}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <InstructorRating
                                                    courseSlug={courseSlug}
                                                    instructorId={instructorItem.instructorId}
                                                />
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
                        <div className="max-w-4xl">
                            {/* ── SUMMARY CARD ── */}
                            <div className="flex flex-col md:flex-row items-center p-6 md:p-8 bg-[#f8faff] rounded-2xl border border-blue-50 mb-8 shadow-sm">
                                <div className="text-center md:w-1/3 mb-6 md:mb-0">
                                    <div className="text-5xl md:text-6xl font-black text-slate-800 leading-none mb-2">
                                        {Number(courseDetails?.rating || 0).toFixed(1)}
                                    </div>
                                    <div className="flex justify-center mb-2">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <FaStar key={s} className={`w-4 h-4 md:w-5 md:h-5 ${s <= Math.round(courseDetails?.rating || 0) ? "text-[#ffb800]" : "text-gray-300"}`} />
                                        ))}
                                    </div>
                                    <div className="text-sm font-medium text-slate-500">{reviews.length} ratings</div>
                                </div>
                                <div className="flex-1 w-full space-y-2.5 px-4 md:px-8 border-t md:border-t-0 md:border-l border-gray-200/60 pt-6 md:pt-0">
                                    {[5, 4, 3, 2, 1].map((s) => {
                                        const count = reviews.filter(r => Math.round(r.rating) === s).length;
                                        const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                                        return (
                                            <div key={s} className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 w-8 text-sm font-semibold text-slate-600">
                                                    {s} <FaStar className="w-3 h-3 text-[#ffb800]" />
                                                </div>
                                                <div className="flex-1 h-2.5 bg-slate-200/70 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#ffb800] rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <div className="w-10 text-right text-xs font-semibold text-slate-400">
                                                    {percentage}%
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ── RATE COURSE CARD ── */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10 relative">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                                <div className="p-6 md:p-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex gap-4 items-start">
                                            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                                                <FaStar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800 mb-1">
                                                    {hasReviewed ? "Update Your Review" : "Write a Review"}
                                                </h3>
                                                <p className="text-sm text-slate-500">Help the community with your honest feedback</p>
                                            </div>
                                        </div>
                                        {hasReviewed && (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
                                                <FaCheckCircle className="w-3 h-3" /> Reviewed
                                            </div>
                                        )}
                                    </div>

                                    {submitError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">{submitError}</div>}
                                    {submitSuccess && <div className="p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg mb-4">{submitSuccess}</div>}

                                    <div className="bg-slate-50 rounded-xl p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-100">
                                        <div className="text-sm font-semibold text-slate-700">How would you rate this course?</div>
                                        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => {
                                                            setRating(star);
                                                            setNewReview(prev => ({ ...prev, rating: star }));
                                                        }}
                                                        className="transition-transform hover:scale-110 focus:outline-none"
                                                    >
                                                        <FaStar className={`w-6 h-6 ${star <= rating ? "text-[#ffb800]" : "text-slate-200"}`} />
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="text-sm font-bold text-slate-800 border-l border-slate-200 pl-4 flex items-center gap-1.5">
                                                {rating || 0} <span className="text-slate-400 font-normal">/ 5.0</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm font-semibold text-slate-700">Write your review <span className="text-slate-400 font-normal">(optional)</span></label>
                                            <span className="text-xs text-slate-400 font-medium">{newReview.text.length}/500</span>
                                        </div>
                                        <textarea
                                            value={newReview.text}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 500) setNewReview(prev => ({ ...prev, text: e.target.value }));
                                            }}
                                            placeholder="Tell us about your experience..."
                                            className="w-full text-sm p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none min-h-[120px]"
                                        />
                                    </div>

                                    <button
                                        onClick={handleRatingSubmit}
                                        disabled={!rating || isSubmittingReview}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50 transition shadow-sm shadow-blue-600/20 flex items-center gap-2"
                                    >
                                        <FaCheckCircle /> {isSubmittingReview ? "Submitting..." : hasReviewed ? "Update Review" : "Submit Review"}
                                    </button>
                                </div>
                            </div>

                            {/* ── STUDENT REVIEWS ── */}
                            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                                <h3 className="text-xl font-black text-slate-800">Student Reviews</h3>
                                <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{reviews.length}</span>
                            </div>

                            <div className="space-y-4">
                                {reviews.length === 0 ? (
                                    <p className="text-sm text-slate-500 py-8 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">No reviews yet. Be the first to review!</p>
                                ) : (
                                    reviews.map((r, i) => {
                                        const isMyReview = r.studentId === student?.id || r.studentName === student?.fullName;
                                        return (
                                            <div key={r.id || i} className="bg-[#f8faff] rounded-2xl p-5 md:p-6 border border-blue-50">
                                                <div className="flex items-start gap-4 mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0 uppercase shadow-sm">
                                                        {r.studentName?.charAt(0) || "S"}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <div className="font-bold text-slate-800">{r.studentName}</div>
                                                            {isMyReview && (
                                                                <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                                                    <FaStar className="w-2.5 h-2.5" /> Your Review
                                                                </span>
                                                            )}
                                                            {r.approved === false && (
                                                                <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pending Approval
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex gap-0.5">
                                                                {Array(5).fill(0).map((_, j) => (
                                                                    <FaStar key={j} className={`w-3 h-3 ${j < r.rating ? "text-[#ffb800]" : "text-slate-200"}`} />
                                                                ))}
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-600">{Number(r.rating || 0).toFixed(1)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {(r.review || r.comment || r.reviewText || r.text) && (
                                                    <p className="text-sm text-slate-600 leading-relaxed pl-14 mb-2">
                                                        {r.review || r.comment || r.reviewText || r.text}
                                                    </p>
                                                )}
                                                <div className="text-[11px] font-medium text-slate-400 pl-14">
                                                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Just now"}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}


                    {/* ── FAQs ── */}
                    {activeTab === "faqs" && (
                        <div className="space-y-2 sm:space-y-3">
                            {(courseDetails?.faqs || []).length === 0 ? (
                                <p className="text-xs text-gray-400">No FAQs available.</p>
                            ) : (
                                (courseDetails?.faqs || [])
                                    .slice()
                                    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                                    .map((faq) => (
                                        <div key={faq.id} className="border border-gray-200 rounded-xl p-3 sm:p-4 bg-white">
                                            <div className="font-semibold text-xs sm:text-sm text-gray-900 mb-1.5">
                                                {faq.question}
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
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
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
    const lessons = mod.lessons || [];

    const handleLessonClick = (lesson) => {
        const mSlug = mod.slug || mod.moduleId || mod.id;
        const lSlug = lesson.slug || lesson.lessonId || lesson.id;
        const lessonKey = `${mod.moduleId || mod.slug || mod.id}-${lesson.lessonId || lesson.slug || lesson.id}`;
        setActiveLesson(lessonKey);
        navigate(`/student/course/${courseSlug}/module/${mSlug}/lesson/${lSlug}`);
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
    const params = useParams();
    const courseSlug = params.courseSlug || params.courseId;
    const { student } = useAuth();

    /* ── Course detail ── */
    const [courseDetails, setCourseDetails] = useState(null);
    const [courseLoading, setCourseLoading] = useState(true);
    const [courseError, setCourseError] = useState("");

    /* ── UI ── */
    const [activeTab, setActiveTab] = useState("overview");

    /* ── Reviews / Ratings ── */
    const [reviews, setReviews] = useState([]);
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState("");
    const [myRating, setMyRating] = useState(null);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const fetchCourseDetails = useCallback(async () => {
        if (!courseSlug) return;

        setCourseLoading(true);
        setCourseError("");

        try {
            const res = await studentLearningApi.getCourseBySlug(courseSlug);
            const data = res.data?.data || res.data;
            setCourseDetails(data || null);
        } catch (err) {
            console.error(err);
            try {
                const listRes = await studentLearningApi.getMyEnrolledCourses(0, 100);
                const content = listRes.data?.data?.content || listRes.data?.content || [];
                const found = content.find(
                    (c) =>
                        String(c.courseId) === String(courseSlug) ||
                        String(c.id) === String(courseSlug) ||
                        String(c.slug) === String(courseSlug)
                );
                setCourseDetails(found || null);
            } catch (fallbackErr) {
                console.error("fetchCourseDetails fallback error:", fallbackErr);
                setCourseError("Failed to load this course. Please try again.");
            }
        } finally {
            setCourseLoading(false);
        }
    }, [courseSlug]);

    const fetchCourseReviews = useCallback(async () => {
        if (!courseSlug) return;

        try {
            setLoadingReviews(true);
            const res = await studentLearningApi.getCourseRatings(courseSlug);
            const content = res.data?.data?.content || res.data?.content || [];
            setReviews(content);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingReviews(false);
        }
    }, [courseSlug]);

    const fetchMyRating = useCallback(async () => {
        if (!courseSlug) return;

        try {
            const res = await studentLearningApi.getMyCourseRating(courseSlug);
            const data = res.data?.data || res.data;
            if (data && (data.rating || data.review)) {
                setMyRating(data);
                setUserRating(data.rating || 0);
                setUserReview(data.review || data.comment || data.text || "");
            } else {
                setMyRating(null);
            }
        } catch (err) {
            setMyRating(null);
        }
    }, [courseSlug]);

    useEffect(() => {
        fetchCourseDetails();
        fetchCourseReviews();
        fetchMyRating();
    }, [fetchCourseDetails, fetchCourseReviews, fetchMyRating]);

    /* ── Derived values ── */
    const courseModules = courseDetails?.modules || [];
    const instructors = courseDetails?.instructors || (courseDetails?.instructor ? [courseDetails.instructor] : []);
    const instructor = instructors[0];

    const totalLessons =
        courseDetails?.totalLessons ??
        courseModules.reduce((s, m) => s + (m.lessons || []).length, 0);

    const totalDuration =
        courseDetails?.totalDurationInMinutes ??
        courseModules.reduce((total, module) => {
            const moduleDuration = (module.lessons || []).reduce(
                (sum, lesson) => sum + (lesson.durationInMinutes || 0),
                0
            );
            return total + moduleDuration;
        }, 0);

    const totalModules = courseDetails?.totalModules ?? courseModules.length;

    const otherReviews = reviews.filter((r) => r.id !== myRating?.id && r.studentId !== myRating?.studentId);

    const visibleRatings = [...(myRating ? [myRating] : []), ...otherReviews];
    const localReviewCount = visibleRatings.length;
    const localAverageRating = localReviewCount
        ? visibleRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / localReviewCount
        : 0;

    const displayReviewCount = Math.max(courseDetails?.totalRatings || courseDetails?.reviews || 0, localReviewCount);
    const displayAverageRating =
        courseDetails?.averageRating && courseDetails.averageRating > 0
            ? courseDetails.averageRating
            : (courseDetails?.rating || localAverageRating);

    /* POST/PUT /api/student/course-ratings/{courseSlug} */
    const handleRatingSubmit = async () => {
        if (!userRating) return;

        setIsSubmittingReview(true);

        try {
            const payload = {
                rating: userRating,
                review: userReview,
            };

            const res = myRating
                ? await studentLearningApi.updateCourseRating(courseSlug, payload)
                : await studentLearningApi.submitCourseRating(courseSlug, payload);

            const savedRating = res.data?.data || res.data;

            setMyRating(savedRating);

            setReviews((prev) => {
                const exists = prev.some((item) => (savedRating?.id && item.id === savedRating.id) || (savedRating?.studentId && item.studentId === savedRating.studentId));
                return exists
                    ? prev.map((item) => ((savedRating?.id && item.id === savedRating.id) || (savedRating?.studentId && item.studentId === savedRating.studentId) ? { ...item, ...savedRating } : item))
                    : [savedRating, ...prev];
            });

            fetchCourseDetails();

            alert(myRating ? "Review updated successfully" : "Review submitted successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to submit review");
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

    const stripHtml = (html) => {
        if (!html) return "";
        return html.replace(/<[^>]*>/g, "");
    };

    const formatDate = (d) =>
        d
            ? new Date(d).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
            : "";

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
                                        {courseDetails?.shortDescription || courseDetails?.courseDescription || courseDetails?.description}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <FaStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                                        <span className="font-bold text-gray-900">
                                            {displayAverageRating ? Number(displayAverageRating).toFixed(1) : "0.0"}
                                        </span>
                                        <span className="text-gray-400 text-[10px] sm:text-xs">
                                            ({displayReviewCount} ratings)
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
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-5">
                                    {stripHtml(courseDetails?.courseDescription || courseDetails?.description || courseDetails?.desc)}
                                </p>
                                {(courseDetails?.tags || []).length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                                        {courseDetails.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="text-[10px] sm:text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
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
                            {instructors.length > 0 ? (
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
                        <div className="space-y-8">
                            {/* Rating Summary Card */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50/70 rounded-2xl p-6 sm:p-8 border border-blue-100/50 shadow-lg">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>

                                <div className="relative flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <div className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-none tracking-tight">
                                                {displayAverageRating ? Number(displayAverageRating).toFixed(1) : "0.0"}
                                            </div>
                                            <div className="flex justify-center mt-2 gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <FaStar
                                                        key={s}
                                                        className={`w-5 h-5 transition-all duration-300 ${s <= Math.round(displayAverageRating || 0)
                                                            ? "text-yellow-400 drop-shadow-sm"
                                                            : "text-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1.5">
                                                <span className="font-semibold text-gray-700">{displayReviewCount}</span> ratings
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating Distribution */}
                                    <div className="flex-1 w-full max-w-sm">
                                        <div className="space-y-2">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const countAtStar = visibleRatings.filter((r) => Math.round(r.rating) === star).length;
                                                const percentage = localReviewCount
                                                    ? Math.round((countAtStar / localReviewCount) * 100)
                                                    : 0;
                                                return (
                                                    <div key={star} className="flex items-center gap-3 group">
                                                        <span className="text-sm font-medium text-gray-600 w-6 text-right">{star}</span>
                                                        <FaStar className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-1000 group-hover:scale-x-105"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-400 w-12 text-right">{percentage}%</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rate This Course */}
                            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                                <div className="relative px-6 sm:px-8 pt-8 pb-6 border-b border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-gradient-to-br from-[#043573]/90 to-[#043573] rounded-xl shadow-lg shadow-blue-500/20">
                                            <FaStar className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {myRating ? "Update Your Review" : "Share Your Experience"}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {myRating
                                                    ? "Help the community with your honest feedback"
                                                    : "Your feedback helps other students make better decisions"}
                                            </p>
                                        </div>
                                        {myRating && (
                                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full border border-emerald-200 shadow-sm">
                                                <FaCheckCircle className="w-3.5 h-3.5" />
                                                Reviewed
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8">
                                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-xl p-6 mb-6 border border-gray-100">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-700 mb-3">
                                                    How would you rate this course?
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            onClick={() => setUserRating(star)}
                                                            className="group relative transition-all duration-200 hover:scale-125 focus:outline-none"
                                                            aria-label={`Rate ${star} stars`}
                                                        >
                                                            <FaStar
                                                                size={38}
                                                                className={`transition-all duration-300 ${star <= userRating
                                                                    ? "text-yellow-400 drop-shadow-md scale-110"
                                                                    : "text-gray-300 group-hover:text-yellow-300 group-hover:scale-110"
                                                                    }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {userRating > 0 && (
                                                <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-xl shadow-md border border-gray-200">
                                                    <span className="text-2xl font-extrabold text-gray-900">{userRating}</span>
                                                    <span className="text-sm text-gray-400">/ 5.0</span>
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <FaStar
                                                                key={s}
                                                                size={12}
                                                                className={s <= userRating ? "text-yellow-400" : "text-gray-200"}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {userRating === 0 && (
                                            <p className="text-xs text-gray-400 mt-3 flex items-center gap-2">
                                                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                                Click a star to rate this course
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Write your review <span className="text-gray-400 font-normal">(optional)</span>
                                            </label>
                                            <span
                                                className={`text-xs font-medium px-2 py-1 rounded-full ${userReview.length > 400 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
                                                    }`}
                                            >
                                                {userReview.length}/500
                                            </span>
                                        </div>
                                        <textarea
                                            value={userReview}
                                            onChange={(e) => setUserReview(e.target.value)}
                                            rows={4}
                                            maxLength={500}
                                            className="w-full border-2 border-gray-200 rounded-xl p-4 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none bg-gray-50 hover:bg-white focus:bg-white"
                                            placeholder="What did you like about this course? What could be improved? Share your honest experience..."
                                        />
                                    </div>

                                    <button
                                        onClick={handleRatingSubmit}
                                        disabled={!userRating || isSubmittingReview}
                                        className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3 ${userRating && !isSubmittingReview
                                            ? "bg-gradient-to-r from-[#043573] to-indigo-600 text-white hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        {isSubmittingReview ? (
                                            "Submitting..."
                                        ) : myRating ? (
                                            <>
                                                <FaCheckCircle className="w-4 h-4" />
                                                Update Review
                                            </>
                                        ) : (
                                            <>
                                                <FaStar className="w-4 h-4" />
                                                Submit Review
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Reviews List */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-gray-900">Student Reviews</h3>
                                        <span className="px-3 py-1 bg-gradient-to-r from-[#043573]/90 to-[#043573] text-white text-xs font-bold rounded-full shadow-md">
                                            {displayReviewCount}
                                        </span>
                                    </div>
                                </div>

                                {loadingReviews ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                                                    <div className="flex-1">
                                                        <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                                                        <div className="h-3 bg-gray-100 rounded w-24" />
                                                    </div>
                                                </div>
                                                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                                                <div className="h-3 bg-gray-100 rounded w-3/4" />
                                            </div>
                                        ))}
                                    </div>
                                ) : !myRating && otherReviews.length === 0 ? (
                                    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border-2 border-dashed border-gray-200">
                                        <div className="text-6xl mb-4">🌟</div>
                                        <p className="text-gray-500 font-semibold text-lg">No reviews yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Be the first to share your experience!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {myRating && (
                                            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50/50 border-2 border-blue-200/70 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200/20 rounded-full blur-2xl"></div>
                                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl"></div>

                                                <div className="relative flex items-start gap-4">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#043573]/10 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-blue-500/20">
                                                            {myRating.studentName?.charAt(0) || student?.fullName?.charAt(0) || "Y"}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#043573] bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                                                                <FaStar className="w-3 h-3" />
                                                                Your Review
                                                            </span>
                                                            {myRating.approved === false && (
                                                                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                                                                    <span className="inline-block w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
                                                                    Pending Approval
                                                                </span>
                                                            )}
                                                            {myRating.approved && (
                                                                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                                                                    <FaCheckCircle className="w-3 h-3" />
                                                                    Approved
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-0.5 mb-1.5">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <FaStar
                                                                    key={star}
                                                                    size={14}
                                                                    className={star <= myRating.rating ? "text-yellow-400 drop-shadow-sm" : "text-gray-300"}
                                                                />
                                                            ))}
                                                            <span className="text-xs text-gray-400 ml-1.5 font-semibold">{myRating.rating}.0</span>
                                                        </div>
                                                        {(myRating.review || myRating.comment || myRating.text) && (
                                                            <p className="text-sm text-gray-700 leading-relaxed">{myRating.review || myRating.comment || myRating.text}</p>
                                                        )}
                                                        <span className="text-xs text-gray-400 mt-2 block">{formatDate(myRating.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {otherReviews.map((review, i) => (
                                            <div
                                                key={review.id || i}
                                                className="group bg-white border border-gray-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-base shadow-md">
                                                            {review.studentName?.charAt(0) || "U"}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                            <h4 className="font-semibold text-gray-900">
                                                                {review.studentName || "Anonymous"}
                                                            </h4>
                                                            {review.approved && (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                                    <FaCheckCircle className="w-3 h-3" />
                                                                    Verified
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-0.5 mb-1.5">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <FaStar
                                                                    key={star}
                                                                    size={14}
                                                                    className={star <= review.rating ? "text-yellow-400 drop-shadow-sm" : "text-gray-300"}
                                                                />
                                                            ))}
                                                            <span className="text-xs text-gray-400 ml-1.5 font-semibold">{review.rating}.0</span>
                                                        </div>
                                                        {(review.review || review.comment || review.text) && (
                                                            <p className="text-sm text-gray-600 leading-relaxed">{review.review || review.comment || review.text}</p>
                                                        )}
                                                        <div className="flex items-center gap-4 mt-3">
                                                            <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
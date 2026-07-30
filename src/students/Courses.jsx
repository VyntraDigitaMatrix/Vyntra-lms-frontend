import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { studentLearningApi } from "./auth/api";
import {
    FaBookOpen, FaChevronLeft, FaChevronRight,
    FaSearch, FaGraduationCap, FaPlay,
    FaTrophy, FaSpinner, FaGlobe, FaStar, FaUserFriends
} from "react-icons/fa";

/* ── Fallback thumbnail ── */
import S1 from "../assets/S1.jpg";

/* ── Status badge helper ── */
const getStatusInfo = (progress, completed) => {
    if (completed) return { label: "Completed", color: "text-emerald-600 bg-emerald-50 border-emerald-200", bar: "bg-emerald-500" };
    if (progress > 0) return { label: "In Progress", color: "text-[#043573] bg-blue-50 border-blue-200", bar: "bg-blue-500" };
    return { label: "Not Started", color: "text-gray-500 bg-gray-50 border-gray-200", bar: "bg-gray-300" };
};

/* ── Skeleton Card ── */
const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
        <div className="w-full h-[130px] bg-gray-200" />
        <div className="p-4 space-y-3">
            <div className="h-3.5 bg-gray-200 rounded-full w-3/4" />
            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            <div className="h-2 bg-gray-100 rounded-full w-full mt-4" />
            <div className="h-9 bg-gray-100 rounded-xl mt-3" />
        </div>
    </div>
);

const Courses = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const PAGE_SIZE = 12;

    const fetchCourses = useCallback(async () => {
<<<<<<< Updated upstream
        setLoading(true);
        setError("");
        try {
            const res = await studentLearningApi.getMyEnrolledCourses(currentPage, PAGE_SIZE);
            if (res.data?.data) {
                const pageData = res.data.data;
                const rawCourses = pageData.content || [];

                // Fetch progress for each course in parallel
                const enriched = await Promise.all(
                    rawCourses.map(async (course) => {
                        const slug = course.slug || course.courseSlug || course.courseId;
                        if (!slug) return course;
                        try {
                            const progRes = await studentLearningApi.getCourseProgress(slug);
                            const prog = progRes.data?.data || {};
                            return {
                                ...course,
                                progressPercentage: prog.progressPercentage ?? course.progressPercentage ?? 0,
                                completed: prog.completed ?? course.completed ?? false,
                                totalLessons: prog.totalLessons ?? course.totalLessons ?? 0,
                                completedLessons: prog.completedLessons ?? course.completedLessons ?? 0,
                                certificateEligible: prog.certificateEligible ?? false,
                            };
                        } catch {
                            return course;
                        }
                    })
                );

                setCourses(enriched);
                setTotalPages(pageData.totalPages || 0);
                setTotalElements(pageData.totalElements || 0);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load your courses. Please try again.");
        } finally {
            setLoading(false);
=======
    setLoading(true);
    setError("");
    try {
        const res = await studentLearningApi.getMyEnrolledCourses(currentPage, PAGE_SIZE);
        if (res.data?.data) {
            const pageData = res.data.data;
            const baseCourses = pageData.content || [];
            setCourses(baseCourses);
            setTotalPages(pageData.totalPages || 0);
            setTotalElements(pageData.totalElements || 0);

            // The list endpoint's progress fields can be stale — fetch live
            // progress per course (same endpoint ModuleLesson uses) and merge in.
            const liveProgress = await Promise.allSettled(
                baseCourses.map(c => studentLearningApi.getCourseProgress(c.slug))
            );

            setCourses(prev => prev.map((c, i) => {
                const result = liveProgress[i];
                if (result.status !== "fulfilled") return c;
                const data = result.value.data?.data;
                if (!data) return c;
                return {
                    ...c,
                    progressPercentage: data.progressPercentage,
                    completed: data.completed,
                };
            }));
>>>>>>> Stashed changes
        }
    } catch (err) {
        console.error(err);
        setError("Failed to load your courses. Please try again.");
    } finally {
        setLoading(false);
    }
}, [currentPage]);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    const tabs = ["All", "In Progress", "Completed", "Not Started"];

    const filteredCourses = useMemo(() => {
        return courses.filter((c) => {
           const title = (c.title || "").toLowerCase();
            const instructor = (c.instructorNames || []) .join(", ").toLowerCase();
            const query = searchTerm.toLowerCase();
            const matchesSearch = title.includes(query) || instructor.includes(query);

            const progress = c.progressPercentage || 0;
            const completed = c.completed;
            let matchesTab = true;
            if (activeTab === "In Progress") matchesTab = progress > 0 && !completed;
            else if (activeTab === "Completed") matchesTab = !!completed;
            else if (activeTab === "Not Started") matchesTab = progress === 0 && !completed;

            return matchesSearch && matchesTab;
        });
    }, [courses, searchTerm, activeTab]);

    /* ── Stats ── */
    const stats = useMemo(() => ({
        total: totalElements,
        inProgress: courses.filter(c => (c.progressPercentage || 0) > 0 && !c.completed).length,
        completed: courses.filter(c => c.completed).length,
        notStarted: courses.filter(c => (c.progressPercentage || 0) === 0 && !c.completed).length,
    }), [courses, totalElements]);

    return (
        <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto">

                {/* ── Header ── */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
                    <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-400 mb-1">
                            <Link to="/student/dashboard" className="hover:text-[#043573] transition">Dashboard</Link>
                            <span className="mx-2">&gt;</span>
                            <span className="text-gray-600 font-medium">My Courses</span>
                        </p>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">My Courses</h1>

                        {/* Tabs */}
                        <div className="flex gap-1 overflow-x-auto pb-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${activeTab === tab
                                        ? "bg-[#043573] text-white shadow-sm"
                                        : "text-gray-500 hover:bg-gray-100"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full lg:w-[280px]">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input
                            type="text"
                            placeholder="Search my courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 outline-none text-sm focus:border-blue-500 bg-white"
                        />
                    </div>
                </div>

                {/* ── Stats Cards ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                        { label: "Enrolled", value: stats.total, icon: FaBookOpen, color: "text-[#043573] bg-blue-50" },
                        { label: "In Progress", value: stats.inProgress, icon: FaPlay, color: "text-amber-600 bg-amber-50" },
                        { label: "Completed", value: stats.completed, icon: FaTrophy, color: "text-emerald-600 bg-emerald-50" },
                        { label: "Not Started", value: stats.notStarted, icon: FaGraduationCap, color: "text-gray-500 bg-gray-50" },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
                                    <Icon className="text-xs" />
                                </div>
                                <span className="text-xs text-gray-500 font-medium">{label}</span>
                            </div>
                            <div className="text-2xl font-black text-gray-900">
                                {loading ? <span className="block w-6 h-6 bg-gray-200 rounded animate-pulse" /> : value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Error ── */}
                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-5 flex items-center justify-between">
                        <p className="text-xs text-red-600 font-semibold">{error}</p>
                        <button onClick={fetchCourses} className="text-xs text-red-600 font-bold underline">Retry</button>
                    </div>
                )}

                {/* ── Course Grid ── */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                            <FaBookOpen className="text-[#043573]/80 text-2xl" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">
                            {searchTerm || activeTab !== "All" ? "No courses match your filters" : "No enrolled courses yet"}
                        </h3>
                        <p className="text-xs text-gray-500 mb-5">
                            {searchTerm || activeTab !== "All"
                                ? "Try clearing your search or changing the filter tab."
                                : "Explore our catalog and enroll in a course to start learning."}
                        </p>
                        {(!searchTerm && activeTab === "All") && (
                            <Link
                                to="/student/all-courses"
                                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#043573] text-white text-xs font-bold hover:bg-blue-700 transition"
                            >
                                Browse Courses
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {filteredCourses.map((course) => {
                            const progress = course.progressPercentage || 0;
                            const status = getStatusInfo(progress, course.completed);
                            const thumbnail = course.thumbnailUrl || S1;
                            const courseSlug = course.slug;

                            return (
                                <div
<<<<<<< Updated upstream
                                    key={course.courseId || course.slug || course.id}
=======
                                    key={course.courseId}
>>>>>>> Stashed changes
                                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative">
                                        <img
                                            src={thumbnail}
<<<<<<< Updated upstream
                                          alt={course.title}
                                            className="w-full h-[130px] object-cover"
=======
                                            alt={course.courseTitle}
                                            className="w-full h-[180px] object-cover"
>>>>>>> Stashed changes
                                            onError={(e) => { e.target.src = S1; }}
                                        />
                                        {/* Progress badge */}
                                        <span className="absolute top-2.5 right-2.5 bg-[#043573] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                                            {Math.round(progress)}%
                                        </span>
                                        {/* Status pill */}
                                        <span className={`absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex-1">
<<<<<<< Updated upstream
                                            <h2 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 min-h-[40px]">
                                                {course.title || course.courseTitle}
                                            </h2>
                                            <p className="text-[11px] text-gray-500 mb-1 line-clamp-1">
                                                By {course.instructorNames?.join(", ") || course.instructorName || "Instructor"}
=======
                                            <h2 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
                                               {course.title}
                                            </h2>
                                            <p className="text-[11px] text-gray-500 mb-1">
                                               By {course.instructorNames?.join(", ") || "Instructor"}
>>>>>>> Stashed changes
                                            </p>
                                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                {course.level && (
                                                    <span className="text-[10px] font-semibold bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                                                        {course.level}
                                                    </span>
                                                )}
                                                {course.language && (
                                                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                                        <FaGlobe size={10} /> {course.language}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-gray-500 font-medium ml-1">
                                                    {course.totalModules || (course.modules || []).length || 0} Modules • {course.totalLessons || (course.modules || []).reduce((acc, m) => acc + (m.lessons || []).length, 0) || 0} Lessons
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
                                                <div className="flex items-center gap-0.5 text-yellow-500">
                                                    <FaStar size={10} />
                                                    <span className="font-bold">{course.averageRating > 0 ? course.averageRating.toFixed(1) : "0.0"}</span>
                                                </div>
                                                <span>({course.totalRatings || 0} reviews)</span>
                                                <span className="flex items-center gap-1 ml-auto font-medium">
                                                    <FaUserFriends size={10} /> {course.totalEnrollments || 0}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="mt-3">
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${status.bar}`}
                                                    style={{ width: `${Math.round(progress)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-1.5">
                                                <span className="text-[10px] text-gray-400">
                                                    {course.completedLessons != null && course.totalLessons != null
                                                        ? `${course.completedLessons}/${course.totalLessons} Lessons`
                                                        : status.label}
                                                </span>
                                                <span className="text-[10px] text-gray-400">{Math.round(progress)}% Complete</span>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <button
<<<<<<< Updated upstream
                                            onClick={() => navigate(`/student/continue-learning/${course.slug || courseId}`)}
=======
                                            onClick={() => navigate(`/student/continue-learning/${courseSlug}`)}
>>>>>>> Stashed changes
                                            className={`w-full mt-3 h-10 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${course.completed
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                                : progress > 0
                                                    ? "bg-[#043573] text-white hover:bg-blue-700"
                                                    : "border border-blue-200 text-[#043573] hover:bg-[#043573] hover:text-white"
                                                }`}
                                        >
                                            {course.completed ? (
                                                <><FaTrophy className="text-xs" /> Review Course</>
                                            ) : progress > 0 ? (
                                                <><FaPlay className="text-[9px]" /> Continue Learning</>
                                            ) : (
                                                <><FaPlay className="text-[9px]" /> Start Learning</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Pagination ── */}
                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <FaChevronLeft className="text-xs" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className={`w-9 h-9 rounded-xl text-xs font-bold transition ${i === currentPage
                                    ? "bg-[#043573] text-white"
                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <FaChevronRight className="text-xs" />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Courses;
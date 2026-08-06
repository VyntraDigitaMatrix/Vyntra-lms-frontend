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
    if (progress > 0) return { label: "In Progress", color: "text-navy-800 bg-navy-50 border-navy-200", bar: "bg-navy-500" };
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
        <div className="min-h-screen bg-navy-50/40 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ── Header Banner ── */}
                <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 rounded-3xl p-5 sm:p-6 shadow-lg relative overflow-hidden">
                    <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-brand-orange/15 blur-2xl pointer-events-none"></div>
                    <p className="relative text-xs text-navy-100/60 mb-1 flex items-center gap-1.5 font-medium">
                        <Link to="/student/dashboard" className="hover:text-brand-orange-light transition">Dashboard</Link>
                        <span>&gt;</span>
                        <span className="text-white font-semibold">My Courses</span>
                    </p>
                    <h1 className="relative text-xl sm:text-2xl font-black text-white tracking-tight">My Courses</h1>
                    <div className="relative h-1 w-12 bg-brand-orange rounded-full mt-2 mb-3"></div>
                    <p className="relative text-xs text-navy-100/70">Track your progress and jump back into your active learning paths.</p>
                </div>

                {/* ── Tabs + Search ── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-xs">
                    {/* Tabs */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border-none ${
                                    activeTab === tab
                                        ? "bg-brand-orange text-white shadow-md shadow-brand-orange/25"
                                        : "text-slate-600 bg-slate-100/70 hover:bg-navy-50 hover:text-navy-800"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full lg:w-[300px]">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input
                            type="text"
                            placeholder="Search my courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 outline-none text-xs font-medium focus:border-navy-800 focus:ring-2 focus:ring-navy-800/10 bg-slate-50/50 transition-all"
                        />
                    </div>
                </div>

                {/* ── Stats Cards ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {[
                        { label: "Enrolled", value: stats.total, icon: FaBookOpen, color: "text-navy-800 bg-navy-50" },
                        { label: "In Progress", value: stats.inProgress, icon: FaPlay, color: "text-amber-600 bg-amber-50" },
                        { label: "Completed", value: stats.completed, icon: FaTrophy, color: "text-emerald-600 bg-emerald-50" },
                        { label: "Not Started", value: stats.notStarted, icon: FaGraduationCap, color: "text-slate-500 bg-slate-100" },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/70 shadow-xs hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color} font-bold`}>
                                    <Icon className="text-xs" />
                                </div>
                                <span className="text-xs text-slate-500 font-semibold">{label}</span>
                            </div>
                            <div className="text-2xl font-black text-slate-900 tracking-tight">
                                {loading ? <span className="block w-8 h-7 bg-slate-200 rounded-lg animate-pulse" /> : value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Error ── */}
                {error && (
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center justify-between">
                        <p className="text-xs text-rose-600 font-semibold">{error}</p>
                        <button onClick={fetchCourses} className="text-xs text-rose-600 font-bold underline cursor-pointer">Retry</button>
                    </div>
                )}

                {/* ── Course Grid ── */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/70 shadow-xs">
                        <div className="w-16 h-16 rounded-2xl bg-navy-50 flex items-center justify-center mx-auto mb-4">
                            <FaBookOpen className="text-navy-800 text-2xl" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">
                            {searchTerm || activeTab !== "All" ? "No courses match your filters" : "No enrolled courses yet"}
                        </h3>
                        <p className="text-xs text-slate-500 mb-5 max-w-md mx-auto">
                            {searchTerm || activeTab !== "All"
                                ? "Try clearing your search or changing the filter tab."
                                : "Explore our catalog and enroll in a course to start learning."}
                        </p>
                        {(!searchTerm && activeTab === "All") && (
                            <Link
                                to="/student/all-courses"
                                className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-navy-800 text-white text-xs font-bold hover:bg-navy-900 transition-all shadow-xs"
                            >
                                Browse Courses
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredCourses.map((course) => {
                            const progress = course.progressPercentage || 0;
                            const status = getStatusInfo(progress, course.completed);
                            const thumbnail = course.thumbnailUrl || S1;

                            return (
                                <div
                                    key={course.courseId || course.slug || course.id}
                                    className="bg-white rounded-2xl overflow-hidden border border-slate-200/70 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Thumbnail */}
                                        <div className="relative overflow-hidden h-[170px]">
                                            <img
                                                src={thumbnail}
                                                alt={course.title || course.courseTitle}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => { e.target.src = S1; }}
                                            />
                                            {/* Progress badge */}
                                            <span className="absolute top-3 right-3 bg-brand-orange text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md">
                                                {Math.round(progress)}%
                                            </span>
                                            {/* Status pill */}
                                            <span className={`absolute bottom-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-xs ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 space-y-2">
                                            <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 min-h-[40px] group-hover:text-navy-800 transition-colors">
                                                {course.title || course.courseTitle}
                                            </h3>
                                            <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                                                By {course.instructorNames?.join(", ") || course.instructorName || "Instructor"}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                                {course.level && (
                                                    <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-md">
                                                        {course.level}
                                                    </span>
                                                )}
                                                {course.language && (
                                                    <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                                        <FaGlobe size={10} /> {course.language}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-slate-400 font-medium ml-auto">
                                                    {course.totalModules || (course.modules || []).length || 0} Modules
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer / CTA */}
                                    <div className="p-4 pt-0">
                                        <div className="space-y-1 mb-3">
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${status.bar}`}
                                                    style={{ width: `${Math.round(progress)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-1">
                                                <span>
                                                    {course.completedLessons != null && course.totalLessons != null
                                                        ? `${course.completedLessons}/${course.totalLessons} Lessons`
                                                        : status.label}
                                                </span>
                                                <span>{Math.round(progress)}% Complete</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/student/continue-learning/${course.slug || course.courseSlug || course.courseId || course.id}`)}
                                            className={`w-full h-10 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                                                course.completed
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                                    : progress > 0
                                                        ? "bg-navy-800 text-white hover:bg-navy-900 shadow-xs"
                                                        : "border border-slate-200 text-navy-800 hover:bg-navy-800 hover:text-white"
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
                    <div className="flex items-center justify-center gap-2 pt-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        >
                            <FaChevronLeft className="text-xs" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                                    i === currentPage
                                        ? "bg-brand-orange text-white shadow-xs"
                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-navy-50"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
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
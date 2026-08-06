import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import S1 from "../assets/S1.jpg";
import S2 from "../assets/S2.jpg";
import S3 from "../assets/S3.jpg";
import S4 from "../assets/S4.jpg";
import S5 from "../assets/S5.jpg";
import {
  FaBookOpen, FaPlayCircle, FaTrophy, FaClock, FaArrowRight,
  FaEllipsisV, FaMedal, FaChevronDown, FaTv, FaCheckCircle,
  FaClipboardCheck, FaFileUpload,
} from "react-icons/fa";
import { useAuth } from "./auth/AuthContext";
import { studentLearningApi, studentCertificateApi, studentAssignmentApi } from "./auth/api";

const Dashboard = () => {
  const { student, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState("This Week");
  const [showDays, setShowDays] = useState(false);
  const [toast, setToast] = useState(null);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [certificatesCount, setCertificatesCount] = useState(0);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const getThumbnailFallback = (index) => {
    const fallbacks = [S1, S2, S3, S4, S5];
    return fallbacks[index % fallbacks.length];
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Enrolled Courses
        const coursesRes = await studentLearningApi.getMyEnrolledCourses(0, 50);
        let rawCourses = [];
        if (coursesRes.data?.data?.content) {
          rawCourses = coursesRes.data.data.content;
        }

        // 2. Fetch Progress for each course in parallel
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
            } catch (err) {
              console.error("Error fetching progress for slug:", slug, err);
              return {
                ...course,
                progressPercentage: course.progressPercentage ?? 0,
                completed: false,
                totalLessons: 0,
                completedLessons: 0,
              };
            }
          })
        );
        setCourses(enriched);

        // 3. Fetch Certificates
        try {
          const certsRes = await studentCertificateApi.getMyCertificates(0, 50);
          if (certsRes.data?.data?.totalElements !== undefined) {
            setCertificatesCount(certsRes.data.data.totalElements);
          } else {
            const completedCount = enriched.filter(c => c.completed).length;
            setCertificatesCount(completedCount);
          }
        } catch {
          const completedCount = enriched.filter(c => c.completed).length;
          setCertificatesCount(completedCount);
        }

        // 4. Fetch Assignments / Deadlines
        try {
          const assignmentsRes = await studentAssignmentApi.getAssignments(0, 10);
          if (assignmentsRes.data?.data?.content) {
            setUpcomingAssignments(assignmentsRes.data.data.content);
          }
        } catch (err) {
          console.error("Failed to fetch assignments:", err);
        }

        // 5. Fetch Submissions for Recent Activity
        let submissions = [];
        try {
          const submissionsRes = await studentAssignmentApi.getSubmissions();
          if (submissionsRes.data?.data) {
            submissions = submissionsRes.data.data.content || submissionsRes.data.data || [];
          }
        } catch (err) {
          console.error("Failed to fetch submissions:", err);
        }

        // 6. Generate Recent Activity dynamically
        const activities = [];
        // Map submissions
        submissions.slice(0, 3).forEach(sub => {
          activities.push({
            type: "SUBMISSION",
            icon: <FaFileUpload className="text-navy-600 text-base" />,
            text: `You submitted assignment "${sub.title || sub.assignmentSlug || 'Assignment'}"`,
            time: sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently",
            path: "/student/assignments"
          });
        });
        // Map completed courses
        enriched.filter(c => c.completed).forEach(c => {
          activities.push({
            type: "COMPLETION",
            icon: <FaCheckCircle className="text-emerald-500 text-base" />,
            text: `You completed course "${c.courseTitle || c.title}"`,
            time: c.completedAt ? new Date(c.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recently",
            path: `/student/continue-learning/${c.courseSlug || c.slug}`
          });
        });
        // Map recent enrollments as fallback/fillers if activities are sparse
        if (activities.length < 3) {
          enriched.forEach(c => {
            if (activities.length < 3) {
              activities.push({
                type: "ENROLLMENT",
                icon: <FaBookOpen className="text-navy-800 text-base" />,
                text: `You enrolled in course "${c.courseTitle || c.title}"`,
                time: c.enrolledAt ? new Date(c.enrolledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recently",
                path: `/student/continue-learning/${c.courseSlug || c.slug}`
              });
            }
          });
        }
        setRecentActivities(activities.slice(0, 4));

      } catch (err) {
        console.error("Dashboard data fetching failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate dynamic stats
  const enrolledCount = courses.length;
  const totalCompletedLessons = courses.reduce((sum, c) => sum + (c.completedLessons || 0), 0);
  const totalLessons = courses.reduce((sum, c) => sum + (c.totalLessons || 0), 0);

  // Dynamic Learning Hours: 25 mins per completed lesson
  const totalMinutes = totalCompletedLessons * 25;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const learningHoursStr = `${hours}h ${mins}m`;

  // Overall Progress Percentage
  const overallProgress = totalLessons > 0 ? Math.round((totalCompletedLessons / totalLessons) * 100) : 0;

  // Find Continue Learning Course
  // Highest progress first, that is in progress (< 100%)
  const inProgressCourses = courses.filter(c => c.progressPercentage > 0 && c.progressPercentage < 100);
  const continueCourse = inProgressCourses.length > 0
    ? inProgressCourses.sort((a, b) => b.progressPercentage - a.progressPercentage)[0]
    : (courses.find(c => c.progressPercentage === 0) || courses[0]);

  const upcomingDeadlines = upcomingAssignments
    .filter(a => !a.submitted && a.dueDate) // filter out submitted ones
    .slice(0, 3) // show top 3
    .map(a => {
      const dueDays = Math.ceil((new Date(a.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      let dueText = "";
      if (dueDays < 0) {
        dueText = "Overdue";
      } else if (dueDays === 0) {
        dueText = "Due Today";
      } else if (dueDays === 1) {
        dueText = "Due Tomorrow";
      } else {
        dueText = `Due in ${dueDays} days`;
      }
      return {
        title: a.title,
        due: dueText,
        urgent: dueDays <= 2,
        slug: a.assignmentSlug
      };
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-navy-50/40">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-navy-800 border-t-brand-orange rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-navy-50/40 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-navy-900 text-white text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-2xl transition-all flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"></span>
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -top-14 w-56 h-56 rounded-full bg-brand-orange/15 blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 bottom-0 w-28 h-28 rounded-full bg-brand-orange/20 blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {student && student.fullName ? student.fullName : "Student"}! 👋
          </h1>
          <div className="h-1 w-14 bg-brand-orange rounded-full mt-2.5 mb-2.5"></div>
          <p className="text-xs sm:text-sm text-navy-100/80 max-w-xl font-normal">
            You're making great progress! Continue where you left off or explore new learning modules.
          </p>
        </div>
        <button
          onClick={() => navigate("/student/courses")}
          className="relative z-10 shrink-0 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all hover:scale-105 border-none cursor-pointer"
        >
          My Learning Center
        </button>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        {/* Left Section */}
        <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Courses Enrolled */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/70 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 text-white flex items-center justify-center text-lg shrink-0 font-bold shadow-sm">
                  <FaBookOpen />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{enrolledCount}</h2>
                  <p className="text-[11px] font-medium text-slate-500 truncate">Enrolled Courses</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-navy-800 hover:text-brand-orange-dark font-semibold flex items-center gap-1.5 text-xs mt-3 group bg-transparent border-none cursor-pointer p-0"
              >
                <span>View All</span>
                <FaArrowRight size={9} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Lessons Completed */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/70 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0 font-bold">
                  <FaTv />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{totalCompletedLessons}</h2>
                  <p className="text-[11px] font-medium text-slate-500 truncate">Lessons Completed</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-navy-800 hover:text-brand-orange-dark font-semibold flex items-center gap-1.5 text-xs mt-3 group bg-transparent border-none cursor-pointer p-0"
              >
                <span>View All</span>
                <FaArrowRight size={9} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Certificates Earned */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/70 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-orange-dark text-white flex items-center justify-center text-lg shrink-0 font-bold shadow-sm">
                  <FaTrophy />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{certificatesCount}</h2>
                  <p className="text-[11px] font-medium text-slate-500 truncate">Certificates</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/student/certificates")}
                className="text-navy-800 hover:text-brand-orange-dark font-semibold flex items-center gap-1.5 text-xs mt-3 group bg-transparent border-none cursor-pointer p-0"
              >
                <span>View All</span>
                <FaArrowRight size={9} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Total Learning Hours */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/70 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-lg shrink-0 font-bold">
                  <FaClock />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{learningHoursStr}</h2>
                  <p className="text-[11px] font-medium text-slate-500 truncate">Learning Hours</p>
                </div>
              </div>
              <button
                onClick={() => showToast("Learning history coming soon!")}
                className="text-navy-800 hover:text-brand-orange-dark font-semibold flex items-center gap-1.5 text-xs mt-3 group bg-transparent border-none cursor-pointer p-0"
              >
                <span>History</span>
                <FaArrowRight size={9} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Continue Learning Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Continue Learning</h2>
                <p className="text-xs text-slate-500">Pick up right where you left off</p>
              </div>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-navy-800 hover:text-brand-orange-dark font-bold flex items-center gap-1.5 text-xs hover:underline w-fit bg-transparent border-none cursor-pointer p-0"
              >
                View All Courses <FaArrowRight size={9} />
              </button>
            </div>

            {continueCourse ? (
              <div className="flex flex-col md:flex-row items-stretch gap-5 p-4 bg-navy-50/50 rounded-2xl border border-navy-100">
                <img
                  src={continueCourse.thumbnailUrl || getThumbnailFallback(0)}
                  alt={continueCourse.courseTitle || continueCourse.title}
                  className="w-full md:w-[220px] lg:w-[260px] h-[150px] rounded-xl object-cover shadow-xs shrink-0"
                />
                <div className="flex flex-col justify-between flex-1 w-full space-y-3">
                  <div>
                    <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-lg mb-2 ${
                      continueCourse.completed ? "bg-emerald-100 text-emerald-700" : "bg-brand-orange-50 text-brand-orange-dark"
                    }`}>
                      {continueCourse.completed ? "Completed" : "In Progress"}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {continueCourse.courseTitle || continueCourse.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Lessons: {continueCourse.completedLessons} / {continueCourse.totalLessons} completed
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium truncate max-w-[200px]">
                        Last course progress
                      </span>
                      <span className="font-bold text-navy-800">{Math.round(continueCourse.progressPercentage || 0)}% Complete</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-navy-700 to-brand-orange rounded-full transition-all duration-500"
                        style={{ width: `${continueCourse.progressPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/student/continue-learning/${continueCourse.courseSlug || continueCourse.slug}`)}
                    className="w-full sm:w-fit bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] cursor-pointer border-none"
                  >
                    Resume Course
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 bg-navy-50/50 border border-dashed border-navy-100 rounded-2xl">
                <p className="text-sm font-semibold">No active learning paths.</p>
                <button
                  onClick={() => navigate("/student/all-courses")}
                  className="mt-2.5 px-4 py-2 bg-brand-orange text-white rounded-xl text-xs font-bold hover:bg-brand-orange-dark transition border-none cursor-pointer"
                >
                  Start a Course
                </button>
              </div>
            )}
          </div>

          {/* My Courses */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">My Enrolled Courses</h2>
                <p className="text-xs text-slate-500">Your active learning paths</p>
              </div>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-navy-800 hover:text-brand-orange-dark font-bold flex items-center gap-1.5 text-xs hover:underline w-fit bg-transparent border-none cursor-pointer p-0"
              >
                View All Courses <FaArrowRight size={9} />
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="py-8 text-center text-slate-500 bg-navy-50/50 border border-dashed border-navy-100 rounded-2xl">
                <p className="text-sm font-semibold">You are not enrolled in any courses yet.</p>
                <button
                  onClick={() => navigate("/student/all-courses")}
                  className="mt-2.5 px-4 py-2 bg-brand-orange text-white rounded-xl text-xs font-bold hover:bg-brand-orange-dark transition border-none cursor-pointer"
                >
                  Browse Course Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {courses.map((course, index) => (
                  <div
                    key={course.courseId || index}
                    onClick={() => navigate(`/student/continue-learning/${course.courseSlug || course.slug}`)}
                    className="group border border-slate-200/70 rounded-2xl overflow-hidden hover:shadow-md hover:border-navy-200 transition-all duration-300 bg-white cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative overflow-hidden h-[110px]">
                        <img
                          src={course.thumbnailUrl || getThumbnailFallback(index)}
                          alt={course.courseTitle || course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent"></div>
                      </div>
                      <div className="p-3.5 space-y-2">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug">
                          {course.courseTitle || course.title}
                        </h4>
                      </div>
                    </div>
                    <div className="p-3.5 pt-0 mt-auto">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-navy-700 to-brand-orange rounded-full"
                          style={{ width: `${course.progressPercentage || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-[10px] font-medium text-slate-400">
                        <span>Overall Progress</span>
                        <span className="font-bold text-navy-800">{Math.round(course.progressPercentage || 0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Recent Activity</h2>
                <p className="text-xs text-slate-500">Your recent actions and milestones</p>
              </div>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-navy-800 hover:text-brand-orange-dark font-bold flex items-center gap-1.5 text-xs hover:underline w-fit bg-transparent border-none cursor-pointer p-0"
              >
                View History <FaArrowRight size={9} />
              </button>
            </div>

            <div className="space-y-3">
              {recentActivities.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 bg-navy-50/40 rounded-xl border border-dashed border-navy-100">
                  No recent activities recorded.
                </div>
              ) : (
                recentActivities.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(item.path)}
                    className="flex items-center justify-between gap-4 border border-slate-100 rounded-xl p-3.5 hover:bg-navy-50/50 hover:border-navy-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm text-slate-800">{item.text}</h4>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap shrink-0">{item.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:col-span-4 xl:col-span-3 space-y-6">

          {/* Learning Progress Ring */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/70">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Learning Overview</h3>
              <div className="relative">
                <button
                  onClick={() => setShowDays(!showDays)}
                  className="text-xs font-semibold text-slate-500 hover:text-navy-800 flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1 bg-white cursor-pointer"
                >
                  <span>{selectedDays}</span> <FaChevronDown size={8} />
                </button>
                {showDays && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                    {["This Week", "20 Days"].map((day) => (
                      <button
                        key={day}
                        onClick={() => { setSelectedDays(day); setShowDays(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-navy-50 hover:text-navy-800 font-medium bg-transparent border-none cursor-pointer"
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center my-4">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90">
                  <defs>
                    <linearGradient id="progressRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#122a5e" />
                      <stop offset="100%" stopColor="#f5a623" />
                    </linearGradient>
                  </defs>
                  <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#f3f5fb" strokeWidth="8" />
                  <circle
                    cx="50%" cy="50%" r="42%" fill="none" stroke="url(#progressRingGradient)" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 42}px`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - overallProgress / 100)}px`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-2xl font-black text-slate-900">{overallProgress}%</span>
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Overall</p>
                  </div>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-3 text-center">
                Keep consistent to achieve your target goals!
              </p>
            </div>

            <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
              {[
                { color: "bg-emerald-500", label: "Completed Lessons", value: totalCompletedLessons, path: "/student/courses" },
                { color: "bg-brand-orange", label: "Remaining Lessons", value: totalLessons - totalCompletedLessons, path: "/student/courses" },
              ].map((item) => (
                <div
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex justify-between items-center cursor-pointer hover:bg-navy-50/60 rounded-lg px-2 py-1.5 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 ${item.color} rounded-full`}></span>
                    <span className="text-slate-600 font-medium">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                <span className="font-semibold text-slate-700">Total Lessons</span>
                <span className="font-bold text-navy-800">{totalLessons}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/70">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-900">Upcoming Deadlines</h3>
              <button
                onClick={() => navigate("/student/assignments")}
                className="text-navy-800 hover:text-brand-orange-dark font-bold text-xs hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                View All
              </button>
            </div>
            <div className="space-y-2.5">
              {upcomingDeadlines.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 bg-navy-50/40 rounded-xl border border-dashed border-navy-100">
                  No upcoming deadlines!
                </div>
              ) : (
                upcomingDeadlines.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(`/student/assignments/${item.slug}`)}
                    className="cursor-pointer hover:bg-navy-50/50 rounded-xl p-2.5 border border-slate-100 transition"
                  >
                    <h4 className="font-semibold text-xs text-slate-800">{item.title}</h4>
                    <p className={`text-[11px] font-medium mt-1 ${item.urgent ? "text-rose-600 font-bold" : "text-slate-400"}`}>
                      {item.due}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/70">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-900">Achievements</h3>
              <button
                onClick={() => showToast("Achievements page coming soon!")}
                className="text-navy-800 hover:text-brand-orange-dark font-bold text-xs hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                View All
              </button>
            </div>
            <div className="space-y-2.5">
              {[
                { bg: "bg-gradient-to-br from-brand-orange to-brand-orange-dark text-white", title: "Quick Learner", desc: "Completed 5 lessons" },
                { bg: "bg-gradient-to-br from-navy-700 to-navy-900 text-white", title: "Consistent Learner", desc: "Studied 7 days in a row" },
                { bg: "bg-purple-100 text-purple-700", title: "Rising Star", desc: "Scored 90% in a quiz" },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => showToast(`🏅 ${item.title}: ${item.desc}`)}
                  className="flex items-center gap-3 cursor-pointer hover:bg-navy-50/50 rounded-xl p-2 border border-slate-100 transition"
                >
                  <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0 font-bold text-sm shadow-sm`}>
                    <FaMedal />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;

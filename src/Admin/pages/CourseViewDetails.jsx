import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaStar, FaUser, FaBook, FaClock, FaTrophy, FaCheckCircle,
  FaChevronDown, FaPlay, FaLock, FaTimes, FaVideo, FaFilePdf,
  FaLink, FaCheck, FaTimesCircle, FaArchive
} from "react-icons/fa";
import { adminCourseApi } from "../auth/api";
import S1 from "../../assets/S1.jpg";

const CourseViewDetails = () => {
  const { courseSlug } = useParams();

  // State
  const [courseData, setCourseData] = useState(null);
  const [modules, setModules] = useState([]);
  const [moduleLessons, setModuleLessons] = useState({});
  const [expandedModules, setExpandedModules] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const courseRes = await adminCourseApi.getCourseBySlug(courseSlug);
      if (courseRes.data && courseRes.data.data) {
        setCourseData(courseRes.data.data);
      }

      const modulesRes = await adminCourseApi.getCourseModules(courseSlug);
      if (modulesRes.data && modulesRes.data.data) {
        const fetchedModules = modulesRes.data.data.content || [];
        fetchedModules.sort((a, b) => a.sortOrder - b.sortOrder);
        setModules(fetchedModules);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch course details from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseSlug]);

  const toggleModule = async (idx, moduleSlug) => {
    const isExpanding = !expandedModules[idx];
    setExpandedModules((p) => ({ ...p, [idx]: isExpanding }));

    if (isExpanding && moduleSlug && !moduleLessons[moduleSlug]) {
      try {
        const res = await adminCourseApi.getModuleLessons(moduleSlug);
        if (res.data && res.data.data) {
          const fetchedLessons = res.data.data.content || [];
          fetchedLessons.sort((a, b) => a.sortOrder - b.sortOrder);
          setModuleLessons(prev => ({ ...prev, [moduleSlug]: fetchedLessons }));
        }
      } catch (err) {
        console.error("Failed to fetch lessons for module " + moduleSlug, err);
      }
    }
  };

  const handlePublish = async () => {
    if (window.confirm("Are you sure you want to PUBLISH this course? It will become visible to all students.")) {
      setActionLoading(true);
      try {
        await adminCourseApi.publishCourse(courseSlug);
        alert("Course published successfully!");
        fetchData();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to publish the course.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleArchive = async () => {
    if (window.confirm("Are you sure you want to ARCHIVE this course? Students won't be able to buy it anymore.")) {
      setActionLoading(true);
      try {
        await adminCourseApi.archiveCourse(courseSlug);
        alert("Course archived successfully!");
        fetchData();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to archive the course.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-5">
        <div className="w-10 h-10 border-4 border-t-teal-600 border-gray-200 rounded-full animate-spin mb-4"></div>
        <span className="text-sm text-gray-500 font-semibold font-sans">Loading course details...</span>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-5">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 max-w-md text-center">
          <p className="text-sm font-bold mb-2">⚠️ Error Loading Course</p>
          <p className="text-xs text-gray-600 mb-4">{error || "Course not found"}</p>
          <Link
            to="/admin/all-courses"
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const instructor = courseData.instructors?.[0];
  const course = {
    ...courseData,
    rating: courseData.averageRating ?? 0,
    reviews: courseData.totalRatings ?? 0,
    students: courseData.totalEnrollments ?? 0,
    level: courseData.level || "BEGINNER",
    price: courseData.free ? "Free" : courseData.actualPrice != null ? `₹${courseData.actualPrice}` : "—",
    discountPrice: courseData.discountPrice,
    image: courseData.thumbnailUrl || S1,
    language: courseData.language || "English",
    instructorName: instructor?.fullName,
    instructorCode: instructor?.instructorCode,
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "curriculum", label: `Curriculum (${modules.length} Modules)` },
    { key: "instructor", label: "Instructor Details" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-5 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <p className="text-sm text-gray-400">
            <Link to="/admin/all-courses" className="hover:text-teal-600 transition-colors">All Courses</Link>
            <span className="text-gray-300"> &gt; </span>
            <span className="text-gray-700 font-medium">{course.title}</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Hero Summary Card */}
            <div className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="relative w-full sm:w-72 h-48 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900 border border-gray-100">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                {course.promoVideoUrl && (
                  <a href={course.promoVideoUrl} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/55 transition-colors">
                    <FaPlay className="text-white w-8 h-8" />
                  </a>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 leading-tight mb-2">{course.title}</h1>
                  <p className="text-sm text-gray-500 line-clamp-3">{course.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FaStar className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold text-gray-900">{course.rating}</span>
                    <span className="text-gray-400">({course.reviews} ratings)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <FaUser className="w-4 h-4" />
                    <span>{course.students} Enrolled</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                    <span>{course.level} Level</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white">
                    <FaBook className="text-gray-400" />
                    {course.language}
                  </span>
                  <span className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white">
                    <FaClock className="text-gray-400" />
                    {modules.length} Modules
                  </span>
                  {courseData.settings?.certificatesEnabled && (
                    <span className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white">
                      <FaTrophy className="text-gray-400" />
                      Certificate included
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-6">
                {tabs.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`relative pb-3 pt-1 text-sm font-bold transition-colors ${activeTab === key ? "text-teal-600" : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    {label}
                    {activeTab === key && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Panels */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm min-h-[250px]">

              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">About this course</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {course.description || "No description provided."}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">E-Learning Outcomes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
                      {[
                        "Comprehensive core skills mastery",
                        "Practical labs and quizzes evaluation",
                        "Industry-aligned workflow patterns",
                        "Real-world projects implementation"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                          <FaCheckCircle className="text-teal-600" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "curriculum" && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 mb-2">Curriculum Syllabus</h3>
                  {modules.length === 0 ? (
                    <p className="text-sm text-gray-500 italic py-4">No modules found for this course.</p>
                  ) : (
                    modules.map((mod, i) => {
                      const lessonsList = moduleLessons[mod.slug] || [];
                      return (
                        <div key={mod.id || i} className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50/35">
                          <button
                            onClick={() => toggleModule(i, mod.slug)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition text-left"
                          >
                            <div>
                              <span className="block text-sm font-bold text-gray-800">{mod.title}</span>
                              {mod.description && <span className="block text-[11px] text-gray-400 mt-0.5">{mod.description}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">{mod.totalLessons ?? lessonsList.length ?? 0} Lessons</span>
                              <FaChevronDown className={`text-gray-400 transition-transform ${expandedModules[i] ? 'rotate-180' : ''}`} />
                            </div>
                          </button>

                          {expandedModules[i] && (
                            <div className="border-t border-gray-100 bg-white px-4 py-2 space-y-1">
                              {lessonsList.length === 0 ? (
                                <p className="text-xs text-gray-400 py-2 italic">No lessons inside this module.</p>
                              ) : (
                                lessonsList.map((lesson, j) => (
                                  <div key={lesson.id || j} className="flex items-center justify-between py-2 text-xs text-gray-600 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-2">
                                      {lesson.lessonType === "PDF" ? <FaFilePdf className="text-amber-500" /> : <FaVideo className="text-teal-500" />}
                                      <Link
                                        to={`/admin/course/${courseSlug}/lesson/${lesson.lessonSlug}`}
                                        className="font-semibold text-gray-700 hover:text-teal-600 transition-colors no-underline"
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {lesson.durationInMinutes && <span className="text-gray-400">{lesson.durationInMinutes} mins</span>}
                                      {lesson.previewAllowed && <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">FREE PREVIEW</span>}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === "instructor" && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-4">Instructor Profile</h3>
                  <div className="flex gap-4 p-5 bg-teal-50/40 rounded-2xl border border-teal-50">
                    <div className="w-14 h-14 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {course.instructorName ? course.instructorName.charAt(0) : "I"}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{course.instructorName || "No instructor assigned"}</h4>
                      <p className="text-xs text-teal-600 mb-2 font-medium">Instructor Code: {course.instructorCode || "N/A"}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Authorized educator at Vyntra Digita Matrix. Re-assigned to facilitate high-quality lessons, verify evaluations, and monitor student academic performance schedules.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT COLUMN (Actions Panel) */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <div className="sticky top-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="p-5 space-y-5">

                {/* Pricing summary */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Course Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-gray-900">
                      {course.free ? "Free" : course.discountPrice != null ? `₹${course.discountPrice}` : course.price}
                    </span>
                    {!course.free && course.discountPrice != null && courseData.actualPrice > 0 && (
                      <>
                        <span className="text-sm text-gray-400 line-through">₹{courseData.actualPrice}</span>
                        <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                          {Math.round(((courseData.actualPrice - courseData.discountPrice) / courseData.actualPrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Course Metadata info */}
                <div className="border-t border-gray-100 pt-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">System Status</span>
                    <span className={`font-bold px-2.5 py-0.5 rounded-full ${course.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : course.status === "ARCHIVED"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                      {course.status || "DRAFT"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Re-assign Code</span>
                    <span className="font-bold text-gray-800 uppercase">{course.instructorCode || "NONE"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Lifetime Access</span>
                    <span className="font-bold text-gray-800">{courseData.lifetimeAccess ? "YES" : `${courseData.validityInDays || 365} Days`}</span>
                  </div>
                </div>

                {/* Admin Actions Panel */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <p className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">Review Actions</p>

                  {course.status !== "PUBLISHED" && (
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={actionLoading}
                      className="w-full h-10 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border-none cursor-pointer"
                    >
                      <FaCheck /> Publish Course
                    </button>
                  )}

                  {course.status === "PUBLISHED" && (
                    <button
                      type="button"
                      onClick={handleArchive}
                      disabled={actionLoading}
                      className="w-full h-10 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FaArchive /> Archive Course
                    </button>
                  )}

                  <Link
                    to="/admin/all-courses"
                    className="w-full h-10 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition flex items-center justify-center gap-1.5 no-underline mt-2"
                  >
                    Back to All Courses
                  </Link>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CourseViewDetails;

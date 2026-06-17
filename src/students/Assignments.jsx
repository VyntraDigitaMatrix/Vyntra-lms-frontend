import React, { useMemo, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { studentAssignmentApi, studentEnrolledCourseApi } from "./auth/api";
import {
  FaFileAlt,
  FaClipboardList,
  FaExclamationCircle,
  FaSpinner,
  FaExternalLinkAlt,
} from "react-icons/fa";

import {
  extractArray,
  buildSubmissionMap,
  transformAssignment,
  Badge,
  iconBg,
} from "./components/AssignmentShared";
import PendingDetail from "./components/PendingDetail";
import SubmittedDetail from "./components/SubmittedDetail";
import GradedDetail from "./components/GradedDetail";

/* ─── Main Assignments Page ─── */
const Assignments = () => {
  const navigate = useNavigate();

  const [selectedCalDate, setSelectedCalDate] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [selected, setSelected] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedModule, setSelectedModule] = useState("All");
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [isModulesLoading, setIsModulesLoading] = useState(false);
  const [fetchProgress, setFetchProgress] = useState({ current: 0, total: 0 });

  const assignmentsRef = useRef([]);
  useEffect(() => {
    assignmentsRef.current = assignments;
  }, [assignments]);

  const tabs = ["All", "Pending", "Submitted", "Graded"];

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const statusMatch = activeTab === "All" || a.status === activeTab;
      const courseMatch =
        selectedCourse === "All" || String(a.courseId) === String(selectedCourse);
      const moduleMatch =
        selectedModule === "All" || String(a.moduleId) === String(selectedModule);
      return statusMatch && courseMatch && moduleMatch;
    });
  }, [assignments, activeTab, selectedCourse, selectedModule]);

  const overview = [
    { label: "Total Assignments", value: assignments.length, color: "bg-blue-100 text-blue-600" },
    { label: "Pending", value: assignments.filter((a) => a.status === "Pending").length, color: "bg-orange-100 text-orange-600" },
    { label: "Submitted", value: assignments.filter((a) => a.status === "Submitted").length, color: "bg-green-100 text-green-600" },
    { label: "Graded", value: assignments.filter((a) => a.status === "Graded").length, color: "bg-purple-100 text-purple-600" },
  ];

  const [currentDate, setCurrentDate] = useState(new Date());
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const dueDateMap = useMemo(() => {
    const map = {};
    assignments.forEach((a) => {
      if (a.dueDate) {
        const d = new Date(a.dueDate);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (!map[key]) map[key] = [];
        map[key].push(a);
      }
    });
    return map;
  }, [assignments]);

  const courseTitleMap = useMemo(() => {
    const map = {};
    courses.forEach((c) => { map[String(c.courseId)] = c.courseTitle; });
    return map;
  }, [courses]);

  function buttonLabel(status) {
    if (status === "Submitted") return "View Submission";
    if (status === "Graded") return "View Grade";
    return "View Details";
  }

  /* ── Navigate to the lesson inside the course player ── */
  const openInCoursePlayer = (item) => {
    // item.lessonId comes from the assignment API (lessonId / lesson_id field)
    // Route: /student/course/:courseId/module/:moduleId/lesson/:lessonId
    const lessonId = item.lessonId ?? item.lesson_id ?? item.lessonID;
    if (item.courseId && item.moduleId && lessonId) {
      navigate(
        `/student/course/${item.courseId}/module/${item.moduleId}/lesson/${lessonId}`
      );
    }
  };

  /* ── Whether this assignment can be opened in the course player ── */
  const hasLessonLink = (item) => {
    const lessonId = item.lessonId ?? item.lesson_id ?? item.lessonID;
    return !!(item.courseId && item.moduleId && lessonId);
  };

  /* ── Data fetching ── */

  const fetchSubmissions = async () => {
    try {
      const response = await studentAssignmentApi.getSubmissions();
      const rawSubs = extractArray(response.data);
      return buildSubmissionMap(rawSubs);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      return {};
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await studentEnrolledCourseApi.getMyEnrolledCourses();
      const coursesData = response.data?.data?.content || [];
      setCourses(coursesData);
      return coursesData;
    } catch (err) {
      console.error("Course fetch error:", err);
      setCourses([]);
      return [];
    }
  };

  const fetchAssignments = async (submissionMap = {}, coursesData = []) => {
    try {
      setLoading(true);
      setError("");
      setFetchProgress({ current: 0, total: 0 });

      if (coursesData.length === 0) {
        setAssignments([]);
        return [];
      }

      // First pass: count total modules for progress indicator
      let allModulesByCourse = [];
      for (const course of coursesData) {
        if (!course.courseId) continue;
        try {
          const modRes = await studentEnrolledCourseApi.getCourseModules(course.courseId);
          const mods =
            modRes.data?.data?.content ||
            modRes.data?.content ||
            modRes.data?.data ||
            (Array.isArray(modRes.data) ? modRes.data : []);
          allModulesByCourse.push({ course, mods: Array.isArray(mods) ? mods : [] });
        } catch (err) {
          console.error(`Error fetching modules for course ${course.courseId}:`, err);
          allModulesByCourse.push({ course, mods: [] });
        }
      }

      const totalModules = allModulesByCourse.reduce((sum, x) => sum + x.mods.length, 0);
      setFetchProgress({ current: 0, total: totalModules });

      const allAssignments = [];
      let processedModules = 0;

      for (const { course, mods } of allModulesByCourse) {
        const courseId = course.courseId;

        for (const mod of mods) {
          processedModules++;
          setFetchProgress({ current: processedModules, total: totalModules });

          const moduleId = mod.id ?? mod.moduleId;
          if (!moduleId) continue;

          try {
            const res = await studentAssignmentApi.getAssignmentsByModule(moduleId);
            const rawItems = extractArray(res.data);
            if (rawItems.length === 0) continue;

            const transformed = rawItems.map((item) => {
              const base = transformAssignment(item, submissionMap);
              return {
                ...base,
                // Ensure ID is always set
                id: base.id || item.id || item.assignmentId || item._id,
                // Stamp course + module context
                courseId,
                moduleId,
                courseName: course.courseTitle,
                moduleName: mod.title || mod.moduleName || `Module ${moduleId}`,
                // ── Lesson link fields ──
                // The assignment API may return the associated lesson ID under
                // different field names. Capture all common variants here.
                lessonId:
                  item.lessonId ??
                  item.lesson_id ??
                  item.lessonID ??
                  item.lesson?.id ??
                  null,
              };
            });

            allAssignments.push(...transformed);
          } catch (err) {
            console.error(`Error fetching assignments for module ${moduleId}:`, err);
          }
        }
      }

      // Deduplicate by id
      const seen = new Set();
      const unique = allAssignments.filter((a) => {
        if (!a.id) return false;
        if (seen.has(a.id)) return false;
        seen.add(a.id);
        return true;
      });

      console.log(`Total unique assignments: ${unique.length}`);
      setAssignments(unique);
      return unique;
    } catch (err) {
      console.error("Error in fetchAssignments:", err);
      setError(err?.response?.data?.message || "Failed to load assignments. Please try again.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (courseId) => {
    try {
      setIsModulesLoading(true);
      const response = await studentEnrolledCourseApi.getCourseModules(courseId);
      const data =
        response.data?.data?.content ||
        response.data?.content ||
        response.data?.data ||
        (Array.isArray(response.data) ? response.data : []);
      setModules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Module fetch error:", err);
      setModules([]);
    } finally {
      setIsModulesLoading(false);
    }
  };

  const loadAll = async () => {
    const [subMap, coursesData] = await Promise.all([
      fetchSubmissions(),
      fetchCourses(),
    ]);
    await fetchAssignments(subMap, coursesData);
  };

  /* ── Open assignment detail (existing modal flow) ── */
  const openAssignment = async (assignmentItem) => {
    if (!assignmentItem?.id) {
      alert("Cannot open assignment: Invalid assignment data");
      return;
    }

    setDetailLoading(true);
    try {
      let detailResponse;
      try {
        detailResponse = await studentAssignmentApi.getAssignmentById(assignmentItem.id);
      } catch (err) {
        const existing = assignmentsRef.current.find((a) => a.id === assignmentItem.id);
        if (existing) { setSelected(existing); return; }
        throw err;
      }

      const raw = detailResponse.data;
      const detail = raw?.data ?? raw;
      const subMap = await fetchSubmissions();

      const merged = transformAssignment(
        {
          ...detail,
          courseId: assignmentItem.courseId,
          moduleId: detail.moduleId ?? assignmentItem.moduleId,
        },
        subMap
      );

      setSelected({
        ...merged,
        id: merged.id || assignmentItem.id,
        courseId: assignmentItem.courseId,
        moduleId: assignmentItem.moduleId,
        lessonId: assignmentItem.lessonId,
        courseName: assignmentItem.courseName || courseTitleMap[String(assignmentItem.courseId)],
        moduleName: assignmentItem.moduleName,
      });
    } catch (err) {
      console.error("Error in openAssignment:", err);
      const fallback = assignmentsRef.current.find((a) => a.id === assignmentItem.id);
      if (fallback) setSelected(fallback);
      else alert("Failed to load assignment details. Please try again.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSubmitAssignment = async (assignmentId, submissionText, file) => {
    try {
      const response = await studentAssignmentApi.submitAssignment(assignmentId, submissionText, file);
      console.log(response.data);
      alert("Assignment submitted successfully");
      await loadAll();
    } catch (err) {
      console.error("Submission error:", err.response?.data);
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  const handleResubmit = (assignment) => {
    setSelected({ ...assignment, status: "Pending" });
  };

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    setSelectedModule("All");
    if (selectedCourse === "All" || !selectedCourse) { setModules([]); return; }
    fetchModules(selectedCourse);
  }, [selectedCourse]);

  /* ── Render states ── */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-600 text-3xl mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {fetchProgress.total > 0
              ? `Loading assignments... (${fetchProgress.current}/${fetchProgress.total} modules)`
              : "Loading assignments..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <div className="text-center">
          <FaExclamationCircle className="text-red-500 text-3xl mx-auto mb-3" />
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button onClick={loadAll} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (selected) {
    const onBack = () => setSelected(null);
    if (selected.status === "Pending")
      return <PendingDetail assignment={selected} onBack={onBack} onSubmit={handleSubmitAssignment} />;
    if (selected.status === "Submitted")
      return <SubmittedDetail assignment={selected} onBack={onBack} onResubmit={handleResubmit} allowResubmission={selected.allowResubmission} />;
    if (selected.status === "Graded")
      return <GradedDetail assignment={selected} onBack={onBack} />;
  }

  /* ── Main list view ── */
  return (
    <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-5">
      {detailLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-3 shadow-xl">
            <FaSpinner className="animate-spin text-blue-600 text-2xl" />
            <p className="text-sm text-gray-600">Loading assignment details...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left: Assignment list */}
        <div className="w-full lg:col-span-9">
          <div className="mb-4 sm:mb-5">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">
              <Link to="/student/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
              <span className="mx-1 sm:mx-2">&gt;</span>
              <span className="text-gray-600 font-medium">Assignments</span>
            </p>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Assignments</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
              Complete assignments to enhance your learning and track your progress.
            </p>
          </div>

          {/* Tabs + Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-gray-200 mb-4 pb-3 gap-4">
            <div className="flex gap-4 sm:gap-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 sm:pb-3 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                    activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-600"
                  }`}
                >
                  {tab}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                    activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {tab === "All"
                      ? assignments.length
                      : assignments.filter((a) => a.status === tab).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="All">All Courses</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseTitle}
                </option>
              ))}
            </select>

            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedCourse === "All" || isModulesLoading}
            >
              <option value="All">
                {selectedCourse === "All"
                  ? "Select a course first"
                  : isModulesLoading
                  ? "Loading modules..."
                  : "All Modules"}
              </option>
              {modules.map((module) => (
                <option key={module.id ?? module.moduleId} value={module.id ?? module.moduleId}>
                  {module.title ?? module.moduleName ?? `Module ${module.id ?? module.moduleId}`}
                </option>
              ))}
            </select>
          </div>

          {/* Assignment cards */}
          <div className="space-y-3 sm:space-y-4">
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const canOpenInPlayer = hasLessonLink(item);
                return (
                  <div
                    key={item.id || Math.random()}
                    className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg[item.status] || "bg-gray-100 text-gray-500"}`}>
                          <FaFileAlt className="text-base sm:text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="font-bold text-gray-900 text-sm sm:text-base">
                            {item.title || "Untitled"}
                          </h2>
                          <p className="text-[11px] sm:text-sm font-semibold text-gray-700 mt-0.5 sm:mt-1">
                            {courseTitleMap[String(item.courseId)] || item.courseName || `Course ${item.courseId}`}
                            {" · "}
                            {item.moduleName || `Module ${item.moduleId}`}
                          </p>
                          <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Badge status={item.status} />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                        <div>
                          <p className="text-[9px] sm:text-xs text-gray-400 font-semibold">Due Date</p>
                          <p className="text-[10px] sm:text-sm font-bold text-red-500">
                            {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "Not set"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] sm:text-xs text-gray-400 font-semibold">Marks</p>
                          {item.status === "Graded" ? (
                            <p className="text-[10px] sm:text-sm font-bold text-blue-600">
                              {item.scoredMarks}/{item.maxMarks}
                            </p>
                          ) : (
                            <p className="text-[10px] sm:text-sm font-bold text-gray-800">
                              {item.maxMarks}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          {/* Open in Course Player — shown when lessonId is available */}
                          {canOpenInPlayer && (
                            <button
                              onClick={() => openInCoursePlayer(item)}
                              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-600 text-[10px] sm:text-sm font-semibold hover:bg-gray-50 transition"
                              title="Open in course player"
                            >
                              <FaExternalLinkAlt className="text-[9px] sm:text-xs" />
                              <span className="hidden sm:inline">Open in Course</span>
                              <span className="sm:hidden">Course</span>
                            </button>
                          )}

                          {/* Primary action — opens detail view */}
                          <button
                            onClick={() => openAssignment(item)}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-blue-500 text-blue-600 text-[10px] sm:text-sm font-semibold hover:bg-blue-600 hover:text-white transition"
                          >
                            {buttonLabel(item.status)}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <FaFileAlt className="text-gray-300 text-3xl mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-semibold">
                  No {activeTab !== "All" ? activeTab.toLowerCase() : ""} assignments found
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {selectedCourse !== "All" || selectedModule !== "All"
                    ? "Try adjusting your filters."
                    : "No assignments available for your enrolled courses."}
                </p>
                {(selectedCourse !== "All" || selectedModule !== "All") && (
                  <button
                    onClick={() => { setSelectedCourse("All"); setSelectedModule("All"); }}
                    className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Overview + Calendar */}
        <div className="w-full lg:col-span-3 space-y-4 sm:space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <h2 className="font-bold text-gray-900 text-sm sm:text-base mb-3 sm:mb-5">Assignment Overview</h2>
            <div className="space-y-2.5 sm:space-y-3">
              {overview.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center ${item.color}`}>
                      <FaClipboardList className="text-xs sm:text-sm" />
                    </div>
                    <span className="text-[11px] sm:text-sm font-semibold text-gray-700">{item.label}</span>
                  </div>
                  <span className="font-bold text-gray-900 text-xs sm:text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 sm:mb-5">
              <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="text-gray-400 text-base sm:text-xl hover:text-blue-600">‹</button>
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">{monthNames[month]} {year}</h2>
              <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="text-gray-400 text-base sm:text-xl hover:text-blue-600">›</button>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-3 text-center text-[9px] sm:text-xs text-gray-400 mb-2 sm:mb-3">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => <span key={d}>{d}</span>)}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-3 text-center text-xs sm:text-sm">
              {calendarDays.map((date, i) => {
                if (!date) return <span key={i} />;
                const key = `${year}-${month}-${date}`;
                const items = dueDateMap[key];
                const statusColor = items
                  ? items.some((a) => a.status === "Pending") ? "bg-orange-100 text-orange-600"
                    : items.some((a) => a.status === "Submitted") ? "bg-green-100 text-green-600"
                    : "bg-blue-100 text-blue-600"
                  : "";
                const isSelected = selectedCalDate === key;
                const dotColor = items
                  ? items.some((a) => a.status === "Pending") ? "bg-orange-500"
                    : items.some((a) => a.status === "Submitted") ? "bg-green-500"
                    : "bg-blue-500"
                  : "";
                return (
                  <span
                    key={i}
                    onClick={() => items && setSelectedCalDate(isSelected ? null : key)}
                    className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full mx-auto text-[11px] sm:text-sm relative
                      ${items ? `cursor-pointer font-semibold ${statusColor}` : "text-gray-600"}
                      ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""}
                    `}
                    title={items ? items.map((a) => a.title).join(", ") : ""}
                  >
                    {date}
                    {items && <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${dotColor}`} />}
                  </span>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 pt-3 border-t border-gray-100">
              {[["bg-orange-500","Pending"],["bg-green-500","Submitted"],["bg-blue-500","Graded"]].map(([color, label]) => (
                <div key={label} className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  {label}
                </div>
              ))}
            </div>

            {selectedCalDate && dueDateMap[selectedCalDate] ? (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                {dueDateMap[selectedCalDate].map((a, i) => (
                  <div
                    key={i}
                    onClick={() => openAssignment(a)}
                    className="flex items-center justify-between bg-gray-50 rounded-xl p-2 sm:p-3 border border-gray-100 cursor-pointer hover:border-blue-200 hover:bg-blue-50 transition"
                  >
                    <div>
                      <p className="text-[11px] sm:text-xs font-semibold text-gray-800 leading-tight">{a.title}</p>
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                        Due {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "Not set"}
                      </p>
                    </div>
                    <Badge status={a.status} />
                  </div>
                ))}
              </div>
            ) : !selectedCalDate ? (
              <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-3 pt-3 border-t border-gray-100">
                Tap a highlighted date to see due assignments
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
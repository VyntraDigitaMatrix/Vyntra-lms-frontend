import React, { useMemo, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  const { assignmentSlug } = useParams();

  const [selectedCalDate, setSelectedCalDate] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [selected, setSelected] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [courses, setCourses] = useState([]);
  const [fetchProgress, setFetchProgress] = useState({ current: 0, total: 0 });

  const assignmentsRef = useRef([]);
  useEffect(() => {
    assignmentsRef.current = assignments;
  }, [assignments]);

  const tabs = ["All", "Pending", "Submitted", "Graded"];

  const derivedModules = useMemo(() => {
    if (selectedCourse === "All") return [];
    const mods = new Map();
    assignments.forEach(a => {
      if (String(a.courseId) === String(selectedCourse) && a.moduleId) {
        mods.set(String(a.moduleId), a.moduleName || `Module ${a.moduleId}`);
      }
    });
    return Array.from(mods.entries()).map(([id, name]) => ({ id, name }));
  }, [assignments, selectedCourse]);

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const statusMatch = activeTab === "All" || a.status === activeTab;
      const courseMatch =
        selectedCourse === "All" || String(a.courseId) === String(selectedCourse);
      const moduleMatch =
        selectedModule === "All" || String(a.moduleId) === String(selectedModule);
      const typeMatch = 
        selectedType === "All" || a.assignmentType === selectedType;
      return statusMatch && courseMatch && moduleMatch && typeMatch;
    });
  }, [assignments, activeTab, selectedCourse, selectedModule, selectedType]);

  const overview = [
    { label: "Total Assignments", value: assignments.length, color: "bg-[#043573]/10 text-[#043573]" },
    { label: "Pending", value: assignments.filter((a) => a.status === "Pending").length, color: "bg-orange-100 text-orange-600" },
    { label: "Submitted", value: assignments.filter((a) => a.status === "Submitted").length, color: "bg-green-100 text-green-600" },
    { label: "Graded", value: assignments.filter((a) => a.status === "Graded").length, color: "bg-purple-100 text-purple-600" },
  ];

  const [currentDate, setCurrentDate] = useState(new Date());
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
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
    const lId = item.lessonSlug ?? item.lessonId ?? item.lesson_id ?? item.lessonID;
    const mId = item.moduleSlug ?? item.moduleId ?? item.module_id ?? item.moduleID;
    const cId = item.courseSlug ?? item.courseId ?? item.course_id ?? item.courseID;
    if (cId && mId && lId) {
      navigate(`/student/course/${cId}/module/${mId}/lesson/${lId}`);
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

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const [assignRes, subMap] = await Promise.all([
        studentAssignmentApi.getAssignments().catch(err => {
          console.error("Assignments API error:", err);
          return { data: [] };
        }),
        fetchSubmissions().catch(() => ({}))
      ]);

      const rawItems = extractArray(assignRes.data);

      const transformed = rawItems.map((item) => {
        // We use the shared transformAssignment function to ensure ALL 
        // fields like submittedDate, submittedFiles, etc are mapped correctly.
        const merged = transformAssignment(item, subMap);
        return {
          ...merged,
          courseId: item.courseId,
          moduleId: item.moduleId,
          lessonId: item.lessonId,
          courseName: item.courseName,
          moduleName: item.moduleName,
          lessonName: item.lessonName,
          assignmentType: item.assignmentType,
          submitted: item.submitted,
          graded: item.graded,
          assignmentStatus: item.assignmentStatus,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        };
      });

      setAssignments(transformed);
      return transformed;
    } catch (err) {
      console.error("Error in fetchAssignments:", err);
      setError(err?.response?.data?.message || "Failed to load assignments. Please try again.");
      return [];
    } finally {
      setLoading(false);
    }
  };


  const loadAll = async () => {
    await Promise.all([
      fetchCourses(),
      fetchAssignments()
    ]);
  };

  /* ── Open assignment detail (existing modal flow) ── */
  const openAssignment = async (assignmentItem) => {
    if (!assignmentItem?.id && !assignmentItem?.assignmentSlug) {
      alert("Cannot open assignment: Invalid assignment data");
      return;
    }

    setDetailLoading(true);
    try {
      let detailResponse;
      try {
        const slugOrId = assignmentItem.assignmentSlug || assignmentItem.id;
        detailResponse = await studentAssignmentApi.getAssignmentBySlug(slugOrId);
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
        slug: merged.slug || assignmentItem.assignmentSlug || assignmentItem.slug || null,
        assignmentSlug: merged.assignmentSlug || assignmentItem.assignmentSlug || assignmentItem.slug || null,
        courseId: assignmentItem.courseId,
        moduleId: assignmentItem.moduleId,
        lessonId: assignmentItem.lessonId,
        courseName: assignmentItem.courseName || courseTitleMap[String(assignmentItem.courseId)],
        moduleName: assignmentItem.moduleName,
      });
      if (assignmentSlug !== slugOrId) {
        navigate(`/student/assignments/${slugOrId}`);
      }
    } catch (err) {
      console.error("Error in openAssignment:", err);
      const fallback = assignmentsRef.current.find((a) => a.id === assignmentItem.id);
      if (fallback) {
        setSelected(fallback);
        const slugOrId = fallback.assignmentSlug || fallback.slug || fallback.id;
        if (assignmentSlug !== slugOrId) {
          navigate(`/student/assignments/${slugOrId}`);
        }
      } else {
        alert("Failed to load assignment details. Please try again.");
        if (assignmentSlug) navigate("/student/assignments");
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSubmitAssignment = async (assignmentId, submissionText, file) => {
    const slugOrId = selected?.slug ?? selected?.assignmentSlug ?? assignmentId;
    try {
      const response = await studentAssignmentApi.submitAssignment(slugOrId, submissionText, file);
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
    if (assignmentSlug && !selected && !detailLoading && assignments.length > 0) {
      const found = assignments.find(
        (a) => a.assignmentSlug === assignmentSlug || String(a.id) === assignmentSlug
      );
      if (found) {
        openAssignment(found);
      } else {
        alert("Assignment not found.");
        navigate("/student/assignments");
      }
    } else if (!assignmentSlug && selected) {
      setSelected(null);
    }
  }, [assignmentSlug, selected, detailLoading, assignments, navigate]);

  useEffect(() => {
    setSelectedModule("All");
  }, [selectedCourse]);

  /* ── Render states ── */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-[#043573] text-3xl mx-auto mb-3" />
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
          <button onClick={loadAll} className="px-4 py-2 bg-[#043573] text-white rounded-lg text-sm hover:bg-[#043573]/90 transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (selected) {
    const onBack = () => {
      setSelected(null);
      navigate("/student/assignments");
    };
    if (selected.status === "Pending")
      return <PendingDetail assignment={selected} onBack={onBack} onSubmit={handleSubmitAssignment} />;
    if (selected.status === "Submitted")
      return <SubmittedDetail assignment={selected} onBack={onBack} onResubmit={handleResubmit} allowResubmission={selected.allowResubmission} />;
    if (selected.status === "Graded")
      return <GradedDetail assignment={selected} onBack={onBack} />;
  }

  /* ── Main list view ── */
  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-slate-50/60 max-w-7xl mx-auto space-y-6">
      {detailLoading && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 shadow-2xl">
            <FaSpinner className="animate-spin text-[#043573] text-2xl" />
            <p className="text-xs font-semibold text-slate-700">Loading assignment details...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        {/* Left: Assignment list */}
        <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-xs">
            <p className="text-xs text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
              <Link to="/student/dashboard" className="hover:text-[#043573] transition">Dashboard</Link>
              <span>&gt;</span>
              <span className="text-slate-700 font-semibold">Assignments</span>
            </p>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Assignments</h1>
            <p className="text-xs text-slate-500 mt-1">
              Complete assignments to enhance your learning and track your progress.
            </p>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pt-4 border-t border-slate-100 mt-4 scrollbar-hide">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                const count = tab === "All" ? assignments.length : assignments.filter((a) => a.status === tab).length;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? "bg-[#043573] text-white shadow-md shadow-[#043573]/20"
                        : "bg-slate-100/70 text-slate-600 hover:bg-slate-100 hover:text-[#043573]"
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filters row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium bg-slate-50/50 outline-none focus:border-[#043573] transition-all cursor-pointer"
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
                className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium bg-slate-50/50 outline-none focus:border-[#043573] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={selectedCourse === "All" || derivedModules.length === 0}
              >
                <option value="All">
                  {selectedCourse === "All"
                    ? "Select a course first"
                    : derivedModules.length === 0
                      ? "No modules available"
                      : "All Modules"}
                </option>
                {derivedModules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium bg-slate-50/50 outline-none focus:border-[#043573] transition-all cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="IN_CLASS_ASSIGNMENT">In Class Assignment</option>
                <option value="HOMEWORK_ASSIGNMENT">Home Assignment</option>
              </select>
            </div>
          </div>

          {/* Assignment cards */}
          <div className="space-y-4">
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const canOpenInPlayer = hasLessonLink(item);
                return (
                  <div
                    key={item.id || Math.random()}
                    className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg[item.status] || "bg-slate-100 text-slate-500"}`}>
                        <FaFileAlt className="text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#043573] transition-colors">
                            {item.title || "Untitled"}
                          </h3>
                          <Badge status={item.status} />
                        </div>
                        <p className="text-xs font-semibold text-slate-600 mt-1">
                          {courseTitleMap[String(item.courseId)] || item.courseName || `Course ${item.courseId}`}
                          {" · "}
                          {item.moduleName || `Module ${item.moduleId}`}
                        </p>
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">Due Date</p>
                          <p className="text-xs font-bold text-rose-600">
                            {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "Not set"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">Marks</p>
                          {item.status === "Graded" ? (
                            <p className="text-xs font-black text-[#043573]">
                              {item.scoredMarks}/{item.maxMarks}
                            </p>
                          ) : (
                            <p className="text-xs font-bold text-slate-800">
                              {item.maxMarks}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {canOpenInPlayer && (
                          <button
                            onClick={() => openInCoursePlayer(item)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                            title="Open in course player"
                          >
                            <FaExternalLinkAlt className="text-[10px]" />
                            <span>Course</span>
                          </button>
                        )}

                        <button
                          onClick={() => openAssignment(item)}
                          className="px-4 py-2 rounded-xl border border-[#043573] text-[#043573] text-xs font-bold hover:bg-[#043573] hover:text-white transition-all cursor-pointer shadow-2xs"
                        >
                          {buttonLabel(item.status)}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/70 p-12 text-center shadow-xs">
                <FaFileAlt className="text-slate-300 text-3xl mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-800">
                  No {activeTab !== "All" ? activeTab.toLowerCase() : ""} assignments found
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {selectedCourse !== "All" || selectedModule !== "All"
                    ? "Try adjusting your filters."
                    : "No assignments available for your enrolled courses."}
                </p>
                {(selectedCourse !== "All" || selectedModule !== "All") && (
                  <button
                    onClick={() => { setSelectedCourse("All"); setSelectedModule("All"); }}
                    className="mt-4 px-4 py-2 bg-blue-50 text-[#043573] rounded-xl text-xs font-bold hover:bg-blue-100 transition-all cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Overview + Calendar */}
        <div className="w-full lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Assignment Overview</h3>
            <div className="space-y-3">
              {overview.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color} font-bold text-sm`}>
                      <FaClipboardList />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  </div>
                  <span className="font-black text-slate-900 text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="text-slate-400 text-lg hover:text-[#043573] p-1 font-bold cursor-pointer">‹</button>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{monthNames[month]} {year}</h3>
              <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="text-slate-400 text-lg hover:text-[#043573] p-1 font-bold cursor-pointer">›</button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => <span key={d}>{d}</span>)}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {calendarDays.map((date, i) => {
                if (!date) return <span key={i} />;
                const key = `${year}-${month}-${date}`;
                const items = dueDateMap[key];
                const statusColor = items
                  ? items.some((a) => a.status === "Pending") ? "bg-amber-100 text-amber-700 font-bold"
                    : items.some((a) => a.status === "Submitted") ? "bg-emerald-100 text-emerald-700 font-bold"
                      : "bg-blue-100 text-[#043573] font-bold"
                  : "";
                const isSelected = selectedCalDate === key;
                return (
                  <span
                    key={i}
                    onClick={() => items && setSelectedCalDate(isSelected ? null : key)}
                    className={`w-7 h-7 flex items-center justify-center rounded-xl mx-auto text-xs relative transition-all ${
                      items ? `cursor-pointer ${statusColor}` : "text-slate-600 hover:bg-slate-100"
                    } ${isSelected ? "ring-2 ring-[#043573] ring-offset-1" : ""}`}
                    title={items ? items.map((a) => a.title).join(", ") : ""}
                  >
                    {date}
                  </span>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2.5 mt-3 pt-3 border-t border-slate-100">
              {[["bg-amber-500", "Pending"], ["bg-emerald-500", "Submitted"], ["bg-blue-600", "Graded"]].map(([color, label]) => (
                <div key={label} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  {label}
                </div>
              ))}
            </div>

            {selectedCalDate && dueDateMap[selectedCalDate] ? (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                {dueDateMap[selectedCalDate].map((a, i) => (
                  <div
                    key={i}
                    onClick={() => openAssignment(a)}
                    className="flex items-center justify-between bg-slate-50 rounded-xl p-2.5 border border-slate-100 cursor-pointer hover:border-[#043573]/30 transition"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{a.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        Due {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "Not set"}
                      </p>
                    </div>
                    <Badge status={a.status} />
                  </div>
                ))}
              </div>
            ) : !selectedCalDate ? (
              <p className="text-[10px] font-medium text-slate-400 text-center mt-3 pt-3 border-t border-slate-100">
                Tap a highlighted date to view due assignments
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
import React, { useState, useEffect, useCallback } from "react";
import {
  MdVideoCall, MdAdd, MdClose, MdContentCopy, MdCheck,
  MdCalendarToday, MdAccessTime, MdInfo,
  MdMeetingRoom, MdLink, MdVpnKey, MdSearch,
  MdArrowForward,
} from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaVideo, FaLaptop, FaChevronRight, FaRegCalendarAlt } from "react-icons/fa";
import {
  instructorZoomApi,
  instructorCourseApi,
  instructorModuleApi,
  instructorLessonApi,
} from "../auth/api";

/* ─── Helpers ─── */
const extractList = (res) => {
  const body = res?.data?.data ?? res?.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.content)) return body.content;
  return [];
};

const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fmtTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/* ─── Toast ─── */
function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-3 animate-bounce ${
      type === "error" ? "bg-red-600" : "bg-emerald-600"
    }`}>
      <span>{msg}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200 font-bold ml-2">&times;</button>
    </div>
  );
}

/* ─── Schedule Modal ─── */
const EMPTY_FORM = {
  topic: "",
  agenda: "",
  courseSlug: "",
  moduleSlug: "",
  lessonSlug: "",
  startTime: "",
  duration: 60,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
};

function ScheduleMeetingModal({ onClose, onSaved, coursesList, initialCourseSlug }) {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    courseSlug: initialCourseSlug || "",
  });
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const up = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Load modules when course selection changes
  useEffect(() => {
    setModules([]);
    up("moduleSlug", "");
    if (!form.courseSlug) return;
    instructorModuleApi
      .getCourseModules(form.courseSlug, 0, 100)
      .then((res) => setModules(res?.data?.data?.content ?? extractList(res)))
      .catch((err) => console.error("Failed to load modules", err));
  }, [form.courseSlug]);

  // Load lessons when module selection changes
  useEffect(() => {
    setLessons([]);
    up("lessonSlug", "");
    if (!form.moduleSlug) return;
    instructorLessonApi
      .getModuleLessons(form.moduleSlug, 0, 100)
      .then((res) => setLessons(res?.data?.data?.content ?? extractList(res)))
      .catch((err) => console.error("Failed to load lessons", err));
  }, [form.moduleSlug]);

  const handleSave = async () => {
    if (!form.topic.trim()) {
      setError("Topic is required.");
      return;
    }
    if (!form.courseSlug) {
      setError("Course selection is required.");
      return;
    }
    if (!form.startTime) {
      setError("Start time is required.");
      return;
    }
    if (form.duration <= 0) {
      setError("Duration must be a positive number.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const chosenCourse = coursesList.find((c) => (c.slug || c.id) === form.courseSlug);
      const chosenModule = modules.find((m) => (m.slug || m.id) === form.moduleSlug);
      const chosenLesson = lessons.find((l) => (l.lessonSlug || l.id) === form.lessonSlug);

      // Format datetime-local "YYYY-MM-DDTHH:MM" to "YYYY-MM-DDTHH:MM:00"
      let formattedStartTime = form.startTime;
      if (formattedStartTime && formattedStartTime.length === 16) {
        formattedStartTime += ":00";
      }

      const payload = {
        courseId: chosenCourse ? chosenCourse.id : null,
        moduleId: chosenModule ? chosenModule.id : null,
        lessonId: chosenLesson ? chosenLesson.id : null,
        topic: form.topic.trim(),
        agenda: form.agenda.trim(),
        startTime: formattedStartTime,
        duration: Number(form.duration),
        timezone: form.timezone,
      };

      await instructorZoomApi.createMeeting(payload);
      onSaved();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to schedule Zoom meeting.");
    } finally {
      setSaving(false);
    }
  };

  const inp =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-white";
  const lbl =
    "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
              <MdVideoCall size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Schedule Zoom Meeting</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
              <MdInfo size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Context details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className={lbl}>Course*</label>
              <select
                value={form.courseSlug}
                onChange={(e) => up("courseSlug", e.target.value)}
                className={inp}
              >
                <option value="">— Select Course —</option>
                {coursesList.map((c) => (
                  <option key={c.slug || c.id} value={c.slug || c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>Module (Optional)</label>
              <select
                value={form.moduleSlug}
                onChange={(e) => up("moduleSlug", e.target.value)}
                disabled={!form.courseSlug}
                className={inp}
              >
                <option value="">— Select Module —</option>
                {modules.map((m) => (
                  <option key={m.slug || m.id} value={m.slug || m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>Lesson (Optional)</label>
              <select
                value={form.lessonSlug}
                onChange={(e) => up("lessonSlug", e.target.value)}
                disabled={!form.moduleSlug}
                className={inp}
              >
                <option value="">— Select Lesson —</option>
                {lessons.map((l) => (
                  <option key={l.lessonSlug || l.id} value={l.lessonSlug || l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={lbl}>Meeting Topic*</label>
            <input
              type="text"
              value={form.topic}
              onChange={(e) => up("topic", e.target.value)}
              placeholder="e.g. Introduction to React Hooks & State"
              className={inp}
            />
          </div>

          <div>
            <label className={lbl}>Agenda / Description</label>
            <textarea
              value={form.agenda}
              onChange={(e) => up("agenda", e.target.value)}
              placeholder="Brief agenda of what will be covered in this live session..."
              rows={3}
              className={inp}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Start Time*</label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => up("startTime", e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Duration (Minutes)*</label>
              <input
                type="number"
                min="5"
                max="360"
                value={form.duration}
                onChange={(e) => up("duration", e.target.value)}
                className={inp}
              />
            </div>
          </div>

          <div>
            <label className={lbl}>Timezone</label>
            <input
              type="text"
              value={form.timezone}
              onChange={(e) => up("timezone", e.target.value)}
              className={inp}
              placeholder="e.g. Asia/Kolkata"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Detected local timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-55 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            {saving ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin text-sm" />
                Scheduling...
              </>
            ) : (
              "Schedule Meeting"
            )}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 border border-gray-200 bg-white text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function ZoomMeetings() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch all courses
  useEffect(() => {
    instructorCourseApi
      .getInstructorCourses(0, 100)
      .then((res) => {
        const fetched = extractList(res);
        setCourses(fetched);
        if (fetched.length > 0) {
          setSelectedCourseSlug(fetched[0].slug || fetched[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to load courses", err);
        showToast("Failed to load courses.", "error");
      });
  }, []);

  // Fetch meetings for selected course
  const loadMeetings = useCallback(async (courseSlug) => {
    if (!courseSlug) return;
    setLoading(true);
    try {
      const res = await instructorZoomApi.getMeetingsForCourse(courseSlug);
      setMeetings(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch meetings for course", err);
      // Fallback: clear the list on error
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCourseSlug) {
      loadMeetings(selectedCourseSlug);
    }
  }, [selectedCourseSlug, loadMeetings]);

  const handleCopy = (text, id, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(`${id}-${type}`);
    showToast("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartMeeting = (startUrl) => {
    if (startUrl) {
      window.open(startUrl, "_blank");
    } else {
      showToast("Start URL is not available", "error");
    }
  };

  // Filter meetings locally by search query
  const filteredMeetings = meetings.filter((m) => {
    const query = search.toLowerCase();
    return (
      m.topic?.toLowerCase().includes(query) ||
      m.agenda?.toLowerCase().includes(query) ||
      m.zoomMeetingId?.includes(query)
    );
  });

  // Calculate statistics
  const now = new Date();
  const stats = {
    total: meetings.length,
    upcoming: meetings.filter((m) => m.startTime && new Date(m.startTime) > now).length,
    completed: meetings.filter((m) => m.status === "FINISHED" || (m.startTime && new Date(m.startTime) < now)).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md">
              <FaLaptop size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Zoom Live Classes</h1>
              <p className="text-xs text-gray-500 mt-0.5">Schedule, configure and host live webinars and sessions.</p>
            </div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition shadow-md hover:shadow-lg self-start sm:self-center"
          >
            <MdAdd size={18} /> Schedule Live Class
          </button>
        </div>
      </div>

      <div className="flex-1 px-8 py-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Sessions", value: stats.total, bg: "bg-violet-50", text: "text-violet-700", border: "border-t-violet-500", icon: "💻" },
            { label: "Upcoming Classes", value: stats.upcoming, bg: "bg-emerald-50", text: "text-emerald-700", border: "border-t-emerald-500", icon: "📅" },
            { label: "Past Sessions", value: stats.completed, bg: "bg-slate-50", text: "text-slate-600", border: "border-t-slate-500", icon: "🏁" },
          ].map(({ label, value, bg, text, border, icon }) => (
            <div
              key={label}
              className={`bg-white rounded-xl border border-gray-200 ${border} border-t-2 p-4 shadow-sm flex items-center gap-3.5`}
            >
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                {icon}
              </div>
              <div>
                <div className={`text-2xl font-black ${text} leading-none`}>{value}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 min-w-[200px] max-w-sm">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
              Active Course Context
            </label>
            <select
              value={selectedCourseSlug}
              onChange={(e) => setSelectedCourseSlug(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 bg-white"
            >
              {courses.map((c) => (
                <option key={c.slug || c.id} value={c.slug || c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-1 items-center gap-2.5 max-w-md w-full border border-gray-200 rounded-lg px-3 py-2 focus-within:border-violet-400 transition bg-white ml-auto">
            <MdSearch className="text-gray-400 text-lg flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search meetings by topic or agenda..."
              className="w-full bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* List of Meetings */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AiOutlineLoading3Quarters className="animate-spin text-3xl text-violet-600" />
            <p className="text-sm font-semibold text-gray-500">Loading live classes...</p>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl py-16 px-4 text-center shadow-sm flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
              <FaRegCalendarAlt size={30} />
            </div>
            <h3 className="text-base font-bold text-gray-900">No Live Classes Scheduled</h3>
            <p className="text-xs text-gray-500 mt-1.5 max-w-xs mx-auto">
              Schedule interactive meetings linked to courses, modules, or lessons for your students.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-5 flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition shadow-md"
            >
              <MdAdd size={16} /> Schedule Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMeetings.map((meeting) => {
              const isPast = meeting.startTime && new Date(meeting.startTime) < now;
              const hasStartUrl = Boolean(meeting.startUrl);
              const formattedDate = fmtDate(meeting.startTime);
              const formattedTime = fmtTime(meeting.startTime);

              return (
                <div
                  key={meeting.id}
                  className="bg-white border border-gray-200 hover:border-violet-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Status & Breadcrumbs */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap gap-1 items-center text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
                        <span>{meeting.courseName || "Course"}</span>
                        {meeting.moduleName && (
                          <>
                            <FaChevronRight className="text-[7px]" />
                            <span className="text-gray-500">{meeting.moduleName}</span>
                          </>
                        )}
                        {meeting.lessonName && (
                          <>
                            <FaChevronRight className="text-[7px]" />
                            <span className="text-violet-500">{meeting.lessonName}</span>
                          </>
                        )}
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isPast
                          ? "bg-gray-100 text-gray-600 border border-gray-200"
                          : meeting.status === "STARTED"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200 animate-pulse"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}>
                        {isPast ? "COMPLETED" : meeting.status || "SCHEDULED"}
                      </span>
                    </div>

                    {/* Topic & Agenda */}
                    <div>
                      <h3 className="text-base font-bold text-gray-900 leading-tight">
                        {meeting.topic || "Untitled Zoom Session"}
                      </h3>
                      {meeting.agenda && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {meeting.agenda}
                        </p>
                      )}
                    </div>

                    {/* Time Details */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5 font-medium">
                        <MdCalendarToday className="text-violet-500 text-sm" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <MdAccessTime className="text-violet-500 text-sm" />
                        <span>{formattedTime} ({meeting.duration} Mins)</span>
                      </div>
                    </div>

                    {/* Join credentials */}
                    <div className="grid grid-cols-2 gap-3.5 bg-gray-50 border border-gray-100 rounded-xl p-3 text-[11px] text-gray-700 font-semibold">
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                          Meeting ID
                        </span>
                        <div className="flex items-center gap-1 min-w-0">
                          <MdMeetingRoom size={13} className="text-gray-400 flex-shrink-0" />
                          <span className="truncate">{meeting.zoomMeetingId || "—"}</span>
                          <button
                            onClick={() => handleCopy(meeting.zoomMeetingId, meeting.id, "id")}
                            className="p-1 hover:bg-gray-200 rounded transition text-gray-400 hover:text-gray-600 flex-shrink-0"
                          >
                            {copiedId === `${meeting.id}-id` ? (
                              <MdCheck className="text-emerald-500" />
                            ) : (
                              <MdContentCopy size={11} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                          Password
                        </span>
                        <div className="flex items-center gap-1 min-w-0">
                          <MdVpnKey size={13} className="text-gray-400 flex-shrink-0" />
                          <span className="truncate">{meeting.password || "—"}</span>
                          {meeting.password && (
                            <button
                              onClick={() => handleCopy(meeting.password, meeting.id, "pwd")}
                              className="p-1 hover:bg-gray-200 rounded transition text-gray-400 hover:text-gray-600 flex-shrink-0"
                            >
                              {copiedId === `${meeting.id}-pwd` ? (
                                <MdCheck className="text-emerald-500" />
                              ) : (
                                <MdContentCopy size={11} />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleStartMeeting(meeting.startUrl)}
                      disabled={isPast || !hasStartUrl}
                      className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <MdVideoCall size={16} />
                      Start Meeting
                    </button>
                    <button
                      onClick={() => handleCopy(meeting.joinUrl, meeting.id, "url")}
                      disabled={!meeting.joinUrl}
                      className="flex-1 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 bg-white"
                    >
                      <MdLink size={16} />
                      Copy Join Link
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {modalOpen && (
        <ScheduleMeetingModal
          coursesList={courses}
          initialCourseSlug={selectedCourseSlug}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            showToast("Zoom meeting scheduled successfully!");
            if (selectedCourseSlug) {
              loadMeetings(selectedCourseSlug);
            }
          }}
        />
      )}

      {/* Toast Alert */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

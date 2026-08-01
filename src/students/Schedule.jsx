import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaSearch, FaChevronLeft, FaChevronRight, FaCalendarAlt,
  FaClipboardList, FaSpinner, FaTimes, FaExclamationCircle,
} from "react-icons/fa";
import { studentAssignmentApi } from "./auth/api";

/* ─── Styling for assignment cards ─── */
const ASSIGNMENT_STYLE = {
  label: "Assignment",
  Icon: FaClipboardList,
  badge: "bg-indigo-50 text-indigo-600 border-indigo-200",
  card: "bg-indigo-50/70 border-indigo-400 hover:bg-indigo-100",
  dot: "bg-indigo-500",
};

/* ─── Helpers ─────────────────────────────────────────────── */
const dateKey = (isoOrDate) => new Date(isoOrDate).toDateString();

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const getWeekRange = (date) => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(date.getDate() - day);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return { start: startOfWeek, end: endOfWeek };
};

// Try the most likely due-date field names until one has a value.
// ⚠️ Once you confirm the real field from the console log below, you can
// simplify this back down to a single `a.dueDate` (or whatever it is).
const getAssignmentDueDate = (a) =>
  a.dueDate || a.deadline || a.dueAt || a.submissionDeadline || a.endDate || null;

const getAssignmentSlug = (a) => a.slug || a.assignmentSlug || a.id || a.assignmentId;

const Schedules = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("weekly");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const weekRange = useMemo(() => getWeekRange(currentDate), [currentDate]);
  const currentWeekString = `${weekRange.start.getDate()} - ${weekRange.end.getDate()} ${weekRange.end.toLocaleString("default", { month: "long" })}, ${weekRange.end.getFullYear()}`;

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekRange.start);
      day.setDate(weekRange.start.getDate() + i);
      days.push({
        day: day.toLocaleString("default", { weekday: "short" }).toUpperCase(),
        date: day.getDate(),
        fullDate: day,
        active: day.toDateString() === selectedDate.toDateString(),
      });
    }
    return days;
  }, [weekRange, selectedDate]);

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: prevMonthLastDay - i, fullDate: new Date(year, month - 1, prevMonthLastDay - i), isCurrentMonth: false });
    }
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const fullDate = new Date(year, month, i);
      days.push({ date: i, fullDate, isCurrentMonth: true, active: fullDate.toDateString() === selectedDate.toDateString() });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: i, fullDate: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    return days;
  }, [currentDate, selectedDate]);

  const weekDaysNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  /* ─── Fetch assignments and map to calendar events ────────── */
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await studentAssignmentApi.getAssignments(0, 1000);
      if (res.data.success) {
        const list = res.data.data.content || [];

        // One-time shape check — open the console once and confirm the
        // real due-date field name, then you can simplify getAssignmentDueDate().
        if (list[0]) {
          console.log("ASSIGNMENT OBJECT SHAPE:", list[0]);
        }

        const mapped = list
          .map((a) => {
            const due = getAssignmentDueDate(a);
            if (!due) return null;
            return {
              eventId: `assignment-${getAssignmentSlug(a)}`,
              title: a.title,
              eventType: "ASSIGNMENT",
              eventDateTime: due,
              description: a.description || "",
              navigationSlug: getAssignmentSlug(a),
            };
          })
          .filter(Boolean);

        setEvents(mapped);
      } else {
        setEvents([]);
        setError(res.data.message || "Failed to load assignments.");
      }
    } catch (err) {
      console.error("fetchEvents:", err);
      setEvents([]);
      setError(err.response?.data?.message || "Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  /* ─── Filtering (search only, no type tabs needed) ─────────── */
  const visibleEvents = useMemo(() => {
    if (!search) return events;
    return events.filter(
      (e) =>
        e.title?.toLowerCase().includes(search.toLowerCase()) ||
        e.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

  const eventsByDate = useMemo(() => {
    const map = new Map();
    visibleEvents.forEach((e) => {
      const key = dateKey(e.eventDateTime);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    });
    map.forEach((list) => list.sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime)));
    return map;
  }, [visibleEvents]);

  const selectedDateEvents = eventsByDate.get(selectedDate.toDateString()) || [];

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return [...visibleEvents]
      .filter((e) => new Date(e.eventDateTime) >= now)
      .sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime))
      .slice(0, 5);
  }, [visibleEvents]);

  /* ─── Navigation ──────────────────────────────────────────── */
  const navigateWeek = (dir) => {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() + (dir === "prev" ? -7 : 7));
    setCurrentDate(d);
  };
  const navigateMonth = (dir) => {
    const d = new Date(currentDate);
    d.setMonth(currentDate.getMonth() + (dir === "prev" ? -1 : 1));
    setCurrentDate(d);
  };
  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (view === "monthly" && date.getMonth() !== currentDate.getMonth()) {
      setCurrentDate(date);
    }
  };
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleGoToEvent = (event) => {
    navigate(`/student/assignments/${event.navigationSlug}`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-slate-50/60 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-xs">
        <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
          <Link to="/student/dashboard" className="hover:text-[#043573] transition">Dashboard</Link>
          <span>&gt;</span>
          <span className="text-slate-700 font-semibold">Schedule</span>
        </p>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Schedule</h1>
        <p className="text-xs text-slate-500 mt-1">Assignment due dates and upcoming milestones</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        {/* Main Calendar */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/70 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-[#043573] w-4 h-4" />
              <h2 className="text-base font-bold text-slate-900">
                {view === "weekly" ? "Weekly Schedule" : "Monthly Schedule"}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button onClick={() => setView("monthly")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${view === "monthly" ? "bg-white shadow-xs text-[#043573]" : "text-slate-500 hover:text-slate-800"}`}>
                  Monthly
                </button>
                <button onClick={() => setView("weekly")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${view === "weekly" ? "bg-white shadow-xs text-[#043573]" : "text-slate-500 hover:text-slate-800"}`}>
                  Weekly
                </button>
              </div>

              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search assignments..."
                  className="w-48 sm:w-56 h-9 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:border-[#043573] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-4 px-6 py-3.5 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button onClick={() => (view === "weekly" ? navigateWeek("prev") : navigateMonth("prev"))}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs transition-all cursor-pointer">
                <FaChevronLeft className="text-xs" />
              </button>
              <button onClick={() => (view === "weekly" ? navigateWeek("next") : navigateMonth("next"))}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs transition-all cursor-pointer">
                <FaChevronRight className="text-xs" />
              </button>
            </div>
            <div className="h-5 w-px bg-slate-200" />
            <h3 className="font-bold text-sm text-slate-800">
              {view === "weekly" ? currentWeekString : currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </h3>
            <div className="h-5 w-px bg-slate-200" />
            <button onClick={goToToday} className="text-xs text-[#043573] font-bold hover:underline cursor-pointer">
              Today
            </button>
          </div>

          {/* Loading / error states */}
          {loading && (
            <div className="py-16 text-center text-slate-400">
              <FaSpinner className="animate-spin text-2xl text-[#043573] mx-auto mb-2" />
              <p className="text-xs font-medium">Loading schedule...</p>
            </div>
          )}
          {!loading && error && (
            <div className="py-16 text-center text-red-400">
              <FaExclamationCircle className="text-2xl mx-auto mb-2" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Weekly view */}
          {!loading && !error && view === "weekly" && (
            <div className="grid grid-cols-1 sm:grid-cols-7 divide-x divide-gray-100">
              {weekDays.map((day, idx) => {
                const dayEvents = eventsByDate.get(day.fullDate.toDateString()) || [];
                return (
                  <div key={idx} className="min-h-[320px]">
                    <div
                      onClick={() => handleDateClick(day.fullDate)}
                      className={`text-center py-3 cursor-pointer border-b border-gray-100 ${day.active ? "bg-blue-50/50" : "hover:bg-gray-50/50"}`}
                    >
                      <p className="text-[11px] font-semibold text-gray-400 tracking-wide uppercase">{day.day}</p>
                      <h3 className={`text-lg font-bold mt-0.5 ${day.active ? "text-[#043573]" : "text-gray-700"}`}>{day.date}</h3>
                    </div>
                    <div className="p-2 space-y-2">
                      {dayEvents.length === 0 ? (
                        <p className="text-[11px] text-gray-300 text-center pt-4">No assignments</p>
                      ) : (
                        dayEvents.map((event) => (
                          <div
                            key={event.eventId}
                            onClick={() => setSelectedEvent(event)}
                            className={`rounded-lg border-l-4 px-2.5 py-2 cursor-pointer transition-all shadow-sm hover:shadow-md ${ASSIGNMENT_STYLE.card}`}
                          >
                            <div className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border mb-1 ${ASSIGNMENT_STYLE.badge}`}>
                              <ASSIGNMENT_STYLE.Icon size={8} /> {ASSIGNMENT_STYLE.label}
                            </div>
                            <p className="text-xs font-bold text-gray-800 truncate">{event.title}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Monthly view */}
          {!loading && !error && view === "monthly" && (
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1">
                {weekDaysNames.map((d) => (
                  <div key={d} className="text-center py-3 text-xs font-semibold text-gray-500">{d}</div>
                ))}
                {monthDays.map((day, idx) => {
                  const dayEvents = eventsByDate.get(day.fullDate.toDateString()) || [];
                  const isSelected = day.fullDate.toDateString() === selectedDate.toDateString();
                  return (
                    <div
                      key={idx}
                      onClick={() => handleDateClick(day.fullDate)}
                      className={`min-h-[100px] border rounded-lg p-1 cursor-pointer transition-all ${day.isCurrentMonth ? "bg-white" : "bg-gray-50"} ${isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-100 hover:border-gray-300 hover:shadow-sm"}`}
                    >
                      <div className={`text-right px-1 py-0.5 text-sm font-medium rounded-full w-7 ${isSelected ? "bg-blue-600 text-white" : day.isCurrentMonth ? "text-gray-700" : "text-gray-400"}`}>
                        {day.date}
                      </div>
                      <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.eventId}
                            onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                            className="flex items-center gap-1 text-[10px] px-1 py-0.5 rounded truncate hover:bg-gray-100"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ASSIGNMENT_STYLE.dot}`} />
                            <span className="truncate">{event.title}</span>
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-[9px] text-gray-400 text-center">+{dayEvents.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Event Details Modal */}
          {selectedEvent && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
              <div className="bg-white rounded-xl shadow-xl w-[350px] max-w-[90%] p-5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border mb-2 ${ASSIGNMENT_STYLE.badge}`}>
                      <ASSIGNMENT_STYLE.Icon size={10} /> {ASSIGNMENT_STYLE.label}
                    </span>
                    <h3 className="font-bold text-lg text-gray-900">{selectedEvent.title}</h3>
                  </div>
                  <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-red-500">
                    <FaTimes />
                  </button>
                </div>
                <p className="text-xs text-gray-400">Due {formatDate(selectedEvent.eventDateTime)}</p>
                {selectedEvent.description && (
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">{selectedEvent.description}</p>
                )}
                <button
                  onClick={() => handleGoToEvent(selectedEvent)}
                  className="mt-4 w-full bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  View assignment
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-3">
          {/* Daily Agenda */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-white/50">
              <div className="w-1.5 h-5 bg-[#043573] rounded-full" />
              <h2 className="font-semibold text-gray-800">Daily Agenda</h2>
            </div>
            <div className="p-4">
              <div className="rounded-xl border border-gray-100 overflow-hidden bg-white">
                <div className="h-14 flex items-center justify-between px-4 bg-gray-50/50 border-b border-gray-100">
                  <button
                    onClick={() => { const d = new Date(selectedDate); d.setDate(selectedDate.getDate() - 1); handleDateClick(d); }}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all"
                  >
                    <FaChevronLeft className="text-sm" />
                  </button>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800">{selectedDate.toLocaleString("default", { weekday: "long" })}</h3>
                    <p className="text-xs text-gray-400">{selectedDate.toLocaleString("default", { month: "long", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <button
                    onClick={() => { const d = new Date(selectedDate); d.setDate(selectedDate.getDate() + 1); handleDateClick(d); }}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all"
                  >
                    <FaChevronRight className="text-sm" />
                  </button>
                </div>
                <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                  {selectedDateEvents.length > 0 ? (
                    selectedDateEvents.map((event) => (
                      <div key={event.eventId} onClick={() => setSelectedEvent(event)}
                        className="p-3 hover:bg-gray-50/50 transition-colors cursor-pointer">
                        <div className={`rounded-lg border-l-4 p-2.5 ${ASSIGNMENT_STYLE.card}`}>
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border mb-1 ${ASSIGNMENT_STYLE.badge}`}>
                            <ASSIGNMENT_STYLE.Icon size={8} /> {ASSIGNMENT_STYLE.label}
                          </span>
                          <h4 className="font-bold text-gray-800 truncate text-xs">{event.title}</h4>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">No assignments due this day</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-white/50">
              <div className="w-1.5 h-5 bg-[#043573] rounded-full" />
              <h2 className="font-semibold text-gray-800">Upcoming Assignments</h2>
            </div>
            <div className="p-4 space-y-3">
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Nothing coming up</p>
              )}
              {upcomingEvents.map((event) => (
                <div key={event.eventId} onClick={() => setSelectedEvent(event)}
                  className="rounded-xl border border-gray-100 p-4 hover:bg-gray-50/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${ASSIGNMENT_STYLE.dot}`} />
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${ASSIGNMENT_STYLE.badge}`}>
                      <ASSIGNMENT_STYLE.Icon size={8} /> {ASSIGNMENT_STYLE.label}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">{formatDate(event.eventDateTime)}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mt-2">{event.title}</p>
                </div>
              ))}
              <Link to="/student/assignments" className="block w-full mt-2 py-2 text-center text-sm font-medium text-[#043573] hover:text-[#032a5a] transition-colors">
                View all assignments →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
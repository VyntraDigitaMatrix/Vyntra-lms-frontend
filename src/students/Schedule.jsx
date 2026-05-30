import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaCalendarAlt,
} from "react-icons/fa";

const Timeline = () => {
  const [view, setView] = useState("weekly");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [search, setSearch] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 25));
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 10, 25));

  // Get current week range
  const getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(date.getDate() - day);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return {
      start: startOfWeek,
      end: endOfWeek,
    };
  };

  const weekRange = getWeekRange(currentDate);
  const currentWeekString = `${weekRange.start.getDate()} - ${weekRange.end.getDate()} ${weekRange.end.toLocaleString('default', { month: 'long' })}, ${weekRange.end.getFullYear()}`;

  // Generate days for weekly view
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = getWeekRange(currentDate).start;
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push({
        day: day.toLocaleString('default', { weekday: 'short' }).toUpperCase(),
        date: day.getDate(),
        fullDate: day,
        active: day.toDateString() === selectedDate.toDateString(),
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  // Generate days for monthly view
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    const days = [];
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        fullDate: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        active: false,
      });
    }
    // Current month days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const fullDate = new Date(year, month, i);
      days.push({
        date: i,
        fullDate: fullDate,
        isCurrentMonth: true,
        active: fullDate.toDateString() === selectedDate.toDateString(),
      });
    }
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        fullDate: new Date(year, month + 1, i),
        isCurrentMonth: false,
        active: false,
      });
    }
    return days;
  };

  const monthDays = getMonthDays();
  const weekDaysNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const times = [
    "07 AM", "08 AM", "09 AM", "10 AM", "11 AM", "12 PM",
    "01 PM", "02 PM", "03 PM", "04 PM", "05 PM", "06 PM",
  ];

  // Full events list
  const allEvents = [
    { id: 1, date: new Date(2024, 10, 21), title: "Mathematics", time: "09:30 AM - 10:30 AM", instructor: "Dr. Smith", color: "bg-teal-50 border-teal-500 hover:bg-teal-100" },
    { id: 2, date: new Date(2024, 10, 22), title: "Physics", time: "10:00 AM - 11:00 AM", instructor: "Prof. Johnson", color: "bg-blue-50 border-blue-500 hover:bg-blue-100" },
    { id: 3, date: new Date(2024, 10, 23), title: "Chemistry", time: "11:00 AM - 12:00 PM", instructor: "Ms. Davis", color: "bg-emerald-50 border-emerald-500 hover:bg-emerald-100" },
    { id: 4, date: new Date(2024, 10, 24), title: "Biology", time: "01:00 PM - 02:00 PM", instructor: "Dr. Wilson", color: "bg-amber-50 border-amber-500 hover:bg-amber-100" },
    { id: 5, date: new Date(2024, 10, 25), title: "Computer Science", time: "02:00 PM - 03:30 PM", instructor: "Ms. Davis", color: "bg-purple-50 border-purple-500 hover:bg-purple-100" },
    { id: 6, date: new Date(2024, 10, 26), title: "English Literature", time: "10:30 AM - 11:30 AM", instructor: "Prof. Brown", color: "bg-rose-50 border-rose-500 hover:bg-rose-100" },
    { id: 7, date: new Date(2024, 10, 27), title: "History", time: "09:00 AM - 10:00 AM", instructor: "Dr. Taylor", color: "bg-indigo-50 border-indigo-500 hover:bg-indigo-100" },
    { id: 8, date: new Date(2024, 10, 28), title: "Geography", time: "11:00 AM - 12:00 PM", instructor: "Prof. Anderson", color: "bg-cyan-50 border-cyan-500 hover:bg-cyan-100" },
    { id: 9, date: new Date(2024, 10, 29), title: "Economics", time: "01:00 PM - 02:00 PM", instructor: "Dr. Martinez", color: "bg-lime-50 border-lime-500 hover:bg-lime-100" },
    { id: 10, date: new Date(2024, 10, 30), title: "Political Science", time: "03:00 PM - 04:00 PM", instructor: "Prof. Garcia", color: "bg-pink-50 border-pink-500 hover:bg-pink-100" },
  ];

  // Get events for weekly view with positioning
  const getWeeklyEvents = () => {
    const getTopPosition = (timeStr) => {
      const timeMap = {
        "09:30 AM - 10:30 AM": 185,
        "10:00 AM - 11:00 AM": 145,
        "11:00 AM - 12:00 PM": 105,
        "01:00 PM - 02:00 PM": 265,
        "02:00 PM - 03:30 PM": 200,
        "10:30 AM - 11:30 AM": 170,
        "09:00 AM - 10:00 AM": 140,
      };
      return timeMap[timeStr] || 150;
    };

    return allEvents
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= weekRange.start && eventDate <= weekRange.end;
      })
      .map(event => {
        const dayIndex = event.date.getDay();
        return {
          ...event,
          day: dayIndex,
          top: getTopPosition(event.time),
        };
      });
  };

  const weeklyEvents = getWeeklyEvents();

  // Get events for selected date (for agenda)
  const getEventsForSelectedDate = () => {
    return allEvents.filter(event => 
      event.date.toDateString() === selectedDate.toDateString()
    );
  };

  const selectedDateEvents = getEventsForSelectedDate();

  // Get events for monthly view (returns events grouped by date)
  const getMonthlyEvents = () => {
    const eventsMap = new Map();
    allEvents.forEach(event => {
      const dateStr = event.date.toDateString();
      if (!eventsMap.has(dateStr)) {
        eventsMap.set(dateStr, []);
      }
      eventsMap.get(dateStr).push(event);
    });
    return eventsMap;
  };

  const monthlyEventsMap = getMonthlyEvents();

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'prev' ? -7 : 7));
    setCurrentDate(newDate);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'prev' ? -1 : 1));
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (view === 'monthly' && date.getMonth() !== currentDate.getMonth()) {
      setCurrentDate(date);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Filter events based on search
  const filteredEvents = (events) => {
    if (!search) return events;
    return events.filter(event => 
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.instructor.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-5">
      {/* Header Bar with Breadcrumbs and Title */}
      <div className="mb-6">
        {/* Breadcrumbs */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400">
            <Link to="/student/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-600 font-medium">Schedule</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200"></div>
          </div>
        </div>
        
        {/* LMS Timeline Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">LMS Timeline</h1>
            <p className="text-sm text-gray-500">Schedule & Events Overview</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-3">
        {/* Main Calendar Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-gray-100 bg-white/50">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500 w-5 h-5" />
              <h2 className="text-lg font-semibold text-gray-800">
                {view === "weekly" ? "Weekly Schedule" : "Monthly Schedule"}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setView("weekly")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    view === "weekly"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setView("monthly")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    view === "monthly"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  Monthly
                </button>
              </div>

              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events..."
                  className="w-56 h-10 pl-9 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <button className="h-10 px-4 rounded-lg border border-gray-200 bg-white flex items-center gap-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                <FaFilter className="text-gray-400" /> Filter
              </button>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => view === "weekly" ? navigateWeek('prev') : navigateMonth('prev')}
                className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <button
                onClick={() => view === "weekly" ? navigateWeek('next') : navigateMonth('next')}
                className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
            <div className="h-6 w-px bg-gray-200"></div>
            <h3 className="font-semibold text-base text-gray-700">
              {view === "weekly" 
                ? currentWeekString 
                : currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="h-6 w-px bg-gray-200"></div>
            <button
              onClick={goToToday}
              className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Today
            </button>
          </div>

          {/* Calendar Content */}
          {view === "weekly" ? (
            /* Weekly Timeline Grid */
            <div className="relative overflow-x-auto scrollbar-hide">
              <div className="relative grid grid-cols-[80px_repeat(7,1fr)] min-w-[800px]">
                {/* Timezone Header */}
                <div className="h-[72px] border-r border-b border-gray-100 flex items-start justify-center pt-4 text-[11px] font-medium text-gray-400 bg-gray-50/30">
                  GMT+05:30
                </div>

                {/* Day Headers */}
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => handleDateClick(day.fullDate)}
                    className={`h-[72px] border-r border-b border-gray-100 text-center pt-3 relative transition-all cursor-pointer ${
                      day.active ? "bg-blue-50/30" : "hover:bg-gray-50/50"
                    }`}
                  >
                    <p className="text-[11px] font-semibold text-gray-400 tracking-wide uppercase">
                      {day.day}
                    </p>
                    <h3 className={`text-xl font-bold leading-6 mt-1 ${day.active ? "text-blue-600" : "text-gray-700"}`}>
                      {day.date}
                    </h3>
                    {day.active && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />
                    )}
                  </div>
                ))}

                <div className="col-span-8 grid grid-cols-[80px_1fr]">
                  {/* Time Labels */}
                  <div className="bg-gray-50/20">
                    {times.map((time) => (
                      <div
                        key={time}
                        className="h-[64px] border-r border-b border-gray-100 text-[11px] font-medium text-gray-400 text-right pr-3 pt-2"
                      >
                        {time}
                      </div>
                    ))}
                  </div>

                  {/* Grid & Events Container */}
                  <div className="relative grid grid-cols-7 min-h-[768px] bg-white">
                    {/* Vertical Grid Lines */}
                    {weekDays.map((_, i) => (
                      <div key={i} className="border-r border-gray-100 h-full" />
                    ))}
                    
                    {/* Horizontal Grid Lines */}
                    {times.map((_, i) => (
                      <div
                        key={i}
                        className="absolute left-0 right-0 border-t border-gray-100"
                        style={{ top: i * 64 }}
                      />
                    ))}

                    {/* Events */}
                    {filteredEvents(weeklyEvents).map((event) => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`absolute h-[56px] rounded-lg border-l-4 px-3 py-2 text-[11px] font-medium shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.01] ${event.color}`}
                        style={{
                          left: `calc(${event.day} * 14.285% + 8px)`,
                          top: event.top,
                          width: "calc(14.285% - 16px)",
                        }}
                      >
                        <h4 className="font-bold text-gray-800 truncate text-xs">
                          {event.title}
                        </h4>
                        <p className="mt-1 text-gray-500 truncate text-[10px]">{event.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Monthly Calendar Grid */
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1">
                {/* Week day headers */}
                {weekDaysNames.map((day, idx) => (
                  <div key={idx} className="text-center py-3 text-xs font-semibold text-gray-500">
                    {day}
                  </div>
                ))}
                
                {/* Month days */}
                {monthDays.map((day, idx) => {
                  const dayEvents = monthlyEventsMap.get(day.fullDate.toDateString()) || [];
                  const filteredDayEvents = filteredEvents(dayEvents);
                  const isSelected = day.fullDate.toDateString() === selectedDate.toDateString();
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => handleDateClick(day.fullDate)}
                      className={`min-h-[100px] border rounded-lg p-1 cursor-pointer transition-all ${
                        day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                      } ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'}`}
                    >
                      <div className={`text-right px-1 py-0.5 text-sm font-medium rounded-full w-7 ${
                        isSelected ? 'bg-blue-600 text-white' : day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        {day.date}
                      </div>
                      <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                        {filteredDayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                            className={`text-[10px] p-1 rounded truncate ${event.color.split(' ')[0]} border-l-2 ${event.color.split(' ')[1]} cursor-pointer hover:opacity-80`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {filteredDayEvents.length > 3 && (
                          <div className="text-[9px] text-gray-400 text-center">
                            +{filteredDayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Event Details Modal/Popup */}
          {selectedEvent && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
              <div className="bg-white rounded-xl shadow-xl w-[350px] max-w-[90%] p-5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900">
                    {selectedEvent.title}
                  </h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-red-500 text-xl"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-500">{selectedEvent.time}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedEvent.date.toDateString()}
                </p>
                <button className="mt-4 w-full bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Join with Google Meet
                </button>
                <p className="text-xs mt-3 text-gray-500">
                  meet.google.com/qsr-dsfef-weq
                </p>
                <hr className="my-3" />
                <p className="text-sm font-semibold">Instructor: {selectedEvent.instructor}</p>
                <p className="text-xs text-gray-500 mt-2">Reminder 15 mins before</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Agenda Sidebar */}
        <div className="space-y-3">
          {/* Daily Agenda Card - Shows events for selected date */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                <h2 className="font-semibold text-gray-800">Daily Agenda</h2>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors">
                <FaFilter className="text-xs" /> Filter
              </button>
            </div>

            <div className="p-4">
              <div className="rounded-xl border border-gray-100 overflow-hidden bg-white">
                <div className="h-14 flex items-center justify-between px-4 bg-gray-50/50 border-b border-gray-100">
                  <button
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(selectedDate.getDate() - 1);
                      handleDateClick(newDate);
                    }}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all"
                  >
                    <FaChevronLeft className="text-sm" />
                  </button>

                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800">
                      {selectedDate.toLocaleString('default', { weekday: 'long' })}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {selectedDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(selectedDate.getDate() + 1);
                      handleDateClick(newDate);
                    }}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all"
                  >
                    <FaChevronRight className="text-sm" />
                  </button>
                </div>

                <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                  {filteredEvents(selectedDateEvents).length > 0 ? (
                    filteredEvents(selectedDateEvents).map((item, index) => (
                      <div 
                        key={index} 
                        onClick={() => setSelectedEvent(item)}
                        className="grid grid-cols-[60px_1fr] gap-3 p-3 hover:bg-gray-50/50 transition-colors cursor-pointer"
                      >
                        <p className="text-sm font-medium text-gray-500 pt-1.5">
                          {item.time.split(' - ')[0]}
                        </p>
                        <div className={`rounded-lg border-l-4 p-2.5 ${item.color} transition-all hover:shadow-sm`}>
                          <h4 className="font-bold text-gray-800 truncate text-xs">{item.title}</h4>
                          <p className="text-[11px] mt-1 text-gray-500">{item.time}</p>
                          <p className="text-[10px] mt-1 text-gray-400">{item.instructor}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      No events scheduled for this day
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-purple-500 rounded-full"></div>
                <h2 className="font-semibold text-gray-800">Upcoming Events</h2>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {filteredEvents(allEvents.filter(event => event.date >= new Date())).slice(0, 4).map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedEvent(item)}
                  className="rounded-xl border border-gray-100 p-4 hover:bg-gray-50/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.color.includes('teal') ? 'bg-teal-500' : item.color.includes('blue') ? 'bg-blue-500' : item.color.includes('emerald') ? 'bg-emerald-500' : 'bg-purple-500'}`}></div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {item.time.split(' - ')[0]}
                    </span>
                    <div className="h-3 w-px bg-gray-200"></div>
                    <span className="text-xs text-gray-400">
                      {item.date.toLocaleString('default', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mt-2">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.instructor}</p>
                </div>
              ))}
              
              <button className="w-full mt-2 py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                View all upcoming events →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
import React, { useMemo, useState } from "react";
import {
  FaSearch,
  FaBell,
  FaRobot,
  FaChevronDown,
  FaFilter,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

function Schedule() {
  const [view, setView] = useState("Monthly");
  const [currentDate, setCurrentDate] = useState(new Date(2023, 8, 1));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [messageModal, setMessageModal] = useState({
  show: false,
  type: "",
  message: "",
});

  const [events, setEvents] = useState([
    { id: 1, date: "2023-09-02", title: "Design Review", time: "", type: "Review" },
    { id: 2, date: "2023-09-05", title: "Meeting", time: "11:30 - 13.00", type: "Meeting" },
    { id: 3, date: "2023-09-09", title: "Design Review", time: "10:00 - 11.00", type: "Review" },
    { id: 4, date: "2023-09-09", title: "Discussion", time: "10:00 - 11.00", type: "Discussion" },
    { id: 5, date: "2023-09-14", title: "Market Research", time: "", type: "Research" },
    { id: 6, date: "2023-09-14", title: "Discussion", time: "", type: "Discussion" },
  ]);
  const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = [2023, 2024, 2025, 2026, 2027];

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    type: "Meeting",
  });

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const getEventColor = (type) => {
    if (type === "Meeting") return "bg-yellow-50 text-yellow-700";
    if (type === "Review") return "bg-red-100 text-red-600";
    if (type === "Discussion") return "bg-purple-100 text-purple-600";
    return "bg-green-100 text-green-600";
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter = filter === "All" || event.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [events, search, filter]);

  const getMonthDays = () => {
    const firstDay = new Date(year, currentDate.getMonth(), 1);
    const lastDay = new Date(year, currentDate.getMonth() + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const prevMonthLastDay = new Date(year, currentDate.getMonth(), 0).getDate();

    const days = [];

    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        currentMonth: false,
        date: new Date(year, currentDate.getMonth() - 1, prevMonthLastDay - i),
      });
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        currentMonth: true,
        date: new Date(year, currentDate.getMonth(), i),
      });
    }

    while (days.length % 7 !== 0) {
      const nextDay = days.length - startDay - totalDays + 1;
      days.push({
        day: nextDay,
        currentMonth: false,
        date: new Date(year, currentDate.getMonth() + 1, nextDay),
      });
    }

    return days;
  };

 const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
  const changeMonth = (value) => {
    setCurrentDate(new Date(year, currentDate.getMonth() + value, 1));
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

 const handleAddEvent = (e) => {
  e.preventDefault();

  if (!formData.title || !formData.date) {
    setMessageModal({
      show: true,
      type: "error",
      message: "Please enter event title and date.",
    });

    return;
  }

  const newEvent = {
    id: Date.now(),
    title: formData.title,
    date: formData.date,
    time: formData.time,
    type: formData.type,
  };

  setEvents((prev) => [...prev, newEvent]);

  setFormData({
    title: "",
    date: "",
    time: "",
    type: "Meeting",
  });

  setShowModal(false);

  setTimeout(() => {
    setMessageModal({
      show: true,
      type: "success",
      message: "Event Successfully Added!",
    });
  }, 200);
};

  const renderEvent = (event) => (
  <button
    key={event.id}
    onClick={() => setSelectedEvent(event)}
    className={`w-full text-left px-2 py-1 text-xs rounded-sm overflow-hidden ${getEventColor(
      event.type
    )}`}
  >
    <p className="font-medium truncate">{event.title}</p>
    {event.time && <p className="truncate">{event.time}</p>}
  </button>
);

  const monthDays = getMonthDays();
  const getWeekDays = () => {
  const start = new Date(currentDate);
  start.setDate(currentDate.getDate() - currentDate.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};

const changeDate = (value) => {
  if (view === "Monthly") {
    setCurrentDate(new Date(year, currentDate.getMonth() + value, 1));
  }

  if (view === "Weekly") {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + value * 7);
    setCurrentDate(newDate);
  }

  if (view === "Daily") {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + value);
    setCurrentDate(newDate);
  }
};

const dayEvents = filteredEvents.filter(
  (event) => event.date === formatDate(currentDate)
);

const weekDays = getWeekDays();

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];
const handleMonthChange = (e) => {
  const selectedMonth = Number(e.target.value);
  setCurrentDate(new Date(currentDate.getFullYear(), selectedMonth, 1));
};

const handleYearChange = (e) => {
  const selectedYear = Number(e.target.value);
  setCurrentDate(new Date(selectedYear, currentDate.getMonth(), 1));
};

  return (
<div className="bg-[#f7f7f7] min-h-screen px-6 pb-6 pt-2">    

      <div className="h-[60px] border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-10 h-full">
          <h1 className="text-[28px] text-none font-medium">Calendar</h1>

          {["Monthly", "Weekly", "Daily"].map((item) => (
            <button
              key={item}
              onClick={() => setView(item)}
              className={`h-full px-4 font-medium ${
                view === item
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="h-[42px] px-5 border border-orange-600 text-orange-600 rounded-md flex items-center gap-2"
          >
            <FaFilter /> Filter
          </button>

          {showFilter && (
            <div className="absolute right-40 top-12 w-44 bg-white border rounded-xl shadow-lg z-20 p-3">
              {["All", "Meeting", "Review", "Discussion", "Research"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setFilter(item);
                      setShowFilter(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      filter === item
                        ? "bg-orange-600 text-white"
                        : "hover:bg-orange-50"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          )}

          <div className="h-8 w-px bg-gray-300" />

          <button
            onClick={() => setShowModal(true)}
            className="h-[42px] px-5 bg-orange-600 text-white rounded-md flex items-center gap-2"
          >
            <FaPlus /> Add Event
          </button>
        </div>
      </div>
<div className="px-10 py-7 flex items-center gap-8">
  <div className="flex items-center gap-4">

  {/* Month Dropdown */}
  <div className="relative">
    <button
      onClick={() => {
        setShowMonthDropdown(!showMonthDropdown);
        setShowYearDropdown(false);
      }}
      className="min-w-[190px] h-[56px] bg-white rounded-xl px-5 text-orange-600 text-[24px] flex items-center justify-between hover:bg-orange-50 hover:border-orange-200 border border-transparent transition"
    >
      {monthName}
      <FaChevronDown className="text-sm" />
    </button>

    {showMonthDropdown && (
      <div className="absolute left-0 top-16 w-[190px] bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-2">
        {months.map((month, index) => (
          <button
            key={month}
            onClick={() => {
              setCurrentDate(new Date(currentDate.getFullYear(), index, 1));
              setShowMonthDropdown(false);
            }}
            className={`w-full text-left px-4 py-2 rounded-lg text-[16px] transition ${
              currentDate.getMonth() === index
                ? "bg-orange-600 text-white"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            {month}
          </button>
        ))}
      </div>
    )}
  </div>

  {/* Year Dropdown */}
  <div className="relative">
    <button
      onClick={() => {
        setShowYearDropdown(!showYearDropdown);
        setShowMonthDropdown(false);
      }}
      className="min-w-[130px] h-[56px] bg-orange-50 rounded-xl px-5 text-orange-600 text-[24px] flex items-center justify-between hover:bg-orange-100 border border-transparent hover:border-orange-200 transition"
    >
      {year}
      <FaChevronDown className="text-sm" />
    </button>

    {showYearDropdown && (
      <div className="absolute left-0 top-16 w-[130px] bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-2">
        {years.map((item) => (
          <button
            key={item}
            onClick={() => {
              setCurrentDate(new Date(item, currentDate.getMonth(), 1));
              setShowYearDropdown(false);
            }}
            className={`w-full text-left px-4 py-2 rounded-lg text-[16px] transition ${
              currentDate.getFullYear() === item
                ? "bg-orange-600 text-white"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    )}
  </div>

</div>

        <button
          onClick={() => changeDate(-1)}
          className="w-9 h-9 bg-orange-50 text-orange-600 rounded-md flex items-center justify-center"
        >
          <FaChevronLeft />
        </button>

        <button
          onClick={goToday}
          className="h-9 px-4 bg-orange-600 text-white rounded-md"
        >
          Today
        </button>

        <button
          onClick={() => changeDate(1)}
          className="w-9 h-9 bg-orange-50 text-orange-600 rounded-md flex items-center justify-center"
        >
          <FaChevronRight />
        </button>
      </div>

      {view === "Monthly" && (
        <div className="px-10">
          <div className="grid grid-cols-7 h-[48px] border border-gray-200 rounded-md bg-gray-50">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="flex items-center justify-center font-semibold text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border-l border-t border-gray-200 mt-4">
            {monthDays.map((item, index) => {
              const dayEvents = filteredEvents.filter(
                (event) => event.date === formatDate(item.date)
              );

              return (
                <div
                  key={index}
                  className="h-[170px] border-r border-b border-gray-200 p-4 overflow-hidden"
                >
                  <span
                    className={`text-[16px] ${
                      item.currentMonth ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {item.day}
                  </span>

                  <div className="mt-3 space-y-1 max-h-[118px] overflow-y-auto pr-1">
                           {dayEvents.map(renderEvent)}
                       </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "Weekly" && (
  <div className="px-10">
    <div className="grid grid-cols-7 border-l border-t border-gray-200">
      {weekDays.map((day) => {
        const eventsForDay = filteredEvents.filter(
          (event) => event.date === formatDate(day)
        );

        return (
          <div
            key={formatDate(day)}
            className="min-h-[420px] border-r border-b border-gray-200 p-4 overflow-hidden"
          >
            <div className="font-semibold text-orange-600 mb-4">
              {day.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
              })}
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {eventsForDay.length > 0 ? (
                eventsForDay.map(renderEvent)
              ) : (
                <p className="text-gray-400 text-sm">No events</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

{view === "Daily" && (
  <div className="px-10">
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 font-semibold text-orange-600">
        {currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </div>

      {timeSlots.map((time) => {
        const eventsAtTime = dayEvents.filter((event) =>
          event.time?.startsWith(time)
        );

        return (
          <div
            key={time}
            className="grid grid-cols-[120px_1fr] border-t border-gray-200 min-h-[70px]"
          >
            <div className="p-4 text-gray-400 border-r border-gray-200">
              {time}
            </div>

            <div className="p-3 space-y-2">
              {eventsAtTime.length > 0 ? (
                eventsAtTime.map(renderEvent)
              ) : (
                <span className="text-gray-300 text-sm">No event</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddEvent}
            className="w-[420px] bg-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Add Event</h2>
              <button type="button" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <input
              type="text"
              placeholder="Event title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full h-11 border rounded-lg px-3 mb-4 outline-none"
            />

            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full h-11 border rounded-lg px-3 mb-4 outline-none"
            />

            <input
              type="text"
              placeholder="Time example: 10:00 - 11:00"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className="w-full h-11 border rounded-lg px-3 mb-4 outline-none"
            />

            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full h-11 border rounded-lg px-3 mb-5 outline-none"
            >
              <option value="Meeting">Meeting</option>
              <option value="Review">Review</option>
              <option value="Discussion">Discussion</option>
              <option value="Research">Research</option>
            </select>

            <button className="w-full h-11 bg-orange-600 text-white rounded-lg">
              Save Event
            </button>
          </form>
        </div>
      )}
{messageModal.show && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
    <div className="w-[360px] bg-white rounded-2xl p-6 shadow-xl text-center">
      <div
        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${
          messageModal.type === "success"
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
        }`}
      >
        {messageModal.type === "success" ? "✓" : "!"}
      </div>

      <h2 className="text-[22px] font-bold text-[#241b4b] mb-2">
        {messageModal.type === "success" ? "Success" : "Error"}
      </h2>

      <p className="text-gray-500 mb-5">{messageModal.message}</p>

      <button
        onClick={() =>
          setMessageModal({
            show: false,
            type: "",
            message: "",
          })
        }
        className={`h-[42px] px-6 rounded-xl text-white ${
          messageModal.type === "success"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        OK
      </button>
    </div>
  </div>
)}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-[360px] bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
              <button onClick={() => setSelectedEvent(null)}>
                <FaTimes />
              </button>
            </div>

            <p className="text-gray-600 mb-2">Date: {selectedEvent.date}</p>
            <p className="text-gray-600 mb-2">
              Time: {selectedEvent.time || "No time added"}
            </p>
            <p className="text-gray-600">Type: {selectedEvent.type}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;
import React, { useMemo, useState } from "react";
import {
  FaSearch,
  FaVideo,
  FaCalendarAlt,
  FaUserCheck,
  FaCheckCircle,
  FaPlay,
  FaDownload,
  FaClipboardList,
  FaBell,
  FaLink,
} from "react-icons/fa";

function Classes() {
  const [search, setSearch] = useState("");

  const classes = [
    {
      id: 1,
      title: "React Routing Live Class",
      course: "React JS",
      instructor: "Shankar",
      date: "Today",
      time: "11:30 AM - 12:30 PM",
      status: "Live",
      type: "Google Meet",
      attendance: "Present",
      materials: 3,
    },
    {
      id: 2,
      title: "JavaScript Functions",
      course: "JavaScript",
      instructor: "Rahul",
      date: "May 26, 2026",
      time: "10:00 AM - 11:00 AM",
      status: "Upcoming",
      type: "Zoom",
      attendance: "Pending",
      materials: 2,
    },
    {
      id: 3,
      title: "CSS Flexbox Layout",
      course: "Frontend Design",
      instructor: "Priya",
      date: "May 20, 2026",
      time: "02:00 PM - 03:00 PM",
      status: "Completed",
      type: "Recorded",
      attendance: "Present",
      materials: 5,
    },
  ];

  const filteredClasses = classes.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = useMemo(() => {
    return {
      total: classes.length,
      live: classes.filter((item) => item.status === "Live").length,
      completed: classes.filter((item) => item.status === "Completed").length,
      attendance: 86,
    };
  }, [classes]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-6 pt-3 pb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[34px] font-bold text-[#241b4b]">Classes</h1>
          <p className="text-[18px] text-gray-400 mt-2">
            Manage live classes, schedules, attendance, and recordings
          </p>
        </div>

        <button className="h-[46px] px-5 bg-orange-600 text-white rounded-xl flex items-center gap-2 hover:bg-orange-700">
          <FaCalendarAlt />
          Schedule Class
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-400">Total Classes</p>
          <h2 className="text-[28px] font-bold text-[#241b4b]">
            {stats.total}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-400">Live Classes</p>
          <h2 className="text-[28px] font-bold text-[#241b4b]">
            {stats.live}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-400">Completed</p>
          <h2 className="text-[28px] font-bold text-[#241b4b]">
            {stats.completed}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-400">Attendance</p>
          <h2 className="text-[28px] font-bold text-[#241b4b]">
            {stats.attendance}%
          </h2>
        </div>
      </div>

      {/* Live Banner */}
      <div className="bg-[#241b4b] text-white rounded-2xl p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-orange-400 font-semibold mb-1">Live Now</p>
          <h2 className="text-[26px] font-bold">React Routing Live Class</h2>
          <p className="text-gray-300 mt-1">
            Instructor: Shankar • Google Meet • 11:30 AM
          </p>
        </div>

        <button className="h-[44px] px-5 bg-orange-600 rounded-xl flex items-center gap-2 hover:bg-orange-700">
          <FaVideo />
          Join Class
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6 flex items-center gap-4">
        <div className="flex-1 h-[46px] border border-gray-200 rounded-xl px-4 flex items-center gap-3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-gray-700"
          />
        </div>

        <select className="h-[46px] px-4 border border-gray-200 rounded-xl outline-none text-gray-600">
          <option>All Status</option>
          <option>Live</option>
          <option>Upcoming</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredClasses.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[21px] font-bold text-[#241b4b]">
                  {item.title}
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  {item.course} • {item.type}
                </p>
              </div>

              <span
                className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === "Live"
                    ? "bg-red-100 text-red-600"
                    : item.status === "Completed"
                    ? "bg-green-100 text-green-600"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-orange-500" />
                {item.date}
              </div>

              <div className="flex items-center gap-2">
                <FaBell className="text-orange-500" />
                {item.time}
              </div>

              <div className="flex items-center gap-2">
                <FaUserCheck className="text-orange-500" />
                {item.instructor}
              </div>

              <div className="flex items-center gap-2">
                <FaClipboardList className="text-orange-500" />
                {item.materials} Materials
              </div>
            </div>

            <div className="flex items-center justify-between mt-5 text-sm">
              <span className="text-gray-500">
                Attendance:{" "}
                <b className="text-[#241b4b]">{item.attendance}</b>
              </span>

              <button className="text-orange-600 flex items-center gap-2">
                <FaLink />
                Copy Link
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-4 flex-wrap">
              {item.status === "Live" || item.status === "Upcoming" ? (
                <button className="h-[38px] px-4 bg-orange-600 text-white rounded-xl flex items-center gap-2">
                  <FaVideo />
                  Join Class
                </button>
              ) : (
                <button className="h-[38px] px-4 bg-orange-50 text-orange-600 rounded-xl flex items-center gap-2">
                  <FaPlay />
                  Recording
                </button>
              )}

              <button className="h-[38px] px-4 bg-gray-100 text-gray-600 rounded-xl flex items-center gap-2">
                <FaDownload />
                Notes
              </button>

              <button className="h-[38px] px-4 bg-[#241b4b] text-white rounded-xl flex items-center gap-2">
                <FaCheckCircle />
                Attendance
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Classes;
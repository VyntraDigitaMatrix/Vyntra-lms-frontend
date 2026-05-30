import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
const Assignments = () => {
  const [activeTab, setActiveTab] = useState("All");

  const assignments = [
    {
      title: "SEO Keywords Research Report",
      course: "Search Engine Optimization (SEO)",
      desc: "Find and analyze 10 SEO keywords for a given.",
      dueDate: "20 May 2024, 11:59 PM",
      marks: 100,
      status: "Pending",
    },
    {
      title: "Social Media Strategy Plan",
      course: "Social Media Marketing",
      desc: "Create a 7-day social media strategy .",
      dueDate: "22 May 2024, 11:59 PM",
      marks: 100,
      status: "Submitted",
    },
    {
      title: "Google Ads Campaign Setup",
      course: "Google Ads & PPC",
      desc: "Set up a Google Ads campaign and share .",
      dueDate: "25 May 2024, 11:59 PM",
      marks: 100,
      status: "Graded",
    },
    {
      title: "Email Marketing Plan",
      course: "Email Marketing",
      desc: "Design an email marketing plan .",
      dueDate: "28 May 2024, 11:59 PM",
      marks: 100,
      status: "Pending",
    },
  ];

  const tabs = ["All", "Pending", "Submitted", "Graded"];

  const filteredAssignments = useMemo(() => {
    if (activeTab === "All") return assignments;
    return assignments.filter((item) => item.status === activeTab);
  }, [activeTab]);

  const statusStyle = {
    Pending: "bg-orange-100 text-orange-600",
    Submitted: "bg-green-100 text-green-600",
    Graded: "bg-blue-100 text-blue-600",
  };

  const iconStyle = {
    Pending: "bg-orange-100 text-orange-500",
    Submitted: "bg-green-100 text-green-500",
    Graded: "bg-blue-100 text-blue-500",
  };

  const overview = [
    { label: "Total Assignments", value: assignments.length, color: "bg-blue-100 text-blue-600" },
    { label: "Pending", value: assignments.filter((a) => a.status === "Pending").length, color: "bg-orange-100 text-orange-600" },
    { label: "Submitted", value: assignments.filter((a) => a.status === "Submitted").length, color: "bg-green-100 text-green-600" },
    { label: "Graded", value: assignments.filter((a) => a.status === "Graded").length, color: "bg-purple-100 text-purple-600" },
  ];
  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1));

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

const previousMonth = () => {
  setCurrentDate(new Date(year, month - 1, 1));
};

const nextMonth = () => {
  setCurrentDate(new Date(year, month + 1, 1));
};
  return (
    <div className="min-h-screen bg-[#f6f7fb] p-5">
      <div className="grid grid-cols-12 gap-3">
        {/* Left Content */}
        <div className="col-span-12 xl:col-span-9">
          <div>
  <p className="text-sm text-gray-400 mb-1">
    <Link
      to="/student/dashboard"
      className="hover:text-blue-600 transition"
    >
      Dashboard
    </Link>

    <span className="mx-2">&gt;</span>

    <span className="text-gray-600 font-medium">
      Assignments
    </span>
  </p>

  <h1 className="text-xl font-bold text-gray-900">
   Assignments
  </h1>
            <p className="text-sm text-gray-500 mt-2">
              Complete assignments to enhance your learning and track your progress.
            </p>
          </div>
          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-6 mt-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Assignment List */}
          <div className="space-y-3">
            {filteredAssignments.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-12 lg:col-span-1">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${iconStyle[item.status]}`}
                    >
                      📄
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-5">
                    <h2 className="font-bold text-gray-900">
                      {item.title}
                    </h2>
                    <p className="text-sm font-semibold text-gray-700 mt-1">
                      {item.course}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.desc}
                    </p>
                  </div>
                  <div className="col-span-6 lg:col-span-2">
                    <p className="text-xs text-gray-500 font-semibold">
                      Due Date
                    </p>
                    <p className="text-sm font-bold text-red-500 mt-1">
                      {item.dueDate}
                    </p>
                  </div>
                  <div className="col-span-6 lg:col-span-2">
                    <p className="text-xs text-gray-500 font-semibold">
                      Total Marks
                    </p>
                    <p className="text-sm font-bold text-gray-800 mt-1">
                      {item.marks}
                    </p>
                  </div>
                  <div className="col-span-12 lg:col-span-2 flex flex-col items-end gap-3">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusStyle[item.status]}`}
                    >
                      {item.status}
                    </span>
                    <button className="w-[135px] h-9 rounded-lg border border-blue-500 text-blue-600 text-sm font-semibold hover:bg-blue-600 hover:text-white transition">
                      {item.status === "Submitted"
                        ? "View Submission"
                        : item.status === "Graded"
                        ? "View Grade"
                        : "View Details"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right Cards */}
        <div className="col-span-12 xl:col-span-3 space-y-5 mt-6 xl:mt-34">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-5">
              Assignment Overview
            </h2>
            <div className="space-y-3">
              {overview.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${item.color}`}
                    >
                      📋
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
  <div className="flex items-center justify-between mb-5">
    <button
      onClick={previousMonth}
      className="text-gray-400 text-xl hover:text-blue-600"
    >
      ‹
    </button>
    <h2 className="font-bold text-gray-900">
      {monthNames[month]} {year}
    </h2>
    <button
      onClick={nextMonth}
      className="text-gray-400 text-xl hover:text-blue-600"
    >
      ›
    </button>
  </div>
  <div className="grid grid-cols-7 gap-3 text-center text-xs text-gray-400 mb-3">
    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
      <span key={day}>{day}</span>
    ))}
  </div>
  <div className="grid grid-cols-7 gap-3 text-center text-sm text-gray-600">
    {calendarDays.map((date, index) => (
      <span
        key={index}
        className={`w-8 h-8 flex items-center justify-center rounded-full mx-auto ${
          date === 20 && month === 4 && year === 2024
            ? "bg-blue-600 text-white font-bold"
            : date
            ? "hover:bg-blue-50 cursor-pointer"
            : ""
        }`}
      >
        {date}
      </span>
    ))}
  </div>
</div>
        </div>
      </div>
    </div>
  );
};
export default Assignments;
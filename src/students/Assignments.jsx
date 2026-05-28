import React, { useMemo, useState } from "react";
import {
  FaSearch,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function Assignments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateSort, setDateSort] = useState("default");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const assignments = [
    {
      title: "Conducting User Resea...",
      course: "User Research and Per...",
      dueDate: "July 1, 2024",
      status: "Done",
      submit: "Submitted",
    },
    {
      title: "Competitive Analysis R...",
      course: "Competitive Analysis in...",
      dueDate: "July 25, 2024",
      status: "Progress",
      submit: "Upload",
    },
    {
      title: "Creating Wireframes",
      course: "Wireframing and Protot...",
      dueDate: "August 1, 2024",
      status: "Progress",
      submit: "Upload",
    },
    {
      title: "Usability Testing and F...",
      course: "Usability Testing and It...",
      dueDate: "August 22, 2024",
      status: "Pending",
      submit: "Upload",
    },
    {
      title: "Developing Visual Desi...",
      course: "Visual Design and Bran...",
      dueDate: "August 29, 2024",
      status: "Pending",
      submit: "Upload",
    },
    {
      title: "Creating a Design Syst...",
      course: "Design Systems and C...",
      dueDate: "September 5, 2024",
      status: "Pending",
      submit: "Upload",
    },
    {
      title: "Final Prototype Review",
      course: "UX Design Project",
      dueDate: "September 12, 2024",
      status: "Done",
      submit: "Submitted",
    },
    {
      title: "React Dashboard Task",
      course: "Frontend Development",
      dueDate: "September 18, 2024",
      status: "Progress",
      submit: "Upload",
    },
    {
      title: "Research Report",
      course: "Product Research",
      dueDate: "September 25, 2024",
      status: "Pending",
      submit: "Upload",
    },
    {
      title: "UI Case Study",
      course: "Design Portfolio",
      dueDate: "October 1, 2024",
      status: "Done",
      submit: "Submitted",
    },
  ];

  const statusStyle = {
    Done: "bg-green-100 text-green-700",
    Progress: "bg-blue-100 text-blue-600",
    Pending: "bg-red-100 text-red-600",
  };

  const dotStyle = {
    Done: "bg-green-600",
    Progress: "bg-blue-500",
    Pending: "bg-red-500",
  };

  const filteredAssignments = useMemo(() => {
    let data = [...assignments];

    if (search.trim()) {
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.course.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      data = data.filter((item) => item.status === statusFilter);
    }

    if (dateSort === "newest") {
      data.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }

    if (dateSort === "oldest") {
      data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    return data;
  }, [search, statusFilter, dateSort]);

  const totalPages = Math.ceil(filteredAssignments.length / rowsPerPage) || 1;

  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDateSortChange = (e) => {
    setDateSort(e.target.value);
    setCurrentPage(1);
  };

  return (
   <div className="bg-[#f7f7f7] min-h-screen px-6 pb-6 pt-2">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[28px] leading-none font-bold text-[#211b3d]">
            Assignments
          </h1>
          <p className="text-[16px] text-gray-400 mt-2">
            View and manage your course assignments
          </p>
        </div>

        <div className="flex items-center gap-4 mt-1">
          <div className="relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-black text-sm" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[160px] h-[44px] pl-11 pr-3 rounded-lg border border-gray-200 outline-none focus:border-orange-500"
            />
          </div>

   <span className="text-[14px] text-gray-400">Filter by</span>

{/* Date Dropdown */}
<div className="relative">
  <button
    onClick={() => {
      setShowDateDropdown(!showDateDropdown);
      setShowStatusDropdown(false);
    }}
    className="h-[42px] px-5 border border-orange-500 rounded-xl flex items-center gap-3 text-orange-600 hover:bg-orange-50 transition"
  >
    {dateSort === "default"
      ? "Dates"
      : dateSort.charAt(0).toUpperCase() + dateSort.slice(1)}

    <FaChevronDown className="text-sm" />
  </button>

  {showDateDropdown && (
    <div className="absolute top-12 left-0 w-[160px] bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-2">
      {[
        { label: "Dates", value: "default" },
        { label: "Oldest", value: "oldest" },
        { label: "Newest", value: "newest" },
      ].map((item) => (
        <button
          key={item.value}
          onClick={() => {
            setDateSort(item.value);
            setCurrentPage(1);
            setShowDateDropdown(false);
          }}
          className={`w-full text-left px-4 py-2 rounded-lg transition ${
            dateSort === item.value
              ? "bg-orange-600 text-white"
              : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  )}
</div>

{/* Status Dropdown */}
<div className="relative">
  <button
    onClick={() => {
      setShowStatusDropdown(!showStatusDropdown);
      setShowDateDropdown(false);
    }}
    className="h-[42px] px-5 border border-orange-500 rounded-xl flex items-center gap-3 text-orange-600 hover:bg-orange-50 transition"
  >
    {statusFilter}
    <FaChevronDown className="text-sm" />
  </button>

  {showStatusDropdown && (
    <div className="absolute top-12 left-0 w-[170px] bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-2">
      {["All", "Done", "Progress", "Pending"].map((item) => (
        <button
          key={item}
          onClick={() => {
            setStatusFilter(item);
            setCurrentPage(1);
            setShowStatusDropdown(false);
          }}
          className={`w-full text-left px-4 py-2 rounded-lg transition ${
            statusFilter === item
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
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-[1.1fr_1.2fr_1fr_0.9fr_0.8fr] items-center px-6 h-[48px] border border-gray-200 rounded-md bg-gray-50 text-gray-500 font-semibold text-[14px]">
          <div>Assignment Title</div>
          <div>Course/lessons</div>
          <div>Due Date</div>
          <div>Status</div>
          <div>Submit</div>
        </div>

        {paginatedAssignments.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1.1fr_1.2fr_1fr_0.9fr_0.8fr] items-center px-6 h-[50px] border border-gray-200 rounded-md bg-white shadow-sm text-[14px]"
          >
            <div className="text-black truncate">{item.title}</div>
            <div className="text-gray-500 truncate">{item.course}</div>
            <div className="text-gray-500">{item.dueDate}</div>

            <div>
              <span
                className={`inline-flex items-center gap-2 px-2 py-[4px] rounded-full text-[12px] font-medium ${statusStyle[item.status]}`}
              >
                <span className={`w-2 h-2 rounded-full ${dotStyle[item.status]}`} />
                {item.status}
              </span>
            </div>

            <button
              className={`text-left ${
                item.submit === "Submitted"
                  ? "text-gray-400 font-semibold cursor-default"
                  : "text-gray-500 hover:text-orange-600"
              }`}
            >
              {item.submit}
            </button>
          </div>
        ))}

        {paginatedAssignments.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-lg">
            No assignments found
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-4 text-[14px]">
          <span>Show</span>

          <div className="relative">
            <select
              value={rowsPerPage}
              onChange={handleRowsChange}
              className="w-[70px] h-[40px] border border-gray-300 rounded-md px-4 appearance-none outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none" />
          </div>

          <span>Row</span>
        </div>

        <div className="flex items-center gap-5 text-[17px]">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-md bg-gray-100 disabled:text-gray-300 flex items-center justify-center"
          >
            <FaChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => changePage(page)}
                className={`w-9 h-9 rounded-md ${
                  currentPage === page
                    ? "bg-orange-600 text-white"
                    : "text-black"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-md bg-gray-100 disabled:text-gray-300 flex items-center justify-center"
          >
            <FaChevronRight />
          </button>
        </div>

        <div />
      </div>
    </div>
  );
}

export default Assignments;
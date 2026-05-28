import React, { useMemo, useState } from "react";
import {
  FaSearch,
  FaPlay,
  FaDownload,
  FaClock,
  FaBookOpen,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";

function Recordings() {
  const recordingsData = [
    {
      id: 1,
      title: "Color styles - 02",
      duration: "1:30hrs",
      lessons: "02 Lessons",
      category: "Design",
      date: "2024-05-01",
      image:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Design Thinking",
      duration: "2:30hrs",
      lessons: "01 Lessons",
      category: "Thinking",
      date: "2024-05-04",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Visual Designs Briefs",
      duration: "3:30hrs",
      lessons: "03 Lessons",
      category: "Design",
      date: "2024-05-06",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Curiosity for terminology",
      duration: "4:00hrs",
      lessons: "02 Lessons",
      category: "Research",
      date: "2024-05-09",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 5,
      title: "Color styles - 01",
      duration: "2:30hrs",
      lessons: "02 Lessons",
      category: "Design",
      date: "2024-05-11",
      image:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  const filteredRecordings = useMemo(() => {
    return recordingsData.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || item.category === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const totalPages =
    Math.ceil(filteredRecordings.length / rowsPerPage) || 1;

  const paginatedData = filteredRecordings.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
<div className="bg-[#f7f7f7] min-h-screen px-6 pb-6 pt-2">      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[36px] font-bold text-[#241b4b] leading-none">
            Class Recordings
          </h1>

          <p className="text-[22px] text-gray-400 mt-3">
            Access and review past class sessions
          </p>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <div className="w-[50px] h-[50px] rounded-2xl border border-gray-200 bg-white flex items-center justify-center">
            <FaSearch className="text-black text-xl" />
          </div>

          <div className="flex items-center gap-4">
  <span className="text-[18px] text-gray-400">Filter by</span>

  {/* Category Dropdown */}
  <div className="relative">
    <button
      onClick={() => {
        setShowCategoryDropdown(!showCategoryDropdown);
        setShowCourseDropdown(false);
      }}
      className="h-[42px] px-5 border border-orange-500 rounded-xl flex items-center gap-3 text-orange-600 hover:bg-orange-50 transition"
    >
      {filter}
      <FaChevronDown className="text-sm" />
    </button>

    {showCategoryDropdown && (
      <div className="absolute top-12 left-0 w-[180px] bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-2">
        {["All", "Design", "Thinking", "Research"].map((item) => (
          <button
            key={item}
            onClick={() => {
              setFilter(item);
              setCurrentPage(1);
              setShowCategoryDropdown(false);
            }}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              filter === item
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

  {/* Course Dropdown */}
  <div className="relative">
    <button
      onClick={() => {
        setShowCourseDropdown(!showCourseDropdown);
        setShowCategoryDropdown(false);
      }}
      className="h-[42px] px-5 border border-orange-500 rounded-xl flex items-center gap-3 text-orange-600 hover:bg-orange-50 transition"
    >
      Course
      <FaChevronDown className="text-sm" />
    </button>

    {showCourseDropdown && (
      <div className="absolute top-12 left-0 w-[180px] bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-2">
        {["UI/UX", "Frontend", "Research"].map((item) => (
          <button
            key={item}
            onClick={() => {
              setShowCourseDropdown(false);
            }}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition"
          >
            {item}
          </button>
        ))}
      </div>
    )}
  </div>
</div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {paginatedData.map((item) => (
        <div
  key={item.id}
  className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 hover:shadow-lg transition max-w-[320px]"
>
            <img
              src={item.image}
              alt={item.title}
             className="w-full h-[140px] object-cover rounded-lg"
            />

           <h2 className="text-[20px] font-bold text-[#241b4b] mt-3 leading-tight min-h-[50px]">
              {item.title}
            </h2>

            <div className="flex items-center gap-5 text-gray-400 mt-3 text-[15px]">
              <div className="flex items-center gap-2">
                <FaClock className="text-xs" />
                {item.duration}
              </div>

              <div className="flex items-center gap-2">
                <FaBookOpen className="text-xs" />
                {item.lessons}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-5">
              <button className="h-[38px] px-4 text-sm bg-orange-600 text-white rounded-lg flex items-center gap-2 hover:bg-orange-700 transition">
                <FaPlay className="text-xs" />
                Watch Now
              </button>

              <button className="h-[38px] px-4 text-sm bg-orange-50 text-orange-600 rounded-lg flex items-center gap-2 hover:bg-orange-100 transition">
                <FaDownload className="text-xs" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-12">
        <div className="flex items-center gap-4">
          <span className="text-[18px]">Show</span>

          <div className="relative">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-[90px] h-[40px] border border-gray-300 rounded-xl px-5 appearance-none outline-none text-[22px] bg-white"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
            </select>

            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          <span className="text-[18px]">Row</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-[54px] h-[54px] rounded-xl bg-gray-100 flex items-center justify-center text-gray-400"
          >
            <FaChevronLeft />
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              key={page}
              onClick={() => changePage(page)}
              className={`w-[50px] h-[40px] rounded-xl text-[20px]  ${
                currentPage === page
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-[54px] h-[54px] rounded-xl bg-gray-100 flex items-center justify-center"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Recordings;
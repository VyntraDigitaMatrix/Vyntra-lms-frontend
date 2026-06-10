import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch, FaCalendarAlt, FaDownload, FaPlay,
  FaVideo, FaClock, FaEye, FaHeadset, FaFilter, FaCheck, FaTimes,
} from "react-icons/fa";

const Recordings = () => {
  const allRecordings = [
    {
      module: "Module 1",
      title: "Introduction to Digital Marketing",
      date: "20 May 2024",
      time: "07:00 PM - 08:15 PM",
      duration: "01:15:30",
      video: "/videos/recording1.mp4",
    },
    {
      module: "Module 2",
      title: "Understanding the Customer Journey",
      date: "22 May 2024",
      time: "07:00 PM - 08:02 PM",
      duration: "01:02:45",
      video: "/videos/recording2.mp4",
    },
  ];

  const [activeTab, setActiveTab] = useState("all");

  // Filter state
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [searchInput, setSearchInput] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    module: "All Modules", search: "", from: "", to: "",
  });

  // Video modal
  const [watchingVideo, setWatchingVideo] = useState(null);

  // Download tracking
  const [downloaded, setDownloaded] = useState(new Set());

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedFilters({ module: moduleFilter, search: searchInput, from: fromDate, to: toDate });
    showToast("Filters applied");
  };

  // Handle download
  const handleDownload = (item, index) => {
    const a = document.createElement("a");
    a.href = item.video;
    a.download = `${item.title}.mp4`;
    a.click();
    setDownloaded((prev) => new Set([...prev, index]));
    showToast(`Downloading: ${item.title}`);
  };

  // Handle contact support
  const handleSupport = () => {
    window.location.href = "mailto:support@yourplatform.com?subject=Recording Access Issue";
  };

  // Filtered + sorted recordings
  const filteredRecordings = useMemo(() => {
    let list = [...allRecordings];

    // Tab sort
    if (activeTab === "module") list.sort((a, b) => a.module.localeCompare(b.module));
    if (activeTab === "date")   list.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Filters
    if (appliedFilters.module !== "All Modules")
      list = list.filter((r) => r.module === appliedFilters.module);
    if (appliedFilters.search)
      list = list.filter((r) =>
        r.title.toLowerCase().includes(appliedFilters.search.toLowerCase())
      );
    if (appliedFilters.from)
      list = list.filter((r) => new Date(r.date) >= new Date(appliedFilters.from));
    if (appliedFilters.to)
      list = list.filter((r) => new Date(r.date) <= new Date(appliedFilters.to));

    return list;
  }, [activeTab, appliedFilters]);

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-5">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Video Modal */}
      {watchingVideo !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setWatchingVideo(null)}
        >
          <div
            className="bg-black rounded-2xl overflow-hidden w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-4 py-3">
              <p className="text-white text-sm font-semibold truncate">
                {allRecordings.find((r) => r.video === watchingVideo)?.title}
              </p>
              <button
                onClick={() => setWatchingVideo(null)}
                className="text-white hover:text-gray-300 text-xl"
              >
                <FaTimes />
              </button>
            </div>
            <video
              src={watchingVideo}
              controls
              autoPlay
              className="w-full aspect-video bg-black"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
          <Link to="/student/dashboard" className="hover:text-blue-600 transition font-medium">Dashboard</Link>
          <span className="text-gray-400">›</span>
          <Link to="/student/classes" className="hover:text-blue-600 transition font-medium">Live Classes</Link>
          <span className="text-gray-400">›</span>
          <span className="text-blue-600 font-semibold">Recordings</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 sm:gap-6">
          {/* Left Section */}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Live Class Recordings</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-4 sm:mb-6">
              Watch recorded sessions anytime to revise and enhance your learning.
            </p>

            {/* Course Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
                <div className="relative w-full sm:w-[210px] h-[80px] sm:h-[95px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-bold">Course Thumbnail</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Digital Marketing Fundamentals</h2>
                    <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg font-semibold w-fit">Ongoing</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Instructor: <b>Rohit Sharma</b></p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">28 Live Classes Conducted</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">Course Progress</span>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full">
                        <div className="w-[65%] h-full bg-blue-600 rounded-full"></div>
                      </div>
                      <span className="text-xs sm:text-sm text-green-600 font-bold">65%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 sm:gap-8 border-b border-gray-200 mb-4 overflow-x-auto">
              {["all", "module", "date"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 sm:pb-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                    activeTab === tab ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent"
                  }`}
                >
                  {tab === "all" ? "All Recordings" : tab === "module" ? "By Module" : "By Date"}
                </button>
              ))}
            </div>

            {/* Recording List */}
            <div className="space-y-3 sm:space-y-4">
              {filteredRecordings.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
                  No recordings match your filters.
                </div>
              ) : (
                filteredRecordings.map((item, index) => {
                  const originalIndex = allRecordings.findIndex((r) => r.video === item.video);
                  const isDownloaded = downloaded.has(originalIndex);
                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                        {/* Thumbnail — click to watch */}
                        <div
                          className="relative w-full md:w-[130px] h-[65px] rounded-lg overflow-hidden bg-black flex-shrink-0 cursor-pointer group"
                          onClick={() => setWatchingVideo(item.video)}
                        >
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <FaPlay className="text-white opacity-50 group-hover:opacity-100 group-hover:scale-110 transition" />
                          </div>
                          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded">
                            {item.duration}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] sm:text-xs bg-blue-100 text-blue-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-semibold inline-block">
                            {item.module}
                          </span>
                          <h3 className="font-bold text-gray-900 mt-1 text-sm sm:text-base">{item.title}</h3>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                            {item.date}<span className="mx-1 sm:mx-2">•</span>{item.time}
                          </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-row md:flex-col gap-2 mt-2 md:mt-0 items-center md:items-end">
                          <button
                            onClick={() => handleDownload(item, originalIndex)}
                            className={`flex-1 md:w-auto text-[11px] sm:text-sm font-semibold flex items-center justify-center gap-1.5 px-2 sm:px-0 transition ${
                              isDownloaded ? "text-green-600" : "text-blue-600 hover:text-blue-800"
                            }`}
                          >
                            {isDownloaded ? <FaCheck size={11} /> : <FaDownload size={11} />}
                            {isDownloaded ? "Downloaded" : "Download"}
                          </button>
                          <button
                            onClick={() => setWatchingVideo(item.video)}
                            className="flex-1 md:w-auto px-3 sm:px-5 py-1.5 sm:py-2 border border-blue-500 text-blue-600 rounded-lg text-[11px] sm:text-sm font-semibold hover:bg-blue-100 transition whitespace-nowrap"
                          >
                            Watch Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 mt-6 lg:mt-20">
            {/* Filter Recordings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4">Filter Recordings</h2>

              <label className="text-[10px] sm:text-xs font-bold text-gray-600">Module</label>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="w-full mt-1 mb-3 h-9 sm:h-11 border border-gray-200 rounded-lg px-3 text-xs sm:text-sm outline-none focus:border-blue-500 bg-white"
              >
                <option>All Modules</option>
                <option>Module 1</option>
                <option>Module 2</option>
                <option>Module 3</option>
              </select>

              <label className="text-[10px] sm:text-xs font-bold text-gray-600">Search</label>
              <div className="w-full mt-1 mb-3 h-9 sm:h-11 border border-gray-200 rounded-lg px-3 flex items-center gap-2 bg-white focus-within:border-blue-500">
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
                  placeholder="Search by title..."
                  className="flex-1 outline-none text-xs sm:text-sm bg-transparent"
                />
                <FaSearch className="text-gray-400 text-xs sm:text-sm" />
              </div>

              <label className="text-[10px] sm:text-xs font-bold text-gray-600">From Date</label>
              <div className="w-full mt-1 mb-3 h-9 sm:h-11 border border-gray-200 rounded-lg px-3 flex items-center justify-between bg-white focus-within:border-blue-500">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="flex-1 outline-none text-xs sm:text-sm text-gray-500 bg-transparent"
                />
              </div>

              <label className="text-[10px] sm:text-xs font-bold text-gray-600">To Date</label>
              <div className="w-full mt-1 mb-4 h-9 sm:h-11 border border-gray-200 rounded-lg px-3 flex items-center justify-between bg-white focus-within:border-blue-500">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="flex-1 outline-none text-xs sm:text-sm text-gray-500 bg-transparent"
                />
              </div>

              <button
                onClick={handleApplyFilters}
                className="w-full h-9 sm:h-11 bg-blue-600 text-white rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition"
              >
                <FaFilter size={11} /> Apply Filters
              </button>
            </div>

            {/* Recording Overview */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base mb-4 sm:mb-5">Recording Overview</h2>
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 sm:gap-3 text-gray-600">
                    <FaVideo className="text-blue-500" /> Total Recordings
                  </span>
                  <b className="text-blue-600">28</b>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 sm:gap-3 text-gray-600">
                    <FaClock className="text-green-500" /> Total Watch Time
                  </span>
                  <b className="text-green-600">18h 45m</b>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 sm:gap-3 text-gray-600">
                    <FaDownload className="text-orange-500" /> Downloaded
                  </span>
                  <b className="text-orange-500">{downloaded.size || 12}</b>
                </div>
                <div>
                  <span className="flex items-center gap-2 sm:gap-3 text-gray-600">
                    <FaEye className="text-purple-500" /> Last Watched
                  </span>
                  <p className="font-semibold text-gray-800 mt-1 ml-7 text-xs sm:text-sm">
                    Social Media Marketing Overview
                  </p>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">Need Help?</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                If you have any issues accessing the recordings, our support team is here to help.
              </p>
              <button
                onClick={handleSupport}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-blue-500 text-blue-600 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 hover:bg-blue-100 transition"
              >
                <FaHeadset size={12} /> Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recordings;